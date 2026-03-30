import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';
import { Type } from "@google/genai";

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
    // Check if we already have recent data to avoid redundant calls
    // (Optional: but good for stability)
    
    const keyword = "日本 国内 行政 不祥事 不作為 最新ニュース 報道";
    console.log(`Querying AI with keyword: ${keyword}`);
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `日本国内の最新の行政不祥事、公務員の不正、または行政の不作為に関するニュースを検索し、重要な事例を【最低5つ】抽出して要約してください。
      
      キーワード: ${keyword}
      
      各事例について、以下の情報を正確に抽出してください：
      1. タイトル (具体的かつ簡潔に)
      2. 内容の要約 (何が起きたか、何が問題か)
      3. 報道日または発生時期
      4. 場所 (都道府県・市区町村)
      5. ソースURL (信頼できるニュースサイトのURL)
      6. ソース名 (メディア名)`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              date: { type: Type.STRING },
              location: { type: Type.STRING },
              sourceUrl: { type: Type.STRING },
              sourceTitle: { type: Type.STRING }
            },
            required: ["title", "description", "sourceUrl"]
          }
        }
      },
    });

    if (!response.text) {
      console.error("AI returned empty response text.");
      return;
    }

    const cases = JSON.parse(response.text);
    console.log(`AI found ${cases.length} cases.`);
    
    if (cases.length === 0) {
      console.warn("AI found 0 cases. Search might have failed or no recent news.");
      return;
    }
    
    for (const caseItem of cases) {
      try {
        await addDoc(collection(db, 'misconduct_cases'), {
          title: caseItem.title || "不明な事案",
          description: caseItem.description || "詳細情報なし",
          date: caseItem.date || "最近",
          location: caseItem.location || "日本国内",
          sources: [{ title: caseItem.sourceTitle || "ニュースソース", uri: caseItem.sourceUrl }],
          collectedBy: "AI-SYSTEM",
          createdAt: serverTimestamp(),
        });
      } catch (dbError) {
        console.error("Error saving case to Firestore:", dbError);
      }
    }
    
    console.log(`Automated collection successful: ${cases.length} items saved.`);
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

  app.post("/api/admin/collect", async (req, res) => {
    try {
      await runAutomatedCollection();
      res.json({ success: true, message: "Automated collection triggered." });
    } catch (error) {
      console.error("Manual trigger error:", error);
      res.status(500).json({ error: "Failed to trigger collection." });
    }
  });

  app.post("/api/collect", async (req, res) => {
    const { keyword } = req.body;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `以下のキーワードに関連する最新の行政不祥事や不作為に関するニュースや報告を検索し、重要な事例を【最低5つ】抽出して要約してください。\n\nキーワード: ${keyword}`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "事例のタイトル" },
                description: { type: Type.STRING, description: "事例の要約内容" },
                date: { type: Type.STRING, description: "発生日または報道日" },
                location: { type: Type.STRING, description: "場所" },
                sourceUrl: { type: Type.STRING, description: "ソースURL" },
                sourceTitle: { type: Type.STRING, description: "ソースのタイトル" }
              },
              required: ["title", "description", "sourceUrl"]
            }
          }
        },
      });

      const cases = JSON.parse(response.text);
      res.json({ cases });
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
