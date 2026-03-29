import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/analyze", async (req, res) => {
    const { prompt } = req.body;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      res.json({ text: response.text });
    } catch (error) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ error: "AI解析中にエラーが発生しました。" });
    }
  });

  app.post("/api/collect", async (req, res) => {
    const { keyword } = req.body;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `以下のキーワードに関連する最新の行政不祥事や不作為に関するニュースや報告を検索し、重要な事例を3つから5つ抽出して要約してください。各事例には、日付、場所、内容、およびソースURLを含めてください。\n\nキーワード: ${keyword}`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      // Extract grounding metadata for sources
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      const sources = groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title,
        uri: chunk.web?.uri
      })) || [];

      res.json({ 
        text: response.text,
        sources: sources
      });
    } catch (error) {
      console.error("AI Collection Error:", error);
      res.status(500).json({ error: "AI自動収集中にエラーが発生しました。" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
