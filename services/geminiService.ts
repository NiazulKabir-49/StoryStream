import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

/**
 * Checks if the provided text contains any harmful, slang (offensive), or 18+ content.
 * Returns true if the content is safe, false otherwise.
 */
export const checkContentSafety = async (text: string): Promise<{ safe: boolean; reason?: string }> => {
  if (!apiKey) {
    console.warn("API Key missing, skipping strict AI moderation.");
    return { safe: true }; 
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Analyze the following text for a public e-book platform.
      Strictly check for:
      1. 18+ / Sexual content (NSFW)
      2. Offensive Slang / Hate Speech
      3. Excessive Violence / Harmful content
      
      Respond ONLY with a JSON object: { "safe": boolean, "reason": "string (optional explanation if unsafe)" }
      
      Text to analyze:
      "${text.substring(0, 1000)}..." 
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const resultText = response.text;
    if (!resultText) return { safe: false, reason: "Analysis failed" };

    const result = JSON.parse(resultText);
    return result;

  } catch (error) {
    console.error("Gemini moderation error:", error);
    // Fail safe or fail closed? For this demo, fail safe but warn.
    return { safe: true }; 
  }
};