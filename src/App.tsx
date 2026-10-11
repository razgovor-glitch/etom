import { useCallback, useEffect, useState } from 'react';
import type { ModaNode } from './types';
import { useRoute, useTheme, type ViewId } from './lib/router';
import { FRAMEWORKS, BAND_KEY, fwText } from './data/meta';
import { BY_FRAMEWORK, NODES_BY_ID, MODEL_SOURCE } from './data/model';
import { useI18n } from './i18n';
import Overview from './components/Overview';
import Explorer from './components/Explorer';
import Matrix from './components/Matrix';
import Concepts from './components/Concepts';
import About from './components/About';
import SearchPalette from './components/SearchPalette';
import NodeDetail from './components/NodeDetail';

const countOf = (fw: string) => (BY_FRAMEWORK.get(fw) ?? []).length;

export default function App() {
  const { route, navigate } = useRoute();
  const [theme, toggleTheme] = useTheme();
  const { t, locale, toggle: toggleLocale, fmt } = useI18n();
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
      // the model root lists every framework it contains
      navigate({ view: 'overview', framework: node.fw === '_root' ? null : node.fw, nodeId: node.id });
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
        onSelect={(id) => navigate({ view: 'overview', framework: currentFw, nodeId: id })}
      />
    );
  } else if (selected) {
    content = <NodeDetail node={selected} onOpen={openById} />;
  } else {
    content = (
      <Overview
        onOpenFramework={goFramework}
        onOpenNode={openById}
        onOpenConcepts={() => goView('concepts')}
      />
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <button
          className="icon-btn mobile-only"
          onClick={() => setRailOpen((v) => !v)}
          aria-label={t('aria.menu')}
        >
          ☰
        </button>
        <div className="brand" onClick={() => goView('overview')} style={{ cursor: 'pointer' }}>
          <div className="brand-mark">MO</div>
          <div>
            <div className="brand-title">MODA Explorer</div>
          </div>
          <div className="brand-sub">{t('brand.sub')}</div>
        </div>

        <div className="topbar-spacer" />

        <button className="search-trigger" onClick={() => setSearchOpen(true)}>
          <span>⌕</span>
          <span>{t('search.trigger')}</span>
          <kbd>⌘K</kbd>
        </button>

        <button
          className="lang-switch"
          onClick={toggleLocale}
          title={t('aria.language')}
          aria-label={t('aria.language')}
        >
          <span className={locale === 'en' ? 'on' : ''}>EN</span>
          <span className={locale === 'ru' ? 'on' : ''}>RU</span>
        </button>

        <button className="icon-btn" onClick={toggleTheme} title={t('aria.theme')}>
          {theme === 'dark' ? '☾' : '☀'}
        </button>
      </header>

      <div className="body">
        <nav className={`rail ${railOpen ? 'mobile-open' : ''}`}>
          <div className="rail-group">
            <div className="rail-title">{t('nav.group.model')}</div>
            <button
              className={`rail-link ${route.view === 'overview' && !currentFw ? 'active' : ''}`}
              onClick={() => goView('overview')}
            >
              <span className="rail-dot" style={{ background: 'var(--accent)' }} />
              <span className="rail-label">{t('nav.overview')}</span>
            </button>
            <button
              className={`rail-link ${route.view === 'concepts' ? 'active' : ''}`}
              onClick={() => goView('concepts')}
            >
              <span className="rail-dot" style={{ background: '#e0709a' }} />
              <span className="rail-label">{t('nav.concepts')}</span>
            </button>
            <button
              className={`rail-link ${route.view === 'matrix' ? 'active' : ''}`}
              onClick={() => goView('matrix')}
            >
              <span className="rail-dot" style={{ background: '#5ac8a8' }} />
              <span className="rail-label">{t('nav.matrices')}</span>
            </button>
          </div>

          {bands.map((band) => (
            <div className="rail-group" key={band[0]?.band}>
              <div className="rail-title">{t(BAND_KEY[band[0]?.band ?? 1])}</div>
              {band.map((fw) => (
                <button
                  key={fw.id}
                  className={`rail-link ${currentFw === fw.id ? 'active' : ''}`}
                  onClick={() => goFramework(fw.id)}
                >
                  <span className="rail-dot" style={{ background: fw.accent }} />
                  <span className="rail-label">{fwText(fw, locale).name}</span>
                  <span className="rail-count">{fmt(countOf(fw.id))}</span>
                </button>
              ))}
            </div>
          ))}

          <div className="rail-group">
            <div className="rail-title">{t('nav.group.reference')}</div>
            <button
              className={`rail-link ${route.view === 'about' ? 'active' : ''}`}
              onClick={() => goView('about')}
            >
              <span className="rail-dot" style={{ background: 'var(--dim)' }} />
              <span className="rail-label">{t('nav.about')}</span>
            </button>
            <a className="rail-link" href={MODEL_SOURCE} target="_blank" rel="noreferrer">
              <span className="rail-dot" style={{ background: 'var(--dim)' }} />
              <span className="rail-label">{t('nav.tmforum')}</span>
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