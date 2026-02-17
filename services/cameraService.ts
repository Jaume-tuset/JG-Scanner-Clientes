import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export const takePhotoBase64 = async (): Promise<string | null> => {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  try {
    const image = await Camera.getPhoto({
      quality: 70,             
      width: 1600,             
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      correctOrientation: true,
    });

    if (!image || !image.dataUrl) return null;

    // dataUrl sigue siendo
    return image.dataUrl;
  } catch (e) {
    console.error('Error al hacer foto nativa', e);
    return null;
  }
};
