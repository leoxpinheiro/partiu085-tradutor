import { GoogleGenAI, Modality } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';

const getAiClient = () => {
   const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("API key not found. The application is not configured correctly.");
    }
    return new GoogleGenAI({ apiKey });
}

export const generateAdaptedText = async (userInput: string, footer?: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const fullPrompt = SYSTEM_PROMPT.replace('{{ texto_usuario }}', userInput);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
    });
    
    if (!response.text) {
        throw new Error("Empty response from Gemini API.");
    }

    let resultText = response.text.trim();
    if (footer && footer.trim()) {
        resultText += `\n\n${footer.trim()}`;
    }

    return resultText;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && (error.message.includes('API key') || error.message.includes('403') || error.message.includes('401'))) {
        throw new Error("There is an issue with the API configuration. Please try again later.");
    }
    throw new Error("Failed to generate text from Gemini API.");
  }
};

export const processImageWithPrompt = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const ai = getAiClient();
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        
        throw new Error("No image was returned from the API.");

    } catch (error) {
        console.error("Error calling Gemini Image API:", error);
        if (error instanceof Error && (error.message.includes('API key') || error.message.includes('403') || error.message.includes('401'))) {
            throw new Error("There is an issue with the API configuration. Please try again later.");
        }
        throw new Error("Failed to process image with Gemini API.");
    }
};