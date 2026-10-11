import { BAND_LABELS, FRAMEWORKS, RELATIONS } from '../data/meta';
import { ALL_NODES, BY_FRAMEWORK } from '../data/model';

interface Props {
  onOpenFramework: (fw: string) => void;
  onOpenNode: (id: string) => void;
  onOpenConcepts: () => void;
}

export default function Overview({ onOpenFramework, onOpenNode, onOpenConcepts }: Props) {
  const total = ALL_NODES.length;
  const domains = (BY_FRAMEWORK.get('domains') ?? []).length;

  const bands = [1, 2, 3].map((band) => FRAMEWORKS.filter((f) => f.band === band));

  return (
    <>
      <div className="hero">
        <div>
          <div className="kicker">TM Forum · Open Digital Architecture</div>
          <h1>One architecture, eight views.</h1>
          <p className="page-lede">
            MODA is TM Forum’s reference architecture for digital business. It does not invent a
            new way to model a company — it lines up the views an operator already needs: what the
            business <i>is</i> (domains), what it <i>does</i> (eTOM processes), what it must
            <i> be able to do</i> (functions), what <i>delivers it</i> (applications), what data
            it <i>carries</i> (information) and how it <i>knows</i> it worked (metrics).
          </p>
          <p className="page-lede">
            This explorer reads the model TM Forum publishes and lets you move between those views
            without losing your place — the point of MODA only shows up when you can trace one
            process across all of them.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
            <button className="btn primary" onClick={() => onOpenFramework('etom')}>
              Start with eTOM →
            </button>
            <button className="btn" onClick={onOpenConcepts}>
              Trace a concept across layers
            </button>
            <button className="btn" onClick={() => onOpenNode('0')}>
              The model root
            </button>
          </div>
        </div>

        <div className="panel panel-pad">
          <div className="stat-row">
            <div className="stat">
              <div className="n">{total.toLocaleString()}</div>
              <div className="l">model elements</div>
            </div>
            <div className="stat">
              <div className="n">{FRAMEWORKS.length}</div>
              <div className="l">frameworks</div>
            </div>
            <div className="stat">
              <div className="n">{domains || 12}</div>
              <div className="l">business domains</div>
            </div>
          </div>
          <p className="dim small" style={{ marginTop: 16, marginBottom: 0 }}>
            Every element links back to its page in the published TM Forum model, so anything here
            can be checked against the source.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h3>The master ODA diagram</h3>
          <span className="hint">click any layer to open it</span>
        </div>
        <div className="panel oda">
          {bands.map((band, i) => (
            <div key={i} style={{ display: 'contents' }}>
              <div className="oda-band">{BAND_LABELS[i + 1]}</div>
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
                    <div className="t">{fw.name}</div>
                    <div className="q">{fw.question}</div>
                    <div className="c">{count ? `${count.toLocaleString()} elements` : '—'}</div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h3>Inside each framework</h3>
          <span className="hint">the published package tree, straight from the model</span>
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
                  <h4>{fw.name}</h4>
                  <span className="dim tiny mono" style={{ marginLeft: 'auto' }}>
                    {all.length.toLocaleString()}
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
                    <span className="dim small">
                      No package level published for this branch.
                    </span>
                  )}
                  {tops.length > 10 && (
                    <span className="dim tiny">+{tops.length - 10} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h3>How the layers connect</h3>
          <span className="hint">the relationships that make MODA one model</span>
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
                    {from.short}
                  </button>
                  <span className="dim">→</span>
                  <button
                    className="tag solid"
                    style={{ background: to.accent, cursor: 'pointer', border: 'none' }}
                    onClick={() => onOpenFramework(to.id)}
                  >
                    {to.short}
                  </button>
                </div>
                <p className="muted small" style={{ margin: 0 }}>
                  {rel.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}