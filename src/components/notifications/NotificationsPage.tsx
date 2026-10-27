import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useRouter } from '../../context/RouterContext';
import { NotificationService } from '../../lib/services/notificationService';
import { DemoBadge } from '../ui/DemoBadge';
import { formatRelativeTime } from '../../lib/utils';
import {
  Bell,
  CheckCheck,
  Check,
  Filter,
  AlertTriangle,
  CloudRain,
  Calendar,
  Satellite,
  ExternalLink,
} from 'lucide-react';

export function NotificationsPage() {
  const { notifications, refreshData, showToast } = useApp();
  const { navigate } = useRouter();

  const [categoryFilter, setCategoryFilter] = useState<string>('Todas');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const matchCat = categoryFilter === 'Todas' || n.category === categoryFilter;
      const matchUnread = !unreadOnly || !n.read;
      return matchCat && matchUnread;
    });
  }, [notifications, categoryFilter, unreadOnly]);

  const handleMarkAsRead = (id: string) => {
    NotificationService.markAsRead(id);
    refreshData();
  };

  const handleMarkAll = () => {
    NotificationService.markAllAsRead();
    refreshData();
    showToast('Notificações atualizadas', 'Todas as mensagens foram marcadas como lidas.', 'info');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Alerta Agrícola':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'Condição Climática':
        return <CloudRain className="w-4 h-4 text-blue-600" />;
      case 'Atividade Pendente':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'Observação Satélite':
        return <Satellite className="w-4 h-4 text-[#65A30D]" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#65A30D]" />
            Centro de Notificações & Alertas
          </h2>
          <p className="text-xs text-gray-500">
            Avisos meteorológicos, passagens de satélite e tarefas agronómicas pendentes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Marcar todas como lidas</span>
          </button>
          <DemoBadge compact />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E5E7EB] shadow-xs text-xs">
        <div className="flex flex-wrap items-center gap-1">
          {['Todas', 'Alerta Agrícola', 'Condição Climática', 'Atividade Pendente', 'Observação Satélite'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                  categoryFilter === cat
                    ? 'bg-[#65A30D] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        <label className="flex items-center gap-2 text-gray-700 cursor-pointer font-medium pr-2">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
            className="rounded text-[#65A30D] focus:ring-[#65A30D]"
          />
          <span>Apenas não lidas</span>
        </label>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs divide-y divide-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="font-bold text-gray-800">Sem notificações para o filtro atual</p>
            <p className="mt-1">Tudo em dia nas suas explorações agrícolas.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                !item.read ? 'bg-lime-50/40' : 'hover:bg-gray-50/60'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  {getCategoryIcon(item.category)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-gray-900">{item.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                      {item.category}
                    </span>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#65A30D] shrink-0"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-xl">{item.message}</p>
                  <span className="text-[11px] text-gray-400 block">
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.link && (
                  <button
                    onClick={() => navigate(item.link!)}
                    className="p-2 text-gray-500 hover:text-[#65A30D] hover:bg-lime-50 rounded-lg transition-colors"
                    title="Abrir página associada"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
                {!item.read && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    className="p-2 text-gray-400 hover:text-[#65A30D] hover:bg-lime-50 rounded-lg transition-colors"
                    title="Marcar como lida"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
