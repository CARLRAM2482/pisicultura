import React from 'react';
import { LayoutDashboard, Fish, Droplets, DollarSign, Bot, Menu, X } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'DASHBOARD', label: 'Tablero Principal', icon: LayoutDashboard },
    { id: 'BATCHES', label: 'Gestión de Lotes', icon: Fish },
    { id: 'WATER', label: 'Calidad de Agua', icon: Droplets },
    { id: 'FINANCE', label: 'Finanzas', icon: DollarSign },
    { id: 'ADVISOR', label: 'Asesor IA', icon: Bot },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-blue-600 text-white rounded-lg shadow-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Fish className="text-cyan-400" />
            Tilapia<span className="text-cyan-400">Master</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Gestión Inteligente</p>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id as ViewState);
                if (window.innerWidth < 768) setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${currentView === item.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Sistema en línea
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;