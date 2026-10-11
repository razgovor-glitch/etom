import { useEffect, useMemo, useState } from 'react';
import type { ModaNode } from '../types';
import {
  BY_FRAMEWORK,
  facetsOf,
  packageChildrenOf,
  countPackageChildren,
  NODES_BY_ID,
} from '../data/model';
import { FRAMEWORK_BY_ID, fwText } from '../data/meta';
import { useI18n, type T } from '../i18n';
import { domainShort } from '../i18n/domains';
import NodeDetail from './NodeDetail';

interface Props {
  framework: string;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const MAX_ROWS = 250;

function TreeNode({
  node,
  expanded,
  selected,
  onToggle,
  onSelect,
  filter,
  domainKeep,
  t,
}: {
  node: ModaNode;
  expanded: Set<string>;
  selected: string | null;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  filter: string;
  domainKeep: Set<string> | null;
  t: T;
}) {
  const isOpen = expanded.has(node.id);
  const kids = useMemo(() => (isOpen ? packageChildrenOf(node.id) : []), [isOpen, node.id]);
  const visibleKids = useMemo(() => {
    let list = kids;
    if (filter) {
      const q = filter.toLowerCase();
      list = list.filter((k) => k.name.toLowerCase().includes(q));
    }
    if (domainKeep) list = list.filter((k) => domainKeep.has(k.id));
    return list.slice(0, MAX_ROWS);
  }, [kids, filter, domainKeep]);

  const match = filter && node.name.toLowerCase().includes(filter.toLowerCase());
  const hidden = kids.length - visibleKids.length;

  return (
    <>
      <button
        className={`tree-row ${selected === node.id ? 'selected' : ''} ${match ? 'match' : ''}`}
        style={{ paddingLeft: 8 + node.depth * 11 }}
        onClick={() => onSelect(node.id)}
        onDoubleClick={() => onToggle(node.id)}
      >
        <span
          className={`tree-caret ${countPackageChildren(node.id) ? (isOpen ? 'open' : '') : 'leaf'}`}
          onClick={(e) => {
            e.stopPropagation();
            if (countPackageChildren(node.id)) onToggle(node.id);
          }}
        >
          ▶
        </span>
        <span className="tree-name">{node.name}</span>
        {countPackageChildren(node.id) > 0 && (
          <span className="tree-badge">{countPackageChildren(node.id)}</span>
        )}
      </button>
      {isOpen && hidden > 0 && (
        <p className="dim tiny" style={{ padding: '2px 0 2px 12px' }}>
          {hidden} hidden by the active filter
        </p>
      )}
      {isOpen &&
        visibleKids.map((kid) => (
          <TreeNode
            key={kid.id}
            node={kid}
            expanded={expanded}
            selected={selected}
            onToggle={onToggle}
            onSelect={onSelect}
            filter={filter}
            domainKeep={domainKeep}
            t={t}
          />
        ))}
    </>
  );
}

export default function Explorer({ framework, selectedId, onSelect }: Props) {
  const roots = useMemo(() => {
    const list = BY_FRAMEWORK.get(framework) ?? [];
    const topLevel = list.filter((n) => n.depth === 2);
    return topLevel.length ? topLevel : list.slice(0, 1);
  }, [framework]);

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState('');
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const facets = useMemo(() => facetsOf(framework), [framework]);
  const meta = FRAMEWORK_BY_ID.get(framework as never);
  const { t, locale } = useI18n();
  const text = fwText(meta, locale);

  /**
   * Ids to keep when a business-domain filter is active: every element in that
   * domain plus its ancestors, so the tree keeps its shape instead of
   * flattening into a list.
   */
  const domainKeep = useMemo(() => {
    if (!domainFilter) return null;
    const keep = new Set<string>();
    for (const node of BY_FRAMEWORK.get(framework) ?? []) {
      if (node.vertical !== domainFilter) continue;
      keep.add(node.id);
      let cursor = node.parent;
      while (cursor && !keep.has(cursor)) {
        keep.add(cursor);
        cursor = NODES_BY_ID.get(cursor)?.parent ?? null;
      }
    }
    return keep;
  }, [framework, domainFilter]);

  // Open the path down to whatever is selected, and the roots by default.
  useEffect(() => {
    setExpanded((prev) => {
      const next = new Set(prev);
      for (const root of roots) next.add(root.id);
      if (selectedId) {
        let cursor: string | null = selectedId;
        while (cursor) {
          next.add(cursor);
          cursor = NODES_BY_ID.get(cursor)?.parent ?? null;
        }
      }
      return next;
    });
    setFilter('');
  }, [framework, selectedId, roots]);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const selected = selectedId ? NODES_BY_ID.get(selectedId) : undefined;
  const total = (BY_FRAMEWORK.get(framework) ?? []).length;

  return (
    <>
      <div className="page-title">{text.name || framework}</div>
      <p className="page-lede">{text.summary}</p>

      <div className="explorer" style={{ marginTop: 22 }}>
        <div className="panel tree-panel">
          <div className="tree-head">
            <input
              className="tree-input"
              placeholder={t('explorer.filter', { count: total })}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            {(facets.vertical.length > 1 || facets.horizontal.length > 1) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 9 }}>
                {facets.vertical.map((v) => (
                  <button
                    key={v}
                    className={`chip ${domainFilter === v ? 'on' : ''}`}
                    onClick={() => setDomainFilter(domainFilter === v ? null : v)}
                    title={v}
                  >
                    {domainShort(locale, v)}
                  </button>
                ))}
                {facets.horizontal.map((h) => (
                  <span key={h} className="tag">
                    {h}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="tree-body">
            {roots.length === 0 && <p className="empty">{t('explorer.empty')}</p>}
            {roots.map((root) => (
              <TreeNode
                key={root.id}
                node={root}
                expanded={expanded}
                selected={selectedId}
                onToggle={toggle}
                onSelect={onSelect}
                filter={filter}
                domainKeep={domainKeep}
                t={t}
              />
            ))}
          </div>
        </div>

        <div>
          {selected ? (
            <NodeDetail node={selected} onOpen={onSelect} />
          ) : (
            <div className="panel panel-pad">
              <h3 style={{ marginBottom: 10 }}>{text.name || framework}</h3>
              <p className="muted" style={{ maxWidth: '70ch' }}>
                {text.question}
              </p>
              {meta?.quote && (
                <blockquote
                  style={{
                    margin: '18px 0 0',
                    padding: '12px 16px',
                    borderLeft: '2px solid var(--accent)',
                    background: 'var(--panel-2)',
                    borderRadius: '0 9px 9px 0',
                    color: 'var(--muted)',
                    fontSize: 13.5,
                  }}
                >
                  <div>
                    {locale === 'ru' && meta.quoteRu ? meta.quoteRu : `“${meta.quote}”`}
                  </div>
                  {locale === 'ru' && meta.quoteRu && (
                    <div className="small" style={{ marginTop: 8, opacity: 0.7 }}>
                      “{meta.quote}”
                    </div>
                  )}
                  <div className="dim tiny" style={{ marginTop: 8 }}>
                    — {meta.quoteSource}
                  </div>
                </blockquote>
              )}
              <p className="dim small" style={{ marginTop: 18 }}>
                {t('explorer.pick')} <b>{t('explorer.loaded', { count: total })}</b>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}