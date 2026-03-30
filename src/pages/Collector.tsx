import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Database, Activity, ArrowRight, Globe, Save, Loader2, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function Collector() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recentCollections, setRecentCollections] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'misconduct_cases'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecentCollections(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleCollect = async () => {
    if (!keyword.trim()) return;
    setIsCollecting(true);
    setResults([]);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      });

      if (!response.ok) throw new Error('AI自動収集に失敗しました。');

      const data = await response.json();
      setResults(data.cases || []);
    } catch (err) {
      console.error('Collection error:', err);
      setError('AI自動収集中にエラーが発生しました。');
    } finally {
      setIsCollecting(false);
    }
  };

  const handleSave = async () => {
    if (results.length === 0 || !auth.currentUser) {
      if (!auth.currentUser) setError('保存するにはログインが必要です。');
      return;
    }
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      for (const item of results) {
        await addDoc(collection(db, 'misconduct_cases'), {
          title: item.title,
          description: item.description,
          date: item.date || "",
          location: item.location || "",
          sources: [{ title: item.sourceTitle || "Source", uri: item.sourceUrl }],
          collectedBy: auth.currentUser.uid,
          createdAt: serverTimestamp(),
        });
      }
      setSuccess(`${results.length}件の事例をデータベースに保存しました。`);
      setResults([]); // Clear results after saving
    } catch (err) {
      console.error('Save error:', err);
      setError('保存中にエラーが発生しました。');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low pt-24 pb-12 px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
              <Database className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-primary">AI自動収集システム</h1>
          </motion.div>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            AIがインターネット上のニュースや公開資料から、行政の不祥事や不作為に関する情報を**毎時自動的に収集**・要約します。
          </p>
        </header>

        {/* Search Area */}
        <section className="bg-white p-8 rounded-3xl shadow-sm mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="例: 自治体 不祥事 2024, 道路建設 不作為"
                className="w-full bg-surface-container-high border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-12 py-4 rounded-t-xl outline-none text-lg"
              />
              <Search className="absolute left-4 top-4.5 w-6 h-6 text-on-surface-variant" />
            </div>
            <button
              onClick={handleCollect}
              disabled={isCollecting || !keyword.trim()}
              className="bg-secondary text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all disabled:opacity-50"
            >
              {isCollecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Globe className="w-5 h-5" />}
              AIで収集を開始
            </button>
          </div>
        </section>

        {/* Results Area */}
        {(results.length > 0 || isCollecting) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 mb-16"
          >
            <div className="bg-white p-10 rounded-3xl shadow-md relative">
              <div className="flex justify-between items-center mb-8 border-b border-outline-variant/20 pb-4">
                <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                  <Activity className="w-6 h-6 text-secondary" />
                  AI収集結果 ({results.length}件)
                </h2>
                {results.length > 0 && (
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    全てDBに保存
                  </button>
                )}
              </div>

              {isCollecting ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 text-on-surface-variant">
                  <Loader2 className="w-12 h-12 animate-spin text-secondary" />
                  <p className="animate-pulse">AIが最新情報を収集中です...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {results.map((item, idx) => (
                    <div key={idx} className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-primary">{item.title}</h3>
                        <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded">NEW</span>
                      </div>
                      <p className="text-on-surface-variant mb-4 leading-relaxed">{item.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant mb-4">
                        {item.date && <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {item.date}</span>}
                        {item.location && <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {item.location}</span>}
                      </div>
                      <a 
                        href={item.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-secondary font-bold hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {item.sourceTitle || "ソースを確認"}
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="mt-6 p-4 bg-error-container text-on-error-container rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-6 p-4 bg-primary-container text-primary-fixed rounded-xl flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  {success}
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Recent Collections Feed */}
        <section className="mt-16">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-6 h-6 text-secondary" />
            <h2 className="text-2xl font-bold text-primary">最近の収集アーカイブ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentCollections.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10 hover:border-secondary transition-all">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">AI Discovery</span>
                  <span className="text-xs text-on-surface-variant">
                    {item.createdAt?.toDate().toLocaleDateString('ja-JP')}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-primary mb-2 line-clamp-1">{item.title}</h4>
                <p className="text-sm text-on-surface-variant line-clamp-3 mb-4">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.sources?.slice(0, 3).map((source: any, idx: number) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] bg-surface-container-high px-2 py-1 rounded flex items-center gap-1 hover:bg-secondary/10 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Source {idx + 1}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
