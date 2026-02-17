import { Capacitor } from '@capacitor/core';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';

// Pide permisos de cámara
export const checkQrPermission = async (): Promise<boolean> => {
  if (Capacitor.getPlatform() === 'web') {
    alert('El escáner QR solo está disponible en la app móvil.');
    return false;
  }

  try {
    const perm = await BarcodeScanner.requestPermissions();

    // valores típicos: 'granted' | 'denied' | 'limited'
    if (perm.camera === 'granted' || perm.camera === 'limited') {
      return true;
    }

    alert('Sin permiso de cámara para escanear QR.');
    return false;
  } catch (e) {
    console.error('checkQrPermission ERROR', e);
    alert('Error al solicitar permisos de cámara.');
    return false;
  }
};

// Escaneo QR: abre cámara, escanea y devuelve el texto del primer QR encontrado
export const startQrScan = async (): Promise<string | null> => {
  if (Capacitor.getPlatform() === 'web') {
    alert('El escáner QR solo está disponible en la app móvil.');
    return null;
  }

  try {
    console.log('MLKIT >>> startQrScan');

    const ok = await checkQrPermission();
    console.log('MLKIT >>> permission', ok);
    if (!ok) return null;

    // Abre UI nativa de cámara y escanea códigos de tipo QR
    const { barcodes } = await BarcodeScanner.scan({
      formats: [BarcodeFormat.QrCode], 
      autoZoom: true,
    });
    console.log('MLKIT >>> barcodes', barcodes);

    if (!barcodes || barcodes.length === 0) {
      console.log('MLKIT >>> no barcodes');
      return null;
    }

    // Tomamos el primer código detectado
    const first = barcodes[0];
    const value = first.rawValue || first.displayValue || '';
    console.log('MLKIT >>> value', value);

    if (!value) return null;
    return value;
  } catch (e) {
    console.error('startQrScan ERROR', e);
    alert('Error al escanear el QR.');
    return null;
  }
};
