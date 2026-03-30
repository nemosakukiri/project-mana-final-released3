import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, FileText, Activity, ArrowRight, ShieldCheck, AlertTriangle, Scale } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function Analysis() {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        const fetchedReports = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReports(fetchedReports);
        if (fetchedReports.length > 0) {
          setSelectedReport(fetchedReports[0]);
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('レポートの取得に失敗しました。');
      }
    };
    fetchReports();
  }, []);

  const handleAnalyze = async () => {
    if (!selectedReport) return;
    setIsAnalyzing(true);
    setAnalysis('');
    setError('');

    try {
      const prompt = `
        以下の行政不作為・不祥事の報告を、法的および倫理的な観点から詳細に解析してください。
        
        タイトル: ${selectedReport.title}
        カテゴリー: ${selectedReport.category}
        場所: ${selectedReport.location}
        日付: ${selectedReport.date}
        内容: ${selectedReport.description}
        
        解析には以下の項目を含めてください：
        1. 法的論点（どの法律や条例に抵触する可能性があるか）
        2. 行政の責任（なされるべきだった公務の内容）
        3. 市民への影響（権利侵害の程度）
        4. 推奨されるアクション（今後の対応策）
        
        回答は、専門的かつ客観的なトーンで、Markdown形式で出力してください。
      `;

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('AI解析に失敗しました。');
      }

      const data = await response.json();
      setAnalysis(data.text || '解析結果を取得できませんでした。');
    } catch (err) {
      console.error('Error analyzing report:', err);
      setError('AI解析中にエラーが発生しました。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header Section - Mondrian Style */}
        <section className="grid grid-cols-12 border-b-8 border-black bg-white">
          <div className="col-span-12 lg:col-span-9 p-16 border-r-8 border-black">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[6vw] font-headline mb-8 leading-none tracking-tighter"
            >
              AI法的精査・<span className="text-secondary italic">解析</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl text-on-surface-variant leading-relaxed font-serif italic max-w-3xl"
            >
              記録された証言をAIが多角的に分析。法的な論点を整理し、行政の不作為を客観的な証拠へと昇華させます。
            </motion.p>
          </div>
          <div className="col-span-12 lg:col-span-3 grid grid-rows-2">
            <div className="bg-mondrian-blue border-b-8 border-black p-12 flex items-center justify-center">
               <Scale className="w-24 h-24 text-white" />
            </div>
            <div className="bg-mondrian-yellow p-12 flex flex-col items-center justify-center">
               <span className="text-black font-headline text-3xl mb-4 uppercase tracking-widest">Analysis Tool</span>
               <Link to="/report" className="text-xl font-bold border-b-4 border-black hover:bg-black hover:text-white transition-all px-4 py-2">
                  新規報告を行う
               </Link>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-12 gap-0 border-b-8 border-black">
          {/* Sidebar: Report List */}
          <aside className="col-span-12 lg:col-span-4 border-r-8 border-black bg-white flex flex-col">
            <div className="p-12 border-b-8 border-black bg-black text-white flex justify-between items-center">
              <h2 className="text-4xl font-headline uppercase tracking-tighter flex items-center gap-4">
                <Activity className="w-10 h-10" />
                Recent Reports
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[100vh] custom-scrollbar">
              <div className="divide-y-8 divide-black">
                {reports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`w-full text-left p-12 transition-all group ${
                      selectedReport?.id === report.id
                        ? 'bg-mondrian-yellow'
                        : 'bg-white hover:bg-mondrian-blue/5'
                    }`}
                  >
                    <div className="flex gap-4 mb-4 items-center">
                      <span className="bg-black px-4 py-1 font-headline text-sm text-white tracking-widest">
                        {report.category === 'inaction' ? '不作為' : '不祥事'}
                      </span>
                      <span className="text-sm font-mono opacity-60">{report.date}</span>
                    </div>
                    <h3 className="text-3xl font-headline mb-4 group-hover:text-secondary transition-colors leading-none tracking-tighter line-clamp-1">
                      {report.title}
                    </h3>
                    <p className="text-lg font-serif italic text-on-surface-variant line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>
                  </button>
                ))}
                {reports.length === 0 && !error && (
                  <div className="p-20 text-center bg-white">
                    <p className="text-xl font-serif italic opacity-60 mb-8">報告データがありません</p>
                    <Link to="/report" className="inline-flex items-center gap-4 text-2xl font-headline border-b-4 border-secondary hover:text-secondary transition-all pb-2">
                      最初の報告を行う
                      <ArrowRight className="w-6 h-6" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content: Analysis */}
          <main className="col-span-12 lg:col-span-8 bg-white">
            {selectedReport ? (
              <div className="flex flex-col h-full">
                <div className="p-16 border-b-8 border-black">
                  <div className="flex flex-wrap items-center gap-6 mb-8">
                    <span className="bg-secondary text-white px-6 py-2 font-headline text-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      {selectedReport.category === 'inaction' ? '不作為' : '不祥事'}
                    </span>
                    <span className="text-2xl font-serif italic text-on-surface-variant">
                      {selectedReport.location} • {selectedReport.date}
                    </span>
                  </div>
                  <h2 className="text-6xl font-headline mb-12 leading-none tracking-tighter">{selectedReport.title}</h2>
                  <div className="p-12 bg-mondrian-yellow/10 border-l-8 border-mondrian-yellow text-2xl font-serif italic text-on-surface-variant leading-relaxed mb-12">
                    「{selectedReport.description}」
                  </div>
                  
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-secondary text-white px-12 py-8 font-headline text-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-6 disabled:opacity-50 disabled:scale-100"
                  >
                    {isAnalyzing ? 'AI解析中...' : 'AI法的精査を実行する'}
                    <Scale className="w-10 h-10" />
                  </button>
                </div>

                <div className="flex-1 bg-white">
                  {analysis && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-16 bg-black text-white"
                    >
                      <div className="flex items-center gap-6 mb-12 text-mondrian-yellow">
                        <ShieldCheck className="w-12 h-12" />
                        <h3 className="text-4xl font-headline uppercase tracking-widest">AI Analysis Report</h3>
                      </div>
                      <div className="prose prose-invert prose-2xl max-w-none markdown-body">
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <div className="p-16 bg-secondary text-white flex items-center gap-8 border-t-8 border-black">
                      <AlertTriangle className="w-16 h-16 shrink-0" />
                      <p className="text-3xl font-headline uppercase tracking-tighter">{error}</p>
                    </div>
                  )}

                  {!analysis && !isAnalyzing && (
                    <div className="h-full min-h-[400px] flex items-center justify-center p-20 text-center">
                      <div>
                        <Search className="w-32 h-32 mx-auto mb-8 opacity-10" />
                        <p className="text-3xl font-serif italic opacity-40">解析ボタンを押して、AIによる精査を開始してください</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[600px] flex items-center justify-center p-20 text-center">
                <div>
                  <Search className="w-48 h-48 mx-auto mb-12 opacity-10" />
                  <p className="text-4xl font-serif italic opacity-40">左側のリストから解析する報告を選択してください</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
