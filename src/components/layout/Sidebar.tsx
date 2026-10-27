import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Sprout,
  Map,
  Activity,
  Bot,
  CloudSun,
  Satellite,
  CalendarDays,
  FileSpreadsheet,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

export function Sidebar() {
  const { currentPath, navigate } = useRouter();
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    unreadNotifsCount,
    alerts,
    userProfile,
    setIsAuthenticated,
    showToast,
    setHelpOpen,
  } = useApp();

  const activeAlertsCount = alerts.filter((a) => a.status === 'Ativo').length;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Mapa', path: '/map', icon: Map },
    {
      label: 'Monitorização',
      path: '/monitoring',
      icon: Activity,
      badge: activeAlertsCount > 0 ? `${activeAlertsCount} alertas` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      label: 'Assistente IA',
      path: '/ai-assistant',
      icon: Bot,
      highlight: true,
    },
    { label: 'Clima', path: '/weather', icon: CloudSun },
    { label: 'Satélite', path: '/satellite', icon: Satellite },
    { label: 'Calendário agrícola', path: '/calendar', icon: CalendarDays },
    { label: 'Relatórios', path: '/reports', icon: FileSpreadsheet },
    {
      label: 'Notificações',
      path: '/notifications',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? String(unreadNotifsCount) : undefined,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    { label: 'Definições', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    setIsAuthenticated(false);
    showToast('Sessão terminada', 'Sessão encerrada com sucesso no ambiente demonstrativo.', 'info');
    navigate('/login');
  };

  const isCurrentActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-[#E5E7EB] h-screen transition-all duration-300 z-30 select-none ${
        sidebarCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-14 px-3.5 border-b border-[#E5E7EB]">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 overflow-hidden text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#65A30D] to-[#365314] flex items-center justify-center text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            <Sprout className="w-5 h-5 text-[#ECFCCB]" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black tracking-tight text-[#1F2937]">
                Agri<span className="text-[#65A30D]">ia</span>
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                Precisão Agrícola
              </span>
            </div>
          )}
        </button>

        <button
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title={sidebarCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
          aria-label="Toggle Sidebar"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isCurrentActive(item.path);
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-lime-50 text-[#365314] font-semibold shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div
                className={`flex items-center justify-center shrink-0 ${
                  active ? 'text-[#65A30D]' : 'text-gray-400 group-hover:text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {!sidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between text-left truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${item.badgeColor || 'bg-gray-100 text-gray-700'}`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded bg-lime-100 text-[#365314]">
                      IA
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Help Guide Button */}
      <div className="px-3 pb-2">
        <button
          onClick={() => setHelpOpen(true)}
          className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-lime-900 bg-lime-50/80 hover:bg-lime-100 border border-lime-200/80 transition-colors ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}
          title="Manual de Ajuda & Guia Agronómico"
        >
          <HelpCircle className="w-4 h-4 text-[#65A30D] shrink-0" />
          {!sidebarCollapsed && <span>Ajuda & Dicionário</span>}
        </button>
      </div>

      {/* User Profile & Logout Section */}
      <div className="p-2.5 border-t border-[#E5E7EB] bg-gray-50/50">
        <div
          onClick={() => navigate('/settings')}
          className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-xs border border-transparent hover:border-gray-200/60 cursor-pointer transition-all ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}
          title="Ver definições do perfil"
        >
          <div className="relative shrink-0">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-lime-600/20"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#65A30D] border-2 border-white rounded-full"></span>
          </div>

          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-bold text-gray-900 truncate flex items-center gap-1">
                {userProfile.name}
                <ShieldCheck className="w-3 h-3 text-[#65A30D] shrink-0" />
              </p>
              <p className="text-[11px] text-gray-500 truncate">{userProfile.role}</p>
            </div>
          )}
        </div>

        {!sidebarCollapsed && (
          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-rose-600 hover:bg-rose-50/80 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminar sessão</span>
          </button>
        )}
      </div>
    </aside>
  );
}
