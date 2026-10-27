import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  RotateCcw,
  Sparkles,
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
  const [useMapLibre, setUseMapLibre] = useState(true);
  const [maplibreReady, setMaplibreReady] = useState(false);

  // Fallback vector map state
  const [vectorZoom, setVectorZoom] = useState(1);
  const [vectorPan, setVectorPan] = useState({ x: 0, y: 0 });

  // Prevent browser window from displaying unhandled worker loading errors in sandboxed iframes
  useEffect(() => {
    const handleWindowError = (e: ErrorEvent) => {
      if (
        e.message?.includes('Worker failed to load') ||
        e.message?.includes('Worker') ||
        e.message?.includes('WebGL')
      ) {
        e.preventDefault();
        e.stopPropagation();
        setUseMapLibre(false);
      }
    };

    window.addEventListener('error', handleWindowError);
    return () => window.removeEventListener('error', handleWindowError);
  }, []);

  // Initialize MapLibre GL with safe worker URL and error trapping
  useEffect(() => {
    if (!mapContainerRef.current || !useMapLibre) return;

    try {
      // Set the worker URL to the local public worker file
      if (typeof maplibregl.setWorkerUrl === 'function') {
        try {
          maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
        } catch (workerErr) {
          console.warn('MapLibre workerUrl setup:', workerErr);
        }
      }

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

      // Trap map errors to prevent unhandled rejections
      map.on('error', (e) => {
        console.warn('MapLibre GL error caught:', e?.error?.message || e);
        if (
          e?.error?.message?.includes('Worker') ||
          e?.error?.message?.includes('WebGL') ||
          e?.error?.message?.includes('fetch')
        ) {
          setUseMapLibre(false);
        }
      });

      map.on('load', () => {
        setMaplibreReady(true);
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
        try {
          map.remove();
        } catch {}
      };
    } catch (e) {
      console.warn('MapLibre GL failed, switching to vector GIS cartography', e);
      setUseMapLibre(false);
    }
  }, [farms, useMapLibre]);

  const handleFlyToFarm = (farm: Farm) => {
    setSelectedFarm(farm);
    setSelectedPlot(farm.plots[0] || null);
    if (mapInstanceRef.current && useMapLibre) {
      try {
        mapInstanceRef.current.flyTo({
          center: [farm.coordinates.lng, farm.coordinates.lat],
          zoom: 11,
          essential: true,
        });
      } catch {
        // Fallback
      }
    } else {
      // Focus in vector map
      setVectorZoom(1.8);
      if (farm.province === 'Huambo') setVectorPan({ x: -40, y: -20 });
      else if (farm.province === 'Huíla') setVectorPan({ x: 30, y: -120 });
      else if (farm.province === 'Malanje') setVectorPan({ x: -100, y: 100 });
    }
  };

  const handleZoom = (type: 'in' | 'out') => {
    if (mapInstanceRef.current && useMapLibre) {
      try {
        if (type === 'in') mapInstanceRef.current.zoomIn();
        else mapInstanceRef.current.zoomOut();
      } catch {}
    } else {
      setVectorZoom((prev) =>
        type === 'in' ? Math.min(prev + 0.4, 3.5) : Math.max(prev - 0.4, 0.8)
      );
    }
  };

  const handleResetVectorView = () => {
    setVectorZoom(1);
    setVectorPan({ x: 0, y: 0 });
  };

  const filteredFarms = useMemo(() => {
    return farms.filter(
      (f) =>
        f.name.toLowerCase().includes(mapSearch.toLowerCase()) ||
        f.province.toLowerCase().includes(mapSearch.toLowerCase())
    );
  }, [farms, mapSearch]);

  // Equirectangular projection coordinates for Angola (SVG 800x600 viewport)
  // Bounds: minLng: 11.5, maxLng: 24.5; minLat: -18.2, maxLat: -4.5;
  const projectGeoToSvg = (lat: number, lng: number) => {
    const minLng = 11.2;
    const maxLng = 24.5;
    const minLat = -18.2;
    const maxLat = -4.5;

    const width = 800;
    const height = 650;

    const x = ((lng - minLng) / (maxLng - minLng)) * width;
    const y = ((maxLat - lat) / (maxLat - minLat)) * height;
    return { x, y };
  };

  // Crop color helper
  const getCropColor = (crop: string) => {
    const c = crop.toLowerCase();
    if (c.includes('milho')) return '#eab308'; // yellow
    if (c.includes('soja')) return '#10b981'; // emerald
    if (c.includes('batata')) return '#f59e0b'; // amber
    if (c.includes('trigo')) return '#f97316'; // orange
    if (c.includes('mandioca')) return '#84cc16'; // lime
    if (c.includes('café')) return '#a16207'; // brown
    return '#65a30d';
  };

  // NDVI color helper
  const getNdviColor = (score: number) => {
    if (score >= 0.8) return '#15803d';
    if (score >= 0.7) return '#65a30d';
    if (score >= 0.6) return '#ca8a04';
    return '#dc2626';
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#65A30D]" />
            Cartografia Geoespacial & Parcelas Agrícolas
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
                activeLayer === 'all'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Geral
            </button>
            <button
              onClick={() => setActiveLayer('crops')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                activeLayer === 'crops'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Culturas
            </button>
            <button
              onClick={() => setActiveLayer('ndvi')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                activeLayer === 'ndvi'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Vigor NDVI
            </button>
            <button
              onClick={() => setActiveLayer('alerts')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                activeLayer === 'alerts'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Alertas
            </button>
          </div>

          {/* Toggle Map View Mode */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setUseMapLibre(true)}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                useMapLibre ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Visualizador MapLibre Tiles"
            >
              Satélite OSM
            </button>
            <button
              onClick={() => setUseMapLibre(false)}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                !useMapLibre ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Cartografia Vetorial SIG de Alta Precisão"
            >
              Mapa Vetorial SIG
            </button>
          </div>

          <DemoBadge />
        </div>
      </div>

      {/* Main Map + Inspector Layout */}
      <div className="relative h-[650px] w-full rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-md flex bg-[#F0F2EB]">
        {/* Map Container */}
        {useMapLibre ? (
          <div ref={mapContainerRef} className="w-full h-full bg-[#e5e3df] relative" />
        ) : (
          /* Interactive Vector GIS Cartography of Angola */
          <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-[#eaf0e2] to-[#dfe7d5] select-none flex items-center justify-center">
            {/* SVG Background Map of Angola */}
            <svg
              className="w-full h-full transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing"
              viewBox="0 0 800 650"
              style={{
                transform: `scale(${vectorZoom}) translate(${vectorPan.x}px, ${vectorPan.y}px)`,
              }}
            >
              <defs>
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d5dfcb" strokeWidth="0.8" />
                </pattern>
                <linearGradient id="angolaTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f3f8ee" />
                  <stop offset="50%" stopColor="#e4eedb" />
                  <stop offset="100%" stopColor="#dbe8d0" />
                </linearGradient>
                <filter id="pinShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.25" />
                </filter>
              </defs>

              <rect width="800" height="650" fill="url(#gridPattern)" />

              {/* Angola Simplified Stylized Geographic Contour */}
              <path
                d="M 120 60 L 220 50 L 300 70 L 340 120 L 450 140 L 520 180 L 590 220 L 640 280 L 650 360 L 600 450 L 580 540 L 460 590 L 380 610 L 220 580 L 160 540 L 140 450 L 130 350 L 110 260 L 100 170 Z"
                fill="url(#angolaTerrain)"
                stroke="#65A30D"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                opacity="0.85"
              />

              {/* Major Rivers / Geographic Markers */}
              <path
                d="M 220 180 Q 300 210 380 200 T 520 220"
                fill="none"
                stroke="#93c5fd"
                strokeWidth="3"
                opacity="0.6"
              />
              <text x="320" y="195" fontSize="10" fill="#60a5fa" fontWeight="bold">
                Rio Kwanza
              </text>

              {/* Provincial Regions Labels */}
              <text x="210" y="270" fontSize="13" fill="#6b7280" fontWeight="bold" opacity="0.6">
                PROVÍNCIA DO HUAMBO
              </text>
              <text x="180" y="440" fontSize="13" fill="#6b7280" fontWeight="bold" opacity="0.6">
                PROVÍNCIA DA HUÍLA
              </text>
              <text x="360" y="170" fontSize="13" fill="#6b7280" fontWeight="bold" opacity="0.6">
                PROVÍNCIA DE MALANJE
              </text>
              <text x="80" y="280" fontSize="11" fill="#9ca3af" fontWeight="bold" opacity="0.5">
                BENGUELA
              </text>
              <text x="100" y="140" fontSize="11" fill="#9ca3af" fontWeight="bold" opacity="0.5">
                LUANDA (Costa Atlântica)
              </text>

              {/* Plots & Parcel Boundary Polygons for each Farm */}
              {farms.map((farm) => {
                const center = projectGeoToSvg(farm.coordinates.lat, farm.coordinates.lng);
                const isFarmSelected = selectedFarm.id === farm.id;

                return (
                  <g key={`plots-group-${farm.id}`}>
                    {farm.plots.map((plot, pIdx) => {
                      // Offset each plot around the farm center
                      const angle = (pIdx / farm.plots.length) * Math.PI * 2;
                      const radius = 28 + (plot.areaHectares / 450) * 18;
                      const px = center.x + Math.cos(angle) * radius;
                      const py = center.y + Math.sin(angle) * radius;
                      const size = Math.max(16, Math.min(32, Math.sqrt(plot.areaHectares) * 2));

                      // Determine plot fill color based on active layer
                      let fillColor = '#65A30D';
                      if (activeLayer === 'crops') {
                        fillColor = getCropColor(plot.crop);
                      } else if (activeLayer === 'ndvi') {
                        fillColor = getNdviColor(plot.ndviScore);
                      } else if (activeLayer === 'alerts') {
                        const hasAlert = alerts.some(
                          (a) => a.plotName === plot.name && a.status === 'Ativo'
                        );
                        fillColor = hasAlert ? '#dc2626' : '#65A30D';
                      }

                      const isPlotSelected = selectedPlot?.id === plot.id;

                      return (
                        <g
                          key={plot.id}
                          className="cursor-pointer transition-transform hover:scale-110"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFarm(farm);
                            setSelectedPlot(plot);
                          }}
                        >
                          <rect
                            x={px - size / 2}
                            y={py - size / 2}
                            width={size}
                            height={size}
                            rx="5"
                            fill={fillColor}
                            fillOpacity={isPlotSelected ? 0.95 : 0.75}
                            stroke={isPlotSelected ? '#1F2937' : '#ffffff'}
                            strokeWidth={isPlotSelected ? 2.5 : 1.2}
                          />
                          <text
                            x={px}
                            y={py + 3}
                            textAnchor="middle"
                            fontSize="8"
                            fill="#ffffff"
                            fontWeight="bold"
                            pointerEvents="none"
                          >
                            P{pIdx + 1}
                          </text>
                        </g>
                      );
                    })}

                    {/* Farm Center Pin */}
                    <g
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedFarm(farm);
                        setSelectedPlot(farm.plots[0] || null);
                      }}
                      filter="url(#pinShadow)"
                    >
                      {/* Animated Pulse Ring if selected */}
                      {isFarmSelected && (
                        <circle
                          cx={center.x}
                          cy={center.y}
                          r="22"
                          fill="#65A30D"
                          fillOpacity="0.25"
                          className="animate-ping"
                        />
                      )}

                      <circle
                        cx={center.x}
                        cy={center.y}
                        r="14"
                        fill="#365314"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                      />
                      <circle cx={center.x} cy={center.y} r="6" fill="#ECFCCB" />

                      {/* Farm Name Banner */}
                      <rect
                        x={center.x - 70}
                        y={center.y - 32}
                        width="140"
                        height="20"
                        rx="6"
                        fill="#ffffff"
                        stroke="#65A30D"
                        strokeWidth="1.5"
                      />
                      <text
                        x={center.x}
                        y={center.y - 18}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill="#1F2937"
                      >
                        🌱 {farm.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Vector Map Overlay Controls */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-gray-200 text-[11px] text-gray-700 space-y-1 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#365314]"></span>
                <span>Explorações Agrícolas Ativas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-[#65A30D]"></span>
                <span>Parcelas Georreferenciadas (WGS84)</span>
              </div>
              <div className="pt-1 text-[10px] text-gray-400">
                Camada ativa: <strong>{activeLayer.toUpperCase()}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Map Floating Zoom Controls */}
        <div className="absolute bottom-4 right-[380px] z-10 hidden sm:flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-gray-200 shadow-md">
          <button
            onClick={() => handleZoom('in')}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
            title="Aproximar (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
            title="Afastar (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          {!useMapLibre && (
            <button
              onClick={handleResetVectorView}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
              title="Centrar mapa"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
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
                <span className="text-gray-400 text-[10px] uppercase font-bold block">
                  Área Total
                </span>
                <span className="text-sm font-extrabold text-gray-900">
                  {formatHectares(selectedFarm.areaHectares)}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8FAF5] border border-gray-100">
                <span className="text-gray-400 text-[10px] uppercase font-bold block">
                  Saúde Média
                </span>
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
                        <span className="font-semibold text-[#65A30D]">
                          NDVI: {plot.ndviScore}
                        </span>
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
