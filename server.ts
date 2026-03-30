import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Load Firebase config for server-side automated tasks
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8'));
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

async function runAutomatedCollection() {
  console.log("Starting automated collection...");
  try {
    const keyword = "行政 不祥事 不作為 最新ニュース";
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `以下のキーワードに関連する最新の行政不祥事や不作為に関するニュースや報告を検索し、重要な事例を【最低5つ】抽出して要約してください。各事例には、日付、場所、内容、およびソースURLを含めてください。
      
      キーワード: ${keyword}
      
      出力は日本語で、市民が監視しやすいように簡潔にまとめてください。`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title,
      uri: chunk.web?.uri
    })) || [];

    await addDoc(collection(db, 'misconduct_cases'), {
      keyword: "自動収集 (毎時更新)",
      summary: response.text,
      sources: sources,
      collectedBy: "AI-SYSTEM",
      createdAt: serverTimestamp(),
    });
    console.log("Automated collection successful.");
  } catch (error) {
    console.error("Automated Collection Error:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Run automated collection on startup and then every hour
  runAutomatedCollection();
  setInterval(runAutomatedCollection, 3600000);

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
        contents: `以下のキーワードに関連する最新の行政不祥事や不作為に関するニュースや報告を検索し、重要な事例を【最低5つ】抽出して要約してください。各事例には、日付、場所、内容、およびソースURLを含めてください。\n\nキーワード: ${keyword}`,
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
