import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Database, Activity, ArrowRight, Globe, Save, Loader2, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';

const INITIAL_CASES = [
  {
    title: "兵庫県知事 パワハラ・公益通報対応問題",
    description: "2024年、兵庫県知事によるパワーハラ疑惑や贈答品の受領を指摘する告発文書を巡り、県が公益通報者保護法を軽視し、通報者を特定・処分した疑いが浮上。県議会で不信任決議が可決される異例の事態に発展した。",
    category: "organizational",
    severityIndex: 9,
    impactIndex: 10,
    recurrenceRisk: 4,
    date: "2024年〜継続中",
    location: "兵庫県庁",
    sourceUrl: "https://www.asahi.com/topics/word/%E5%85%B5%E5%BA%AB%E7%9C%8C%E7%9F%A5%E4%BA%8B.html",
    sourceTitle: "朝日新聞デジタル - 兵庫県知事問題"
  },
  {
    title: "自民党 派閥政治資金パーティー裏金事件",
    description: "自民党の主要派閥が政治資金パーティーの収入を収支報告書に記載せず、議員側に還流させて裏金化していた問題。行政の透明性を揺るがす重大な不祥事として、複数の議員が立件・離党する事態となった。",
    category: "organizational",
    severityIndex: 10,
    impactIndex: 10,
    recurrenceRisk: 8,
    date: "2023年12月〜報道",
    location: "永田町・国会議事堂",
    sourceUrl: "https://www.nhk.or.jp/news/special/political-fund/",
    sourceTitle: "NHK NEWS WEB - 政治資金問題"
  },
  {
    title: "【個人不祥事】市職員による公金横領事件",
    description: "地方自治体の職員が、数年間にわたり公金を自身の口座に振り込ませ、私的に流用していたことが発覚。内部監査の網を潜り抜ける手口が問題視され、管理責任も問われている。",
    category: "individual",
    severityIndex: 6,
    impactIndex: 4,
    recurrenceRisk: 7,
    date: "2024年3月発覚",
    location: "某地方自治体",
    sourceUrl: "https://www.google.com/search?q=%E5%85%AC%E5%8B%99%E5%93%A1+%E6%A8%AA%E9%A0%98+%E3%83%80%E3%82%A4%E3%82%B8%E3%82%A7%E3%82%B9%E3%83%88",
    sourceTitle: "ニュース検索 - 公務員 横領"
  },
  {
    title: "【個人不祥事】警察官による酒気帯び運転・当て逃げ",
    description: "非番の警察官が酒気帯び状態で車を運転し、物損事故を起こしたまま逃走。市民の信頼を裏切る行為として懲戒免職処分となった。警察組織全体の規律が改めて問われている。",
    category: "individual",
    severityIndex: 7,
    impactIndex: 5,
    recurrenceRisk: 6,
    date: "2024年2月",
    location: "某県警",
    sourceUrl: "https://www.google.com/search?q=%E8%AD%A6%E5%AF%9F%E5%AE%98+%E9%85%92%E6%B0%97%E5%B8%AF%E3%81%B3%E9%81%8B%E8%BB%A2",
    sourceTitle: "ニュース検索 - 警察官 不祥事"
  },
  {
    title: "マイナンバーカード 紐付けミス・情報漏洩",
    description: "健康保険証や公金受取口座が別人の情報と紐付けられるトラブルが全国で相次いだ。デジタル庁の管理体制の不備や、不具合発覚後の対応の遅れが「行政の不作為」として厳しく批判された。",
    category: "organizational",
    severityIndex: 8,
    impactIndex: 9,
    recurrenceRisk: 9,
    date: "2023年〜2024年",
    location: "デジタル庁・全国自治体",
    sourceUrl: "https://www.nikkei.com/topics/23052400",
    sourceTitle: "日本経済新聞 - マイナンバー問題"
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
          category: item.category || "other",
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
                        <div className="flex flex-col gap-1">
                          <h3 className="text-xl font-bold text-primary">{item.title}</h3>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit ${
                            item.category === 'individual' ? 'bg-orange-100 text-orange-700' : 
                            item.category === 'organizational' ? 'bg-blue-100 text-blue-700' : 
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {item.category === 'individual' ? '個人不祥事' : 
                             item.category === 'organizational' ? '組織的不祥事' : 'その他'}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded">NEW</span>
                      </div>
                      <p className="text-on-surface-variant mb-4 leading-relaxed">{item.description}</p>
                      
                      {/* Visual Indices */}
                      <div className="grid grid-cols-3 gap-4 mb-6 bg-white/50 p-4 rounded-xl border border-outline-variant/5">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-primary uppercase tracking-tighter">
                            <span>深刻度</span>
                            <span>{item.severityIndex || 5}/10</span>
                          </div>
                          <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.severityIndex || 5) * 10}%` }}
                              className="h-full bg-error"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-primary uppercase tracking-tighter">
                            <span>社会的影響</span>
                            <span>{item.impactIndex || 5}/10</span>
                          </div>
                          <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.impactIndex || 5) * 10}%` }}
                              className="h-full bg-secondary"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-primary uppercase tracking-tighter">
                            <span>再発リスク</span>
                            <span>{item.recurrenceRisk || 5}/10</span>
                          </div>
                          <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.recurrenceRisk || 5) * 10}%` }}
                              className="h-full bg-primary"
                            />
                          </div>
                        </div>
                      </div>

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
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">AI Discovery</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      item.category === 'individual' ? 'bg-orange-50 text-orange-600' : 
                      item.category === 'organizational' ? 'bg-blue-50 text-blue-600' : 
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {item.category === 'individual' ? '個人' : 
                       item.category === 'organizational' ? '組織' : '他'}
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant">
                    {item.createdAt?.toDate().toLocaleDateString('ja-JP')}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-primary mb-2 line-clamp-1">{item.title}</h4>
                <p className="text-sm text-on-surface-variant line-clamp-3 mb-4">{item.description}</p>
                
                {/* Visual Indices (Mini) */}
                <div className="flex gap-4 mb-4 bg-surface-container-low p-2 rounded-lg">
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[8px] font-bold text-primary uppercase">
                      <span>深刻度</span>
                      <span>{item.severityIndex || 5}</span>
                    </div>
                    <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-error" style={{ width: `${(item.severityIndex || 5) * 10}%` }} />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[8px] font-bold text-primary uppercase">
                      <span>影響</span>
                      <span>{item.impactIndex || 5}</span>
                    </div>
                    <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-secondary" style={{ width: `${(item.impactIndex || 5) * 10}%` }} />
                    </div>
                  </div>
                </div>

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
