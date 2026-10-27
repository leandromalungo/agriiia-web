import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WeatherService } from '../../lib/services/weatherService';
import { DemoBadge } from '../ui/DemoBadge';
import {
  CloudSun,
  CloudRain,
  Sun,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  Gauge,
  Sparkles,
  CheckCircle2,
  Calendar,
  Compass,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export function WeatherPage() {
  const { farms } = useApp();
  const [selectedFarmId, setSelectedFarmId] = useState<string>('farm-1');

  const selectedFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];
  const weather = WeatherService.getByFarmId(selectedFarmId);

  return (
    <div className="space-y-6">
      {/* Top Header & Farm Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-[#65A30D]" />
            Boletim Meteorológico & Balanço Hídrico
          </h2>
          <p className="text-xs text-gray-500">
            Previsões agrícolas detalhadas para planeamento de sementeira, rega e pulverizações
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#F8FAF5] border border-gray-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-gray-400 font-medium">Exploração:</span>
            <select
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="bg-transparent text-gray-800 font-semibold focus:outline-none cursor-pointer"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.province})
                </option>
              ))}
            </select>
          </div>
          <DemoBadge />
        </div>
      </div>

      {/* Hero Weather Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-lime-900 via-lime-800 to-[#365314] text-white shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-lime-400 text-lime-950 uppercase">
                {selectedFarm.province} • {selectedFarm.municipality}
              </span>
              <span className="text-xs text-lime-200">Tempo Real Simulado</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-black">{weather.current.temp}°C</span>
              <div className="text-xs text-lime-200">
                <p className="font-semibold text-white text-sm">{weather.current.condition}</p>
                <p>Sensação térmica de {weather.current.feelsLike}°C</p>
              </div>
            </div>
          </div>

          {/* Grid of Weather Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs w-full md:w-auto">
            <div>
              <span className="text-lime-200 text-[10px] uppercase font-bold flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-lime-400" /> Humidade
              </span>
              <span className="text-base font-extrabold text-white mt-0.5 block">
                {weather.current.humidity}%
              </span>
            </div>

            <div>
              <span className="text-lime-200 text-[10px] uppercase font-bold flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-lime-400" /> Chuva Hoje
              </span>
              <span className="text-base font-extrabold text-white mt-0.5 block">
                {weather.current.precipitationMm} mm
              </span>
            </div>

            <div>
              <span className="text-lime-200 text-[10px] uppercase font-bold flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-lime-400" /> Vento
              </span>
              <span className="text-base font-extrabold text-white mt-0.5 block">
                {weather.current.windSpeed} km/h
              </span>
            </div>

            <div>
              <span className="text-lime-200 text-[10px] uppercase font-bold flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-lime-400" /> Evap. (ETo)
              </span>
              <span className="text-base font-extrabold text-white mt-0.5 block">
                {weather.current.evapotranspirationMm} mm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Row */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Previsão Detalhada para os Próximos 7 Dias
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weather.forecast.map((day, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-2xl border border-gray-200 hover:border-lime-400 hover:shadow-md transition-all text-center flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-bold text-gray-800">{day.dayOfWeek}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{day.date}</p>

                <div className="my-3">
                  <span className="text-xl font-black text-gray-900">{day.tempMax}°</span>
                  <span className="text-xs font-medium text-gray-400 ml-1.5">{day.tempMin}°</span>
                </div>

                <p className="text-[11px] font-semibold text-gray-700">{day.condition}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-blue-600 font-semibold">
                  <span>Chuva:</span>
                  <span>{day.precipitationMm} mm</span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span>Prob.:</span>
                  <span>{day.precipitationChance}%</span>
                </div>
                <div className="mt-2">
                  <span className="inline-block w-full py-0.5 rounded text-[10px] font-bold bg-lime-50 text-[#365314] border border-lime-200/60">
                    Aptidão {day.suitabilityScore}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Trend Chart */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-amber-500" />
                Variação Térmica e Precipitação Horária (24h)
              </h3>
              <p className="text-xs text-gray-500">Ciclo diurno de temperatura e aguaceiros</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weather.hourly}>
                <defs>
                  <linearGradient id="colorTempHourly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} unit="°C" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="temp"
                  name="Temperatura (°C)"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fill="url(#colorTempHourly)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Historical Rainfall Comparison Chart */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-blue-600" />
                Histórico Climático Pluviométrico (mm)
              </h3>
              <p className="text-xs text-gray-500">
                Comparativo mensal com a série histórica normal de Angola
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weather.history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} unit="mm" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="precipitationMm"
                  name="Precipitação 2026"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="historicalAverageMm"
                  name="Média 10 Anos"
                  fill="#cbd5e1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Agronomic Recommendations for this Weather */}
      <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-lime-50 text-[#65A30D] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Recomendações Agronómicas para {selectedFarm.name}
            </h3>
            <p className="text-xs text-gray-500">
              Orientações baseadas nas previsões de chuva, temperatura e vento
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {weather.recommendations.map((rec, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#F8FAF5] border border-gray-200/80 flex items-start gap-3"
            >
              <CheckCircle2 className="w-4 h-4 text-[#65A30D] shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700 leading-relaxed font-medium">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
