import { useCallback, useEffect, useState } from 'react';
import type { ModaNode } from './types';
import { useRoute, useTheme, type ViewId } from './lib/router';
import { FRAMEWORKS, SOURCES, BAND_LABELS } from './data/meta';
import { BY_FRAMEWORK, NODES_BY_ID, MODEL_SOURCE, MODEL_GENERATED_AT } from './data/model';
import Overview from './components/Overview';
import Explorer from './components/Explorer';
import Matrix from './components/Matrix';
import Concepts from './components/Concepts';
import SearchPalette from './components/SearchPalette';
import NodeDetail from './components/NodeDetail';

const countOf = (fw: string) => (BY_FRAMEWORK.get(fw) ?? []).length;

function About() {
  return (
    <>
      <div className="page-title">About this explorer</div>
      <p className="page-lede">
        MODA is published by TM Forum as a browsable Enterprise Architect model. This app reads the
        structure of that model — every package, process, function, application, entity and metric
        it contains — and presents it as one navigable architecture. Nothing here is invented: each
        element links back to its page on tmforum.org.
      </p>

      <div className="section">
        <div className="section-head">
          <h3>How it was built</h3>
        </div>
        <div className="concept-grid">
          <div className="panel concept-card">
            <h4>Structure</h4>
            <p className="muted small" style={{ margin: 0 }}>
              The published model exposes its whole tree through GUID-keyed XML data files. Each
              node lists its children — name, type, link — so the tree can be walked node by node
              without scraping rendered HTML.
            </p>
          </div>
          <div className="panel concept-card">
            <h4>Cross-references</h4>
            <p className="muted small" style={{ margin: 0 }}>
              Concepts like billing or fault are matched to their element in each framework by
              name, with a curated spine first and automatic terminology matching as a fallback —
              so the layers stay connected even when upstream names move.
            </p>
          </div>
          <div className="panel concept-card">
            <h4>Status</h4>
            <p className="muted small" style={{ margin: 0 }}>
              Elements carry the release and lifecycle status published by TM Forum. The model
              itself evolves; the explorer re-derives everything from the current publication.
            </p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h3>Sources</h3>
          <span className="hint">
            {MODEL_GENERATED_AT
              ? `model read ${new Date(MODEL_GENERATED_AT).toLocaleString()}`
              : 'model not yet loaded'}
          </span>
        </div>
        <div className="concept-grid">
          {SOURCES.map((s) => (
            <a key={s.url} className="panel concept-card" href={s.url} target="_blank" rel="noreferrer">
              <h4 style={{ color: 'var(--accent)' }}>{s.label} ↗</h4>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

export default function App() {
  const { route, navigate } = useRoute();
  const [theme, toggleTheme] = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [railOpen, setRailOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === '/' && !searchOpen) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          setSearchOpen(true);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  const openNode = useCallback(
    (node: ModaNode) => {
      if (node.fw === '_root') {
        // the model root lists every framework it contains
        navigate({ view: 'overview', framework: null, nodeId: node.id });
        return;
      }
      navigate({ view: 'overview', framework: node.fw, nodeId: node.id });
    },
    [navigate],
  );

  const openById = useCallback(
    (id: string) => {
      const node = NODES_BY_ID.get(id);
      if (node) openNode(node);
    },
    [openNode],
  );

  const goFramework = (fw: string) => {
    navigate({ view: 'overview', framework: fw, nodeId: null });
    setRailOpen(false);
  };

  const goView = (view: ViewId) => {
    navigate({ view, framework: null, nodeId: null });
    setRailOpen(false);
  };

  const selected = route.nodeId ? NODES_BY_ID.get(route.nodeId) : undefined;
  const currentFw = route.framework && countOf(route.framework) > 0 ? route.framework : null;
  const bands = [1, 2, 3].map((b) => FRAMEWORKS.filter((f) => f.band === b));

  let content;
  if (route.view === 'matrix') content = <Matrix onOpenNode={openById} />;
  else if (route.view === 'concepts') content = <Concepts onOpenNode={openById} />;
  else if (route.view === 'about') content = <About />;
  else if (currentFw) {
    content = (
      <Explorer
        framework={currentFw}
        selectedId={route.nodeId}
        onSelect={(id) =>
          navigate({ view: 'overview', framework: currentFw, nodeId: id })
        }
      />
    );
  } else if (selected) {
    content = <NodeDetail node={selected} onOpen={openById} />;
  } else content = (
    <Overview
      onOpenFramework={goFramework}
      onOpenNode={openById}
      onOpenConcepts={() => goView('concepts')}
    />
  );

  return (
    <div className="app">
      <header className="topbar">
        <button
          className="icon-btn mobile-only"
          onClick={() => setRailOpen((v) => !v)}
          aria-label="Menu"
        >
          ☰
        </button>
        <div className="brand" onClick={() => goView('overview')} style={{ cursor: 'pointer' }}>
          <div className="brand-mark">MO</div>
          <div>
            <div className="brand-title">MODA Explorer</div>
          </div>
          <div className="brand-sub">Model of the Open Digital Architecture · TM Forum</div>
        </div>

        <div className="topbar-spacer" />

        <button className="search-trigger" onClick={() => setSearchOpen(true)}>
          <span>⌕</span>
          <span>Search the model…</span>
          <kbd>⌘K</kbd>
        </button>

        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☾' : '☀'}
        </button>
      </header>

      <div className="body">
        <nav className={`rail ${railOpen ? 'mobile-open' : ''}`}>
          <div className="rail-group">
            <div className="rail-title">Model</div>
            <button
              className={`rail-link ${route.view === 'overview' && !currentFw ? 'active' : ''}`}
              onClick={() => goView('overview')}
            >
              <span className="rail-dot" style={{ background: 'var(--accent)' }} />
              <span className="rail-label">Overview</span>
            </button>
            <button
              className={`rail-link ${route.view === 'concepts' ? 'active' : ''}`}
              onClick={() => goView('concepts')}
            >
              <span className="rail-dot" style={{ background: '#e0709a' }} />
              <span className="rail-label">Concept map</span>
            </button>
            <button
              className={`rail-link ${route.view === 'matrix' ? 'active' : ''}`}
              onClick={() => goView('matrix')}
            >
              <span className="rail-dot" style={{ background: '#5ac8a8' }} />
              <span className="rail-label">Matrices</span>
            </button>
          </div>

          {bands.map((band) => (
            <div className="rail-group" key={band[0]?.band}>
              <div className="rail-title">{BAND_LABELS[band[0]?.band ?? 1]}</div>
              {band.map((fw) => (
                <button
                  key={fw.id}
                  className={`rail-link ${currentFw === fw.id ? 'active' : ''}`}
                  onClick={() => goFramework(fw.id)}
                >
                  <span className="rail-dot" style={{ background: fw.accent }} />
                  <span className="rail-label">{fw.name}</span>
                  <span className="rail-count">{countOf(fw.id).toLocaleString()}</span>
                </button>
              ))}
            </div>
          ))}

          <div className="rail-group">
            <div className="rail-title">Reference</div>
            <button
              className={`rail-link ${route.view === 'about' ? 'active' : ''}`}
              onClick={() => goView('about')}
            >
              <span className="rail-dot" style={{ background: 'var(--dim)' }} />
              <span className="rail-label">About &amp; sources</span>
            </button>
            <a className="rail-link" href={MODEL_SOURCE} target="_blank" rel="noreferrer">
              <span className="rail-dot" style={{ background: 'var(--dim)' }} />
              <span className="rail-label">TM Forum model ↗</span>
            </a>
          </div>
        </nav>

        <main className="main">
          <div className="main-inner">{content}</div>
        </main>
      </div>

      {searchOpen && (
        <SearchPalette
          onClose={() => setSearchOpen(false)}
          onOpen={(node) => {
            setSearchOpen(false);
            openNode(node);
          }}
        />
      )}
    </div>
  );
}