import { BAND_KEY, FRAMEWORKS, RELATIONS, fwText } from '../data/meta';
import { ALL_NODES, BY_FRAMEWORK } from '../data/model';
import { useI18n } from '../i18n';

interface Props {
  onOpenFramework: (fw: string) => void;
  onOpenNode: (id: string) => void;
  onOpenConcepts: () => void;
}

export default function Overview({ onOpenFramework, onOpenNode, onOpenConcepts }: Props) {
  const { t, locale, fmt } = useI18n();
  const total = ALL_NODES.length;
  const domains = (BY_FRAMEWORK.get('domains') ?? []).length;

  const bands = [1, 2, 3].map((band) => FRAMEWORKS.filter((f) => f.band === band));

  return (
    <>
      <div className="hero">
        <div>
          <div className="kicker">{t('home.kicker')}</div>
          <h1>{t('home.title')}</h1>
          <p className="page-lede">{t('home.lede1')}</p>
          <p className="page-lede">{t('home.lede2')}</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
            <button className="btn primary" onClick={() => onOpenFramework('etom')}>
              {t('home.cta.etom')}
            </button>
            <button className="btn" onClick={onOpenConcepts}>
              {t('home.cta.concepts')}
            </button>
            <button className="btn" onClick={() => onOpenNode('0')}>
              {t('home.cta.root')}
            </button>
          </div>
        </div>

        <div className="panel panel-pad">
          <div className="stat-row">
            <div className="stat">
              <div className="n">{fmt(total)}</div>
              <div className="l">{t('home.stat.elements')}</div>
            </div>
            <div className="stat">
              <div className="n">{FRAMEWORKS.length}</div>
              <div className="l">{t('home.stat.frameworks')}</div>
            </div>
            <div className="stat">
              <div className="n">{domains || 12}</div>
              <div className="l">{t('home.stat.domains')}</div>
            </div>
          </div>
          <p className="dim small" style={{ marginTop: 16, marginBottom: 0 }}>
            {t('home.stat.note')}
          </p>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h3>{t('home.master.title')}</h3>
          <span className="hint">{t('home.master.hint')}</span>
        </div>
        <div className="panel oda">
          {bands.map((band, i) => (
            <div key={i} style={{ display: 'contents' }}>
              <div className="oda-band">{t(BAND_KEY[(i + 1) as 1 | 2 | 3])}</div>
              {band.map((fw) => {
                const count = (BY_FRAMEWORK.get(fw.id) ?? []).length;
                return (
                  <button
                    key={fw.id}
                    className="oda-node"
                    style={
                      {
                        '--fw-accent': fw.accent,
                        gridColumn: `span ${Math.floor(12 / band.length)}`,
                      } as React.CSSProperties
                    }
                    onClick={() => onOpenFramework(fw.id)}
                  >
                    <div className="t">{fwText(fw, locale).name}</div>
                    <div className="q">{fwText(fw, locale).question}</div>
                    <div className="c">{count ? t('detail.count', { count }) : t('common.empty')}</div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h3>{t('home.inside.title')}</h3>
          <span className="hint">{t('home.inside.hint')}</span>
        </div>
        <div className="concept-grid">
          {FRAMEWORKS.map((fw) => {
            const all = BY_FRAMEWORK.get(fw.id) ?? [];
            const pkgs = all.filter((n) => n.depth === 3 && n.kind === 'Package');
            const tops = pkgs.length ? pkgs : all.filter((n) => n.depth === 3);
            return (
              <div key={fw.id} className="panel concept-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span className="rail-dot" style={{ background: fw.accent }} />
                  <h4>{fwText(fw, locale).name}</h4>
                  <span className="dim tiny mono" style={{ marginLeft: 'auto' }}>
                    {fmt(all.length)}
                  </span>
                </div>
                <div className="concept-targets">
                  {tops.slice(0, 10).map((node) => (
                    <button
                      key={node.id}
                      className="concept-target"
                      onClick={() => onOpenNode(node.id)}
                      title={node.name}
                    >
                      {node.name}
                    </button>
                  ))}
                  {tops.length === 0 && (
                    <span className="dim small">{t('home.inside.empty')}</span>
                  )}
                  {tops.length > 10 && (
                    <span className="dim tiny">
                      {t('common.more', { count: tops.length - 10 })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h3>{t('home.relations.title')}</h3>
          <span className="hint">{t('home.relations.hint')}</span>
        </div>
        <div className="concept-grid">
          {RELATIONS.map((rel) => {
            const from = FRAMEWORKS.find((f) => f.id === rel.from);
            const to = FRAMEWORKS.find((f) => f.id === rel.to);
            if (!from || !to) return null;
            return (
              <div key={`${rel.from}-${rel.to}`} className="panel concept-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    className="tag solid"
                    style={{ background: from.accent, cursor: 'pointer', border: 'none' }}
                    onClick={() => onOpenFramework(from.id)}
                  >
                    {fwText(from, locale).short}
                  </button>
                  <span className="dim">→</span>
                  <button
                    className="tag solid"
                    style={{ background: to.accent, cursor: 'pointer', border: 'none' }}
                    onClick={() => onOpenFramework(to.id)}
                  >
                    {fwText(to, locale).short}
                  </button>
                </div>
                <p className="muted small" style={{ margin: 0 }}>
                  {t(rel.key)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}