import { GoogleGenAI } from "@google/genai";
import { GameResult } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing!");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateParentReport = async (history: GameResult[], childName: string): Promise<string> => {
  try {
    const ai = createClient();
    
    // Summarize data for the prompt to save tokens
    const recentGames = history.slice(-10);
    const dataSummary = JSON.stringify(recentGames);

    const prompt = `
      Bertindaklah sebagai ahli pendidikan anak usia dini dan psikolog anak.
      Analisis data perkembangan belajar berikut untuk anak bernama ${childName}.
      Data (JSON): ${dataSummary}
      
      Berikan laporan singkat untuk orang tua dalam Bahasa Indonesia yang mencakup:
      1. Ringkasan kemajuan (puji usaha anak).
      2. Area kekuatan (Membaca atau Berhitung).
      3. Saran aktivitas konkret di rumah untuk meningkatkan area yang lebih lemah.
      
      Gunakan nada yang hangat, menyemangati, dan profesional. Jangan gunakan markdown yang rumit, cukup paragraf dan poin-poin sederhana.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Maaf, tidak dapat membuat laporan saat ini.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "Terjadi kesalahan saat menghubungkan ke asisten AI. Pastikan kunci API valid.";
  }
};