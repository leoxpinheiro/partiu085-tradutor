import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "../constants";

const getAiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API key not found. The application is not configured correctly.");
  }

  return new GoogleGenerativeAI(apiKey);
};

export const generateAdaptedText = async (userInput: string, footer?: string) => {
  try {
    const genAI = getAiClient();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const fullPrompt = SYSTEM_PROMPT.replace("{{ texto_usuario }}", userInput);

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Gemini returned empty response.");
    }

    return text;
  } catch (err) {
    console.error("Gemini Error:", err);
    throw new Error("Failed to generate text from Gemini API.");
  }
};
