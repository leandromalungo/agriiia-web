import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useRouter } from '../../context/RouterContext';
import { DemoBadge } from '../ui/DemoBadge';
import { WeatherService } from '../../lib/services/weatherService';
import { SatelliteService } from '../../lib/services/satelliteService';
import {
  Activity,
  Sprout,
  Droplets,
  Thermometer,
  CloudRain,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export function MonitoringPage() {
  const { farms, alerts } = useApp();
  const { navigate } = useRouter();

  const [selectedFarmId, setSelectedFarmId] = useState<string>('farm-1');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const currentFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];
  const weather = WeatherService.getByFarmId(selectedFarmId);
  const observations = SatelliteService.getByFarmId(selectedFarmId);
  const farmAlerts = alerts.filter((a) => a.farmId === selectedFarmId && a.status === 'Ativo');

  // Multi-depth soil moisture data (10cm, 30cm, 60cm)
  const soilMoistureTimeline = [
    { date: '15 Out', top10cm: 42, mid30cm: 48, deep60cm: 52 },
    { date: '18 Out', top10cm: 38, mid30cm: 46, deep60cm: 51 },
    { date: '21 Out', top10cm: 34, mid30cm: 44, deep60cm: 50 },
    { date: '24 Out', top10cm: 48, mid30cm: 49, deep60cm: 53 }, // after rain
    { date: '26 Out', top10cm: 44, mid30cm: 47, deep60cm: 52 },
    { date: '27 Out', top10cm: 41, mid30cm: 45, deep60cm: 51 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar with Farm and Period Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#65A30D]" />
            Monitorização de Culturas & Solo
          </h2>
          <p className="text-xs text-gray-500">
            Acompanhamento contínuo de vigor, humidade volumétrica e estresse hídrico
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Farm selector */}
          <div className="flex items-center gap-1.5 bg-[#F8FAF5] border border-gray-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-gray-400 font-medium">Exploração:</span>
            <select
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="bg-transparent text-gray-800 font-semibold focus:outline-none cursor-pointer"
            >
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name} ({farm.province})
                </option>
              ))}
            </select>
          </div>

          {/* Period selector */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSelectedPeriod('7d')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedPeriod === '7d' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              7 Dias
            </button>
            <button
              onClick={() => setSelectedPeriod('30d')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedPeriod === '30d' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              30 Dias
            </button>
            <button
              onClick={() => setSelectedPeriod('90d')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedPeriod === '90d' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Safra
            </button>
          </div>

          <DemoBadge />
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vegetative Health Score */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Saúde Vegetativa Média</span>
            <div className="w-8 h-8 rounded-xl bg-lime-50 text-[#65A30D] flex items-center justify-center font-bold">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">{currentFarm.healthScore}%</span>
            <span className="text-xs font-semibold text-emerald-600">NDVI 0.78</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Calibrado via Sentinel-2</p>
        </div>

        {/* Soil Moisture */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Humidade Média Solo</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-900">43.8%</span>
            <span className="text-xs font-medium text-gray-500">Capacidade Campo: 45%</span>
          </div>
          <p className="text-xs text-blue-600 font-medium mt-1">Zona de conforto hídrico</p>
        </div>

        {/* Soil Temperature */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Temperatura Média Solo</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">24.2°C</span>
            <span className="text-xs text-gray-400">Ambiente: {weather.current.temp}°C</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Ideal para atividade radicular</p>
        </div>

        {/* Active Alerts on this farm */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Alertas Ativos</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">{farmAlerts.length}</span>
            <span className="text-xs text-gray-500">requerem ação de campo</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {farmAlerts[0] ? farmAlerts[0].title.slice(0, 30) + '...' : 'Sem alertas graves'}
          </p>
        </div>
      </div>

      {/* Soil Moisture Depths Chart */}
      <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              Humidade do Solo por Camadas de Profundidade (%)
            </h3>
            <p className="text-xs text-gray-500">
              Sensores capacitivos simulados a 10 cm (camada superficial), 30 cm e 60 cm (camada profunda)
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
            {currentFarm.name}
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={soilMoistureTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} domain={[20, 70]} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  fontSize: '12px',
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="top10cm"
                name="10 cm (Superficial)"
                stroke="#38bdf8"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="mid30cm"
                name="30 cm (Zona Radicular Principal)"
                stroke="#0284c7"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="deep60cm"
                name="60 cm (Reserva Subsuperficial)"
                stroke="#1e3a8a"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Parcel Health Matrix Table */}
      <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Estado Individual das Parcelas</h3>
            <p className="text-xs text-gray-500">
              Cruzamento de dados de solo, satélite e fenologia para a exploração {currentFarm.name}
            </p>
          </div>
          <button
            onClick={() => navigate(`/farms/${currentFarm.id}`)}
            className="text-xs font-bold text-[#65A30D] hover:underline flex items-center gap-1"
          >
            Ver Ficha Completa <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
              <tr>
                <th className="px-4 py-3">Parcela</th>
                <th className="px-4 py-3">Cultura</th>
                <th className="px-4 py-3">Área (ha)</th>
                <th className="px-4 py-3">Índice NDVI</th>
                <th className="px-4 py-3">Humidade Solo</th>
                <th className="px-4 py-3">Temp. Solo</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentFarm.plots.map((plot) => {
                const statusStyles = {
                  Excelente: 'bg-emerald-100 text-emerald-800',
                  Bom: 'bg-lime-100 text-[#365314]',
                  Alerta: 'bg-amber-100 text-amber-800',
                  Crítico: 'bg-rose-100 text-rose-800',
                };

                return (
                  <tr key={plot.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-gray-900">{plot.name}</td>
                    <td className="px-4 py-3.5 font-medium">{plot.crop}</td>
                    <td className="px-4 py-3.5 font-semibold text-gray-900">{plot.areaHectares} ha</td>
                    <td className="px-4 py-3.5 font-bold text-[#365314]">{plot.ndviScore}</td>
                    <td className="px-4 py-3.5 font-semibold text-blue-700">{plot.soilMoisture}%</td>
                    <td className="px-4 py-3.5 text-gray-600">{plot.soilTemp}°C</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          statusStyles[plot.status as keyof typeof statusStyles] || 'bg-gray-100'
                        }`}
                      >
                        {plot.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => navigate('/satellite')}
                        className="text-xs font-semibold text-[#65A30D] hover:underline"
                      >
                        Ver Satélite
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
