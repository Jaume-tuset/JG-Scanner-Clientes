import React from 'react';
import { Client, ViewType } from '../types';

interface HomeViewProps {
  clients: Client[];
  onStartScan: (type: 'tarjeta' | 'qr') => void;
  onViewClient: (client: Client) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ clients, onStartScan, onViewClient }) => {
  const recentClients = [...clients].sort((a, b) => b.createdAt - a.createdAt).slice(0, 2);

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-3xl font-black text-gray-900">Hola de nuevo,</h2>
        <p className="text-gray-500 font-medium">¿Qué deseas gestionar hoy?</p>
      </div>

      <div className="grid gap-4">
        <button 
          onClick={() => onStartScan('tarjeta')}
          className="bg-blue-600 p-6 rounded-[2rem] text-left text-white flex items-center justify-between shadow-lg shadow-blue-200 active:scale-95 transition-all overflow-hidden relative"
        >
          <div className="space-y-1 relative z-10">
            <div className="bg-white/20 p-2 rounded-xl w-fit mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="14" x="3" y="5" rx="2"/><path d="M11 9h2"/><path d="M11 13h2"/><path d="M7 9h.01"/><path d="M7 13h.01"/></svg>
            </div>
            <h3 className="text-xl font-bold">Escanear Tarjeta</h3>
            <p className="text-blue-100 text-xs font-medium">Registro automático de datos</p>
          </div>
          <svg className="absolute right-[-10%] bottom-[-10%] opacity-10 w-40 h-40" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </button>

        <button 
          onClick={() => onStartScan('qr')}
          className="bg-white border border-gray-100 p-6 rounded-[2rem] text-left text-gray-800 flex items-center justify-between shadow-sm active:scale-95 transition-all overflow-hidden relative"
        >
          <div className="space-y-1 relative z-10">
            <div className="bg-blue-50 text-blue-600 p-2 rounded-xl w-fit mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16h.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-.01"/></svg>
            </div>
            <h3 className="text-xl font-bold">Escanear QR</h3>
            <p className="text-gray-400 text-xs font-medium">Acceso rápido mediante código</p>
          </div>
          <div className="absolute right-[5%] top-[5%] opacity-[0.03] w-32 h-32">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h2v2h-2v-2zm-3 0h2v2h-2v-2zm3 3h2v2h-2v-2zm-3 0h2v2h-2v-2zm3-3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h2v2h-2v-2zm-3 0h2v2h-2v-2z"/></svg>
          </div>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-sm text-gray-800 uppercase tracking-widest">Actividad de Hoy</h4>
          <button className="text-blue-600 text-xs font-bold">Ver todo</button>
        </div>

        <div className="bg-white rounded-3xl p-6 flex items-center justify-between shadow-sm border border-gray-50">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Clientes Registrados</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-gray-900">{clients.length}</span>
              <span className="text-green-500 text-xs font-bold mb-1 flex items-center">
                <svg className="mr-0.5" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                12%
              </span>
            </div>
          </div>
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          </div>
        </div>

        <div className="space-y-2">
          {recentClients.map(client => (
            <div 
              key={client.id}
              onClick={() => onViewClient(client)}
              className="bg-white p-4 rounded-2xl border border-gray-50 flex items-center justify-between group active:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
                <div>
                  <h5 className="font-bold text-gray-900">{client.nombres} {client.apellidos}</h5>
                  <p className="text-[10px] font-medium text-gray-400">Escaneado vía {client.scanType?.toUpperCase() || 'TARJETA'} • 10:45 AM</p>
                </div>
              </div>
              <div className="text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" /></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeView;
