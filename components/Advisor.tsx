import React, { useState, useRef, useEffect } from 'react';
import { getAquacultureAdvice } from '../services/geminiService';
import { ChatMessage, Batch, WaterQualityLog } from '../types';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface AdvisorProps {
  batches: Batch[];
  waterLogs: WaterQualityLog[];
}

const Advisor: React.FC<AdvisorProps> = ({ batches, waterLogs }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hola. Soy tu asistente experto en piscicultura de Tilapia. ¿En qué puedo ayudarte hoy? Puedo analizar tus lotes, calidad de agua o ayudarte a calcular raciones de alimento.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await getAquacultureAdvice(userMsg.text, { batches, waterLogs });
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Lo siento, tuve un problema conectando con el servidor.',
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "¿Cuál es la tasa de alimentación para alevines de 5g?",
    "Mi pH está en 5.5, ¿cómo lo subo?",
    "Calcula la fecha de cosecha estimada",
    "¿Qué densidad de siembra recomiendas?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          <Bot className="text-blue-600" /> Asesor Técnico (Gemini)
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
              } ${msg.isError ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-75 text-xs">
                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                <span>{msg.role === 'user' ? 'Tú' : 'Experto IA'}</span>
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-slate-100 flex items-center gap-2">
              <Loader2 className="animate-spin text-blue-500" size={16} />
              <span className="text-sm text-slate-500">Analizando datos...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t">
         {/* Suggestions */}
         <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map((s, i) => (
              <button 
                key={i} 
                onClick={() => setInput(s)}
                className="whitespace-nowrap px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full hover:bg-blue-100 transition"
              >
                {s}
              </button>
            ))}
          </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta sobre el cultivo..."
            className="flex-1 rounded-lg border-slate-200 border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Advisor;