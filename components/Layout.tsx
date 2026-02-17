import React from 'react';
import { ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: ViewType;
  setActiveTab: (tab: ViewType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  { 
      id: 'home', 
      label: 'Inicio', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <line x1="3" x2="21" y1="9" y2="9" />
          <line x1="9" x2="9" y1="21" y2="9" />
        </svg>
      )
    },
    { 
      id: 'scanner', 
      label: 'Escáner', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <line x1="3" x2="21" y1="9" y2="9" />
          <line x1="9" x2="9" y1="21" y2="9" />
        </svg>
      )
    },
    { 
      id: 'form', 
      label: 'Nuevo', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      )
    },
    { 
      id: 'clients', 
      label: 'Clientes', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    }
  ];

  // Oculta nav en splash y detalles
  const hideNav =
    activeTab === 'splash' ||
    activeTab === 'details' ||
    activeTab === 'scanner';

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 overflow-hidden relative shadow-xl">
      {/* Header */}
      {activeTab !== 'splash' &&
        activeTab !== 'scanner' &&
        activeTab !== 'details' && (
          <header className="bg-white px-6 py-5 flex items-center justify-between z-10 border-b border-gray-100 shrink-0">
            <button className="text-blue-700 active:scale-90 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <img
                src="/images/Logo2026Pequeno_negro.png"
                alt="JG Señalización"
                className="w-50 h-12 object-contain"
              />
            </div>
            <button className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
              <svg width="20" height="20" fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>
          </header>
        )}

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto no-scrollbar ${!hideNav ? 'pb-40' : ''}`}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 flex justify-around py-4 px-4 z-[150] rounded-t-[2.5rem] shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                // Si ya estamos en esa pestaña, no hagas nada
                if (activeTab === item.id) return;
                setActiveTab(item.id);
              }}
              className={`flex flex-col items-center gap-1.5 transition-all flex-1 py-1 ${
                activeTab === item.id ||
                (activeTab === 'details' && item.id === 'clients')
                  ? 'text-blue-600'
                  : 'text-gray-300'
              }`}
            >
              <div
                className={`transition-transform duration-300 ${
                  activeTab === item.id ? 'scale-110' : ''
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-[0.15em] transition-opacity ${
                  activeTab === item.id ? 'opacity-100' : 'opacity-60'
                }`}
              >
                {item.label}
              </span>
            </button>

          ))}
        </nav>
      )}
    </div>
  );
};

export default Layout;
