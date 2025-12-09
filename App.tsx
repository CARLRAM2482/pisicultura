import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import BatchManager from './components/BatchManager';
import WaterMonitor from './components/WaterMonitor';
import Advisor from './components/Advisor';
import { ViewState, Batch, WaterQualityLog, FishStage } from './types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Initial Data
const INITIAL_BATCHES: Batch[] = [
  {
    id: '1',
    name: 'Lote Alpha-1',
    tankId: 'Tanque 1',
    startDate: '2023-10-01',
    initialQuantity: 2000,
    currentQuantity: 1950,
    averageWeight: 150, // grams
    stage: FishStage.JUVENIL
  },
  {
    id: '2',
    name: 'Lote Beta-2',
    tankId: 'Tanque 2',
    startDate: '2023-11-15',
    initialQuantity: 5000,
    currentQuantity: 4800,
    averageWeight: 15, // grams
    stage: FishStage.ALEVINAJE
  }
];

const INITIAL_LOGS: WaterQualityLog[] = [
  { id: '1', date: '2023-10-20', tankId: 'Tanque 1', ph: 7.2, temperature: 26.5, oxygen: 5.5, ammonia: 0.01 },
  { id: '2', date: '2023-10-21', tankId: 'Tanque 1', ph: 7.1, temperature: 26.0, oxygen: 5.2, ammonia: 0.02 },
  { id: '3', date: '2023-10-22', tankId: 'Tanque 1', ph: 6.9, temperature: 25.8, oxygen: 4.8, ammonia: 0.03 },
  { id: '4', date: '2023-10-23', tankId: 'Tanque 1', ph: 7.0, temperature: 26.2, oxygen: 5.0, ammonia: 0.01 },
];

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewState>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // App State
  const [batches, setBatches] = useState<Batch[]>(INITIAL_BATCHES);
  const [waterLogs, setWaterLogs] = useState<WaterQualityLog[]>(INITIAL_LOGS);

  const addWaterLog = (log: WaterQualityLog) => {
    setWaterLogs([...waterLogs, log]);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard batches={batches} logs={waterLogs} />;
      case 'BATCHES':
        return <BatchManager batches={batches} setBatches={setBatches} />;
      case 'WATER':
        return <WaterMonitor logs={waterLogs} addLog={addWaterLog} />;
      case 'FINANCE':
        return (
          <div className="flex flex-col items-center justify-center h-96 text-center p-8">
            <h2 className="text-2xl font-bold text-slate-800">Módulo Financiero</h2>
            <p className="text-slate-500 mt-2">Próximamente: Calculadora de ROI y Costos Operativos.</p>
            <p className="text-sm text-blue-500 mt-4">Tip: Usa el Asesor IA para estimar costos mientras tanto.</p>
          </div>
        );
      case 'ADVISOR':
        return <Advisor batches={batches} waterLogs={waterLogs} />;
      default:
        return <Dashboard batches={batches} logs={waterLogs} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setView={setView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      <main className="flex-1 overflow-auto w-full relative">
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

// Simple Dashboard Component
const Dashboard = ({ batches, logs }: { batches: Batch[], logs: WaterQualityLog[] }) => {
  const totalFish = batches.reduce((acc, b) => acc + b.currentQuantity, 0);
  const totalBiomass = batches.reduce((acc, b) => acc + ((b.currentQuantity * b.averageWeight) / 1000), 0).toFixed(1);
  const activeTanks = new Set(batches.map(b => b.tankId)).size;

  const pieData = batches.map(b => ({
      name: b.name,
      value: (b.currentQuantity * b.averageWeight) / 1000
  }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Resumen del Proyecto</h2>
        <p className="text-slate-500">Visión general de la granja piscícola.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Población Total</p>
          <h3 className="text-3xl font-bold text-slate-800">{totalFish.toLocaleString()} <span className="text-sm font-normal text-slate-400">peces</span></h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Biomasa Estimada</p>
          <h3 className="text-3xl font-bold text-blue-600">{totalBiomass} <span className="text-sm font-normal text-slate-400">kg</span></h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Tanques Activos</p>
          <h3 className="text-3xl font-bold text-green-600">{activeTanks}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-bold mb-4 text-slate-700">Distribución de Biomasa</h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-6 rounded-xl shadow-lg text-white">
              <h3 className="text-xl font-bold mb-2">Consejo del Día</h3>
              <p className="opacity-90 leading-relaxed">
                  Recuerda que la alimentación es el costo más alto (aprox 60-70%). 
                  Monitorea el oxígeno antes de la primera alimentación del día. 
                  Si el oxígeno está bajo {'(<3mg/L)'}, los peces no comerán y desperdiciarás alimento.
              </p>
              <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                  <span className="text-sm opacity-75">Fuente: Mejores Prácticas Tilapia</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default App;