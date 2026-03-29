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
    <div className="min-h-screen bg-surface-container-low py-20 px-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-primary mb-6 font-headline">AI法的精査・解析</h1>
          <p className="text-xl text-on-surface-variant leading-relaxed max-w-3xl">
            記録された証言をAIが多角的に分析。法的な論点を整理し、行政の不作為を客観的な証拠へと昇華させます。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar: Report List */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <Activity className="w-5 h-5" />
                最近の報告
              </h2>
              <Link to="/report" className="text-secondary font-bold text-sm hover:underline">
                新規報告
              </Link>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all ${
                    selectedReport?.id === report.id
                      ? 'bg-primary text-white border-primary shadow-lg'
                      : 'bg-white text-on-surface border-outline-variant/20 hover:border-primary/50'
                  }`}
                >
                  <div className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70">
                    {report.category === 'inaction' ? '不作為' : '不祥事'} • {report.date}
                  </div>
                  <h3 className="text-lg font-bold mb-2 line-clamp-1">{report.title}</h3>
                  <p className={`text-sm line-clamp-2 ${selectedReport?.id === report.id ? 'opacity-80' : 'text-on-surface-variant'}`}>
                    {report.description}
                  </p>
                </button>
              ))}
              {reports.length === 0 && !error && (
                <div className="p-10 text-center bg-white/50 rounded-2xl border border-dashed border-outline-variant/50 text-on-surface-variant">
                  <p className="italic mb-6">報告データがありません</p>
                  <Link to="/report" className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-4 transition-all">
                    最初の報告を行う
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Main Content: Analysis */}
          <div className="lg:col-span-2 space-y-10">
            {selectedReport ? (
              <>
                <div className="bg-white p-10 md:p-16 rounded-3xl shadow-xl border border-outline-variant/10">
                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    <span className="bg-secondary/10 text-secondary px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest">
                      {selectedReport.category === 'inaction' ? '不作為' : '不祥事'}
                    </span>
                    <span className="text-on-surface-variant text-sm font-medium">
                      {selectedReport.location} • {selectedReport.date}
                    </span>
                  </div>
                  <h2 className="text-4xl font-bold text-primary mb-8 font-headline">{selectedReport.title}</h2>
                  <div className="p-8 bg-surface-container-low rounded-2xl text-lg text-on-surface-variant leading-relaxed mb-10 border border-outline-variant/10 italic">
                    「{selectedReport.description}」
                  </div>
                  
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-secondary text-white px-10 py-6 rounded-full font-bold text-xl shadow-xl hover:bg-secondary/90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
                  >
                    {isAnalyzing ? 'AI解析中...' : 'AI法的精査を実行する'}
                    <Scale className="w-6 h-6" />
                  </button>
                </div>

                {analysis && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary-fixed text-primary-fixed-dim p-10 md:p-16 rounded-3xl shadow-2xl border border-primary/20"
                  >
                    <div className="flex items-center gap-3 mb-10 text-secondary">
                      <ShieldCheck className="w-8 h-8" />
                      <h3 className="text-2xl font-bold font-headline uppercase tracking-widest">AI Analysis Report</h3>
                    </div>
                    <div className="prose prose-invert prose-lg max-w-none markdown-body">
                      <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <div className="flex items-center gap-3 p-8 bg-error-container text-on-error-container rounded-3xl border border-error/20">
                    <AlertTriangle className="w-8 h-8 shrink-0" />
                    <p className="text-lg font-medium">{error}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex items-center justify-center p-20 bg-white/50 rounded-3xl border border-dashed border-outline-variant/50 text-on-surface-variant text-center">
                <div>
                  <Search className="w-16 h-16 mx-auto mb-6 opacity-20" />
                  <p className="text-xl font-medium">左側のリストから解析する報告を選択してください</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
