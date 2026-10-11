import { useCallback, useEffect, useState } from 'react';

export type ViewId = 'overview' | 'matrix' | 'concepts' | 'about';

export interface Route {
  view: ViewId;
  framework: string | null;
  nodeId: string | null;
}

const VIEWS: ViewId[] = ['overview', 'matrix', 'concepts', 'about'];

function parse(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '');
  const [view, ...rest] = clean.split('/');
  if (!view) return { view: 'overview', framework: null, nodeId: null };
  if (view === 'fw' && rest[0]) return { view: 'overview', framework: rest[0], nodeId: rest[1] ?? null };
  if (view === 'node' && rest[0]) return { view: 'overview', framework: null, nodeId: rest[0] };
  if (VIEWS.includes(view as ViewId)) {
    return { view: view as ViewId, framework: rest[0] ?? null, nodeId: rest[1] ?? null };
  }
  return { view: 'overview', framework: null, nodeId: null };
}

function serialize(route: Route): string {
  if (route.view === 'overview') {
    if (route.framework) return `#/fw/${route.framework}${route.nodeId ? `/${route.nodeId}` : ''}`;
    if (route.nodeId) return `#/node/${route.nodeId}`;
    return '#/overview';
  }
  const parts: string[] = [route.view];
  if (route.framework) parts.push(route.framework);
  if (route.nodeId) parts.push(route.nodeId);
  return `#/${parts.join('/')}`;
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash));

  useEffect(() => {
    const onHash = () => setRoute(parse(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((next: Route) => {
    const hash = serialize(next);
    if (window.location.hash === hash) setRoute(next);
    else window.location.hash = hash;
  }, []);

  return { route, navigate };
}

export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => (localStorage.getItem('moda-theme') as 'dark' | 'light') ?? 'dark',
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('moda-theme', theme);
  }, [theme]);
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))] as const;
}