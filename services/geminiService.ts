import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TranslationResult } from "../types";

const ai = new GoogleGenAI(import.meta.env.VITE_API_KEY);

// Define the schema for the translation output
const translationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    inputAnalysis: {
      type: Type.OBJECT,
      properties: {
        hasIssue: { type: Type.BOOLEAN, description: "True if the input has spelling/grammar errors, is ambiguous, or is too stiff/unnatural." },
        original: { type: Type.STRING },
        corrected: { type: Type.STRING, description: "The corrected or improved version of the input. If no issue, repeat original." },
        issueType: { type: Type.STRING, enum: ["spelling", "grammar", "ambiguity", "stiff", "none"] },
        explanation: { type: Type.STRING, description: "Brief, friendly explanation of the error or improvement." },
      },
      required: ["hasIssue", "original", "corrected", "issueType", "explanation"]
    },
    isChineseInput: {
      type: Type.BOOLEAN,
      description: "True if the CORRECTED input language is Chinese, False otherwise.",
    },
    mainTranslation: {
      type: Type.STRING,
      description: "The primary translation of the CORRECTED input text.",
    },
    variations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "If input is Chinese, provide exactly 10 different English translations ranging from formal to slang/meme. If input is not Chinese, leave empty.",
    },
    culturalContext: {
      type: Type.STRING,
      description: "Explain the slang, meme origin, or cultural nuance. If it is a name, explain who it is.",
    },
    examples: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          translated: { type: Type.STRING },
        },
      },
      description: "Provide exactly 3 example sentences using the term/phrase.",
    },
    imagePrompt: {
      type: Type.STRING,
      description: "A detailed visual description to generate a schematic or illustrative image explaining this concept. Keep it visual and conceptual.",
    },
  },
  required: ["inputAnalysis", "isChineseInput", "mainTranslation", "culturalContext", "examples", "imagePrompt"],
};

export const translateText = async (text: string): Promise<TranslationResult> => {
  const prompt = `
    You are a world-class translator and linguist specializing in Internet slang, memes (Gen Z/Alpha), pop culture, and proper names.
    
    Analyze the following input text: "${text}"

    Step 1: Analysis
    Check the input for spelling errors, grammar mistakes, ambiguity, or if the phrasing is too stiff/formal where it shouldn't be.
    If you find issues, create a 'corrected' version. 

    Step 2: Translation
    Using the *corrected* version (if applicable), perform the translation.

    Rules:
    1. If the input is NOT Chinese: Translate it to Chinese.
    2. If the input IS Chinese: Provide exactly 10 English translations. These 10 must vary significantly: include literal translations, formal usage, and most importantly, current internet slang/memes equivalents.
    3. Context: specificially identify if the term is a "Netizen Hot Stem" (network meme), a celebrity nickname, or a specific cultural reference. Explain this in 'culturalContext'.
    4. Examples: Provide 3 bilingual example sentences.
    5. Image Prompt: Create a description for an image that visually explains the meaning (a schematic, a funny situation, or a literal representation of the metaphor).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: translationSchema,
        systemInstruction: "You are a helpful, witty, and culturally aware translation assistant. Your personality is playful.",
      },
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText) as TranslationResult;
  } catch (error) {
    console.error("Translation failed", error);
    throw new Error("Failed to translate text. Please try again.");
  }
};

export const generateIllustration = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: `A clear, high-quality conceptual illustration in a playful 3D cartoon style or vector art (reminiscent of Hanna-Barbera cartoons), explaining the concept: ${prompt}. Bright colors, minimalist background.`,
      config: {
        numberOfImages: 1,
        aspectRatio: "4:3",
        outputMimeType: "image/jpeg",
      },
    });

    const base64Image = response.generatedImages?.[0]?.image?.imageBytes;
    if (!base64Image) {
      throw new Error("No image generated");
    }
    return `data:image/jpeg;base64,${base64Image}`;
  } catch (error) {
    console.error("Image generation failed", error);
    return "";
  }
};
