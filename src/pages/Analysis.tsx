import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, FileText, Activity, ArrowRight, ShieldCheck, AlertTriangle, Scale, Loader2, ChevronDown, Database, Cpu, Gavel, MapPin, Calendar, TrendingUp, BarChart, BookOpen, PenTool, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Link, useLocation } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { GoogleGenAI } from "@google/genai";

export default function Analysis() {
  const location = useLocation();
  const [misconducts, setMisconducts] = useState<any[]>([]);
  const [inactions, setInactions] = useState<any[]>([]);
  const [aiColumns, setAiColumns] = useState<any[]>([]);
  
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingColumn, setIsGeneratingColumn] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch Misconducts
    const qM = query(collection(db, 'misconduct'), orderBy('collectedAt', 'desc'), limit(50));
    const unsubM = onSnapshot(qM, (snap) => {
      setMisconducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch Inactions
    const qI = query(collection(db, 'inaction'), orderBy('reportedAt', 'desc'), limit(50));
    const unsubI = onSnapshot(qI, (snap) => {
      setInactions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch AI Columns
    const qC = query(collection(db, 'aiColumns'), orderBy('createdAt', 'desc'), limit(10));
    const unsubC = onSnapshot(qC, (snap) => {
      setAiColumns(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    if (location.state?.report) {
      setSelectedReport(location.state.report);
    }

    return () => {
      unsubM();
      unsubI();
      unsubC();
    };
  }, [location.state]);

  const handleAnalyze = async () => {
    if (!selectedReport) return;
    setIsAnalyzing(true);
    setAnalysis('');
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const prompt = `
        以下の行政不作為・不祥事の報告を、法的および倫理的な観点から詳細に解析してください。
        
        タイトル: ${selectedReport.title || selectedReport.project}
        カテゴリー: ${selectedReport.category}
        場所: ${selectedReport.location}
        日付: ${selectedReport.date || selectedReport.reportedAt}
        内容: ${selectedReport.description || selectedReport.impact}
        
        解析には以下の項目を含めてください：
        1. 法的論点（どの法律や条例に抵触する可能性があるか）
        2. 行政の責任（なされるべきだった公務の内容）
        3. 市民への影響（権利侵害の程度）
        4. 推奨されるアクション（今後の対応策）
        
        回答は、専門的かつ客観的なトーンで、Markdown形式で出力してください。
      `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      setAnalysis(response.text || 'Analysis results could not be generated.');
    } catch (err) {
      console.error('Error analyzing report:', err);
      setError('An error occurred during the AI audit process.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateAIColumn = async () => {
    setIsGeneratingColumn(true);
    setError('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";

      const contextData = {
        misconductCount: misconducts.length,
        inactionCount: inactions.length,
        recentMisconducts: misconducts.slice(0, 5).map(m => m.title),
        recentInactions: inactions.slice(0, 5).map(i => i.project),
      };

      const prompt = `
        Based on the following civic integrity data, write a sophisticated "AI Column" (editorial article).
        
        Data Context:
        - Total Misconduct Cases: ${contextData.misconductCount}
        - Total Inaction Cases: ${contextData.inactionCount}
        - Recent Misconducts: ${contextData.recentMisconducts.join(', ')}
        - Recent Inactions: ${contextData.recentInactions.join(', ')}
        
        The column should:
        1. Calculate a "Civic Integrity Index" (0-100) based on the ratio of misconduct/inaction to population/time (simulate this based on trends).
        2. Analyze the "Cost of Inaction" (economic and social impact).
        3. Provide a scholarly perspective on the current state of civic transparency.
        4. Include a catchy, authoritative title.
        
        Output format: JSON with fields "title", "content" (markdown), "integrityIndex" (number), "inactionCost" (string).
      `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text);
      
      await addDoc(collection(db, 'aiColumns'), {
        ...data,
        createdAt: serverTimestamp(),
        author: "Civic AI Auditor"
      });

    } catch (err) {
      console.error('Column generation error:', err);
      setError('Failed to generate AI Column.');
    } finally {
      setIsGeneratingColumn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] pt-24 font-sans selection:bg-primary selection:text-on-primary">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        
        {/* Header Section */}
        <header className="mb-20 border-b-4 border-primary pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-9 space-y-10">
              <div className="flex items-center gap-6">
                <div className="px-4 py-1 bg-primary text-on-primary text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
                  Analysis Portal v5.0
                </div>
                <div className="h-[1px] w-12 bg-primary/30"></div>
                <span className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase">Project MANA Intelligence</span>
              </div>
              <h1 className="text-primary font-headline text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
                AI Column<br/>
                <span className="text-tertiary italic">& Analysis</span>
              </h1>
              <div className="text-primary/40 text-sm font-bold tracking-[0.2em] uppercase mt-4">
                AIコラム＆多角分析：データに基づく客観的考察と指数化
              </div>
              <p className="text-secondary text-xl leading-relaxed font-medium border-l-4 border-tertiary pl-8 italic max-w-3xl">
                蓄積された不祥事・不作為データをAIが多角的に分析。独自の指数化と考察により、行政の透明性を数値化し、未来への提言を紡ぎ出します。
              </p>
            </div>
            <div className="lg:col-span-3">
              <button 
                onClick={generateAIColumn}
                disabled={isGeneratingColumn}
                className="w-full aspect-square border-4 border-primary p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group transition-all hover:bg-primary hover:text-on-primary"
              >
                {isGeneratingColumn ? (
                  <Loader2 className="w-16 h-16 animate-spin text-tertiary" />
                ) : (
                  <PenTool className="w-16 h-16 text-tertiary mb-6" />
                )}
                <span className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-60">Insight Engine / 洞察エンジン</span>
                <span className="text-xl font-headline font-black uppercase tracking-tighter border-b-2 border-current">
                  Generate Column / コラム生成
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* AI Column Feed */}
        <section className="mb-32">
          <div className="flex items-center gap-6 mb-12">
            <TrendingUp className="w-8 h-8 text-tertiary" />
            <h2 className="text-4xl font-headline font-black text-primary uppercase tracking-tighter">AI Editorial Feed / AIエディトリアル・フィード</h2>
            <div className="flex-1 h-[2px] bg-primary/10"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {aiColumns.map((column) => (
              <motion.div 
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-primary p-10 flex flex-col group hover:shadow-2xl transition-all"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="text-[10px] font-bold text-tertiary uppercase tracking-widest">
                    {column.createdAt?.toDate().toLocaleDateString() || 'RECENT'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary/30" />
                    <span className="text-[10px] font-black text-primary uppercase">Index: {column.integrityIndex}</span>
                  </div>
                </div>
                <h3 className="text-3xl font-headline font-black text-primary mb-6 leading-none tracking-tighter uppercase group-hover:text-tertiary transition-colors">
                  {column.title}
                </h3>
                <div className="flex-1 prose prose-sm line-clamp-4 text-secondary italic mb-8">
                  <ReactMarkdown>{column.content}</ReactMarkdown>
                </div>
                <div className="pt-8 border-t border-primary/5 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">By {column.author}</span>
                  <button className="text-primary hover:text-tertiary transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Legal Scrutiny Tool */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-4 border-primary bg-white shadow-2xl shadow-primary/10 mb-32">
          <aside className="lg:col-span-4 border-r-4 border-primary flex flex-col bg-[#FBFBFB]">
            <div className="p-10 border-b-2 border-primary/10 bg-primary text-on-primary flex justify-between items-center">
              <h2 className="text-2xl font-headline font-black tracking-tighter flex items-center gap-4 uppercase">
                <Database className="w-6 h-6 text-tertiary" />
                Archival Feed / アーカイブ一覧
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
              <div className="divide-y-2 divide-primary/5">
                {[...misconducts, ...inactions].sort((a, b) => {
                  const dateA = new Date(a.collectedAt || a.reportedAt).getTime();
                  const dateB = new Date(b.collectedAt || b.reportedAt).getTime();
                  return dateB - dateA;
                }).map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`w-full text-left p-10 transition-all relative group ${
                      selectedReport?.id === report.id ? 'bg-white' : 'hover:bg-primary/5'
                    }`}
                  >
                    {selectedReport?.id === report.id && (
                      <div className="absolute left-0 top-0 w-2 h-full bg-tertiary"></div>
                    )}
                    <div className="flex gap-4 mb-4 items-center">
                      <span className={`text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full ${
                        report.category === 'inaction' || report.project ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'
                      }`}>
                        {report.category === 'inaction' || report.project ? 'Inaction' : 'Misconduct'}
                      </span>
                      <span className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">
                        {new Date(report.collectedAt || report.reportedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-2xl font-headline font-black mb-4 group-hover:text-primary transition-colors leading-none tracking-tighter line-clamp-1 uppercase">
                      {report.title || report.project}
                    </h3>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-8 bg-white flex flex-col">
            {selectedReport ? (
              <div className="flex flex-col h-full">
                <div className="p-12 lg:p-20 border-b-2 border-primary/5 bg-[#FBFBFB]">
                  <div className="flex flex-wrap items-center gap-8 mb-10">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-tertiary" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{selectedReport.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-tertiary" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                        {new Date(selectedReport.collectedAt || selectedReport.reportedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <h2 className="text-5xl lg:text-7xl font-headline font-black mb-12 leading-[0.9] tracking-tighter text-primary uppercase">
                    {selectedReport.title || selectedReport.project}
                  </h2>
                  <div className="p-10 bg-white border-2 border-primary/5 text-xl font-medium text-secondary leading-relaxed italic border-l-8 border-tertiary shadow-inner">
                    "{selectedReport.description || selectedReport.impact}"
                  </div>
                  
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="group relative w-full mt-12 py-10 bg-primary text-on-primary overflow-hidden transition-all active:scale-[0.99] disabled:opacity-30"
                  >
                    <div className="absolute inset-0 bg-tertiary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <div className="relative z-10 flex items-center justify-center gap-8">
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-10 h-10 animate-spin text-tertiary" />
                          <span className="text-3xl font-headline font-black uppercase tracking-[0.2em]">Processing Audit... / 解析中...</span>
                        </>
                      ) : (
                        <>
                          <Cpu className="w-10 h-10" />
                          <span className="text-3xl font-headline font-black uppercase tracking-[0.2em]">Execute AI Audit / AI法的精査を実行</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>

                <div className="flex-1 p-12 lg:p-20 bg-white relative">
                  {analysis && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-16"
                    >
                      <div className="flex items-center justify-between border-b-2 border-primary/10 pb-10">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-primary text-on-primary flex items-center justify-center rounded-full">
                            <Gavel className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="text-3xl font-headline font-black text-primary uppercase tracking-tight leading-none">Audit Findings / 解析結果</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mt-2">Protocol: Legal Scrutiny v5.0 / 法的精査プロトコル</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="prose prose-xl max-w-none font-medium text-secondary leading-relaxed prose-headings:font-headline prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-primary prose-strong:text-primary prose-blockquote:border-tertiary prose-blockquote:bg-tertiary/5 prose-blockquote:p-8 prose-blockquote:italic markdown-body">
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                      </div>
                    </motion.div>
                  )}
                  {!analysis && !isAnalyzing && (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center opacity-10">
                      <Cpu className="w-32 h-32 mb-10" />
                      <p className="text-4xl font-headline font-black uppercase tracking-tighter">Awaiting Audit Execution / 解析実行待機中</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-20">
                <div className="w-40 h-40 border-4 border-primary/5 rounded-full flex items-center justify-center mb-12">
                  <Search className="w-16 h-16 text-primary/10" />
                </div>
                <h3 className="text-4xl font-headline font-black text-primary/20 uppercase tracking-tighter mb-6">Select Archival Entry / アーカイブを選択してください</h3>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
