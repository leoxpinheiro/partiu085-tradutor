import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

const getAiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API key not found. The application is not configured correctly.");
  }

  return new GoogleGenAI({ apiKey });
};

export const generateAdaptedText = async (userInput: string, footer?: string) => {
  try {
    const ai = getAiClient();

    const fullPrompt = SYSTEM_PROMPT.replace('{{ texto_usuario }}', userInput);

    const response = await ai.models.generateText({
      model: "gemini-2.0-flash",
      text: fullPrompt
    });

    if (!response.outputText) {
      throw new Error("Gemini returned no text.");
    }

    return response.outputText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate text from Gemini API.");
  }
};
