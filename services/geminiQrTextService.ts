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

Puede ser vCard, MeCard, JSON o texto libre (por ejemplo un bloque de datos de contacto o una URL con parámetros).

Devuélveme SIEMPRE un JSON con exactamente estos campos:
- nombres          (nombre de pila de la persona)
- apellidos        (apellidos de la persona)
- empresa          (nombre de la empresa)
- cargo            (puesto de la persona)
- telefono         (teléfono principal)
- telefono2        (segundo teléfono si lo hay)
- correo           (email principal)
- web              (URL de la web de la empresa o persona)
- direccion        (calle y número)
- codigoPostal     (código postal)
- localidad        (población / barrio)
- ciudad           (ciudad / municipio)
- estado           (provincia / estado / región)
- cif              (NIF/CIF/NIE)
- comentarios      (texto libre que no encaja claro en los campos anteriores)

REGLAS MUY ESTRICTAS (NO LAS INCUMPLES NUNCA):
- SOLO rellenes campos si el dato está claramente presente en el texto del QR o en sus parámetros, por ejemplo:
  - vCard: N:, FN:, ORG:, TITLE:, TEL:, EMAIL:, ADR:
  - texto tipo "Empresa: ACME, Tel: 123..., Email: info@..., Web: https://..."
  - URL con parámetros claros como ?name=...&email=...&phone=...&company=...
- Puedes separar nombre y apellidos si vienen juntos en un solo campo tipo "Juan Pérez García"
  (primer token = nombres, resto = apellidos), pero NO inventes partes que falten.
- codigoPostal: solo si ves un CP claro.
- localidad / ciudad / estado: solo si están indicados de forma clara; si no, deja esos campos vacíos.
- cif: incluye NIF/CIF/NIE solo si aparece explícitamente.
- NO deduzcas ni infieras datos a partir de nombres de dominio, texto de marketing o contexto.
- Si NO estás 100% seguro de un dato, ese campo debe ser "".
- Si el contenido NO es claramente estructurado, deja TODOS los campos vacíos y pon el texto original en "comentarios".
- Si solo hay una URL o identificador, deja TODOS los campos vacíos y pon EXACTAMENTE ese texto en "comentarios".
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
          web: { type: Type.STRING },
          direccion: { type: Type.STRING },
          codigoPostal: { type: Type.STRING },
          localidad: { type: Type.STRING },
          ciudad: { type: Type.STRING },
          estado: { type: Type.STRING },
          cif: { type: Type.STRING },
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
    web: raw.web || '',
    direccion: raw.direccion || '',
    codigoPostal: raw.codigoPostal || '',
    localidad: raw.localidad || '',
    ciudad: raw.ciudad || '',
    estado: raw.estado || '',
    cif: raw.cif || '',
    photoBase64: '',
    photoBackBase64: '',
    scanType: 'qr',
    comentarios: raw.comentarios || '',
  };

  return normalized;
};
