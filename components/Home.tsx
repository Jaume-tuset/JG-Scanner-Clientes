import React from 'react';

interface HomeProps {
  onOpenCatalogo: () => void;
  onOpenAnexo: () => void;
  onOpenTarifa: () => void;  // Nueva prop añadida
  onOpenScanner: () => void;
}

export const Home: React.FC<HomeProps> = ({
  onOpenCatalogo,
  onOpenAnexo,
  onOpenTarifa,  // Nueva prop
  onOpenScanner,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6 py-8">
      {/* Contenedor de catálogo / anexo / tarifa */}
      <div className="w-full max-w-xs flex flex-col gap-4">
        <button
          onClick={onOpenCatalogo}
          className="w-full py-3 rounded-2xl border border-blue-200 bg-white text-blue-700 font-semibold text-sm
                     shadow-sm active:scale-95 transition-all duration-150
                     hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
        >
          Catálogo
        </button>

        <button
          onClick={onOpenTarifa}  // Nuevo botón Tarifa
          className="w-full py-3 rounded-2xl border border-green-200 bg-white text-green-700 font-semibold text-sm
                     shadow-sm active:scale-95 transition-all duration-150
                     hover:bg-green-50 focus:bg-green-50 focus:outline-none"
        >
          Tarifa
        </button>

        <button
          onClick={onOpenAnexo}
          className="w-full py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 font-semibold text-sm
                     shadow-sm active:scale-95 transition-all duration-150
                     hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
        >
          Anexo
        </button>
      </div>
    </div>
  );
};

export default Home;
