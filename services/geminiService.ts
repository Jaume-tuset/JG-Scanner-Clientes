import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult } from "../types";

const normalizeEmail = (email: string): string => {
  if (!email) return "";

  let e = email.toLowerCase().trim();

  e = e.replace("htomail.com", "hotmail.com");
  e = e.replace("gamil.com", "gmail.com");

  e = e
    .replace(/á|à|â|ä/g, "a")
    .replace(/é|è|ê|ë/g, "e")
    .replace(/í|ì|î|ï/g, "i")
    .replace(/ó|ò|ô|ö/g, "o")
    .replace(/ú|ù|û|ü/g, "u")
    .replace(/ç/g, "c");

  return e;
};

export const extractClientDataFromImage = async (
  frontBase64: string,
  backBase64?: string
): Promise<Omit<ScanResult, "photoBase64" | "photoBackBase64" | "scanType"> | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Extrae los datos de esta TARJETA o DNI. Puedes tener una o dos imágenes (frontal y reverso).

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

    Reglas importantes:
    - No devuelvas null en ningún campo, solo texto o "".
    - Si solo hay un teléfono, ponlo en "telefono" y deja "telefono2" como "".
    - Si la dirección está en varias líneas, júntala en "direccion".
    - Para el correo, lee literalmente lo que veas en la tarjeta.
  `;

  try {
    const parts: any[] = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: frontBase64,
        },
      },
    ];

    if (backBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: backBase64,
        },
      });
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
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
          },
        },
      },
    });

    const text = response.text;
    if (!text) return null;

    const raw = JSON.parse(text) as any;

    const normalized = {
      nombres: raw.nombres || "",
      apellidos: raw.apellidos || "",
      empresa: raw.empresa || "",
      cargo: raw.cargo || "",
      telefono: raw.telefono || "",
      telefono2: raw.telefono2 || "",
      correo: normalizeEmail(raw.correo || ""),
      dni: raw.dni || "",
      direccion: raw.direccion || "",
      poblacion: raw.poblacion || "",
      ciudad: raw.ciudad || "",
      estado: raw.estado || "",
      comentarios: raw.comentarios || "",
    };

    return normalized;
  } catch (error) {
    console.error("Error extracting data:", error);
    return null;
  }
};
