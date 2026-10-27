import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useRouter } from '../../context/RouterContext';
import { DemoBadge } from '../ui/DemoBadge';
import { HelpTooltip } from '../ui/HelpTooltip';
import {
  Sprout,
  LandPlot,
  Activity,
  AlertTriangle,
  CloudRain,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
  ChevronRight,
  HelpCircle,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatHectares } from '../../lib/utils';
import { ActivityService } from '../../lib/services/activityService';
import { AlertService } from '../../lib/services/alertService';

export function DashboardPage() {
  const { farms, activities, alerts, refreshData, showToast, setHelpOpen } = useApp();
  const { navigate } = useRouter();

  // Metrics calculation
  const totalFarms = farms.length;
  const totalPlots = farms.reduce((sum, f) => sum + f.plots.length, 0);
  const totalHectares = farms.reduce((sum, f) => sum + f.areaHectares, 0);
  const activeAlerts = alerts.filter((a) => a.status === 'Ativo');
  const avgHealth = Math.round(
    farms.reduce((sum, f) => sum + f.healthScore, 0) / (totalFarms || 1)
  );

  // Chart data: NDVI evolution throughout the crop cycle
  const ndviTrendData = [
    { month: 'Mai', huambo: 0.52, huila: 0.48, malanje: 0.55 },
    { month: 'Jun', huambo: 0.45, huila: 0.42, malanje: 0.49 },
    { month: 'Jul', huambo: 0.41, huila: 0.40, malanje: 0.46 },
    { month: 'Ago', huambo: 0.58, huila: 0.62, malanje: 0.60 },
    { month: 'Set', huambo: 0.74, huila: 0.78, malanje: 0.70 },
    { month: 'Out', huambo: 0.82, huila: 0.84, malanje: 0.78 },
  ];

  // Chart data: Rainfall comparison (current vs historical)
  const rainfallData = [
    { month: 'Mai', real: 15, historico: 12 },
    { month: 'Jun', real: 2, historico: 3 },
    { month: 'Jul', real: 0, historico: 1 },
    { month: 'Ago', real: 8, historico: 6 },
    { month: 'Set', real: 45, historico: 50 },
    { month: 'Out', real: 112, historico: 105 },
  ];

  const handleToggleActivity = (id: string, title: string) => {
    ActivityService.toggleStatus(id);
    refreshData();
    showToast('Atividade atualizada', `O estado da tarefa "${title}" foi alterado.`, 'info');
  };

  const handleResolveAlert = (id: string, title: string) => {
    AlertService.resolve(id);
    refreshData();
    showToast('Alerta resolvido', `O alerta "${title}" foi marcado como resolvido.`, 'success');
  };

  return (
    <div className="space-y-5">
      {/* Top Banner Notice */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-lime-900 via-lime-800 to-[#365314] text-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-lime-500/20 border border-lime-400/30 flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5 text-lime-300" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold tracking-tight">
              Safra 2026/2027 — Planalto Central e Norte de Angola
            </h2>
            <p className="text-[11px] sm:text-xs text-lime-200/90 mt-0.5">
              Monitorização ativa para 3 regiões agrícolas (Huambo, Huíla, Malanje) com imagens Sentinel-2.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-center">
          <DemoBadge />
          <button
            onClick={() => setHelpOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors flex items-center gap-1.5"
            title="Abrir glossário de índices e manual de utilização"
          >
            <HelpCircle className="w-3.5 h-3.5 text-lime-300" />
            <span>Guia & Dicionário</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Plots Monitored */}
        <div
          onClick={() => navigate('/map')}
          className="p-4 rounded-xl bg-white border border-[#E5E7EB] hover:border-lime-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Parcelas Georreferenciadas
              </span>
              <HelpTooltip
                title="Parcelas Agrícolas Georreferenciadas"
                content="Polígonos vetoriais delimitados por GPS e satélite para as culturas ativas de milho, soja, feijão, trigo, batata e mandioca."
              />
            </div>
            <div className="w-8 h-8 rounded-lg bg-lime-50 text-[#65A30D] flex items-center justify-center group-hover:bg-[#65A30D] group-hover:text-white transition-colors">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{totalPlots}</span>
            <span className="text-[11px] font-semibold text-[#65A30D] flex items-center">
              <ArrowUpRight className="w-3 h-3" /> 100% monitorizadas
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Huambo, Huíla e Malanje</p>
        </div>

        {/* Total Area */}
        <div
          onClick={() => navigate('/map')}
          className="p-4 rounded-xl bg-white border border-[#E5E7EB] hover:border-lime-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Área Total Monitorizada
              </span>
              <HelpTooltip
                title="Área Monitorizada"
                content="Área agregada com varredura radiométrica semanal, estimativa de biomassa e cálculo de balanço hídrico."
              />
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <LandPlot className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">
              {formatHectares(totalHectares)}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">11 talhões em regime intensivo</p>
        </div>

        {/* Crops Health Index */}
        <div
          onClick={() => navigate('/monitoring')}
          className="p-4 rounded-xl bg-white border border-[#E5E7EB] hover:border-lime-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Índice de Saúde (NDVI)
              </span>
              <HelpTooltip
                title="Índice NDVI (Normalized Difference Vegetation Index)"
                content="Média ponderada do vigor vegetativo (0.0 a 1.0). Acima de 0.60 representa copas fechadas, fotossíntese vigorosa e bom fornecimento hídrico."
              />
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{avgHealth}%</span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Vigor Bom
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">NDVI médio ponderado de 0.78</p>
        </div>

        {/* Active Alerts */}
        <div
          onClick={() => navigate('/notifications')}
          className="p-4 rounded-xl bg-white border border-[#E5E7EB] hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Alertas Prioritários
              </span>
              <HelpTooltip
                title="Alertas Fitossanitários e Hídricos"
                content="Notificações ativas geradas pelos algoritmos de detecção de anomalias por satélite e modelos de déficit hídrico no solo."
              />
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600">
              {activeAlerts.length}
            </span>
            <span className="text-[11px] font-medium text-gray-600">requerem atenção</span>
          </div>
          <p className="text-[11px] text-rose-500 font-medium mt-1">
            1 crítico (Malanje) • 1 alto (Huambo)
          </p>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Vegetative Evolution NDVI Chart */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#65A30D]" />
                  Evolução do Vigor Vegetativo (NDVI Satélite)
                </h3>
                <HelpTooltip
                  title="Curva Multitemporal NDVI"
                  content="Acompanhamento mensal da reflectância na banda do infravermelho próximo (NIR) comparado ao vermelho (Red) via Sentinel-2 (Copernicus)."
                />
              </div>
              <p className="text-[11px] text-gray-500">Média multiespectral mensal das operações regionais</p>
            </div>
            <button
              onClick={() => navigate('/satellite')}
              className="text-xs font-semibold text-[#65A30D] hover:underline flex items-center gap-1 shrink-0"
            >
              Satélite <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-48 sm:h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ndviTrendData}>
                <defs>
                  <linearGradient id="colorHuambo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#65A30D" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#65A30D" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorHuila" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} domain={[0.3, 1.0]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`${Number(val).toFixed(2)} (NDVI)`, '']}
                />
                <Area
                  type="monotone"
                  dataKey="huambo"
                  name="Vale do Cavaco (Huambo)"
                  stroke="#65A30D"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorHuambo)"
                />
                <Area
                  type="monotone"
                  dataKey="huila"
                  name="Agrícola Lubango (Huíla)"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorHuila)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-5 mt-2 text-[11px] text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#65A30D]"></span> Vale do Cavaco (Milho/Soja)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9]"></span> Lubango (Batata/Trigo)
            </span>
          </div>
        </div>

        {/* Rainfall & Climate Chart */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-blue-600" />
                  Regime Pluviométrico (Precipitação em mm)
                </h3>
                <HelpTooltip
                  title="Pluviometria Acumulada"
                  content="Compara a precipitação real medida em estações meteorológicas locais com a série histórica climatológica normal de 10 anos."
                />
              </div>
              <p className="text-[11px] text-gray-500">
                Precipitação registada vs média histórica dos últimos 10 anos
              </p>
            </div>
            <button
              onClick={() => navigate('/weather')}
              className="text-xs font-semibold text-[#65A30D] hover:underline flex items-center gap-1 shrink-0"
            >
              Clima <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-48 sm:h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rainfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} unit="mm" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`${val} mm`, '']}
                />
                <Bar
                  dataKey="real"
                  name="Precipitação 2026"
                  fill="#3b82f6"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="historico"
                  name="Média Histórica"
                  fill="#cbd5e1"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-5 mt-2 text-[11px] text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-blue-500"></span> Precipitação Real 2026
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-300"></span> Média Histórica Climatológica
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Priority Alerts & Demonstrative AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Alerts (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Alertas Fitossanitários e Hídricos</h3>
                <p className="text-xs text-gray-500">Intervenções de manejo prioritárias</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/notifications')}
              className="text-xs font-semibold text-[#65A30D] hover:underline"
            >
              Ver todos ({activeAlerts.length})
            </button>
          </div>

          <div className="space-y-3">
            {activeAlerts.slice(0, 3).map((alert) => {
              const severityStyles = {
                Crítica: 'bg-rose-50 border-rose-200 text-rose-900',
                Alta: 'bg-orange-50 border-orange-200 text-orange-900',
                Média: 'bg-amber-50 border-amber-200 text-amber-900',
                Baixa: 'bg-blue-50 border-blue-200 text-blue-900',
              };

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border ${severityStyles[alert.severity]} transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/80 border border-current shadow-2xs">
                        {alert.severity}
                      </span>
                      <span className="text-xs font-bold text-gray-900">{alert.title}</span>
                      <span className="text-xs text-gray-500">
                        • {alert.farmName} ({alert.plotName})
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 mt-1 leading-relaxed">{alert.message}</p>
                    <div className="mt-2 text-xs font-medium text-gray-900 flex items-center gap-1.5">
                      <span className="text-emerald-700 font-semibold">Ação recomendada:</span>{' '}
                      {alert.recommendedAction}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleResolveAlert(alert.id, alert.title)}
                      className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg shadow-2xs transition-colors"
                    >
                      Resolver
                    </button>
                    <button
                      onClick={() => navigate('/monitoring')}
                      className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg shadow-2xs transition-colors"
                    >
                      Ver Monitorização
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Recommendations Demonstrative Box (1 col) */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-lime-50/70 to-emerald-50/50 border border-lime-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#65A30D] text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#365314]">Recomendações Agronómicas IA</h3>
                  <p className="text-[11px] text-gray-500">Baseadas em fenologia e previsão climática</p>
                </div>
              </div>
              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-lime-200 text-lime-900">
                Simulado
              </span>
            </div>

            <div className="space-y-3 mt-4">
              <div className="p-3 bg-white/90 rounded-xl border border-lime-100 shadow-2xs text-xs">
                <p className="font-semibold text-gray-900 flex items-center gap-1.5 text-[#365314]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#65A30D]" />
                  Janela Ideal de Pulverização
                </p>
                <p className="text-gray-600 mt-1 leading-relaxed">
                  Sexta-feira (30/10) em Caála terá ventos &lt; 8 km/h e humidade favorável para
                  absorção sem deriva.
                </p>
              </div>

              <div className="p-3 bg-white/90 rounded-xl border border-lime-100 shadow-2xs text-xs">
                <p className="font-semibold text-gray-900 flex items-center gap-1.5 text-[#365314]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#65A30D]" />
                  Ajuste de Pivô na Soja
                </p>
                <p className="text-gray-600 mt-1 leading-relaxed">
                  Com 12 mm de chuva previstos amanhã, reduza o tempo de rotação do Pivô 2 para poupar
                  1.400 m³ de água.
                </p>
              </div>

              <div className="p-3 bg-white/90 rounded-xl border border-lime-100 shadow-2xs text-xs">
                <p className="font-semibold text-gray-900 flex items-center gap-1.5 text-[#365314]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#65A30D]" />
                  Drenagem Preventiva em Malanje
                </p>
                <p className="text-gray-600 mt-1 leading-relaxed">
                  Solo ferralítico argiloso com saturação próxima de 100%. Abra valas de alívio no Milho.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-lime-200/60">
            <button
              onClick={() => navigate('/ai-assistant')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#65A30D] hover:bg-[#558b0a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <span>Consultar Assistente Agrícola</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Recomendações demonstrativas geradas para apoio ao agricultor.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activities & Farms Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-lime-50 text-[#65A30D] flex items-center justify-center font-bold">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Atividades Agrícolas Recentes</h3>
                <p className="text-xs text-gray-500">Manejo de campo agendado e concluído</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/calendar')}
              className="text-xs font-semibold text-[#65A30D] hover:underline"
            >
              Ver calendário completo &rarr;
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {activities.slice(0, 4).map((activity) => {
              const isCompleted = activity.status === 'Concluída';

              const categoryColors = {
                Plantação: 'bg-emerald-100 text-emerald-800',
                Irrigação: 'bg-blue-100 text-blue-800',
                Fertilização: 'bg-purple-100 text-purple-800',
                Tratamento: 'bg-amber-100 text-amber-800',
                Colheita: 'bg-orange-100 text-orange-800',
                Outro: 'bg-gray-100 text-gray-800',
              };

              return (
                <div
                  key={activity.id}
                  className="py-3 flex items-center justify-between gap-3 group hover:bg-gray-50/60 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => handleToggleActivity(activity.id, activity.title)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        isCompleted
                          ? 'bg-[#65A30D] border-[#65A30D] text-white'
                          : 'border-gray-300 hover:border-[#65A30D]'
                      }`}
                      title={isCompleted ? 'Marcar como pendente' : 'Marcar como concluída'}
                    >
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold text-gray-900 truncate ${
                          isCompleted ? 'line-through text-gray-400' : ''
                        }`}
                      >
                        {activity.title}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {activity.farmName} • {activity.plotName || 'Geral'} • Prazo:{' '}
                        {activity.dueDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${categoryColors[activity.category]}`}
                    >
                      {activity.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        activity.status === 'Concluída'
                          ? 'bg-emerald-50 text-emerald-700'
                          : activity.status === 'Em Progresso'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Regional Agricultural Hubs Overview (1 col) */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Polos Agrícolas Monitorizados</h3>
              <p className="text-[11px] text-gray-500">Angola — Huambo, Huíla e Malanje</p>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="text-xs font-semibold text-[#65A30D] hover:underline flex items-center gap-1"
            >
              <span>Mapa</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {farms.map((farm) => (
              <div
                key={farm.id}
                className="p-3 rounded-xl border border-gray-100 hover:border-lime-200 hover:bg-lime-50/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">{farm.name}</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      farm.status === 'Ativa'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {farm.plots.length} talhões
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-1">
                  <MapPin className="w-3 h-3 text-[#65A30D]" />
                  <span>
                    {farm.province} ({farm.municipality}) • {farm.areaHectares} ha
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">Vigor Médio:</span>
                  <span className="font-bold text-[#365314]">{farm.healthScore}%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-[#65A30D] h-full rounded-full transition-all"
                    style={{ width: `${farm.healthScore}%` }}
                  ></div>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => navigate('/map')}
                    className="text-[#65A30D] font-semibold hover:underline"
                  >
                    Ver no Mapa
                  </button>
                  <button
                    onClick={() => navigate('/weather')}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    Clima Local &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
