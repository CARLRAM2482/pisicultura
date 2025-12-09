import React, { useState } from 'react';
import { Expense, ExpenseCategory } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { DollarSign, Plus, Trash2, TrendingUp, Wallet, Zap, Activity } from 'lucide-react';

interface FinanceManagerProps {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
}

const CATEGORIES: { id: ExpenseCategory; label: string; color: string }[] = [
  { id: 'Feed', label: 'Alimento', color: '#3b82f6' }, // Blue
  { id: 'Energy', label: 'Energía', color: '#f59e0b' }, // Amber
  { id: 'Labor', label: 'Mano de Obra', color: '#10b981' }, // Emerald
  { id: 'Fry', label: 'Semilla/Alevines', color: '#8b5cf6' }, // Violet
  { id: 'Maintenance', label: 'Mantenimiento', color: '#64748b' }, // Slate
  { id: 'Other', label: 'Otros', color: '#94a3b8' }, // Gray
];

const FinanceManager: React.FC<FinanceManagerProps> = ({ expenses, addExpense, deleteExpense }) => {
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    category: 'Feed',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.description) return;

    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category as ExpenseCategory || 'Other',
      amount: Number(newExpense.amount),
      date: newExpense.date || new Date().toISOString().split('T')[0],
      description: newExpense.description
    };

    addExpense(expense);
    setNewExpense({
      category: 'Feed',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  // Calculations
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  
  const expensesByCategory = CATEGORIES.map(cat => ({
    name: cat.label,
    value: expenses.filter(e => e.category === cat.id).reduce((sum, e) => sum + e.amount, 0),
    color: cat.color
  })).filter(item => item.value > 0);

  const feedCost = expensesByCategory.find(c => c.name === 'Alimento')?.value || 0;
  const feedPercentage = totalExpenses > 0 ? ((feedCost / totalExpenses) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Finanzas del Proyecto</h2>
        <p className="text-slate-500">Control de costos operativos e inversiones.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Gasto Total</p>
            <h3 className="text-2xl font-bold text-slate-800">${totalExpenses.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Costo Alimento</p>
            <h3 className="text-2xl font-bold text-slate-800">${feedCost.toLocaleString()}</h3>
            <span className="text-xs text-slate-400">{feedPercentage}% del total</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Registros</p>
            <h3 className="text-2xl font-bold text-slate-800">{expenses.length}</h3>
            <span className="text-xs text-slate-400">Transacciones</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Plus className="text-blue-500" /> Registrar Gasto
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
              <select
                value={newExpense.category}
                onChange={e => setNewExpense({...newExpense, category: e.target.value as ExpenseCategory})}
                className="w-full border-gray-300 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Monto</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount || ''}
                  onChange={e => setNewExpense({...newExpense, amount: parseFloat(e.target.value)})}
                  className="w-full border-gray-300 border rounded-lg p-2 pl-7 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                className="w-full border-gray-300 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <input
                type="text"
                value={newExpense.description}
                onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                className="w-full border-gray-300 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ej. 10 sacos inicio 45%"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Guardar Gasto
            </button>
          </form>
        </div>

        {/* Charts & List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
            <h3 className="text-lg font-bold mb-4">Distribución de Costos</h3>
            {expenses.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No hay datos suficientes para graficar.
              </div>
            )}
          </div>

          {/* List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-700">Historial Reciente</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3">Fecha</th>
                    <th className="px-6 py-3">Categoría</th>
                    <th className="px-6 py-3">Descripción</th>
                    <th className="px-6 py-3 text-right">Monto</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice().reverse().map((expense) => (
                    <tr key={expense.id} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-6 py-4">{expense.date}</td>
                      <td className="px-6 py-4">
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: CATEGORIES.find(c => c.id === expense.category)?.color }}
                        >
                          {CATEGORIES.find(c => c.id === expense.category)?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{expense.description}</td>
                      <td className="px-6 py-4 text-right font-bold text-slate-700">
                        ${expense.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => deleteExpense(expense.id)}
                          className="text-slate-400 hover:text-red-500 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        No hay gastos registrados aún.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceManager;