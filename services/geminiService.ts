import { GoogleGenAI, Modality } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

// ======================================================================
// CLIENTE DO GEMINI — SEMPRE USAR VITE_GEMINI_API_KEY
// ======================================================================
const getAiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ API KEY NÃO ENCONTRADA");
    throw new Error("API key not found. The application is not configured correctly.");
  }

  try {
    return new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error("❌ ERRO AO INICIALIZAR GOOGLE GENAI", err);
    throw err;
  }
};

// ======================================================================
// 1) GERAR TEXTO ADAPTADO — Tradutor Partiu085
// ======================================================================
export const generateAdaptedText = async (userInput: string, footer?: string): Promise<string> => {
  try {
    const ai = getAiClient();

    const fullPrompt = SYSTEM_PROMPT.replace("{{ texto_usuario }}", userInput);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }]
    });

    return response.text || "";
  } catch (error) {
    console.error("❌ ERRO NA FUNÇÃO generateAdaptedText:", error);
    throw new Error("Failed to generate text from Gemini API.");
  }
};

// ======================================================================
// 2) PROCESSAR IMAGEM + PROMPT — Aba 'Imagem ✨'
// ======================================================================
export const processImageWithPrompt = async (
  image: File,
  prompt: string
): Promise<string> => {
  try {
    const ai = getAiClient();

    // Lê imagem e converte para base64
    const fileBase64 = await fileToBase64(image);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: image.type,
                data: fileBase64.split(",")[1] // remove header do Base64
              }
            }
          ]
        }
      ]
    });

    return response.text || "";
  } catch (error) {
    console.error("❌ ERRO NA FUNÇÃO processImageWithPrompt:", error);
    return "";
  }
};

// ======================================================================
// Função auxiliar — converte File → Base64 (necessária pro Vite)
// ======================================================================
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
};
