import { GoogleGenAI } from "@google/genai"; // Correct class name for 2026
import 'dotenv/config';
import { retryWithBackoff } from '../utils/retryUtils.js';

// Initialize the client correctly
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const translateAndDefine = async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res.status(400).json({ message: "Text and target language are required." });
  }

  try {
    const prompt = `Return a JSON object with keys: original, language, translation, meaning, examples, synonyms.
Original: "${text}"
Target language: "${targetLanguage}"
Rules:
- examples: array of 2 to 3 sentences
- synonyms: array of 3 to 6 items
- Keep values concise
`;

// getting repeated 503 from gemini, need fix

    // Wrap API call with retry logic
    const response = await retryWithBackoff(
      async () => {
        return await client.models.generateContent({
          model: "models/gemini-2.5-flash",
          contents: [{
            role: "user",
            parts: [{ text: prompt }]
          }],
          config: {
            responseMimeType: "application/json"
          }
        });
      },
      3, // max retries
      1000 // initial delay in ms
    );

    const responseText = (() => {
      if (!response) return "";
      if (typeof response.text === "function") return response.text();
      if (typeof response.text === "string") return response.text;
      const parts = response.candidates?.[0]?.content?.parts || [];
      return parts.map(part => part.text || "").join("");
    })();

    const jsonString = String(responseText)
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    if (!jsonString) {
      throw new Error("Empty response from GenAI");
    }

    const result = JSON.parse(jsonString);
    res.status(200).json(result);

  } catch (error) {
    console.error("Gemini API Error:", error);
    const status = error?.status || error?.response?.status || 500;

    if (status === 429) {
      return res.status(429).json({
        message: "AI Dictionary Service Error",
        details: "Gemini free-tier quota exceeded. Please wait a few minutes and try again.",
        retryAfter: error?.details?.find(d => d["@type"]?.includes("RetryInfo"))?.retryDelay || "60s",
      });
    }

    if (status === 503) {
      return res.status(503).json({
        message: "Gemini API Temporarily Unavailable",
        details: "The service is experiencing high demand. Please try again in a few moments.",
        retryable: true,
      });
    }

    res.status(500).json({ 
      message: "AI Dictionary Service Error", 
      details: error.message || "Unknown error",
      retryable: false
    });
  }
};