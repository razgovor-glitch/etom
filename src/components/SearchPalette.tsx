import { useEffect, useMemo, useRef, useState } from 'react';
import type { ModaNode } from '../types';
import { search } from '../lib/search';
import { FRAMEWORK_BY_ID, fwText } from '../data/meta';
import { useI18n } from '../i18n';

interface Props {
  onClose: () => void;
  onOpen: (node: ModaNode) => void;
}

function Highlight({ text, ranges }: { text: string; ranges: [number, number][] }) {
  if (!ranges.length) return <>{text}</>;
  const out: React.ReactNode[] = [];
  let cursor = 0;
  ranges.forEach(([from, to], i) => {
    if (from > cursor) out.push(text.slice(cursor, from));
    out.push(<mark key={i}>{text.slice(from, to)}</mark>);
    cursor = to;
  });
  if (cursor < text.length) out.push(text.slice(cursor));
  return <>{out}</>;
}

export default function SearchPalette({ onClose, onOpen }: Props) {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const hits = useMemo(() => search(query, 60), [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, hits.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const hit = hits[active];
      if (hit) onOpen(hit.node);
    }
  };

  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="palette" onMouseDown={(e) => e.stopPropagation()} onKeyDown={onKeyDown}>
        <input
          ref={inputRef}
          className="palette-input"
          placeholder={t('search.placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="palette-results" ref={listRef}>
          {query.length < 2 && (
            <p className="empty">{t('search.hint')}</p>
          )}
          {query.length >= 2 && hits.length === 0 && <p className="empty">{t('search.empty')}</p>}
          {hits.map((hit, i) => {
            const meta = FRAMEWORK_BY_ID.get(hit.node.fw as never);
            return (
              <button
                key={hit.node.id}
                data-index={i}
                className={`palette-item ${i === active ? 'active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => onOpen(hit.node)}
              >
                <span
                  className="rail-dot"
                  style={{ background: meta?.accent ?? 'var(--dim)' }}
                />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <div className="pi-name">
                    <Highlight text={hit.node.name} ranges={hit.ranges} />
                  </div>
                  <div className="pi-path">
                    {[...hit.node.path, meta?.name].filter(Boolean).join(' › ')}
                  </div>
                </span>
                <span className="tag">{meta ? fwText(meta, locale).short : hit.node.fw}</span>
              </button>
            );
          })}
        </div>
        <div className="palette-foot">
          <span>{t('search.nav')}</span>
          <span>{t('search.open')}</span>
          <span>{t('search.close')}</span>
          <span style={{ marginLeft: 'auto' }}>
            {t('search.results', { count: hits.length })}
          </span>
        </div>
      </div>
    </div>
  );
}