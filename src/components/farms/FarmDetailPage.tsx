import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useApp } from '../../context/AppContext';
import { FarmService } from '../../lib/services/farmService';
import { WeatherService } from '../../lib/services/weatherService';
import { SatelliteService } from '../../lib/services/satelliteService';
import { DemoBadge } from '../ui/DemoBadge';
import { formatHectares, formatDate } from '../../lib/utils';
import {
  ArrowLeft,
  MapPin,
  Sprout,
  Layers,
  CloudSun,
  Satellite,
  Calendar,
  AlertTriangle,
  Sparkles,
  Phone,
  Mail,
  User,
  Activity,
  Plus,
  Compass,
  CheckCircle2,
  Droplets,
  Thermometer,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function FarmDetailPage() {
  const { params, navigate } = useRouter();
  const { refreshData, showToast } = useApp();
  const farmId = params.farmId || 'farm-1';

  const farm = FarmService.getById(farmId);
  const weather = WeatherService.getByFarmId(farmId);
  const satelliteObs = SatelliteService.getByFarmId(farmId);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'plots' | 'weather' | 'satellite' | 'activities' | 'alerts'
  >('overview');

  if (!farm) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
        <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-gray-900">Exploração não encontrada</h3>
        <p className="text-xs text-gray-500 mt-1">
          A exploração com o identificador &quot;{farmId}&quot; não existe no registo local.
        </p>
        <button
          onClick={() => navigate('/farms')}
          className="mt-4 px-4 py-2 bg-[#65A30D] text-white text-xs font-semibold rounded-xl"
        >
          Voltar às Explorações
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Layers },
    { id: 'plots', label: `Parcelas Agrícolas (${farm.plots.length})`, icon: Sprout },
    { id: 'weather', label: 'Clima & Indicadores', icon: CloudSun },
    { id: 'satellite', label: `Satélite NDVI (${satelliteObs.length})`, icon: Satellite },
    { id: 'alerts', label: 'Alertas & Recomendações', icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      {/* Top Navigation & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate('/farms')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar à lista de explorações</span>
        </button>
        <DemoBadge />
      </div>

      {/* Main Farm Hero Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-lime-900 via-lime-800 to-[#365314] text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-lime-400 text-lime-950 uppercase">
                  {farm.province}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/20 text-white backdrop-blur-xs">
                  {farm.status}
                </span>
                <span className="text-xs text-lime-200">Criada a {formatDate(farm.createdAt)}</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">{farm.name}</h1>
              <p className="text-xs text-lime-200/90 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-lime-400" />
                {farm.municipality} • {farm.location}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 self-stretch md:self-auto justify-around">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-lime-200 block">Área Total</span>
                <span className="text-lg font-black">{formatHectares(farm.areaHectares)}</span>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-lime-200 block">Parcelas</span>
                <span className="text-lg font-black">{farm.plots.length}</span>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-lime-200 block">Saúde NDVI</span>
                <span className="text-lg font-black text-lime-300">{farm.healthScore}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 px-6 bg-gray-50/60 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-semibold text-xs transition-all whitespace-nowrap ${
                  active
                    ? 'border-[#65A30D] text-[#365314] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#65A30D]' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* General Info */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Descrição da Exploração
                    </h3>
                    <p className="text-xs text-gray-700 leading-relaxed bg-[#F8FAF5] p-4 rounded-xl border border-gray-100">
                      {farm.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl border border-gray-200/80 bg-white">
                      <span className="text-gray-400 text-[11px] block font-semibold mb-1">
                        Solo & Caracterização
                      </span>
                      <p className="font-bold text-gray-900">{farm.soilType}</p>
                      <p className="text-gray-500 text-[11px] mt-1">
                        Adequado para culturas de sequeiro e rotação com leguminosas.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-gray-200/80 bg-white">
                      <span className="text-gray-400 text-[11px] block font-semibold mb-1">
                        Sistema de Irrigação
                      </span>
                      <p className="font-bold text-gray-900">{farm.irrigationSystem}</p>
                      <p className="text-gray-500 text-[11px] mt-1">
                        Captação perene e monitorização de caudal.
                      </p>
                    </div>
                  </div>

                  {/* Culturas */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                      Culturas em Produção
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {farm.cropTypes.map((c, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-lime-50 text-[#365314] border border-lime-200 text-xs font-bold"
                        >
                          <Sprout className="w-3.5 h-3.5 text-[#65A30D]" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Contact & Geospatial */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-gray-200 bg-[#F8FAF5] space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Responsável Técnico
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                      <User className="w-4 h-4 text-[#65A30D]" />
                      <span>{farm.managerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{farm.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{farm.contactPhone}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#65A30D]" />
                      Coordenadas no Terreno
                    </h3>
                    <div className="text-xs text-gray-700 font-mono bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                      <p>Lat: {farm.coordinates.lat}</p>
                      <p>Lng: {farm.coordinates.lng}</p>
                    </div>
                    <button
                      onClick={() => navigate('/map')}
                      className="w-full mt-2 py-2 text-xs font-bold text-[#365314] bg-lime-50 hover:bg-lime-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Abrir no Mapa Interativo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PLOTS */}
          {activeTab === 'plots' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Parcelas Agrícolas Mapeadas</h3>
                  <p className="text-xs text-gray-500">
                    Subdivisão territorial com monitorização individualizada de solo e vigor
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {farm.plots.map((plot) => {
                  const statusBadgeColors = {
                    Excelente: 'bg-emerald-100 text-emerald-800',
                    Bom: 'bg-lime-100 text-[#365314]',
                    Alerta: 'bg-amber-100 text-amber-800',
                    Crítico: 'bg-rose-100 text-rose-800',
                  };

                  return (
                    <div
                      key={plot.id}
                      className="p-5 rounded-2xl border border-gray-200 bg-white hover:border-lime-300 transition-all shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">{plot.name}</span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                statusBadgeColors[plot.status as keyof typeof statusBadgeColors] ||
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {plot.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Cultura: <strong>{plot.crop}</strong> ({plot.variety})
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700">
                          {plot.areaHectares} ha
                        </span>
                      </div>

                      {/* Agronomic indicators */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
                        <div className="p-2 rounded-lg bg-gray-50">
                          <span className="text-[10px] text-gray-400 block font-medium">NDVI Satélite</span>
                          <span className="text-xs font-bold text-[#365314]">{plot.ndviScore}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-gray-50">
                          <span className="text-[10px] text-gray-400 block font-medium">Humidade Solo</span>
                          <span className="text-xs font-bold text-blue-700">{plot.soilMoisture}%</span>
                        </div>
                        <div className="p-2 rounded-lg bg-gray-50">
                          <span className="text-[10px] text-gray-400 block font-medium">Temp. Solo</span>
                          <span className="text-xs font-bold text-gray-800">{plot.soilTemp}°C</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                        <span>Plantio: {plot.plantingDate}</span>
                        <span>Previsão Colheita: {plot.expectedHarvestDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: WEATHER & CLIMATE */}
          {activeTab === 'weather' && (
            <div className="space-y-6">
              {/* Current Weather Highlight */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-lime-50 border border-lime-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#65A30D] text-white flex items-center justify-center font-bold">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 font-semibold block">Temperatura Atual</span>
                    <span className="text-xl font-extrabold text-gray-900">{weather.current.temp}°C</span>
                    <span className="text-[10px] text-gray-400 block">Sensação: {weather.current.feelsLike}°C</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 font-semibold block">Humidade do Ar</span>
                    <span className="text-xl font-extrabold text-blue-900">{weather.current.humidity}%</span>
                    <span className="text-[10px] text-gray-400 block">Orvalho favorável</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                    <CloudSun className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 font-semibold block">Precipitação Prevista</span>
                    <span className="text-xl font-extrabold text-amber-900">{weather.current.precipitationMm} mm</span>
                    <span className="text-[10px] text-gray-400 block">Chance: {weather.current.precipitationChance}%</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 font-semibold block">Evapotranspiração (ETo)</span>
                    <span className="text-xl font-extrabold text-purple-900">
                      {weather.current.evapotranspirationMm} mm/dia
                    </span>
                    <span className="text-[10px] text-gray-400 block">Pressão: {weather.current.pressureHpa} hPa</span>
                  </div>
                </div>
              </div>

              {/* 7 Day Forecast Cards */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Previsão Agroclimática para 7 Dias
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {weather.forecast.map((day, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-gray-200 text-center hover:border-lime-300 transition-colors"
                    >
                      <p className="text-xs font-bold text-gray-800">{day.dayOfWeek}</p>
                      <p className="text-[10px] text-gray-400">{day.date.slice(5)}</p>
                      <div className="my-2">
                        <span className="text-sm font-extrabold text-gray-900">{day.tempMax}°</span>
                        <span className="text-xs text-gray-400 ml-1">{day.tempMin}°</span>
                      </div>
                      <p className="text-[10px] font-medium text-blue-600">{day.precipitationMm} mm</p>
                      <span className="inline-block mt-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-lime-50 text-[#365314]">
                        Aptidão {day.suitabilityScore}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SATELLITE & NDVI */}
          {activeTab === 'satellite' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Passagens de Satélite (Sentinel-2 & Landsat 9)
                </h3>
                <p className="text-xs text-gray-500">
                  Monitorização multiespectral orbital calibrada para deteção precoce de stress vegetal
                </p>
              </div>

              <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden bg-white">
                {satelliteObs.map((obs) => (
                  <div key={obs.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs"
                        style={{ backgroundColor: obs.previewColor }}
                      >
                        {obs.ndviAverage.toFixed(2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">{obs.plotName}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                            {obs.satelliteName}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Aquisição: <strong>{obs.acquisitionDate}</strong> • Cobertura de Nuvens:{' '}
                          {obs.cloudCoveragePercent}% • Resolução: {obs.resolutionMeters}m
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center text-xs">
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block font-medium">Estado Vegetativo</span>
                        <span className="font-bold text-[#365314]">{obs.vegetationHealthStatus}</span>
                      </div>
                      <button
                        onClick={() => navigate('/satellite')}
                        className="px-3 py-1.5 bg-lime-50 text-[#365314] font-semibold rounded-lg hover:bg-lime-100 transition-colors text-xs"
                      >
                        Visualizar Espectro
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ALERTS & RECOMMENDATIONS */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Recomendações e Diretrizes Agronómicas</h3>
                <p className="text-xs text-gray-500">
                  Cruzamento de dados meteorológicos e estado fenológico das culturas
                </p>
              </div>

              <div className="space-y-3">
                {weather.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-lime-50/60 border border-lime-200/80 flex items-start gap-3"
                  >
                    <Sparkles className="w-4 h-4 text-[#65A30D] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-800 leading-relaxed">{rec}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
