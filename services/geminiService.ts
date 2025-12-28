import { GameResult } from "../types";

export const generateParentReport = async (history: GameResult[], childName: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ history, childName }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.text || "Maaf, tidak dapat membuat laporan saat ini.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "Terjadi kesalahan saat menghubungkan ke asisten AI.";
  }
};