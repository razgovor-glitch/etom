import type { ModaNode } from '../types';
import { FRAMEWORK_BY_ID } from '../data/meta';
import { childrenOf, countChildren, countPackageChildren } from '../data/model';
import { relationsOf } from '../lib/links';

interface Props {
  node: ModaNode;
  onOpen: (id: string) => void;
  onBack?: () => void;
}

const CHILD_PREVIEW = 24;

export default function NodeDetail({ node, onOpen, onBack }: Props) {
  const meta = FRAMEWORK_BY_ID.get(node.fw as never);
  const children = childrenOf(node.id);
  const packages = countPackageChildren(node.id);
  const { concepts, similar } = relationsOf(node);

  return (
    <div className="panel">
      <div className="detail-head">
        {node.path.length > 0 && (
          <div className="detail-crumbs">
            {node.path.map((crumb, i) => (
              <span key={`${crumb}-${i}`} style={{ display: 'contents' }}>
                <button className="crumb-link" title={crumb}>
                  {crumb}
                </button>
                <span className="crumb-sep">›</span>
              </span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 className="detail-title">{node.name}</h2>
          </div>
          {onBack && (
            <button className="btn small" onClick={onBack}>
              ← Back
            </button>
          )}
        </div>

        <div className="detail-tags">
          {meta && (
            <span className="tag solid" style={{ background: meta.accent }}>
              {meta.name}
            </span>
          )}
          <span className="tag">{node.kind}</span>
          <span className="tag">{node.level}</span>
          {node.vertical && <span className="tag">{node.vertical}</span>}
          {node.horizontal && <span className="tag">{node.horizontal}</span>}
          {node.release && <span className="tag">R{node.release}</span>}
          {node.status && <span className="tag">{node.status}</span>}
          {countChildren(node.id) > 0 && (
            <span className="tag">
              {countChildren(node.id)} element{countChildren(node.id) === 1 ? '' : 's'}
              {packages > 0 && packages !== countChildren(node.id) ? ` · ${packages} packages` : ''}
            </span>
          )}
        </div>
      </div>

      <div className="detail-body">
        {node.summary ? (
          <p className="detail-summary">{node.summary}</p>
        ) : (
          <p className="dim small">
            No description is published for this element in the TM Forum model. Follow the
            source link below for the authoritative page.
          </p>
        )}

        {children.length > 0 && (
          <div className="section">
            <div className="section-head">
              <h3>Contains</h3>
              <span className="hint">{children.length} elements</span>
            </div>
            <div className="grid-cards">
              {children.slice(0, CHILD_PREVIEW).map((child) => (
                <button key={child.id} className="node-card" onClick={() => onOpen(child.id)}>
                  <span className="nc-name">{child.name}</span>
                  <span className="nc-meta">
                    {child.kind} · {child.level}
                    {countPackageChildren(child.id) > 0 ? ` · ${countPackageChildren(child.id)} sub` : ''}
                  </span>
                </button>
              ))}
            </div>
            {children.length > CHILD_PREVIEW && (
              <p className="dim small" style={{ marginTop: 10 }}>
                + {children.length - CHILD_PREVIEW} more. Use the tree on the left to navigate
                the full structure.
              </p>
            )}
          </div>
        )}

        {concepts.length > 0 && (
          <div className="section">
            <div className="section-head">
              <h3>Concepts</h3>
              <span className="hint">how this element carries a business concept across MODA</span>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              {concepts.map((concept) => (
                <div key={concept.concept} className="panel panel-pad" style={{ padding: '14px 16px' }}>
                  <h4 style={{ marginBottom: 4 }}>{concept.concept}</h4>
                  <p className="muted small" style={{ margin: '0 0 10px' }}>
                    {concept.blurb}
                  </p>
                  <div className="concept-targets">
                    {Object.entries(concept.resolved).map(([fw, target]) => {
                      const m = FRAMEWORK_BY_ID.get(fw as never);
                      if (!target) return null;
                      return (
                        <button
                          key={fw}
                          className="concept-target"
                          onClick={() => onOpen(target.id)}
                          title={`${m?.name ?? fw} — ${target.name}`}
                        >
                          <span className="dot" style={{ background: m?.accent }} />
                          <span className="dim">{m?.short ?? fw}</span>
                          <span>{target.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {similar.length > 0 && (
          <div className="section">
            <div className="section-head">
              <h3>Related across MODA</h3>
              <span className="hint">matched by shared terminology in other frameworks</span>
            </div>
            <div className="grid-cards">
              {similar.map(({ node: rel, via, strength }) => {
                const m = FRAMEWORK_BY_ID.get(rel.fw as never);
                return (
                  <button key={rel.id} className="node-card" onClick={() => onOpen(rel.id)}>
                    <span className="nc-name">{rel.name}</span>
                    <span className="nc-meta">
                      <span style={{ color: m?.accent }}>{m?.short ?? rel.fw}</span> · shares “{via}”
                    </span>
                    <span
                      style={{
                        height: 3,
                        borderRadius: 3,
                        background: m?.accent,
                        opacity: 0.25 + strength * 0.6,
                        marginTop: 4,
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="section">
          {node.tmfUrl && (
            <a className="btn" href={node.tmfUrl} target="_blank" rel="noreferrer">
              Open in TM Forum model ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}