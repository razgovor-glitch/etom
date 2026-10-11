import { useMemo, useState } from 'react';
import type { ModaNode } from '../types';
import { BY_FRAMEWORK } from '../data/model';
import { FRAMEWORKS } from '../data/meta';

interface Props {
  onOpenNode: (id: string) => void;
}

/** The business domains MODA aligns every framework on. */
const DOMAIN_ORDER = [
  'Market & Sales',
  'Customer',
  'Product',
  'Service',
  'Resource',
  'Business Partner',
  'Enterprise',
  'Integration',
  'Common',
  'Shared',
];

export default function Matrix({ onOpenNode }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  const grid = useMemo(() => {
    const byDomain = new Map<string, Map<string, ModaNode[]>>();
    for (const list of BY_FRAMEWORK.values()) {
      for (const node of list) {
        if (!node.vertical) continue;
        let row = byDomain.get(node.vertical);
        if (!row) byDomain.set(node.vertical, (row = new Map()));
        const cell = row.get(node.fw);
        if (cell) cell.push(node);
        else row.set(node.fw, [node]);
      }
    }

    const domains = [
      ...DOMAIN_ORDER.filter((d) => byDomain.has(d)),
      ...[...byDomain.keys()].filter((d) => !DOMAIN_ORDER.includes(d)).sort(),
    ];
    return { byDomain, domains };
  }, []);

  const total = (BY_FRAMEWORK.get('etom') ?? []).length;

  const coverage = useMemo(() => {
    const rows = FRAMEWORKS.map((fw) => {
      const list = BY_FRAMEWORK.get(fw.id) ?? [];
      const kinds = new Map<string, number>();
      for (const n of list) kinds.set(n.kind, (kinds.get(n.kind) ?? 0) + 1);
      return { fw, total: list.length, kinds: [...kinds.entries()].sort((a, b) => b[1] - a[1]) };
    });
    return rows;
  }, []);

  const maxKind = Math.max(1, ...coverage.flatMap((r) => r.kinds.map(([, n]) => n)));
  const kinds = [...new Set(coverage.flatMap((r) => r.kinds.map(([k]) => k)))].sort();
  const maxCell = Math.max(
    1,
    ...[...grid.byDomain.values()].flatMap((row) => [...row.values()].map((c) => c.length)),
  );

  return (
    <>
      <div className="page-title">Cross-framework matrices</div>
      <p className="page-lede">
        The same business domains run through every layer of MODA. The Customer domain, for
        example, is a set of processes in eTOM, a set of functions, a set of applications, a set of
        entities and a set of metrics. This grid is that alignment, counted from the live model.
      </p>

      <div className="section">
        <div className="section-head">
          <h3>Business domain × framework</h3>
          <span className="hint">element counts · click a cell to expand</span>
        </div>
        <div className="matrix">
          <table>
            <thead>
              <tr>
                <th style={{ width: 170 }}>Domain ↓</th>
                {FRAMEWORKS.map((fw) => (
                  <th key={fw.id} style={{ textAlign: 'center' }}>
                    <span
                      className="rail-dot"
                      style={{ background: fw.accent, display: 'inline-block', marginRight: 6 }}
                    />
                    {fw.short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.domains.map((domain) => {
                const row = grid.byDomain.get(domain);
                const rowTotal = [...(row?.values() ?? [])].reduce((a, c) => a + c.length, 0);
                return (
                  <tr key={domain}>
                    <td style={{ fontWeight: 600 }}>
                      {domain}
                      <span className="c dim" style={{ display: 'block', fontWeight: 400 }}>
                        {rowTotal.toLocaleString()}
                      </span>
                    </td>
                    {FRAMEWORKS.map((fw) => {
                      const cell = row?.get(fw.id) ?? [];
                      const key = `${domain}||${fw.id}`;
                      const expanded = open === key;
                      return (
                        <td
                          key={fw.id}
                          className="cell"
                          style={{ textAlign: 'center' }}
                          onClick={() => setOpen(expanded ? null : key)}
                        >
                          {cell.length === 0 ? (
                            <span className="dim">·</span>
                          ) : (
                            <>
                              <span
                                style={{
                                  display: 'inline-block',
                                  minWidth: 34,
                                  padding: '3px 9px',
                                  borderRadius: 999,
                                  fontFamily: 'var(--mono)',
                                  fontSize: 12,
                                  background: `color-mix(in srgb, ${fw.accent} ${Math.round(
                                    10 + (cell.length / maxCell) * 55,
                                  )}%, transparent)`,
                                }}
                              >
                                {cell.length}
                              </span>
                              {expanded && (
                                <div
                                  style={{
                                    textAlign: 'left',
                                    marginTop: 10,
                                    maxHeight: 230,
                                    overflowY: 'auto',
                                    borderTop: `1px solid ${fw.accent}55`,
                                    paddingTop: 8,
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {cell
                                    .slice()
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .slice(0, 60)
                                    .map((node) => (
                                      <div
                                        key={node.id}
                                        style={{
                                          padding: '2px 4px',
                                          cursor: 'pointer',
                                          fontSize: 12,
                                          borderRadius: 4,
                                        }}
                                        onClick={() => onOpenNode(node.id)}
                                        title={node.name}
                                      >
                                        · {node.name}
                                      </div>
                                    ))}
                                  {cell.length > 60 && (
                                    <div className="dim tiny" style={{ padding: '4px 0' }}>
                                      +{cell.length - 60} more
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr>
                <td style={{ fontWeight: 600, background: 'var(--panel-2)' }}>Framework total</td>
                {FRAMEWORKS.map((fw) => (
                  <td
                    key={fw.id}
                    className="mono"
                    style={{ textAlign: 'center', background: 'var(--panel-2)', fontWeight: 600 }}
                  >
                    {(BY_FRAMEWORK.get(fw.id) ?? []).length.toLocaleString()}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h3>Element types by framework</h3>
          <span className="hint">{total.toLocaleString()} eTOM elements included</span>
        </div>
        <div className="matrix">
          <table>
            <thead>
              <tr>
                <th style={{ width: 200 }}>Framework</th>
                {kinds.map((k) => (
                  <th key={k} style={{ textAlign: 'right' }}>
                    {k}
                  </th>
                ))}
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {coverage.map(({ fw, total: rowTotal, kinds: rowKinds }) => {
                const lookup = new Map(rowKinds);
                return (
                  <tr key={fw.id}>
                    <td>
                      <span
                        className="rail-dot"
                        style={{ background: fw.accent, display: 'inline-block', marginRight: 8 }}
                      />
                      {fw.name}
                    </td>
                    {kinds.map((k) => {
                      const value = lookup.get(k) ?? 0;
                      return (
                        <td key={k} style={{ textAlign: 'right' }}>
                          {value > 0 ? (
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '1px 8px',
                                borderRadius: 999,
                                background: `color-mix(in srgb, ${fw.accent} ${Math.round(
                                  12 + (value / maxKind) * 40,
                                )}%, transparent)`,
                                fontFamily: 'var(--mono)',
                                fontSize: 11.5,
                              }}
                            >
                              {value}
                            </span>
                          ) : (
                            <span className="dim">·</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="mono" style={{ textAlign: 'right', fontWeight: 600 }}>
                      {rowTotal.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}