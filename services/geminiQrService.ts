import { GoogleGenAI, Type } from '@google/genai';
import { ScanResult } from '../types';

const normalizeEmail = (email: string): string => {
  if (!email) return '';

  let e = email.toLowerCase().trim();
  e = e.replace('htomail.com', 'hotmail.com');
  e = e.replace('gamil.com', 'gmail.com');

  e = e
    .replace(/á|à|â|ä/g, 'a')
    .replace(/é|è|ê|ë/g, 'e')
    .replace(/í|ì|î|ï/g, 'i')
    .replace(/ó|ò|ô|ö/g, 'o')
    .replace(/ú|ù|û|ü/g, 'u')
    .replace(/ç/g, 'c');

  return e;
};

export const extractClientDataFromQrImage = async (
  frontBase64: string
): Promise<ScanResult | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error('API Key is missing');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    En esta imagen hay un CÓDIGO QR (posiblemente junto a una tarjeta o texto).

    1) Primero, lee el contenido del QR de la imagen.
    2) Si el QR contiene datos de contacto (por ejemplo en formato vCard, MeCard, JSON o texto estructurado),
       interpreta esos datos y mapea a los siguientes campos.

    Devuélveme SIEMPRE un JSON con exactamente estos campos:
    - nombres
    - apellidos
    - empresa
    - cargo
    - telefono
    - telefono2
    - correo
    - dni
    - direccion
    - poblacion
    - ciudad
    - estado
    - comentarios

    Reglas importantes:
    - No devuelvas null en ningún campo, solo texto o "".
    - Si solo hay un teléfono, ponlo en "telefono" y deja "telefono2" como "".
    - Si el QR solo contiene una URL o un identificador, deja todos los campos vacíos
      excepto "comentarios", donde pondrás exactamente el texto del QR.
    - Para el correo, lee literalmente lo que veas en el QR (o su contenido),
      y deja el campo vacío si no hay correo claro.
  `;

  try {
    const parts: any[] = [
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: frontBase64,
        },
      },
      { text: prompt },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nombres: { type: Type.STRING },
            apellidos: { type: Type.STRING },
            empresa: { type: Type.STRING },
            cargo: { type: Type.STRING },
            telefono: { type: Type.STRING },
            telefono2: { type: Type.STRING },
            correo: { type: Type.STRING },
            dni: { type: Type.STRING },
            direccion: { type: Type.STRING },
            poblacion: { type: Type.STRING },
            ciudad: { type: Type.STRING },
            estado: { type: Type.STRING },
            comentarios: { type: Type.STRING },
          },
        },
      },
    });

    const text = response.text;
    if (!text) return null;

    const raw = JSON.parse(text) as any;

   const normalized: ScanResult = {
    nombres: raw.nombres || '',
    apellidos: raw.apellidos || '',
    empresa: raw.empresa || '',
    cargo: raw.cargo || '',
    telefono: raw.telefono || '',
    telefono2: raw.telefono2 || '',
    correo: normalizeEmail(raw.correo || ''),
    dni: raw.dni || '',
    direccion: raw.direccion || '',
    poblacion: raw.poblacion || '',
    ciudad: raw.ciudad || '',
    estado: raw.estado || '',
    photoBase64: '',          
    photoBackBase64: '',     
    scanType: 'qr',
    comentarios: raw.comentarios || '',
    };

    return normalized;
  } catch (error) {
    console.error('Error extracting QR data:', error);
    return null;
  }
};
