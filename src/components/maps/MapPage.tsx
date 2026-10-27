import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useRouter } from '../../context/RouterContext';
import { Farm, Plot } from '../../types';
import { DemoBadge } from '../ui/DemoBadge';
import { formatHectares } from '../../lib/utils';
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  Eye,
  Activity,
  Sprout,
  Compass,
  AlertTriangle,
  ChevronRight,
  X,
  Droplets,
  Thermometer,
} from 'lucide-react';
import * as maplibregl from 'maplibre-gl';

export function MapPage() {
  const { farms, alerts } = useApp();
  const { navigate } = useRouter();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);

  const [selectedFarm, setSelectedFarm] = useState<Farm>(farms[0]);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'crops' | 'ndvi' | 'alerts'>('all');
  const [mapSearch, setMapSearch] = useState('');
  const [webGlSupported, setWebGlSupported] = useState(true);

  // Center coordinates of Angola
  const angolaCenter: [number, number] = [17.8739, -11.2027];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      // Check for maplibre-gl support
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors',
            },
          },
          layers: [
            {
              id: 'osm-tiles-layer',
              type: 'raster',
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [selectedFarm.coordinates.lng, selectedFarm.coordinates.lat],
        zoom: 7,
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');

      // Add markers for all farms
      farms.forEach((farm) => {
        const el = document.createElement('div');
        el.className = 'farm-marker-pin';
        el.innerHTML = `
          <div style="
            background: linear-gradient(135deg, #65A30D, #365314);
            color: white;
            padding: 6px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            border: 2px solid white;
            transform: translate(-50%, -100%);
            white-space: nowrap;
          ">
            <span>🌱</span>
            <span>${farm.name}</span>
          </div>
        `;

        el.addEventListener('click', () => {
          setSelectedFarm(farm);
          setSelectedPlot(farm.plots[0] || null);
          map.flyTo({
            center: [farm.coordinates.lng, farm.coordinates.lat],
            zoom: 11,
            essential: true,
          });
        });

        new maplibregl.Marker({ element: el })
          .setLngLat([farm.coordinates.lng, farm.coordinates.lat])
          .addTo(map);
      });

      mapInstanceRef.current = map;

      return () => {
        map.remove();
      };
    } catch (e) {
      console.warn('MapLibre GL initialization fallback to interactive canvas', e);
      setWebGlSupported(false);
    }
  }, [farms]);

  const handleFlyToFarm = (farm: Farm) => {
    setSelectedFarm(farm);
    setSelectedPlot(farm.plots[0] || null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [farm.coordinates.lng, farm.coordinates.lat],
        zoom: 11,
        essential: true,
      });
    }
  };

  const handleZoom = (type: 'in' | 'out') => {
    if (mapInstanceRef.current) {
      if (type === 'in') mapInstanceRef.current.zoomIn();
      else mapInstanceRef.current.zoomOut();
    }
  };

  const filteredFarms = farms.filter(
    (f) =>
      f.name.toLowerCase().includes(mapSearch.toLowerCase()) ||
      f.province.toLowerCase().includes(mapSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#65A30D]" />
            Cartografia Geoespacial & Parcelas
          </h2>
          <p className="text-xs text-gray-500">
            Visualização territorial das explorações agrícolas em Angola com camadas de satélite
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Layer Selector */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                activeLayer === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Geral
            </button>
            <button
              onClick={() => setActiveLayer('crops')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                activeLayer === 'crops' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Culturas
            </button>
            <button
              onClick={() => setActiveLayer('ndvi')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                activeLayer === 'ndvi' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Vigor NDVI
            </button>
            <button
              onClick={() => setActiveLayer('alerts')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                activeLayer === 'alerts' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Alertas
            </button>
          </div>

          <DemoBadge />
        </div>
      </div>

      {/* Main Map + Inspector Layout */}
      <div className="relative h-[650px] w-full rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-md flex">
        {/* MapLibre GL Container */}
        <div ref={mapContainerRef} className="w-full h-full bg-[#e5e3df] relative">
          {!webGlSupported && (
            <div className="absolute inset-0 bg-[#f4f3ef] flex flex-col items-center justify-center p-6 text-center">
              <Compass className="w-12 h-12 text-[#65A30D] mb-2" />
              <h3 className="text-sm font-bold text-gray-800">Visualizador Cartográfico Interativo</h3>
              <p className="text-xs text-gray-500 max-w-sm mt-1">
                A renderização vetorial local está ativa para as 3 explorações em Huambo, Huíla e Malanje.
              </p>
            </div>
          )}
        </div>

        {/* Floating Farm Quick Switcher on Top Left */}
        <div className="absolute top-4 left-4 z-10 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-3 space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={mapSearch}
              onChange={(e) => setMapSearch(e.target.value)}
              placeholder="Pesquisar no mapa..."
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#65A30D]"
            />
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1">
            {filteredFarms.map((farm) => {
              const isSelected = selectedFarm.id === farm.id;
              return (
                <button
                  key={farm.id}
                  onClick={() => handleFlyToFarm(farm)}
                  className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-lime-50 text-[#365314] font-bold border border-lime-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="truncate">
                    <p className="truncate">{farm.name}</p>
                    <span className="text-[10px] text-gray-400 font-normal">
                      {farm.province} • {formatHectares(farm.areaHectares)}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Floating Lateral Inspector Drawer on Right */}
        <div className="absolute top-4 right-4 bottom-4 z-10 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 bg-gradient-to-r from-lime-900 to-[#365314] text-white">
            <div className="flex items-center justify-between mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-400 text-lime-950 uppercase">
                {selectedFarm.province}
              </span>
              <span className="text-xs text-lime-200">{selectedFarm.status}</span>
            </div>
            <h3 className="text-base font-bold truncate">{selectedFarm.name}</h3>
            <p className="text-xs text-lime-200/80 truncate">
              {selectedFarm.municipality} • {selectedFarm.location}
            </p>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-[#F8FAF5] border border-gray-100">
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Área Total</span>
                <span className="text-sm font-extrabold text-gray-900">
                  {formatHectares(selectedFarm.areaHectares)}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8FAF5] border border-gray-100">
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Saúde Média</span>
                <span className="text-sm font-extrabold text-[#365314]">
                  {selectedFarm.healthScore}% (NDVI)
                </span>
              </div>
            </div>

            {/* Plots Selector in Map */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                Parcelas Georreferenciadas ({selectedFarm.plots.length})
              </p>
              <div className="space-y-1.5">
                {selectedFarm.plots.map((plot) => {
                  const isPlotSelected = selectedPlot?.id === plot.id;
                  return (
                    <div
                      key={plot.id}
                      onClick={() => setSelectedPlot(plot)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isPlotSelected
                          ? 'border-[#65A30D] bg-lime-50/70 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{plot.name}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                          {plot.areaHectares} ha
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1">
                        <span>Cultura: {plot.crop}</span>
                        <span className="font-semibold text-[#65A30D]">NDVI: {plot.ndviScore}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Plot Details */}
            {selectedPlot && (
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <p className="text-[11px] font-bold uppercase text-gray-500">
                  Dados de Campo • {selectedPlot.name}
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-gray-400 block">Humidade Solo</span>
                    <strong className="text-blue-700">{selectedPlot.soilMoisture}%</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Temperatura Solo</span>
                    <strong className="text-gray-800">{selectedPlot.soilTemp}°C</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Variedade</span>
                    <strong>{selectedPlot.variety}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Previsão Colheita</span>
                    <strong>{selectedPlot.expectedHarvestDate}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Coordenadas */}
            <div className="text-[11px] text-gray-500 font-mono bg-gray-50 p-2 rounded-lg border border-gray-200">
              Centroide: {selectedFarm.coordinates.lat.toFixed(4)},{' '}
              {selectedFarm.coordinates.lng.toFixed(4)}
            </div>
          </div>

          {/* Drawer Footer Link */}
          <div className="p-3 bg-white border-t border-gray-200">
            <button
              onClick={() => navigate(`/farms/${selectedFarm.id}`)}
              className="w-full py-2 px-3 bg-[#65A30D] hover:bg-[#558b0a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Abrir Ficha Completa da Exploração</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
