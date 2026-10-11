import { useMemo } from 'react';
import { FRAMEWORKS, FRAMEWORK_BY_ID } from '../data/meta';
import { resolvedConcepts } from '../lib/links';

interface Props {
  onOpenNode: (id: string) => void;
}

export default function Concepts({ onOpenNode }: Props) {
  const concepts = useMemo(() => resolvedConcepts(), []);
  const coverage = concepts.reduce((acc, c) => Math.max(acc, c.matchedCount), 0);

  return (
    <>
      <div className="page-title">Concept map</div>
      <p className="page-lede">
        The reason MODA is more than a set of documents. Twenty-six business concepts that every
        framework has an opinion about — billing, order, fault, partner, campaign — and where each
        one lands. Select any cell to jump straight to that element.
      </p>

      <div className="section">
        <div className="section-head">
          <h3>Concept × framework</h3>
          <span className="hint">
            resolved against the live model · up to {coverage} frameworks per concept
          </span>
        </div>
        <div className="matrix">
          <table>
            <thead>
              <tr>
                <th style={{ width: 190 }}>Concept</th>
                {FRAMEWORKS.map((fw) => (
                  <th key={fw.id}>
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
              {concepts.map((concept) => (
                <tr key={concept.concept}>
                  <td style={{ fontWeight: 600 }}>{concept.concept}</td>
                  {FRAMEWORKS.map((fw) => {
                    const target = concept.resolved[fw.id];
                    return (
                      <td key={fw.id} className={target ? 'cell' : ''}>
                        {target ? (
                          <button
                            onClick={() => onOpenNode(target.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer',
                              textAlign: 'left',
                              color: 'inherit',
                              font: 'inherit',
                              fontSize: 12.5,
                            }}
                          >
                            {target.name}
                          </button>
                        ) : (
                          <span className="dim">·</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h3>What each concept means</h3>
        </div>
        <div className="concept-grid">
          {concepts.map((concept) => (
            <div key={concept.concept} className="panel concept-card">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <h4>{concept.concept}</h4>
                <span className="dim tiny mono">
                  {concept.matchedCount}/{FRAMEWORKS.length}
                </span>
              </div>
              <p className="muted small" style={{ margin: 0 }}>
                {concept.blurb}
              </p>
              <div className="concept-targets">
                {Object.entries(concept.resolved).map(([fw, target]) => {
                  if (!target) return null;
                  const m = FRAMEWORK_BY_ID.get(fw as never);
                  return (
                    <button
                      key={fw}
                      className="concept-target"
                      onClick={() => onOpenNode(target.id)}
                    >
                      <span className="dot" style={{ background: m?.accent }} />
                      <span>{target.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}