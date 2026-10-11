import { useMemo } from 'react';
import { FRAMEWORKS, FRAMEWORK_BY_ID, fwText } from '../data/meta';
import { useI18n } from '../i18n';
import { resolvedConcepts } from '../lib/links';
import { CONCEPT_NAMES_RU } from '../data/crossLinks';

interface Props {
  onOpenNode: (id: string) => void;
}

export default function Concepts({ onOpenNode }: Props) {
  const concepts = useMemo(() => resolvedConcepts(), []);
  const coverage = concepts.reduce((acc, c) => Math.max(acc, c.matchedCount), 0);
  const { t, locale } = useI18n();
  const blurb = (c: (typeof concepts)[number]) =>
    locale === 'ru' && c.blurbRu ? c.blurbRu : c.blurb;
  const name = (concept: string) =>
    locale === 'ru' ? (CONCEPT_NAMES_RU[concept] ?? concept) : concept;

  return (
    <>
      <div className="page-title">{t('concepts.title')}</div>
      <p className="page-lede">{t('concepts.lede')}</p>

      <div className="section">
        <div className="section-head">
          <h3>{t('concepts.grid.title')}</h3>
          <span className="hint">{t('concepts.grid.hint', { count: coverage })}</span>
        </div>
        <div className="matrix">
          <table>
            <thead>
              <tr>
                <th style={{ width: 190 }}>{t('concepts.grid.corner')}</th>
                {FRAMEWORKS.map((fw) => (
                  <th key={fw.id}>
                    <span
                      className="rail-dot"
                      style={{ background: fw.accent, display: 'inline-block', marginRight: 6 }}
                    />
                    {fwText(fw, locale).short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {concepts.map((concept) => (
                <tr key={concept.concept}>
                  <td style={{ fontWeight: 600 }}>{name(concept.concept)}</td>
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
          <h3>{t('concepts.detail.title')}</h3>
        </div>
        <div className="concept-grid">
          {concepts.map((concept) => (
            <div key={concept.concept} className="panel concept-card">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <h4>{name(concept.concept)}</h4>
                <span className="dim tiny mono">
                  {concept.matchedCount}/{FRAMEWORKS.length}
                </span>
              </div>
              <p className="muted small" style={{ margin: 0 }}>
                {blurb(concept)}
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