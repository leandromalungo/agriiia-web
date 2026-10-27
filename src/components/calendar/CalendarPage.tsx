import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityService } from '../../lib/services/activityService';
import { AgriculturalActivity, ActivityCategory, ActivityStatus } from '../../types';
import { DemoBadge } from '../ui/DemoBadge';
import { formatCurrencyAoa } from '../../lib/utils';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Layers,
  Sprout,
  X,
  Save,
  Trash2,
} from 'lucide-react';

export function CalendarPage() {
  const { activities, farms, refreshData, showToast } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedFarmFilter, setSelectedFarmFilter] = useState<string>('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<AgriculturalActivity | null>(null);

  // Form State for modal
  const [title, setTitle] = useState('');
  const [farmId, setFarmId] = useState(farms[0]?.id || 'farm-1');
  const [plotName, setPlotName] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('Fertilização');
  const [priority, setPriority] = useState<'Baixa' | 'Média' | 'Alta' | 'Urgente'>('Média');
  const [dueDate, setDueDate] = useState('2026-10-30');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('Matias Bento');
  const [costEstimated, setCostEstimated] = useState<number>(250000);

  // Listen for header button trigger
  useEffect(() => {
    const handleOpen = () => {
      setEditingActivity(null);
      resetForm();
      setIsModalOpen(true);
    };
    window.addEventListener('open-new-activity-modal', handleOpen);
    return () => window.removeEventListener('open-new-activity-modal', handleOpen);
  }, []);

  const resetForm = () => {
    setTitle('');
    setPlotName('');
    setCategory('Fertilização');
    setPriority('Média');
    setDueDate('2026-10-30');
    setDescription('');
    setAssignedTo('Matias Bento');
    setCostEstimated(250000);
  };

  const handleEditClick = (act: AgriculturalActivity) => {
    setEditingActivity(act);
    setTitle(act.title);
    setFarmId(act.farmId);
    setPlotName(act.plotName || '');
    setCategory(act.category);
    setPriority(act.priority);
    setDueDate(act.dueDate);
    setDescription(act.description);
    setAssignedTo(act.assignedTo);
    setCostEstimated(act.costEstimatedAoa || 0);
    setIsModalOpen(true);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Campos em falta', 'O título da atividade é obrigatório.', 'error');
      return;
    }

    const farmObj = farms.find((f) => f.id === farmId) || farms[0];

    if (editingActivity) {
      ActivityService.update(editingActivity.id, {
        title,
        farmId,
        farmName: farmObj.name,
        plotName: plotName || 'Geral',
        category,
        priority,
        dueDate,
        description,
        assignedTo,
        costEstimatedAoa: Number(costEstimated),
      });
      showToast('Atividade atualizada', 'Alterações guardadas no estado local.', 'success');
    } else {
      ActivityService.create({
        title,
        farmId,
        farmName: farmObj.name,
        plotName: plotName || 'Geral',
        category,
        priority,
        dueDate,
        description,
        assignedTo,
        costEstimatedAoa: Number(costEstimated),
        status: 'Pendente',
      });
      showToast('Nova atividade criada', `A atividade "${title}" foi agendada.`, 'success');
    }

    refreshData();
    setIsModalOpen(false);
  };

  const handleToggleStatus = (id: string, actTitle: string) => {
    ActivityService.toggleStatus(id);
    refreshData();
    showToast('Estado alterado', `Estado da atividade "${actTitle}" atualizado.`, 'info');
  };

  const handleDeleteActivity = (id: string) => {
    ActivityService.delete(id);
    refreshData();
    showToast('Atividade removida', 'Atividade apagada com sucesso.', 'info');
    setIsModalOpen(false);
  };

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const today = () => {
    setCurrentDate(new Date(2026, 9, 1)); // October 2026 default
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  const monthTitle = `${monthNames[month]} de ${year}`;

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchCat = selectedCategory === 'Todas' || act.category === selectedCategory;
      const matchFarm = selectedFarmFilter === 'Todas' || act.farmId === selectedFarmFilter;
      return matchCat && matchFarm;
    });
  }, [activities, selectedCategory, selectedFarmFilter]);

  // Calendar matrix calculation
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Days array (starting on Monday)
  // Monday is 1, Sunday is 0 -> offset
  const startOffset = (firstDayOfMonth + 6) % 7;
  const daysArray = Array.from({ length: 42 }).map((_, idx) => {
    const dayNumber = idx - startOffset + 1;
    const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
    const formattedDate = isCurrentMonth
      ? `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`
      : '';

    const dayActivities = isCurrentMonth
      ? filteredActivities.filter((a) => a.dueDate === formattedDate)
      : [];

    return {
      dayNumber,
      isCurrentMonth,
      dateString: formattedDate,
      activities: dayActivities,
    };
  });

  const categoryBadgeColors: Record<ActivityCategory, string> = {
    Plantação: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Irrigação: 'bg-blue-100 text-blue-800 border-blue-200',
    Fertilização: 'bg-purple-100 text-purple-800 border-purple-200',
    Tratamento: 'bg-amber-100 text-amber-800 border-amber-200',
    Colheita: 'bg-orange-100 text-orange-800 border-orange-200',
    Outro: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#65A30D]" />
            Calendário de Manejo Agrícola
          </h2>
          <p className="text-xs text-gray-500">
            Planeamento operacional: plantação, rega, adubação e colheitas da safra
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Farm filter */}
          <div className="flex items-center gap-1.5 bg-[#F8FAF5] border border-gray-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-gray-400 font-medium">Exploração:</span>
            <select
              value={selectedFarmFilter}
              onChange={(e) => setSelectedFarmFilter(e.target.value)}
              className="bg-transparent text-gray-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Todas">Todas</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5 bg-[#F8FAF5] border border-gray-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-gray-400 font-medium">Categoria:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-gray-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Todas">Todas as Tarefas</option>
              <option value="Plantação">Plantação</option>
              <option value="Irrigação">Irrigação</option>
              <option value="Fertilização">Fertilização</option>
              <option value="Tratamento">Tratamento</option>
              <option value="Colheita">Colheita</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <button
            onClick={() => {
              setEditingActivity(null);
              resetForm();
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#65A30D] hover:bg-[#558b0a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nova Atividade</span>
          </button>
        </div>
      </div>

      {/* Calendar Month Navigation Header */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="p-4 px-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-extrabold text-gray-900 tracking-tight">{monthTitle}</h3>
            <DemoBadge compact />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={today}
              className="px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200/80 rounded-lg transition-colors border border-gray-200 bg-white"
            >
              Mês Atual
            </button>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
              <button
                onClick={prevMonth}
                className="p-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Mês Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Mês Seguinte"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 text-center text-xs font-bold text-gray-500 uppercase tracking-wider py-2.5">
          <span>Seg</span>
          <span>Ter</span>
          <span>Qua</span>
          <span>Qui</span>
          <span>Sex</span>
          <span>Sáb</span>
          <span>Dom</span>
        </div>

        {/* Calendar Grid Matrix */}
        <div className="grid grid-cols-7 auto-rows-[115px] divide-x divide-y divide-gray-100">
          {daysArray.map((cell, idx) => {
            const isToday = cell.dateString === '2026-10-27';

            return (
              <div
                key={idx}
                className={`p-1.5 flex flex-col justify-between overflow-hidden transition-colors ${
                  !cell.isCurrentMonth
                    ? 'bg-gray-50/40 text-gray-300'
                    : isToday
                    ? 'bg-lime-50/30 font-semibold'
                    : 'bg-white hover:bg-lime-50/20'
                }`}
              >
                <div className="flex items-center justify-between px-1">
                  <span
                    className={`text-xs ${
                      isToday
                        ? 'w-6 h-6 rounded-full bg-[#65A30D] text-white flex items-center justify-center font-bold shadow-xs'
                        : cell.isCurrentMonth
                        ? 'text-gray-800'
                        : 'text-gray-300'
                    }`}
                  >
                    {cell.isCurrentMonth ? cell.dayNumber : ''}
                  </span>
                  {cell.activities.length > 0 && (
                    <span className="text-[10px] text-gray-400 font-bold">
                      {cell.activities.length} {cell.activities.length === 1 ? 'tarefa' : 'tarefas'}
                    </span>
                  )}
                </div>

                {/* Day Activities List */}
                <div className="space-y-1 overflow-y-auto max-h-[80px] mt-1">
                  {cell.activities.map((act) => {
                    const isDone = act.status === 'Concluída';
                    return (
                      <div
                        key={act.id}
                        onClick={() => handleEditClick(act)}
                        className={`px-1.5 py-1 rounded-md text-[10px] border cursor-pointer truncate transition-all ${
                          categoryBadgeColors[act.category]
                        } ${isDone ? 'opacity-50 line-through' : 'hover:scale-[1.02]'}`}
                        title={`${act.title} • ${act.farmName}`}
                      >
                        <span className="font-bold mr-1">{act.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Details / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in-0">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-lime-900 to-[#365314] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-lime-300" />
                <h3 className="text-sm font-bold">
                  {editingActivity ? 'Editar Atividade Agrícola' : 'Nova Atividade no Calendário'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveActivity} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Título da Atividade *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Adubação de Cobertura com Ureia"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Exploração Agrícola *</label>
                  <select
                    value={farmId}
                    onChange={(e) => setFarmId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                  >
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Parcela / Sector</label>
                  <input
                    type="text"
                    value={plotName}
                    onChange={(e) => setPlotName(e.target.value)}
                    placeholder="Ex: Parcela Norte A1"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                  >
                    <option value="Plantação">Plantação</option>
                    <option value="Irrigação">Irrigação</option>
                    <option value="Fertilização">Fertilização</option>
                    <option value="Tratamento">Tratamento</option>
                    <option value="Colheita">Colheita</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Prioridade</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Data Limite *</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Responsável Operacional</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Custo Estimado (AOA)</label>
                  <input
                    type="number"
                    value={costEstimated}
                    onChange={(e) => setCostEstimated(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Instruções / Descrição de Manejo</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Instruções de aplicação, dosagem, condições atmosféricas ideais..."
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                {editingActivity ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(editingActivity.id, editingActivity.title)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#65A30D]" />
                      <span>Alternar Estado ({editingActivity.status})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteActivity(editingActivity.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Eliminar atividade"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div></div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#65A30D] hover:bg-[#558b0a] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Atividade</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
