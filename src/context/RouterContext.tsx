import React, { createContext, useContext, useEffect, useState } from 'react';

export interface RouteMatch {
  path: string;
  params: Record<string, string>;
}

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
  params: Record<string, string>;
  breadcrumbs: { label: string; path?: string }[];
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function matchRoute(current: string): { routeName: string; params: Record<string, string> } {
  // Normalize
  const clean = current.split('?')[0].replace(/\/+$/, '') || '/';

  // Check /farms/:farmId
  const farmDetailMatch = clean.match(/^\/farms\/(farm-[a-zA-Z0-9_-]+)$/);
  if (farmDetailMatch) {
    return {
      routeName: '/farms/[farmId]',
      params: { farmId: farmDetailMatch[1] },
    };
  }

  return {
    routeName: clean,
    params: {},
  };
}

function computeBreadcrumbs(path: string, params: Record<string, string>): { label: string; path?: string }[] {
  const clean = path.split('?')[0].replace(/\/+$/, '') || '/';
  if (clean === '/dashboard' || clean === '/') {
    return [{ label: 'Dashboard' }];
  }

  const crumbs: { label: string; path?: string }[] = [{ label: 'Início', path: '/dashboard' }];

  if (clean === '/map') {
    crumbs.push({ label: 'Mapa Geoespacial' });
  } else if (clean === '/monitoring') {
    crumbs.push({ label: 'Monitorização de Culturas' });
  } else if (clean === '/ai-assistant') {
    crumbs.push({ label: 'Assistente Agrícola IA' });
  } else if (clean === '/weather') {
    crumbs.push({ label: 'Previsão & Clima' });
  } else if (clean === '/satellite') {
    crumbs.push({ label: 'Observação por Satélite' });
  } else if (clean === '/calendar') {
    crumbs.push({ label: 'Calendário de Manejo' });
  } else if (clean === '/reports') {
    crumbs.push({ label: 'Relatórios & Exportação' });
  } else if (clean === '/notifications') {
    crumbs.push({ label: 'Centro de Notificações' });
  } else if (clean === '/settings') {
    crumbs.push({ label: 'Definições do Sistema' });
  } else if (clean === '/login') {
    crumbs.push({ label: 'Autenticação' });
  } else if (clean === '/register') {
    crumbs.push({ label: 'Registo' });
  } else if (clean === '/forgot-password') {
    crumbs.push({ label: 'Recuperar Palavra-passe' });
  } else {
    crumbs.push({ label: clean.replace('/', '') });
  }

  return crumbs;
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      return pathname === '/' ? '/dashboard' : pathname;
    }
    return '/dashboard';
  });

  const { params } = matchRoute(currentPath);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      setCurrentPath(pathname === '/' ? '/dashboard' : pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const breadcrumbs = computeBreadcrumbs(currentPath, params);

  return (
    <RouterContext.Provider value={{ currentPath, navigate, params, breadcrumbs }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
