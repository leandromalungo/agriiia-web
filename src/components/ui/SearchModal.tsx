import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useRouter } from '../../context/RouterContext';
import {
  Search,
  MapPin,
  Sprout,
  Calendar,
  CloudSun,
  Satellite,
  BarChart3,
  Bot,
  X,
  ArrowRight,
} from 'lucide-react';

export function SearchModal() {
  const { searchOpen, setSearchOpen, farms, activities } = useApp();
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  if (!searchOpen) return null;

  const q = query.trim().toLowerCase();

  // Search results
  const matchedFarms = farms.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.province.toLowerCase().includes(q) ||
      f.municipality.toLowerCase().includes(q) ||
      f.cropTypes.some((c) => c.toLowerCase().includes(q))
  );

  const matchedPlots = farms.flatMap((f) =>
    f.plots
      .filter((p) => p.name.toLowerCase().includes(q) || p.crop.toLowerCase().includes(q))
      .map((p) => ({ ...p, farmName: f.name }))
  );

  const matchedActivities = activities.filter(
    (a) => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
  );

  const navigationItems = [
    { label: 'Dashboard Geral', path: '/dashboard', icon: BarChart3, desc: 'Visão executiva e KPIs' },
    { label: 'Explorações Agrícolas', path: '/farms', icon: Sprout, desc: 'Lista de explorações e cadastro' },
    { label: 'Mapa Geoespacial', path: '/map', icon: MapPin, desc: 'MapLibre GL com camadas de parcelas' },
    { label: 'Monitorização Vegetativa', path: '/monitoring', icon: Sprout, desc: 'Saúde vegetal, solo e NDVI' },
    { label: 'Assistente Agrícola IA', path: '/ai-assistant', icon: Bot, desc: 'Chatbot agronómico simulado' },
    { label: 'Previsão & Clima', path: '/weather', icon: CloudSun, desc: 'Métricas meteorológicas' },
    { label: 'Observação por Satélite', path: '/satellite', icon: Satellite, desc: 'Sentinel-2 & Landsat 9' },
    { label: 'Calendário de Manejo', path: '/calendar', icon: Calendar, desc: 'Atividades e tarefas da safra' },
    { label: 'Relatórios & Exportação', path: '/reports', icon: BarChart3, desc: 'Download CSV de dados' },
  ].filter((item) => !q || item.label.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q));

  const handleSelect = (path: string) => {
    setSearchOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in-0 duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 bg-gray-50/60">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar explorações, parcelas, culturas, clima, páginas..."
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-gray-500 bg-white border border-gray-200 rounded-md shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-4 flex-1">
          {/* Matched Farms */}
          {matchedFarms.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-1.5">
                Explorações ({matchedFarms.length})
              </p>
              <div className="space-y-1">
                {matchedFarms.map((farm) => (
                  <button
                    key={farm.id}
                    onClick={() => handleSelect(`/farms/${farm.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-lime-50/80 group transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-lime-100 text-[#365314] flex items-center justify-center font-bold text-xs">
                        {farm.province.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-[#365314]">
                          {farm.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {farm.province} • {farm.municipality} • {farm.areaHectares} ha
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#65A30D] group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Plots */}
          {matchedPlots.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-1.5">
                Parcelas Agrícolas ({matchedPlots.length})
              </p>
              <div className="space-y-1">
                {matchedPlots.map((plot) => (
                  <button
                    key={plot.id}
                    onClick={() => handleSelect(`/farms/${plot.farmId}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-lime-50/80 group transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <Sprout className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {plot.name}{' '}
                          <span className="text-xs font-normal text-gray-500">
                            ({plot.farmName})
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Cultura: {plot.crop} • NDVI: {plot.ndviScore} • {plot.areaHectares} ha
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#65A30D] transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Shortcuts */}
          {navigationItems.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-1.5">
                Navegação Rápida
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleSelect(item.path)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-100/80 group transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 group-hover:bg-lime-100 group-hover:text-[#365314] flex items-center justify-center shrink-0 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{item.label}</p>
                        <p className="text-[11px] text-gray-500 truncate">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {matchedFarms.length === 0 && matchedPlots.length === 0 && navigationItems.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">Nenhum resultado encontrado para &quot;{query}&quot;</p>
              <p className="text-xs text-gray-400 mt-1">Tente pesquisar por província (Huambo, Huíla), cultura ou página.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Dica: Use <strong>Ctrl + K</strong> a qualquer momento para abrir esta pesquisa.</span>
          <span className="text-[11px] text-gray-400">Agriia v1.0 • Desktop</span>
        </div>
      </div>
      <div className="fixed inset-0 -z-10" onClick={() => setSearchOpen(false)} />
    </div>
  );
}
