import { GoogleGenAI } from "@google/genai"; // Correct class name for 2026
import 'dotenv/config';

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

    const response = await client.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      config: {
        responseMimeType: "application/json"
      }
    });

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
    const status = error?.status || 500;
    const retryDelay = error?.details?.find(d => d["@type"]?.includes("RetryInfo"))?.retryDelay;

    if (status === 429) {
      return res.status(429).json({
        message: "AI Dictionary Service Error",
        details: "Gemini free-tier quota exceeded. Please wait and retry.",
        retryAfter: retryDelay || "",
      });
    }

    res.status(500).json({ message: "AI Dictionary Service Error", details: error.message || "Unknown error" });
  }
};