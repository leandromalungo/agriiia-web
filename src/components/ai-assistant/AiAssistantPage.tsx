import React, { useState, useRef, useEffect } from 'react';
import { DemoBadge } from '../ui/DemoBadge';
import { ChatService } from '../../lib/services/chatService';
import { ChatMessage } from '../../types';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Info,
  AlertTriangle,
  RotateCcw,
  Sprout,
  CheckCircle2,
} from 'lucide-react';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'assistant',
    content: `Olá! Sou o **Assistente Agrícola da Agriia**. 

Estou configurado com base de conhecimento agronómico para as províncias de **Huambo, Huíla e Malanje**. Posso ajudar com:
- Deteção e maneio de pragas (ex: lagarta-do-cartucho no milho)
- Cálculo de lâminas de rega por gota-a-gota e pivô
- Interpretação de dados multiespectrais e índices NDVI (Sentinel-2)
- Recomendações de fertilização azotada e correção de solo ferralítico

*Selecione uma das perguntas sugeridas abaixo ou digite a sua dúvida de campo.*`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedQuestions: [
      'Como controlar a lagarta-do-cartucho no milho em Huambo?',
      'Qual o regime de rega ideal para a batata na Huíla nesta época?',
      'Como interpretar a queda de NDVI na Parcela Sul B1?',
      'Recomendação de adubação de cobertura para soja em solo ferralítico',
    ],
  },
];

export function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      const response = await ChatService.generateReply(text);

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: response.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: response.suggestedQuestions,
        referenceData: response.referenceData,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      // Fallback
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Top Disclaimer Notice */}
      <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900 shrink-0">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Aviso Legal Demonstrativo:</strong> As recomendações deste assistente são
            geradas localmente para fins de demonstração. Devem ser verificadas por um engenheiro
            agrónomo credenciado antes da aplicação no terreno.
          </span>
        </div>
        <DemoBadge compact />
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col overflow-hidden min-h-0">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#F8FAF5]/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#65A30D] to-[#365314] text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5 text-[#ECFCCB]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900">Agriia Copilot Agronómico</h3>
                <span className="w-2 h-2 rounded-full bg-[#65A30D] animate-pulse"></span>
              </div>
              <p className="text-[11px] text-gray-500">
                Assistente de manejo inteligente • Respostas locais instantâneas
              </p>
            </div>
          </div>

          <button
            onClick={handleResetChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reiniciar conversa"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-lime-100 text-[#365314] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-[#365314] text-white rounded-tr-none'
                        : 'bg-[#F8FAF5] border border-gray-200/80 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    {/* Render basic markdown/line breaks */}
                    <div className="space-y-2 whitespace-pre-line">
                      {msg.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>

                    {msg.referenceData && (
                      <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-[#65A30D]">
                        <Sprout className="w-3.5 h-3.5" />
                        <span>Referência: {msg.referenceData.label}</span>
                      </div>
                    )}
                  </div>

                  <span
                    className={`block text-[10px] text-gray-400 px-1 ${
                      isUser ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </span>

                  {/* Suggested questions buttons under assistant reply */}
                  {!isUser && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {msg.suggestedQuestions.map((sq, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(sq)}
                          disabled={isProcessing}
                          className="text-[11px] font-medium px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-lime-400 hover:bg-lime-50/60 text-gray-700 hover:text-[#365314] transition-all text-left shadow-2xs"
                        >
                          {sq}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Processing Indicator */}
          {isProcessing && (
            <div className="flex gap-3.5 items-center">
              <div className="w-8 h-8 rounded-xl bg-lime-100 text-[#365314] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-[#F8FAF5] border border-gray-200 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#65A30D] animate-bounce"></span>
                <span
                  className="w-2 h-2 rounded-full bg-[#65A30D] animate-bounce"
                  style={{ animationDelay: '0.15s' }}
                ></span>
                <span
                  className="w-2 h-2 rounded-full bg-[#65A30D] animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                ></span>
                <span className="text-[11px] text-gray-500 ml-2">A consultar parâmetros agronómicos...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-gray-100 bg-[#F8FAF5]/40 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pergunte sobre rega, solos, adubação de milho, soja, batata, café..."
              className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#65A30D] focus:ring-1 focus:ring-[#65A30D]"
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isProcessing}
              className="p-3 bg-[#65A30D] hover:bg-[#558b0a] disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl shadow-xs transition-colors"
              title="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2 px-1">
            <span>IA Local de Demonstração (sem dependência de API externa)</span>
            <span>Agriia Precision Knowledge Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
}
