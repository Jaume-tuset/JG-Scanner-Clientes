import React, { useState, useRef } from 'react';
import { extractClientDataFromImage } from '../services/geminiService';
import { ScanResult } from '../types';
import { startQrScan } from '../services/qrService';
import { Capacitor } from '@capacitor/core';
import { takePhotoBase64 } from '../services/cameraService';
import { extractClientDataFromQrText } from '../services/geminiQrTextService';
import { extractClientDataFromQrImage } from '../services/geminiQrService';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface ScannerViewProps {
  onDataExtracted: (data: ScanResult) => void;
  onCancel: () => void;
  initialType?: 'tarjeta' | 'qr';
}

const ScannerView: React.FC<ScannerViewProps> = ({
  onDataExtracted,
  onCancel,
  initialType = 'tarjeta',
}) => {
  const [loading, setLoading] = useState(false);
  const [scanType, setScanType] = useState<'tarjeta' | 'qr'>(initialType as 'tarjeta' | 'qr');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);

  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState<'front' | 'askBack' | 'back' | 'done'>('front');

  const processBase64Images = async (frontDataUrl: string, backDataUrl?: string | null) => {
    const frontBase64 = frontDataUrl.split(',')[1];
    const backBase64 = backDataUrl ? backDataUrl.split(',')[1] : undefined;
    setLoading(true);

    try {
      const result = await extractClientDataFromImage(frontBase64, backBase64);
      console.log('OCR result >>>', result);
      onDataExtracted({
        ...(result || {}),
        photoBase64: frontDataUrl,
        photoBackBase64: backDataUrl || '',
        scanType,
      } as ScanResult);
    } catch (err) {
      console.error('OCR error >>>', err);
      onDataExtracted({
        nombres: '',
        apellidos: '',
        empresa: '',
        cargo: '',
        telefono: '',
        telefono2: '',
        correo: '',
        web: '',
        direccion: '',
        codigoPostal: '',
        localidad: '',
        ciudad: '',
        estado: '',
        cif: '',
        comentarios: '',
        photoBase64: frontDataUrl,
        photoBackBase64: backDataUrl || '',
        scanType,
      } as ScanResult);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setFrontImage(dataUrl);
      setScanStep('askBack');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleTakePhoto = async () => {
    if (!Capacitor.isNativePlatform()) {
      fileInputRef.current?.click();
      return;
    }

    const dataUrl = await takePhotoBase64();
    if (!dataUrl) return;

    if (scanStep === 'front') {
      setFrontImage(dataUrl);
      setScanStep('askBack');
    } else if (scanStep === 'back') {
      setBackImage(dataUrl);
      setScanStep('done');
    }
  };

  const handleFinishScan = async () => {
    if (!frontImage) return;
    await processBase64Images(frontImage, backImage);
  };

  // Procesar QR desde una foto (dataUrl de tarjeta con QR)
  const processQrFromImageDataUrl = async (dataUrl: string) => {
    const base64 = dataUrl.split(',')[1] || '';
    setLoading(true);

    try {
      let parsed: ScanResult | null = null;

      const fromImage = await extractClientDataFromQrImage(base64);
      parsed = fromImage;

      if (!parsed) {
        const content = await startQrScan();
        console.log('RESULTADO startQrScan >>>', content);

        if (content) {
          parsed = await extractClientDataFromQrText(content);
        }
      }

      if (parsed) {
        onDataExtracted({
          ...parsed,
          photoBase64: dataUrl,
          photoBackBase64: '',
          scanType: 'qr',
        } as ScanResult);
      } else {
        onDataExtracted({
          nombres: '',
          apellidos: '',
          empresa: '',
          cargo: '',
          telefono: '',
          telefono2: '',
          correo: '',
          web: '',
          direccion: '',
          codigoPostal: '',
          localidad: '',
          ciudad: '',
          estado: '',
          cif: '',
          photoBase64: dataUrl,
          photoBackBase64: '',
          scanType: 'qr',
          comentarios: 'QR vacío o no legible',
        } as ScanResult);
      }
    } catch (e) {
      console.error('Error procesando QR desde foto >>>', e);
      onDataExtracted({
        nombres: '',
        apellidos: '',
        empresa: '',
        cargo: '',
        telefono: '',
        telefono2: '',
        correo: '',
        web: '',
        direccion: '',
        codigoPostal: '',
        localidad: '',
        ciudad: '',
        estado: '',
        cif: '',
        photoBase64: dataUrl,
        photoBackBase64: '',
        scanType: 'qr',
        comentarios: 'Error procesando QR',
      } as ScanResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col h-screen overflow-hidden animate-fade-in transition-colors duration-300 ${
        isScanningActive ? 'bg-transparent' : 'bg-white'
      }`}
      style={
        isScanningActive
          ? {
              backgroundColor: 'transparent',
              background: 'transparent',
            }
          : {}
      }
    >
      {!isScanningActive && (
        <div className="px-4 py-3lec flex items-center justify-between text-gray-900 border-b border-gray-50 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <button
            onClick={onCancel}
            className="p-2 text-gray-500 active:scale-90 transition-transform"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-black tracking-tight">Escáner</h2>
          <button className="p-2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </button>
        </div>
      )}

      {!isScanningActive && (
        <div className="flex-1 flex flex-col items-center justify-start px-4 pt-4 pb-2 text-center space-y-6">
          <div className="space-y-3">
            <h3 className="text-2xl font-black text-gray-900">
              Alinee el {scanType === 'tarjeta' ? 'TARJETA' : 'QR'}
            </h3>
            <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest px-8 leading-relaxed">
              Posicione el documento dentro del marco para procesarlo automáticamente
            </p>
          </div>

          <div
            className={`relative w-full max-w-sm group h-[38vh] max-h-[230px] transition-all duration-500 ${
              isScanningActive ? 'mt-16' : 'mt-2'
            }`}
          >
            <div className="absolute inset-4 border-[3px] border-blue-600/20 rounded-[2.5rem] bg-blue-50/5"></div>
            <div className="absolute top-0 left-0 w-14 h-14 border-t-8 border-l-8 border-blue-600 rounded-tl-[2rem] shadow-[-5px_-5px_15px_rgba(37,99,235,0.2)]"></div>
            <div className="absolute top-0 right-0 w-14 h-14 border-t-8 border-r-8 border-blue-600 rounded-tr-[2rem] shadow-[5px_-5px_15px_rgba(37,99,235,0.2)]"></div>
            <div className="absolute bottom-0 left-0 w-14 h-14 border-b-8 border-l-8 border-blue-600 rounded-bl-[2rem] shadow-[-5px_5px_15px_rgba(37,99,235,0.2)]"></div>
            <div className="absolute bottom-0 right-0 w-14 h-14 border-b-8 border-r-8 border-blue-600 rounded-br-[2rem] shadow-[5px_5px_15px_rgba(37,99,235,0.2)]"></div>

            <div className="absolute left-6 right-6 h-1 bg-blue-600/80 blur-[2px] shadow-[0_0_20px_rgba(37,99,235,1)] animate-laser-scan z-10"></div>
          </div>

          {scanType === 'tarjeta' && scanStep === 'askBack' && (
            <div className="px-6 space-y-4">
              <p className="text-sm font-semibold text-gray-800">
                ¿La tarjeta tiene información por detrás?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setScanStep('back')}
                  className="flex-1 px-4 py-3 rounded-full bg-blue-600 text-white text-sm font-bold"
                >
                  Sí, hacer otra foto
                </button>
                <button
                  onClick={() => setScanStep('done')}
                  className="flex-1 px-4 py-3 rounded-full bg-gray-100 text-gray-800 text-sm font-bold"
                >
                  No, continuar
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-[110] flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <svg
                  className="animate-spin h-16 w-16 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-10"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-100"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-blue-600 uppercase">
                  AI
                </div>
              </div>
              <p className="text-blue-700 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
                Extrayendo Datos...
              </p>
            </div>
          )}
        </div>
      )}

      {!isScanningActive && (
        <div className="bg-gray-50 px-6 pt-2 pb-4 space-y-4 rounded-t-[3rem] shadow-[0_-16px_32px_rgba(0,0,0,0.02)] transition-transform">
          <div className="bg-white/80 p-1.5 rounded-[1.8rem] flex border border-gray-100 shadow-inner max-w-xs mx-auto">
            <button
              onClick={() => {
                setScanType('tarjeta');
                setFrontImage(null);
                setBackImage(null);
                setScanStep('front');
              }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-[1.5rem] transition-all duration-300 ${
                scanType === 'tarjeta' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400'
              }`}
            >
              TARJETA
            </button>
            <button
              onClick={() => {
                setScanType('qr');
                setFrontImage(null);
                setBackImage(null);
                setScanStep('front');
              }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-[1.5rem] transition-all duration-300 ${
                scanType === 'qr' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400'
              }`}
            >
              QR
            </button>
          </div>

          <div className="flex items-center justify-center px-6">
            {scanType === 'qr' ? (
              <button
                onClick={async () => {
                  try {
                    const image = await Camera.getPhoto({
                      quality: 80,
                      allowEditing: false,
                      resultType: CameraResultType.Base64,
                      source: CameraSource.Camera,
                    });

                    const dataUrl = `data:image/jpeg;base64,${image.base64String}`;
                    await processQrFromImageDataUrl(dataUrl);
                  } catch (e) {
                    console.error('Error abriendo cámara para QR >>>', e);
                  }
                }}
                className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_15px_30px_rgba(37,99,235,0.4)] border-[10px] border-white active:scale-90 transition-all"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  QR
                </span>
              </button>
            ) : scanStep === 'front' || scanStep === 'back' ? (
              <button
                onClick={handleTakePhoto}
                className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_15px_30px_rgba(37,99,235,0.4)] border-[10px] border-white active:scale-90 transition-all"
              >
                <div className="w-10 h-10 border-4 border-white rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </button>
            ) : (
              <button
                onClick={handleFinishScan}
                className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-white shadow-[0_15px_30px_rgba(22,163,74,0.4)] border-[10px] border-white active:scale-90 transition-all"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Continuar
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {isScanningActive && (
        <button
          onClick={() => {
            setIsScanningActive(false);
          }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-lg text-white px-8 py-3 rounded-full font-black text-xs tracking-widest border border-white/30"
        >
          CANCELAR ESCANEO
        </button>
      )}

      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <style>{`
        @keyframes laserScan {
          0%, 100% { top: 15%; opacity: 0; }
          10%, 90% { opacity: 1; }
          50% { top: 85%; }
        }
        .animate-laser-scan {
          animation: laserScan 2.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default ScannerView;
