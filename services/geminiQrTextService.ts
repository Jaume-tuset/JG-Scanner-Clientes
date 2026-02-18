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

export const extractClientDataFromQrText = async (
  qrText: string
): Promise<ScanResult | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error('API Key is missing');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Te paso el CONTENIDO EXACTO de un código QR (texto plano):

---
${qrText}
---

Puede ser vCard, MeCard, JSON o texto libre.

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

REGLAS MUY ESTRICTAS (NO LAS INCUMPLES NUNCA):
- SOLO rellenes campos si el dato está claramente presente y etiquetado
  (por ejemplo claves vCard como N:, FN:, ORG:, TEL:, EMAIL:, ADR:
   o claves JSON como "name", "company", "phone", "email", etc.).
- NO deduzcas ni infieras datos a partir de frases, nombres de dominio,
  texto de marketing, ni nada que no sea un campo explícito.
- Si NO estás 100% seguro de un dato, ese campo debe ser "".
- Si el contenido NO parece una vCard/MeCard/JSON clara, deja TODOS los campos vacíos
  excepto "comentarios".
- Si solo contiene una URL, un identificador o texto sin estructura,
  deja TODOS los campos vacíos y pon EXACTAMENTE el texto original del QR en "comentarios".
- NO inventes, NO completes, NO corrijas datos que no estén literal en el texto.

Devuelve SOLO el JSON, sin texto adicional.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ text: prompt }],
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
};
