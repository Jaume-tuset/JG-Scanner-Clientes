import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[200] overflow-hidden">
      <div className="animate-logo-appear flex flex-col items-center">
        <div className="w-80 h-80 rounded-[3.5rem] flex items-center justify-center shadow-[0_0_60px_rgba(0,0,0,0.45)] mb-10 bg-black">
          <img
            src="/images/Logo2026Grande.png"
            alt="JG Señalización"
            className="w-70 h-70 object-contain"
          />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-24 text-center text-gray-700 text-[10px] font-black tracking-[0.5em] uppercase animate-pulse">
        Bienvenidos a METALICAS
      <br />
      JULIO GARCIA
      </div>


      <style>{`
        @keyframes logoAppear {
          0% { transform: scale(0.3); opacity: 0; filter: blur(20px); }
          60% { transform: scale(1.15); opacity: 1; filter: blur(0); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes widthGrow {
          from { width: 0; }
          to { width: 64px; }
        }
        .animate-logo-appear {
          animation: logoAppear 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-width-grow {
          animation: widthGrow 2s 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
