import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Database, Activity, ArrowRight, Globe, Save, Loader2, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';

const INITIAL_CASES = [
  {
    title: "兵庫県知事 パワハラ・公益通報対応問題",
    description: "2024年、兵庫県知事によるパワーハラ疑惑や贈答品の受領を指摘する告発文書を巡り、県が公益通報者保護法を軽視し、通報者を特定・処分した疑いが浮上。県議会で不信任決議が可決される異例の事態に発展した。",
    date: "2024年〜継続中",
    location: "兵庫県庁",
    sourceUrl: "https://www.asahi.com/topics/word/%E5%85%B5%E5%BA%AB%E7%9C%8C%E7%9F%A5%E4%BA%8B.html",
    sourceTitle: "朝日新聞デジタル - 兵庫県知事問題"
  },
  {
    title: "自民党 派閥政治資金パーティー裏金事件",
    description: "自民党の主要派閥が政治資金パーティーの収入を収支報告書に記載せず、議員側に還流させて裏金化していた問題。行政の透明性を揺るがす重大な不祥事として、複数の議員が立件・離党する事態となった。",
    date: "2023年12月〜報道",
    location: "永田町・国会議事堂",
    sourceUrl: "https://www.nhk.or.jp/news/special/political-fund/",
    sourceTitle: "NHK NEWS WEB - 政治資金問題"
  },
  {
    title: "マイナンバーカード 紐付けミス・情報漏洩",
    description: "健康保険証や公金受取口座が別人の情報と紐付けられるトラブルが全国で相次いだ。デジタル庁の管理体制の不備や、不具合発覚後の対応の遅れが「行政の不作為」として厳しく批判された。",
    date: "2023年〜2024年",
    location: "デジタル庁・全国自治体",
    sourceUrl: "https://www.nikkei.com/topics/23052400",
    sourceTitle: "日本経済新聞 - マイナンバー問題"
  },
  {
    title: "国土交通省 建設統計データ書き換え問題",
    description: "国土交通省が「建設工事受注動態統計調査」のデータを長年にわたり二重計上するなど書き換えていた。政府統計の信頼性を根本から損なう組織的な不祥事であり、GDP算出への影響も懸念された。",
    date: "2021年12月発覚",
    location: "国土交通省",
    sourceUrl: "https://www.mainichi.jp/articles/20211215/k00/00m/010/010000c",
    sourceTitle: "毎日新聞 - 統計書き換え問題"
  },
  {
    title: "大阪・関西万博 建設費大幅増額と不透明な予算管理",
    description: "万博会場の建設費が当初予定の1.9倍（約2350億円）に膨れ上がり、国民負担が増大。資材高騰への予測の甘さや、追加費用の説明が不十分であるとして、行政の責任を問う声が強まっている。",
    date: "2023年〜継続中",
    location: "大阪府・日本博覧会協会",
    sourceUrl: "https://www.yomiuri.co.jp/topics/20231020-OYT8T50030/",
    sourceTitle: "読売新聞オンライン - 万博予算問題"
  }
];

export default function Collector() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any[]>(INITIAL_CASES);
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
