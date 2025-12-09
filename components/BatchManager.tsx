import React, { useState } from 'react';
import { Batch, FishStage } from '../types';
import { Plus, Trash2, TrendingUp, Scale } from 'lucide-react';

interface BatchManagerProps {
  batches: Batch[];
  setBatches: React.Dispatch<React.SetStateAction<Batch[]>>;
}

const BatchManager: React.FC<BatchManagerProps> = ({ batches, setBatches }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBatch, setNewBatch] = useState<Partial<Batch>>({
    name: '',
    tankId: 'Tanque 1',
    initialQuantity: 1000,
    averageWeight: 5, // grams
    stage: FishStage.ALEVINAJE
  });

  const handleAddBatch = () => {
    if (!newBatch.name) return;
    const batch: Batch = {
      id: Date.now().toString(),
      name: newBatch.name,
      tankId: newBatch.tankId || 'Tanque 1',
      startDate: new Date().toISOString().split('T')[0],
      initialQuantity: newBatch.initialQuantity || 0,
      currentQuantity: newBatch.initialQuantity || 0, // Assumption
      averageWeight: newBatch.averageWeight || 5,
      stage: newBatch.stage || FishStage.ALEVINAJE
    };
    setBatches([...batches, batch]);
    setIsModalOpen(false);
    setNewBatch({
        name: '',
        tankId: 'Tanque 1',
        initialQuantity: 1000,
        averageWeight: 5,
        stage: FishStage.ALEVINAJE
    });
  };

  const deleteBatch = (id: string) => {
    setBatches(batches.filter(b => b.id !== id));
  };

  const calculateBiomass = (batch: Batch) => {
    // Biomass in Kg
    return ((batch.currentQuantity * batch.averageWeight) / 1000).toFixed(2);
  };

  const estimateFeed = (batch: Batch) => {
    // Very simplified feeding table logic
    // Usually % of biomass based on weight
    let percentage = 0.05; // 5% for fry
    if (batch.averageWeight > 50) percentage = 0.03;
    if (batch.averageWeight > 250) percentage = 0.015;
    
    const biomass = (batch.currentQuantity * batch.averageWeight) / 1000;
    return (biomass * percentage).toFixed(2);
  };

  return (
    <div className="space-y-6">
       <header className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-3xl font-bold text-slate-800">Lotes de Producción</h2>
            <p className="text-slate-500">Gestión de siembra, biomasa y alimentación.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
            <Plus size={20} /> Nuevo Lote
        </button>
      </header>

      {/* Grid of Batches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map(batch => (
            <div key={batch.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition">
                <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="inline-block px-2 py-1 bg-cyan-100 text-cyan-800 text-xs font-bold rounded-full mb-1">
                                {batch.stage}
                            </span>
                            <h3 className="text-xl font-bold text-slate-800">{batch.name}</h3>
                            <p className="text-sm text-slate-500">{batch.tankId} • Sembrado: {batch.startDate}</p>
                        </div>
                        <button onClick={() => deleteBatch(batch.id)} className="text-slate-400 hover:text-red-500">
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-bold mb-1">
                                <Scale size={14} /> Biomasa
                            </div>
                            <div className="text-lg font-bold text-slate-700">{calculateBiomass(batch)} kg</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-bold mb-1">
                                <TrendingUp size={14} /> Peso Prom.
                            </div>
                            <div className="text-lg font-bold text-slate-700">{batch.averageWeight} g</div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">Alimento recomendado (hoy):</span>
                            <span className="font-bold text-blue-600">{estimateFeed(batch)} kg</span>
                        </div>
                         <div className="flex justify-between items-center text-sm mt-1">
                            <span className="text-slate-600">Población:</span>
                            <span className="font-bold text-slate-800">{batch.currentQuantity} peces</span>
                        </div>
                    </div>
                </div>
            </div>
        ))}

        {batches.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                <FishStageIcon />
                <p className="mt-2">No hay lotes activos. Inicia un nuevo proyecto.</p>
            </div>
        )}
      </div>

      {/* Modal for New Batch */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl max-w-md w-full p-6">
                  <h3 className="text-xl font-bold mb-4">Iniciar Nuevo Lote</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1">Nombre del Lote</label>
                          <input 
                            type="text" 
                            className="w-full border rounded-lg p-2"
                            value={newBatch.name}
                            onChange={e => setNewBatch({...newBatch, name: e.target.value})}
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Cantidad Inicial</label>
                            <input 
                                type="number" 
                                className="w-full border rounded-lg p-2"
                                value={newBatch.initialQuantity}
                                onChange={e => setNewBatch({...newBatch, initialQuantity: parseInt(e.target.value)})}
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-medium mb-1">Peso Promedio (g)</label>
                            <input 
                                type="number" 
                                className="w-full border rounded-lg p-2"
                                value={newBatch.averageWeight}
                                onChange={e => setNewBatch({...newBatch, averageWeight: parseFloat(e.target.value)})}
                            />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end mt-6">
                          <button 
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                          >
                              Cancelar
                          </button>
                          <button 
                            onClick={handleAddBatch}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                              Crear Lote
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const FishStageIcon = () => (
    <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
)

export default BatchManager;