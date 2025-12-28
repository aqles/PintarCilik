import { GoogleGenAI } from "@google/genai";

// Vercel Serverless Function handler
export default async function handler(request, response) {
    // Kita cuma nerima POST request aja ya, biar aman.
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    const { history, childName } = request.body;

    if (!process.env.GEMINI_API_KEY) {
        console.error("Server API Key missing");
        return response.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        // Ambil 10 game terakhir aja buat hemat token AI & biar lebih relevan.
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
      
      Gunakan format Markdown yang rapi:
      - Gunakan **Bold** untuk penekanan.
      - Gunakan Heading (## atau ###) untuk memisahkan bagian.
      - Gunakan daftar (bullet points) untuk poin-poin.
      - Gunakan nada yang hangat, menyemangati, dan profesional.
    `;

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.status(200).json({ text: result.text || "Tidak ada respons." });

    } catch (error) {
        console.error("Error generating report:", error);
        return response.status(500).json({ error: 'Failed to generate report' });
    }
}
