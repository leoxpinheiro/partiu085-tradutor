import { GoogleGenAI, Modality } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';

const getAiClient = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("API key not found. The application is not configured correctly.");
    }
    return new GoogleGenAI({ apiKey });
}

export const generateAdaptedText = async (userInput: string): Promise<string> => {
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

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && (error.message.includes('API key') || error.message.includes('403') || error.message.includes('401'))) {
        throw new Error("There is an issue with the API configuration. Please try again later.");
    }
    throw new Error("Failed to generate text from Gemini API.");
  }
};

export const generateTitleForText = async (text: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const prompt = `Crie um título curto e descritivo (máximo 5 palavras) para a seguinte promoção ou resgate: "${text}"`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        if (!response.text) {
            return "Título gerado"; // Fallback
        }

        // Clean up the title - remove quotes and asterisks
        return response.text.replace(/["*]/g, '').trim();

    } catch(error) {
        console.error("Error generating title:", error);
        return "Título da promoção"; // Fallback on error
    }
}

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

export function appendFooterToSentences(text: string, footer: string): string {
    if (!footer || !footer.trim()) return text;
    // Regex to split by sentence-ending punctuation followed by whitespace.
    // It handles '.', '!', and '?' and uses a positive lookbehind to keep the delimiter.
    return text
      .split(/(?<=[.!?])\s+/)
      .map(sentence => {
        const trimmedSentence = sentence.trim();
        // Avoid adding footer if sentence is just the footer already or is empty
        if (!trimmedSentence || trimmedSentence.endsWith(footer)) {
          return sentence;
        }
        return `${trimmedSentence} ${footer}`;
      })
      .join(" ");
  }