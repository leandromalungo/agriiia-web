import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useRouter } from '../../context/RouterContext';
import { Farm, FarmStatus } from '../../types';
import { FarmService } from '../../lib/services/farmService';
import { DemoBadge } from '../ui/DemoBadge';
import { formatHectares } from '../../lib/utils';
import {
  LayoutGrid,
  Table as TableIcon,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  MapPin,
  Sprout,
  Eye,
  Trash2,
  Edit,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
  Activity,
  Layers,
} from 'lucide-react';

export function FarmsPage() {
  const { farms, refreshData, showToast } = useApp();
  const { navigate } = useRouter();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [provinceFilter, setProvinceFilter] = useState<string>('Todas');
  const [statusFilter, setStatusFilter] = useState<string>('Todas');
  const [sortBy, setSortBy] = useState<'name' | 'area' | 'health'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Delete confirmation modal state
  const [farmToDelete, setFarmToDelete] = useState<Farm | null>(null);

  // Provinces list
  const availableProvinces = ['Todas', 'Huambo', 'Huíla', 'Malanje', 'Benguela', 'Uíge', 'Bié'];

  // Filter & Sort
  const filteredFarms = useMemo(() => {
    return farms
      .filter((f) => {
        const matchesSearch =
          f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.municipality.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.cropTypes.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesProvince = provinceFilter === 'Todas' || f.province === provinceFilter;
        const matchesStatus = statusFilter === 'Todas' || f.status === statusFilter;

        return matchesSearch && matchesProvince && matchesStatus;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
        else if (sortBy === 'area') cmp = a.areaHectares - b.areaHectares;
        else if (sortBy === 'health') cmp = a.healthScore - b.healthScore;
        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [farms, searchTerm, provinceFilter, statusFilter, sortBy, sortOrder]);

  const handleDeleteConfirm = () => {
    if (!farmToDelete) return;
    const ok = FarmService.delete(farmToDelete.id);
    if (ok) {
      refreshData();
      showToast('Exploração eliminada', `A exploração "${farmToDelete.name}" foi removida.`, 'info');
    }
    setFarmToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Gestão de Explorações Agrícolas
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {farms.length} propriedades cadastradas • Monitorização por satélite e dados de solo
          </p>
        </div>

        <button
          onClick={() => navigate('/farms/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#65A30D] hover:bg-[#558b0a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Adicionar Nova Exploração</span>
        </button>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por nome, província ou cultura..."
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#65A30D] focus:ring-1 focus:ring-[#65A30D]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Province Filter */}
          <div className="flex items-center gap-1.5 bg-[#F8FAF5] border border-gray-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-gray-400 font-medium">Província:</span>
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="bg-transparent text-gray-800 font-semibold focus:outline-none cursor-pointer"
            >
              {availableProvinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#F8FAF5] border border-gray-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-gray-400 font-medium">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-gray-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Todas">Todas</option>
              <option value="Ativa">Ativa</option>
              <option value="Atenção">Atenção</option>
              <option value="Em Repouso">Em Repouso</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-1.5 bg-[#F8FAF5] border border-gray-200 px-3 py-1.5 rounded-xl text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-gray-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="name">Ordenar por Nome</option>
              <option value="area">Ordenar por Área</option>
              <option value="health">Ordenar por Saúde</option>
            </select>
          </div>

          {/* Toggle Grid vs Table */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Vista em Grelha"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Vista em Tabela"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredFarms.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
          <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">Nenhuma exploração encontrada</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Não foram encontradas explorações que correspondam aos filtros selecionados.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setProvinceFilter('Todas');
              setStatusFilter('Todas');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-[#65A30D] hover:underline"
          >
            Limpar todos os filtros
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredFarms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm) => {
            const statusColors: Record<FarmStatus, string> = {
              Ativa: 'bg-emerald-50 text-emerald-800 border-emerald-200',
              Atenção: 'bg-amber-50 text-amber-800 border-amber-200',
              'Em Repouso': 'bg-gray-100 text-gray-700 border-gray-200',
            };

            return (
              <div
                key={farm.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-lime-400 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Card Header */}
                  <div className="p-5 pb-4 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#65A30D] bg-lime-50 px-2 py-0.5 rounded-md">
                            {farm.province}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                              statusColors[farm.status]
                            }`}
                          >
                            {farm.status}
                          </span>
                        </div>
                        <h3
                          onClick={() => navigate(`/farms/${farm.id}`)}
                          className="text-base font-bold text-gray-900 group-hover:text-[#365314] mt-2 cursor-pointer transition-colors"
                        >
                          {farm.name}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {farm.municipality} • {farm.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-gray-400 text-[11px] block">Área Total</span>
                        <span className="font-extrabold text-gray-900 text-sm">
                          {formatHectares(farm.areaHectares)}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-gray-400 text-[11px] block">Parcelas</span>
                        <span className="font-extrabold text-gray-900 text-sm">
                          {farm.plots.length} parcelas
                        </span>
                      </div>
                    </div>

                    {/* Crops Badges */}
                    <div>
                      <span className="text-[11px] font-medium text-gray-400 block mb-1">
                        Culturas Principais:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {farm.cropTypes.map((crop, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-lime-50 text-[#365314] border border-lime-200/60"
                          >
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Soil & Irrigation */}
                    <div className="text-xs text-gray-600 space-y-1 pt-1">
                      <p>
                        <strong className="text-gray-700">Solo:</strong> {farm.soilType}
                      </p>
                      <p>
                        <strong className="text-gray-700">Irrigação:</strong>{' '}
                        {farm.irrigationSystem}
                      </p>
                    </div>

                    {/* Health Score Bar */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500 font-medium">Índice Vegetativo Médio:</span>
                        <span className="font-bold text-[#365314]">{farm.healthScore}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#65A30D] h-full rounded-full transition-all"
                          style={{ width: `${farm.healthScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => navigate(`/farms/${farm.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-lime-50 text-[#365314] border border-gray-200 hover:border-lime-300 rounded-xl text-xs font-bold shadow-2xs transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#65A30D]" />
                    <span>Ver Detalhes</span>
                  </button>

                  <button
                    onClick={() => setFarmToDelete(farm)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Eliminar exploração"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && filteredFarms.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Exploração</th>
                  <th className="px-4 py-3.5">Província / Município</th>
                  <th className="px-4 py-3.5">Área (ha)</th>
                  <th className="px-4 py-3.5">Culturas</th>
                  <th className="px-4 py-3.5">Sistema de Irrigação</th>
                  <th className="px-4 py-3.5">Saúde (NDVI)</th>
                  <th className="px-4 py-3.5">Estado</th>
                  <th className="px-6 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFarms.map((farm) => (
                  <tr key={farm.id} className="hover:bg-lime-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      <div
                        onClick={() => navigate(`/farms/${farm.id}`)}
                        className="cursor-pointer hover:text-[#65A30D]"
                      >
                        {farm.name}
                        <span className="block text-[11px] font-normal text-gray-400">
                          {farm.plots.length} parcelas
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {farm.province}
                      <span className="block text-[11px] text-gray-400">{farm.municipality}</span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {formatHectares(farm.areaHectares)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {farm.cropTypes.map((c, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 text-[10px]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{farm.irrigationSystem}</td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-[#365314]">{farm.healthScore}%</span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          farm.status === 'Ativa'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {farm.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/farms/${farm.id}`)}
                          className="p-1.5 text-gray-600 hover:text-[#65A30D] hover:bg-lime-50 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setFarmToDelete(farm)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {farmToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in-0">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-gray-900">Eliminar Exploração Agrícola?</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Tem a certeza de que deseja remover a exploração{' '}
                <strong>&quot;{farmToDelete.name}&quot;</strong>? Esta ação apagará as parcelas,
                atividades e observações associadas no estado local.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setFarmToDelete(null)}
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Sim, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
