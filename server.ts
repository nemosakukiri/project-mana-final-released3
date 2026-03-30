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
let db: any;
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    console.log("Firebase initialized on server.");
  } else {
    console.warn("firebase-applet-config.json not found. Automated collection will be disabled.");
  }
} catch (error) {
  console.error("Firebase initialization failed on server:", error);
}

async function runAutomatedCollection() {
  if (!db) {
    console.warn("Skipping automated collection: Database not initialized.");
    return;
  }
  console.log("Starting automated collection...");
  try {
    const keyword = "行政 公務員 不祥事 不作為 個人犯罪 最新ニュース";
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `以下のキーワードに関連する最新の行政・公務員の不祥事（組織的な問題および公務員個人による犯罪・不祥事を含む）や不作為に関するニュースや報告を検索し、重要な事例を【最低5つ】抽出して要約してください。
      
      キーワード: ${keyword}`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING", description: "事例のタイトル" },
              description: { type: "STRING", description: "事例の要約内容" },
              category: { type: "STRING", enum: ["organizational", "individual", "other"], description: "不祥事のカテゴリー（組織的、個人的、その他）" },
              date: { type: "STRING", description: "発生日または報道日" },
              location: { type: "STRING", description: "場所" },
              sourceUrl: { type: "STRING", description: "ソースURL" },
              sourceTitle: { type: "STRING", description: "ソースのタイトル" }
            },
            required: ["title", "description", "sourceUrl"]
          }
        }
      },
    });

    const cases = JSON.parse(response.text);
    
      for (const caseItem of cases) {
        await addDoc(collection(db, 'misconduct_cases'), {
          title: caseItem.title,
          description: caseItem.description,
          category: caseItem.category || "other",
          date: caseItem.date || "",
          location: caseItem.location || "",
          sources: [{ title: caseItem.sourceTitle || "Source", uri: caseItem.sourceUrl }],
          collectedBy: "AI-SYSTEM",
          createdAt: serverTimestamp(),
        });
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

  app.post("/api/collect", async (req, res) => {
    const { keyword } = req.body;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `以下のキーワードに関連する最新の行政・公務員の不祥事（組織的な問題および公務員個人による犯罪・不祥事を含む）や不作為に関するニュースや報告を検索し、重要な事例を【最低5つ】抽出して要約してください。\n\nキーワード: ${keyword}`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING", description: "事例のタイトル" },
                description: { type: "STRING", description: "事例の要約内容" },
                category: { type: "STRING", enum: ["organizational", "individual", "other"], description: "不祥事のカテゴリー（組織的、個人的、その他）" },
                date: { type: "STRING", description: "発生日または報道日" },
                location: { type: "STRING", description: "場所" },
                sourceUrl: { type: "STRING", description: "ソースURL" },
                sourceTitle: { type: "STRING", description: "ソースのタイトル" }
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
    const distPath = path.resolve(__dirname, 'dist');
    console.log(`Serving static files from: ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
