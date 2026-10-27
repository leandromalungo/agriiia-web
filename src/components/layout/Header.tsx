import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../ui/DemoBadge';
import {
  Search,
  Bell,
  Plus,
  ChevronRight,
  ExternalLink,
  Check,
  CalendarPlus,
  Download,
  Filter,
  HelpCircle,
} from 'lucide-react';
import { NotificationService } from '../../lib/services/notificationService';

export function Header() {
  const { currentPath, navigate, breadcrumbs } = useRouter();
  const {
    userProfile,
    unreadNotifsCount,
    notifications,
    refreshData,
    setSearchOpen,
    showToast,
    setHelpOpen,
  } = useApp();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Compute Page Title
  const getPageTitle = () => {
    if (currentPath === '/dashboard') return 'Painel Geral de Controlo';
    if (currentPath === '/map') return 'Cartografia & Satélite';
    if (currentPath === '/monitoring') return 'Monitorização Vegetativa';
    if (currentPath === '/ai-assistant') return 'Assistente Agronómico IA';
    if (currentPath === '/weather') return 'Boletim Meteorológico & Clima';
    if (currentPath === '/satellite') return 'Observações de Satélite';
    if (currentPath === '/calendar') return 'Calendário Agrícola & Manejo';
    if (currentPath === '/reports') return 'Relatórios & Exportações';
    if (currentPath === '/notifications') return 'Notificações e Alertas';
    if (currentPath === '/settings') return 'Definições da Conta';
    return 'Agriia';
  };

  // Contextual action button
  const renderContextualAction = () => {
    if (currentPath === '/calendar') {
      return (
        <button
          onClick={() => {
            const event = new CustomEvent('open-new-activity-modal');
            window.dispatchEvent(event);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#65A30D] hover:bg-[#558b0a] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Nova Atividade</span>
        </button>
      );
    }
    if (currentPath === '/reports') {
      return (
        <button
          onClick={() => {
            const event = new CustomEvent('trigger-quick-export');
            window.dispatchEvent(event);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#365314] hover:bg-[#283e0f] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Dados</span>
        </button>
      );
    }
    return null;
  };

  const handleMarkAllRead = () => {
    NotificationService.markAllAsRead();
    refreshData();
    showToast('Notificações atualizadas', 'Todas as notificações foram marcadas como lidas.', 'info');
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] px-5 py-2.5 flex items-center justify-between">
      {/* Left: Breadcrumbs & Page Title */}
      <div className="flex flex-col">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />}
                {crumb.path && !isLast ? (
                  <button
                    onClick={() => navigate(crumb.path!)}
                    className="hover:text-[#65A30D] transition-colors"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className={isLast ? 'font-semibold text-gray-800' : ''}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
        <div className="flex items-center gap-2.5">
          <h1 className="text-base font-bold text-gray-900 tracking-tight leading-none">
            {getPageTitle()}
          </h1>
          <DemoBadge compact />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Quick Search Bar trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#F8FAF5] hover:bg-gray-100/80 border border-[#E5E7EB] text-gray-500 text-xs rounded-xl w-56 text-left transition-all group"
        >
          <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
          <span className="flex-1 truncate">Pesquisar...</span>
          <kbd className="px-1.5 py-0.5 text-[9px] font-mono text-gray-400 bg-white border border-gray-200 rounded">
            Ctrl+K
          </kbd>
        </button>

        {/* Contextual Action Button */}
        {renderContextualAction()}

        {/* Help Guide Button */}
        <button
          onClick={() => setHelpOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#65A30D] bg-[#F8FAF5] hover:bg-lime-50 border border-gray-200 hover:border-lime-300 rounded-xl transition-all"
          title="Abrir Manual de Ajuda & Guia Agronómico"
        >
          <HelpCircle className="w-4 h-4 text-[#65A30D]" />
          <span>Ajuda</span>
        </button>

        {/* Notifications Icon with popover */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen((prev) => !prev)}
            className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
            title="Notificações"
            aria-label="Abrir notificações"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setNotifDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 z-40 overflow-hidden animate-in fade-in-0 duration-150">
                <div className="p-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">Notificações</span>
                    {unreadNotifsCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700">
                        {unreadNotifsCount} novas
                      </span>
                    )}
                  </div>
                  {unreadNotifsCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-[#65A30D] hover:underline flex items-center gap-1 font-medium"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Marcar lidas
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        NotificationService.markAsRead(n.id);
                        refreshData();
                        setNotifDropdownOpen(false);
                        if (n.link) navigate(n.link);
                        else navigate('/notifications');
                      }}
                      className={`p-3.5 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !n.read ? 'bg-lime-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-gray-900 leading-snug">
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-[#65A30D] shrink-0 mt-1"></span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-center">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(false);
                      navigate('/notifications');
                    }}
                    className="text-xs font-semibold text-[#365314] hover:text-[#65A30D] transition-colors"
                  >
                    Ver todas as notificações &rarr;
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Contextual Action Button */}
        {renderContextualAction()}

        {/* User Mini Card */}
        <div
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 pl-2 border-l border-gray-200 cursor-pointer group"
          title="Ver perfil e definições"
        >
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200 group-hover:ring-[#65A30D] transition-all"
          />
          <div className="hidden lg:flex flex-col text-left leading-none">
            <span className="text-xs font-bold text-gray-900 group-hover:text-[#365314]">
              {userProfile.name.split(' ')[0]} {userProfile.name.split(' ').slice(-1)[0]}
            </span>
            <span className="text-[10px] text-gray-500 mt-0.5">{userProfile.company}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
