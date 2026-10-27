import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExportService } from '../../lib/services/exportService';
import { DemoBadge } from '../ui/DemoBadge';
import {
  FileSpreadsheet,
  Download,
  Eye,
  Filter,
  Calendar,
  Layers,
  Sprout,
  Activity,
  CloudSun,
  CheckCircle2,
} from 'lucide-react';

type ReportType = 'farms' | 'monitoring' | 'weather' | 'activities';

export function ReportsPage() {
  const { farms, activities, showToast } = useApp();

  const [activeReportType, setActiveReportType] = useState<ReportType>('farms');
  const [selectedFarmId, setSelectedFarmId] = useState<string>('Todas');
  const [selectedDateRange, setSelectedDateRange] = useState<'30d' | 'safra' | 'ano'>('30d');

  const handleExportCsv = () => {
    try {
      if (activeReportType === 'farms') {
        ExportService.exportFarmsToCsv();
      } else if (activeReportType === 'monitoring') {
        ExportService.exportMonitoringToCsv();
      } else if (activeReportType === 'weather') {
        ExportService.exportWeatherToCsv(selectedFarmId !== 'Todas' ? selectedFarmId : undefined);
      } else if (activeReportType === 'activities') {
        ExportService.exportActivitiesToCsv();
      }
      showToast('Exportação concluída', 'O ficheiro CSV foi descarregado para o seu computador.', 'success');
    } catch {
      showToast('Erro ao exportar', 'Não foi possível gerar o ficheiro CSV.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#65A30D]" />
            Relatórios Operacionais & Exportação
          </h2>
          <p className="text-xs text-gray-500">
            Geração de relatórios agronómicos e download direto em formato CSV
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#365314] hover:bg-[#283e0f] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-lime-400" />
            <span>Exportar para CSV</span>
          </button>
          <DemoBadge />
        </div>
      </div>

      {/* Report Types Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Farms Report */}
        <div
          onClick={() => setActiveReportType('farms')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeReportType === 'farms'
              ? 'bg-lime-50/80 border-[#65A30D] shadow-xs'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                activeReportType === 'farms'
                  ? 'bg-[#65A30D] text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">1. Cadastro de Explorações</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Áreas, culturas, solos e responsáveis</p>
            </div>
          </div>
        </div>

        {/* Monitoring NDVI Report */}
        <div
          onClick={() => setActiveReportType('monitoring')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeReportType === 'monitoring'
              ? 'bg-lime-50/80 border-[#65A30D] shadow-xs'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                activeReportType === 'monitoring'
                  ? 'bg-[#65A30D] text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">2. Monitorização NDVI</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Vigor vegetal e dados Sentinel-2</p>
            </div>
          </div>
        </div>

        {/* Climate Report */}
        <div
          onClick={() => setActiveReportType('weather')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeReportType === 'weather'
              ? 'bg-lime-50/80 border-[#65A30D] shadow-xs'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                activeReportType === 'weather'
                  ? 'bg-[#65A30D] text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">3. Boletim Agroclimático</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Chuva, humidade, evapotranspiração</p>
            </div>
          </div>
        </div>

        {/* Activities Report */}
        <div
          onClick={() => setActiveReportType('activities')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeReportType === 'activities'
              ? 'bg-lime-50/80 border-[#65A30D] shadow-xs'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                activeReportType === 'activities'
                  ? 'bg-[#65A30D] text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">4. Registo de Atividades</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Manejo, adubações e custos da safra</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Preview Bar */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="p-4 px-6 border-b border-gray-100 bg-gray-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#65A30D]" />
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Pré-visualização do Relatório: {activeReportType.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-1.5 bg-[#65A30D] hover:bg-[#558b0a] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descarregar CSV (.csv)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Table Preview */}
        <div className="overflow-x-auto">
          {activeReportType === 'farms' && (
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="px-6 py-3">Exploração</th>
                  <th className="px-4 py-3">Província</th>
                  <th className="px-4 py-3">Área (ha)</th>
                  <th className="px-4 py-3">Culturas</th>
                  <th className="px-4 py-3">Tipo de Solo</th>
                  <th className="px-4 py-3">Irrigação</th>
                  <th className="px-4 py-3">Saúde (%)</th>
                  <th className="px-6 py-3">Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {farms.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3.5 font-bold text-gray-900">{f.name}</td>
                    <td className="px-4 py-3.5">{f.province}</td>
                    <td className="px-4 py-3.5 font-semibold">{f.areaHectares} ha</td>
                    <td className="px-4 py-3.5">{f.cropTypes.join(', ')}</td>
                    <td className="px-4 py-3.5">{f.soilType}</td>
                    <td className="px-4 py-3.5">{f.irrigationSystem}</td>
                    <td className="px-4 py-3.5 font-bold text-[#365314]">{f.healthScore}%</td>
                    <td className="px-6 py-3.5 text-gray-500">{f.managerName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeReportType === 'activities' && (
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="px-6 py-3">Atividade</th>
                  <th className="px-4 py-3">Exploração</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Prioridade</th>
                  <th className="px-4 py-3">Data Limite</th>
                  <th className="px-4 py-3">Responsável</th>
                  <th className="px-6 py-3 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activities.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3.5 font-bold text-gray-900">{a.title}</td>
                    <td className="px-4 py-3.5">{a.farmName}</td>
                    <td className="px-4 py-3.5">{a.category}</td>
                    <td className="px-4 py-3.5">{a.priority}</td>
                    <td className="px-4 py-3.5 font-mono">{a.dueDate}</td>
                    <td className="px-4 py-3.5">{a.assignedTo}</td>
                    <td className="px-6 py-3.5 text-right font-semibold">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {(activeReportType === 'monitoring' || activeReportType === 'weather') && (
            <div className="p-8 text-center text-xs text-gray-500 space-y-2">
              <FileSpreadsheet className="w-10 h-10 text-[#65A30D] mx-auto opacity-75" />
              <p className="font-bold text-gray-800 text-sm">
                Relatório pronto para download em CSV
              </p>
              <p className="max-w-md mx-auto">
                Os dados multiespectrais Sentinel-2 e os registros meteorológicos de 7 dias estão
                consolidados e prontos para exportação compatível com Excel e SIG.
              </p>
              <button
                onClick={handleExportCsv}
                className="mt-3 px-4 py-2 bg-[#65A30D] hover:bg-[#558b0a] text-white font-bold rounded-xl shadow-xs transition-colors"
              >
                Descarregar Relatório Completo (.csv)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
