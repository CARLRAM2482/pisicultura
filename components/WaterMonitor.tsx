import React, { useState } from 'react';
import { WaterQualityLog } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Droplets, AlertTriangle, CheckCircle } from 'lucide-react';
import { analyzeWaterHealth } from '../services/geminiService';

interface WaterMonitorProps {
  logs: WaterQualityLog[];
  addLog: (log: WaterQualityLog) => void;
}

const WaterMonitor: React.FC<WaterMonitorProps> = ({ logs, addLog }) => {
  const [newLog, setNewLog] = useState<Partial<WaterQualityLog>>({
    ph: 7.0,
    temperature: 26,
    oxygen: 5,
    ammonia: 0
  });
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.ph || !newLog.temperature || !newLog.oxygen) return;

    const log: WaterQualityLog = {
      id: Date.now().toString(),
      tankId: 'Tanque 1', // Simplified for demo
      date: new Date().toISOString().split('T')[0],
      ph: Number(newLog.ph),
      temperature: Number(newLog.temperature),
      oxygen: Number(newLog.oxygen),
      ammonia: Number(newLog.ammonia || 0),
    };

    addLog(log);
    
    // Trigger AI analysis
    setLoadingAnalysis(true);
    const result = await analyzeWaterHealth(log);
    setAnalysis(result);
    setLoadingAnalysis(false);
  };

  const getLastLog = () => logs[logs.length - 1] || null;
  const last = getLastLog();

  const getStatusColor = (val: number, type: 'ph' | 'temp' | 'oxy' | 'amm') => {
    switch(type) {
      case 'ph': return (val >= 6.5 && val <= 8.5) ? 'text-green-500' : 'text-red-500';
      case 'temp': return (val >= 24 && val <= 30) ? 'text-green-500' : 'text-red-500';
      case 'oxy': return (val >= 3.0) ? 'text-green-500' : 'text-red-500';
      case 'amm': return (val <= 0.05) ? 'text-green-500' : 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Calidad del Agua</h2>
        <p className="text-slate-500">Monitoreo de parámetros críticos para la supervivencia.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Droplets className="text-blue-500" /> Nuevo Registro
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">pH</label>
              <input 
                type="number" step="0.1" 
                value={newLog.ph} 
                onChange={e => setNewLog({...newLog, ph: parseFloat(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Temperatura (°C)</label>
              <input 
                type="number" step="0.1" 
                value={newLog.temperature}
                onChange={e => setNewLog({...newLog, temperature: parseFloat(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Oxígeno (mg/L)</label>
              <input 
                type="number" step="0.1" 
                value={newLog.oxygen}
                onChange={e => setNewLog({...newLog, oxygen: parseFloat(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Amonio (mg/L)</label>
              <input 
                type="number" step="0.01" 
                value={newLog.ammonia}
                onChange={e => setNewLog({...newLog, ammonia: parseFloat(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
            >
              Registrar Dato
            </button>
          </form>

          {analysis && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
              <strong className="flex items-center gap-1 mb-1"><BotIcon /> Análisis IA:</strong>
              {analysis}
            </div>
          )}
           {loadingAnalysis && (
            <div className="mt-4 text-sm text-center text-gray-500">Analizando datos con Gemini...</div>
           )}
        </div>

        {/* Current Status Cards */}
        <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatusCard label="pH" value={last?.ph.toFixed(1) || '--'} unit="" statusColor={getStatusColor(last?.ph || 0, 'ph')} />
                <StatusCard label="Temp" value={last?.temperature.toFixed(1) || '--'} unit="°C" statusColor={getStatusColor(last?.temperature || 0, 'temp')} />
                <StatusCard label="Oxígeno" value={last?.oxygen.toFixed(1) || '--'} unit="mg/L" statusColor={getStatusColor(last?.oxygen || 0, 'oxy')} />
                <StatusCard label="Amonio" value={last?.ammonia.toFixed(2) || '--'} unit="mg/L" statusColor={getStatusColor(last?.ammonia || 0, 'amm')} />
            </div>

            {/* Charts */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
                <h3 className="text-lg font-semibold mb-4">Tendencia Histórica</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={logs}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="ph" stroke="#8884d8" name="pH" />
                        <Line type="monotone" dataKey="oxygen" stroke="#82ca9d" name="O2 (mg/L)" />
                        <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Temp (°C)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

const StatusCard = ({ label, value, unit, statusColor }: any) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
    <span className="text-slate-500 text-sm font-medium">{label}</span>
    <span className={`text-2xl font-bold ${statusColor}`}>{value}<span className="text-xs text-slate-400 ml-1">{unit}</span></span>
  </div>
);

const BotIcon = () => (
    <svg className="w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
)

export default WaterMonitor;