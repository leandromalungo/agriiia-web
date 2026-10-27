import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  Sprout,
  Activity,
  CloudSun,
  Satellite,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  BookOpen,
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<'intro' | 'ndvi' | 'soil' | 'weather' | 'faq'>('intro');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in-0 duration-150">
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 px-6 bg-gradient-to-r from-lime-900 via-lime-800 to-[#365314] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-lime-500/20 border border-lime-400/30 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-lime-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Manual de Ajuda & Guia Agronómico Agriia</h3>
              <p className="text-[11px] text-lime-200/80">
                Aprenda a interpretar os índices de satélite, dados de solo e gráficos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50/80 px-4 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('intro')}
            className={`py-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'intro'
                ? 'border-[#65A30D] text-[#365314] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Visão Geral da Tela
          </button>
          <button
            onClick={() => setActiveTab('ndvi')}
            className={`py-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'ndvi'
                ? 'border-[#65A30D] text-[#365314] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Índice NDVI (Satélite)
          </button>
          <button
            onClick={() => setActiveTab('soil')}
            className={`py-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'soil'
                ? 'border-[#65A30D] text-[#365314] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Humidade do Solo
          </button>
          <button
            onClick={() => setActiveTab('weather')}
            className={`py-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'weather'
                ? 'border-[#65A30D] text-[#365314] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Clima & Aptidão
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'faq'
                ? 'border-[#65A30D] text-[#365314] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Perguntas Frequentes
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-gray-700 leading-relaxed">
          {activeTab === 'intro' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-lime-50 rounded-xl border border-lime-200">
                <p className="font-bold text-[#365314] text-sm mb-1">
                  Como utilizar o painel da Agriia
                </p>
                <p className="text-gray-600">
                  A plataforma foi estruturada para apoiar agricultores e gestores operacionais com
                  informações integradas de satélite, clima e planeamento agrícola.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 flex items-center gap-1.5 mb-1 text-xs">
                    <Activity className="w-4 h-4 text-[#65A30D]" />
                    Dashboard
                  </h4>
                  <p className="text-gray-500 text-[11px]">
                    Visão consolidada da safra com indicadores de saúde vegetal, precipitação e alertas.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 flex items-center gap-1.5 mb-1 text-xs">
                    <Layers className="w-4 h-4 text-[#65A30D]" />
                    Mapa Geoespacial
                  </h4>
                  <p className="text-gray-500 text-[11px]">
                    Cartografia vetorial com marcadores das propriedades, parcelas e camadas temáticas.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 flex items-center gap-1.5 mb-1 text-xs">
                    <CloudSun className="w-4 h-4 text-[#65A30D]" />
                    Previsão Meteorológica
                  </h4>
                  <p className="text-gray-500 text-[11px]">
                    Previsão de 7 dias, evapotranspiração (ETo) e janelas ideais para rega e adubação.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 flex items-center gap-1.5 mb-1 text-xs">
                    <Calendar className="w-4 h-4 text-[#65A30D]" />
                    Calendário de Manejo
                  </h4>
                  <p className="text-gray-500 text-[11px]">
                    Agendamento e acompanhamento de tarefas (rega, adubação, colheita) por parcela.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ndvi' && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-sm">
                O que é o NDVI e como interpretar os valores?
              </h4>
              <p>
                O <strong>NDVI (Normalized Difference Vegetation Index)</strong> é um índice
                multiespectral que calcula a absorção de luz vermelha e reflexão do infravermelho
                próximo (NIR) pelas folhas verdes das plantas. Varia numa escala de 0.0 a 1.0:
              </p>

              <div className="space-y-2 pt-2">
                <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-900 text-xs block">
                      NDVI 0.75 a 1.00 — Vigor Excelente
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      Cultura densa, biomassa abundante e fotossíntese ótima (fechamento de entrelinhas).
                    </span>
                  </div>
                  <span className="w-4 h-4 rounded-full bg-emerald-600 shrink-0"></span>
                </div>

                <div className="p-2.5 rounded-xl border border-lime-200 bg-lime-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-lime-900 text-xs block">
                      NDVI 0.60 a 0.74 — Vigor Bom a Moderado
                    </span>
                    <span className="text-[11px] text-lime-700">
                      Crescimento normal em estágio vegetativo intermediário.
                    </span>
                  </div>
                  <span className="w-4 h-4 rounded-full bg-[#65A30D] shrink-0"></span>
                </div>

                <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-amber-900 text-xs block">
                      NDVI 0.45 a 0.59 — Atenção / Estresse Moderado
                    </span>
                    <span className="text-[11px] text-amber-700">
                      Pode indicar deficit hídrico inicial, solo arenoso ou deficiência nutricional.
                    </span>
                  </div>
                  <span className="w-4 h-4 rounded-full bg-amber-500 shrink-0"></span>
                </div>

                <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-rose-900 text-xs block">
                      NDVI &lt; 0.45 — Alerta Crítico / Solo Nu
                    </span>
                    <span className="text-[11px] text-rose-700">
                      Germinação falha, senescência severa ou estresse hídrico agudo. Requer vistoria.
                    </span>
                  </div>
                  <span className="w-4 h-4 rounded-full bg-rose-600 shrink-0"></span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'soil' && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-sm">
                Camadas de Profundidade da Humidade do Solo
              </h4>
              <p>
                Os sensores de solo fornecem leituras de humidade volumétrica (%) em três profundidades
                estratégicas:
              </p>

              <div className="space-y-2.5">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <h5 className="font-bold text-gray-900 text-xs">
                    1. Camada Superficial (10 cm)
                  </h5>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Reflete diretamente a evaporação solar e o impacto imediato das regas ou chuvas.
                    Fundamental para sementes em germinação e mudas transplantadas.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <h5 className="font-bold text-gray-900 text-xs">
                    2. Zona Radicular Principal (30 cm)
                  </h5>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Onde se concentra mais de 70% das raízes absorventes de milho, soja e batata.
                    Ideal manter entre 40% e 55% de humidade volumétrica.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <h5 className="font-bold text-gray-900 text-xs">
                    3. Reserva Subsuperficial (60 cm)
                  </h5>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Reserva profunda do solo contra períodos de veranico. Ajuda a diagnosticar se há
                    encharcamento ou se a água está a infiltrar adequadamente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'weather' && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-sm">
                Índice de Aptidão Agrícola Diária (0 - 100)
              </h4>
              <p>
                O índice de aptidão avalia as condições combinadas para a realização de operações no
                campo:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-[11px]">
                <li>
                  <strong>Pulverizações:</strong> Requer vento inferior a 10 km/h, humidade relativa
                  acima de 50% e ausência de chuva nas 4 horas seguintes.
                </li>
                <li>
                  <strong>Colheita:</strong> Requer dias ensolarados, humidade relativa baixa e solo
                  seco para evitar compactação por ceifeiras.
                </li>
                <li>
                  <strong>Adubação azotada:</strong> Favorecida por chuva leve logo após a aplicação
                  para incorporar a ureia sem perdas gasosas.
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <p className="font-bold text-gray-900 text-xs">
                  Os dados apresentados são reais ou simulados?
                </p>
                <p className="text-[11px] text-gray-600 mt-1">
                  Todos os dados na versão atual são demonstrativos e calibrados com parâmetros reais
                  de solo e clima de Angola (Huambo, Huíla e Malanje) para preparação de integração futura.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <p className="font-bold text-gray-900 text-xs">
                  Como exportar relatórios para o Excel?
                </p>
                <p className="text-[11px] text-gray-600 mt-1">
                  Aceda à página <strong>Relatórios</strong> na barra lateral ou use o botão &quot;Exportar
                  Dados&quot; no topo da página. O ficheiro CSV é compatível com Excel, LibreOffice e SIG.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <p className="font-bold text-gray-900 text-xs">
                  O assistente de IA substitui um engenheiro agrónomo?
                </p>
                <p className="text-[11px] text-gray-600 mt-1">
                  Não. O assistente funciona como ferramenta de apoio à decisão e triagem rápida de
                  boas práticas. Intervenções químicas e estruturais devem ser validadas no campo.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 px-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Dica: Pode consultar este manual a qualquer momento clicando no botão &quot;Ajuda&quot;.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#65A30D] hover:bg-[#558b0a] text-white font-bold rounded-lg transition-colors text-xs"
          >
            Fechar
          </button>
        </div>
      </div>
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
