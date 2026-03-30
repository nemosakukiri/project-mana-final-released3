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
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        {/* Header Section - Elegant Editorial */}
        <section className="py-20 border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-9">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-8"
              >
                AI Legal Scrutiny
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl lg:text-8xl font-headline mb-8 leading-[0.9] tracking-tighter"
              >
                AI法的精査・<span className="text-secondary italic">解析</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl lg:text-2xl text-on-surface-variant leading-relaxed font-serif italic max-w-3xl"
              >
                記録された証言をAIが多角的に分析。法的な論点を整理し、行政の不作為を客観的な証拠へと昇華させます。
              </motion.p>
            </div>
            <div className="lg:col-span-3 hidden lg:block">
              <div className="aspect-square bg-surface border border-border p-8 flex flex-col items-center justify-center text-center group">
                <Scale className="w-20 h-20 text-primary/20 group-hover:text-primary transition-colors mb-6" />
                <span className="text-xs font-bold uppercase tracking-widest mb-4 text-on-surface-variant">Analysis Tool</span>
                <Link to="/report" className="text-lg font-headline border-b border-primary text-primary hover:gap-4 transition-all">
                  新規報告を行う
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-border">
          {/* Sidebar: Report List */}
          <aside className="lg:col-span-4 border-r border-border bg-surface flex flex-col">
            <div className="p-8 border-b border-border bg-muted flex justify-between items-center">
              <h2 className="text-2xl font-headline tracking-tighter flex items-center gap-3">
                <Activity className="w-6 h-6 text-primary" />
                Recent Reports
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[800px] custom-scrollbar">
              <div className="divide-y divide-border">
                {reports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`w-full text-left p-8 transition-all group ${
                      selectedReport?.id === report.id
                        ? 'bg-primary/5 border-l-4 border-primary'
                        : 'bg-surface hover:bg-muted'
                    }`}
                  >
                    <div className="flex gap-4 mb-3 items-center">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-primary bg-primary/10 px-2 py-0.5">
                        {report.category === 'inaction' ? '不作為' : '不祥事'}
                      </span>
                      <span className="text-xs font-mono text-on-surface-variant">{report.date}</span>
                    </div>
                    <h3 className="text-2xl font-headline mb-3 group-hover:text-primary transition-colors leading-tight tracking-tighter line-clamp-1">
                      {report.title}
                    </h3>
                    <p className="text-sm font-serif italic text-on-surface-variant line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>
                  </button>
                ))}
                {reports.length === 0 && !error && (
                  <div className="p-12 text-center bg-surface">
                    <p className="text-lg font-serif italic text-on-surface-variant mb-6">報告データがありません</p>
                    <Link to="/report" className="inline-flex items-center gap-3 text-xl font-headline border-b border-secondary text-secondary hover:gap-5 transition-all">
                      最初の報告を行う
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content: Analysis */}
          <main className="lg:col-span-8 bg-background">
            {selectedReport ? (
              <div className="flex flex-col h-full">
                <div className="p-12 lg:p-16 border-b border-border">
                  <div className="flex flex-wrap items-center gap-6 mb-8">
                    <span className="bg-primary text-white px-4 py-1 font-headline text-sm tracking-widest uppercase">
                      {selectedReport.category === 'inaction' ? '不作為' : '不祥事'}
                    </span>
                    <span className="text-lg font-serif italic text-on-surface-variant">
                      {selectedReport.location} • {selectedReport.date}
                    </span>
                  </div>
                  <h2 className="text-4xl lg:text-6xl font-headline mb-10 leading-tight tracking-tighter">{selectedReport.title}</h2>
                  <div className="p-8 bg-surface border-l-4 border-primary text-xl font-serif italic text-on-surface-variant leading-relaxed mb-10">
                    「{selectedReport.description}」
                  </div>
                  
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-primary text-white px-10 py-6 font-headline text-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <Activity className="w-8 h-8 animate-pulse" />
                        AI解析中...
                      </>
                    ) : (
                      <>
                        AI法的精査を実行する
                        <Scale className="w-8 h-8" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex-1 bg-background">
                  {analysis && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-12 lg:p-16 bg-surface border-t border-border"
                    >
                      <div className="flex items-center gap-4 mb-10 text-primary">
                        <ShieldCheck className="w-10 h-10" />
                        <h3 className="text-2xl font-headline uppercase tracking-widest">AI Analysis Report</h3>
                      </div>
                      <div className="prose prose-lg max-w-none markdown-body">
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <div className="p-12 lg:p-16 bg-secondary/10 text-secondary flex items-center gap-6 border-t border-border">
                      <AlertTriangle className="w-10 h-10 shrink-0" />
                      <p className="text-xl font-headline uppercase tracking-tighter">{error}</p>
                    </div>
                  )}

                  {!analysis && !isAnalyzing && (
                    <div className="h-full min-h-[400px] flex items-center justify-center p-12 lg:p-20 text-center">
                      <div className="max-w-md">
                        <Search className="w-20 h-20 mx-auto mb-6 opacity-10" />
                        <p className="text-2xl font-serif italic text-on-surface-variant opacity-60">解析ボタンを押して、AIによる精査を開始してください</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[600px] flex items-center justify-center p-12 lg:p-20 text-center">
                <div className="max-w-md">
                  <Search className="w-24 h-24 mx-auto mb-8 opacity-10" />
                  <p className="text-3xl font-serif italic text-on-surface-variant opacity-60">左側のリストから解析する報告を選択してください</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
