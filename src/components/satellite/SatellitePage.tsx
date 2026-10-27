import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SatelliteService } from '../../lib/services/satelliteService';
import { DemoBadge } from '../ui/DemoBadge';
import { HelpTooltip } from '../ui/HelpTooltip';
import { SatelliteObservation } from '../../types';
import {
  Satellite,
  Layers,
  Calendar,
  Cloud,
  TrendingUp,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Info,
  Maximize2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export function SatellitePage() {
  const { farms } = useApp();
  const [selectedFarmId, setSelectedFarmId] = useState<string>('Todas');
  const [selectedObsId, setSelectedObsId] = useState<string>('sat-1');

  const allObservations = SatelliteService.getAll();

  const filteredObservations = useMemo(() => {
    if (selectedFarmId === 'Todas') return allObservations;
    return allObservations.filter((o) => o.farmId === selectedFarmId);
  }, [allObservations, selectedFarmId]);

  const activeObs =
    allObservations.find((o) => o.id === selectedObsId) || filteredObservations[0] || allObservations[0];

  // 6-Month historical NDVI evolution for the selected plot
  const ndviHistoryData = [
    { date: '28 Mai', ndvi: 0.42 },
    { date: '15 Jun', ndvi: 0.45 },
    { date: '02 Jul', ndvi: 0.40 },
    { date: '20 Jul', ndvi: 0.48 },
    { date: '12 Ago', ndvi: 0.62 },
    { date: '05 Set', ndvi: 0.74 },
    { date: '22 Set', ndvi: 0.78 },
    { date: '10 Out', ndvi: 0.81 },
    { date: '24 Out', ndvi: activeObs ? activeObs.ndviAverage : 0.82 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Satellite className="w-5 h-5 text-[#65A30D]" />
            Observação e Índices Espectrais de Satélite
          </h2>
          <p className="text-xs text-gray-500">
            Passagens orbitais do Sentinel-2 (Copernicus) e Landsat 9 (USGS) com resolução de 10m
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#F8FAF5] border border-gray-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-gray-400 font-medium">Filtrar Exploração:</span>
            <select
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="bg-transparent text-gray-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Todas">Todas as Explorações</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <DemoBadge />
        </div>
      </div>

      {/* Main Grid: Spectral Viewer (Left) & Observations List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Satellite Scene Visualizer (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
            {/* Visualizer Header */}
            <div className="p-4 bg-gradient-to-r from-lime-900 to-[#365314] text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-400 text-lime-950 uppercase">
                    {activeObs.satelliteName}
                  </span>
                  <span className="text-xs text-lime-200">
                    Aquisição a {activeObs.acquisitionDate}
                  </span>
                </div>
                <h3 className="text-base font-bold mt-1">
                  {activeObs.plotName} • {activeObs.farmName}
                </h3>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[10px] text-lime-200 block font-semibold uppercase">
                    NDVI Médio
                  </span>
                  <HelpTooltip
                    title="NDVI Médio da Passagem"
                    content="Média aritmética de reflectância (NIR - RED) / (NIR + RED) dos pixels sem nuvens no talhão."
                  />
                </div>
                <span className="text-xl sm:text-2xl font-black text-lime-300">
                  {activeObs.ndviAverage.toFixed(2)}
                </span>
              </div>
            </div>

            {/* False Color Heatmap Canvas Simulator */}
            <div className="p-4 sm:p-5">
              <div className="relative h-48 sm:h-56 w-full rounded-xl overflow-hidden border border-gray-200 bg-slate-900 flex items-center justify-center shadow-inner">
                {/* Simulated multi-spectral NDVI grid pattern */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-85 gap-0.5 p-1">
                  {Array.from({ length: 48 }).map((_, i) => {
                    // Generate subtle variations around activeObs.ndviAverage
                    const val = Math.min(
                      0.95,
                      Math.max(
                        0.3,
                        activeObs.ndviAverage + (Math.sin(i * 1.5) * 0.12 - 0.04)
                      )
                    );
                    const color =
                      val > 0.75
                        ? '#15803d'
                        : val > 0.65
                        ? '#65a30d'
                        : val > 0.5
                        ? '#ca8a04'
                        : '#dc2626';

                    return (
                      <div
                        key={i}
                        className="rounded-xs transition-all hover:scale-110 hover:z-10 cursor-pointer flex items-center justify-center text-[9px] text-white/70 font-mono"
                        style={{ backgroundColor: color }}
                        title={`Pixel ${i + 1}: NDVI ${val.toFixed(2)}`}
                      >
                        {val.toFixed(2)}
                      </div>
                    );
                  })}
                </div>

                <div className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-white flex items-center gap-2">
                  <span>Satélite: {activeObs.satelliteName}</span>
                  <span>Resolução: {activeObs.resolutionMeters}m</span>
                  <span>Nuvens: {activeObs.cloudCoveragePercent}%</span>
                </div>
              </div>

              {/* NDVI Color Scale Legend */}
              <div className="mt-3.5 pt-2.5 border-t border-gray-100">
                <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                  <span>Stress Vegetativo / Solo Nu (0.0 - 0.4)</span>
                  <span>Vigor Moderado (0.5 - 0.7)</span>
                  <span>Vigor Elevado / Biomassa Ativa (0.75 - 1.0)</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-red-600 via-yellow-500 via-lime-500 to-emerald-800 shadow-2xs"></div>
              </div>

              {/* Spectral Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-gray-100 text-xs">
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-[10px] font-bold uppercase block">
                      NDVI Mínimo
                    </span>
                    <HelpTooltip title="NDVI Mínimo" content="Pixel de menor biomassa ativa no perímetro analisado." />
                  </div>
                  <span className="text-sm font-extrabold text-gray-900 mt-0.5 block">
                    {activeObs.ndviMin.toFixed(2)}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-[10px] font-bold uppercase block">
                      NDVI Máximo
                    </span>
                    <HelpTooltip title="NDVI Máximo" content="Pixel de maior vigor e densidade foliar." />
                  </div>
                  <span className="text-sm font-extrabold text-[#65A30D] mt-0.5 block">
                    {activeObs.ndviMax.toFixed(2)}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-[10px] font-bold uppercase block">
                      Índice EVI
                    </span>
                    <HelpTooltip title="EVI (Enhanced Vegetation Index)" content="Ajusta o sinal espectral em áreas de alta cobertura vegetal reduzindo interferências atmosféricas." />
                  </div>
                  <span className="text-sm font-extrabold text-blue-700 mt-0.5 block">
                    {activeObs.eviAverage.toFixed(2)}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-[10px] font-bold uppercase block">
                      Clorofila
                    </span>
                    <HelpTooltip title="Teor de Clorofila Foliar" content="Estimativa em mg/m² baseada na banda RedEdge do sensor multiespectral Sentinel-2 MSI." />
                  </div>
                  <span className="text-sm font-extrabold text-emerald-800 mt-0.5 block">
                    {activeObs.chlorophyllIndex.toFixed(1)} mg/m²
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Evolution Chart */}
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#65A30D]" />
                    Curva Temporal de Vigor Vegetativo (NDVI) — Últimos 6 Meses
                  </h3>
                  <HelpTooltip
                    title="Curva Fenológica Multitemporal"
                    content="Acompanhamento do desenvolvimento da cultura desde o plantio até a maturação fisiológica."
                  />
                </div>
                <p className="text-[11px] text-gray-500">
                  Evolução fenológica da cultura na {activeObs.plotName}
                </p>
              </div>
            </div>

            <div className="h-48 sm:h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ndviHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} domain={[0.2, 1.0]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${Number(val).toFixed(2)} NDVI`, '']}
                  />
                  <Line
                    type="monotone"
                    dataKey="ndvi"
                    name="Índice NDVI"
                    stroke="#65A30D"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#365314' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Satellite Observations List (1 col) */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Histórico de Passagens</h3>
              <p className="text-xs text-gray-500">{filteredObservations.length} cenas captadas</p>
            </div>
            <span className="p-1.5 rounded-lg bg-gray-100 text-gray-600">
              <Satellite className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-2 max-h-[750px] overflow-y-auto">
            {filteredObservations.map((obs) => {
              const isSelected = activeObs.id === obs.id;
              return (
                <div
                  key={obs.id}
                  onClick={() => setSelectedObsId(obs.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#65A30D] bg-lime-50/70 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-gray-900">{obs.plotName}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-gray-100 text-gray-700">
                          {obs.satelliteName}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">{obs.farmName}</p>
                    </div>

                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-extrabold text-xs shrink-0"
                      style={{ backgroundColor: obs.previewColor }}
                    >
                      {obs.ndviAverage.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2 pt-2 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {obs.acquisitionDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Cloud className="w-3 h-3 text-gray-400" />
                      {obs.cloudCoveragePercent}% nuvens
                    </span>
                    <span className="font-semibold text-[#365314]">
                      {obs.vegetationHealthStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
