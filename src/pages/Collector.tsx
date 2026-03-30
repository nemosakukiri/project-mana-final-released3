import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Database, Activity, ArrowRight, Globe, Save, Loader2, AlertCircle, Clock, ExternalLink, Download, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
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

  const exportToCSV = () => {
    if (recentCollections.length === 0) return;

    const headers = ['Title', 'Category', 'Description', 'Severity', 'Impact', 'Recurrence', 'Date', 'Location', 'Source'];
    const rows = recentCollections.map(item => [
      `"${(item.title || '').replace(/"/g, '""')}"`,
      item.category,
      `"${(item.description || '').replace(/"/g, '""')}"`,
      item.severityIndex,
      item.impactIndex,
      item.recurrenceRisk,
      item.date,
      item.location,
      item.sources?.[0]?.uri || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `project_mana_misconduct_db_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          severityIndex: item.severityIndex || 5,
          impactIndex: item.impactIndex || 5,
          recurrenceRisk: item.recurrenceRisk || 5,
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
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header - Mondrian Style */}
        <header className="grid grid-cols-12 border-b-8 border-black bg-white">
          <div className="col-span-12 lg:col-span-8 p-16 border-r-8 border-black">
            <span className="editorial-label">Archive No. 02</span>
            <h1 className="text-[10vw] font-headline mb-6 leading-none tracking-tighter">MISCONDUCT<br />DATABASE</h1>
            <p className="text-3xl font-serif italic text-on-surface-variant leading-relaxed max-w-2xl">
              AIによる常時監視と記録。行政の不作為と不祥事を、記者や学者のための「一次ソース」として体系化します。
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4 grid grid-rows-2">
            <div className="bg-mondrian-yellow border-b-8 border-black p-12 flex items-center justify-center">
               <Database className="w-24 h-24 text-black" />
            </div>
            <div className="bg-secondary p-12 flex flex-col items-center justify-center gap-6">
              <button 
                onClick={exportToCSV}
                className="w-full py-6 bg-white text-black font-headline text-2xl hover:bg-black hover:text-white transition-all border-4 border-black"
              >
                DOWNLOAD CSV
              </button>
            </div>
          </div>
        </header>

        {/* Search Area - Mondrian Style */}
        <section className="grid grid-cols-12 border-b-8 border-black bg-white">
          <div className="col-span-12 lg:col-span-9 p-16 border-r-8 border-black">
            <h2 className="text-5xl font-headline mb-12 uppercase">AI自動収集リクエスト</h2>
            <div className="flex flex-col md:flex-row gap-0 border-8 border-black">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="キーワードを入力（例：自治体 不祥事 2024）"
                className="flex-1 bg-white px-8 py-8 outline-none text-3xl font-serif italic"
              />
              <button
                onClick={handleCollect}
                disabled={isCollecting || !keyword.trim()}
                className="bg-black text-white px-16 py-8 font-headline text-3xl hover:bg-secondary transition-all disabled:opacity-50 border-l-8 border-black"
              >
                {isCollecting ? <Loader2 className="w-10 h-10 animate-spin" /> : "START"}
              </button>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3 bg-mondrian-blue p-12 flex items-center justify-center">
             <span className="text-white font-headline text-6xl rotate-90 tracking-widest">SEARCH</span>
          </div>
        </section>

        {/* Results and Archive Grid - Mondrian Style */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b-8 border-black">
          {/* Main Feed */}
          <div className="lg:col-span-8 border-r-8 border-black bg-white">
            <div className="p-12 border-b-8 border-black flex items-center justify-between bg-mondrian-yellow/10">
              <h2 className="text-6xl font-headline uppercase">Latest Discoveries</h2>
              <span className="text-xl font-mono font-bold">UPDATED HOURLY</span>
            </div>

            {isCollecting && (
              <div className="py-32 text-center border-b-8 border-black">
                <Loader2 className="w-24 h-24 animate-spin mx-auto text-secondary mb-8" />
                <p className="font-serif italic text-4xl">AIが深層ウェブから情報を抽出中...</p>
              </div>
            )}

            <div className="divide-y-8 divide-black">
              {(results.length > 0 ? results : recentCollections.slice(0, 15)).map((item, idx) => (
                <motion.article 
                  key={item.id || idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-12 hover:bg-mondrian-yellow/5 transition-colors group"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-4 aspect-[4/3] border-8 border-black bg-black overflow-hidden relative">
                      <img 
                        src={`https://picsum.photos/seed/${item.id || idx}/600/450?grayscale`} 
                        alt="" 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-secondary text-white px-4 py-2 font-headline text-lg border-2 border-black">
                        {item.category}
                      </div>
                    </div>
                    <div className="md:col-span-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-sm font-mono font-bold bg-black text-white px-3 py-1">{item.date || "DATE UNKNOWN"}</span>
                          <span className="text-sm font-mono font-bold border-2 border-black px-3 py-1">{item.location}</span>
                        </div>
                        <h3 className="text-5xl font-headline mb-6 leading-tight group-hover:text-secondary transition-colors uppercase">{item.title}</h3>
                        <p className="text-xl font-serif italic text-on-surface-variant leading-relaxed line-clamp-3 mb-8">
                          {item.description}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 border-4 border-black bg-white">
                          <span className="block text-xs font-bold uppercase mb-1">Severity</span>
                          <span className="text-2xl font-headline">{item.severityIndex}/10</span>
                        </div>
                        <div className="p-4 border-4 border-black bg-white">
                          <span className="block text-xs font-bold uppercase mb-1">Impact</span>
                          <span className="text-2xl font-headline">{item.impactIndex}/10</span>
                        </div>
                        <div className="p-4 border-4 border-black bg-white">
                          <span className="block text-xs font-bold uppercase mb-1">Risk</span>
                          <span className="text-2xl font-headline">{item.recurrenceRisk}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Sidebar - Mondrian Style */}
          <aside className="lg:col-span-4 bg-white flex flex-col">
            <div className="p-12 border-b-8 border-black bg-mondrian-blue text-white">
               <h2 className="text-5xl font-headline mb-8 uppercase">Citizen Audit</h2>
               <Link to="/town-check" className="group block p-10 border-8 border-black bg-white text-black hover:bg-black hover:text-white transition-all">
                  <div className="flex items-center justify-between mb-8">
                    <MapPin className="w-16 h-16" />
                    <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform" />
                  </div>
                  <h3 className="text-4xl font-headline mb-4 uppercase">街の診断へ</h3>
                  <p className="text-xl font-serif italic opacity-80">
                    あなたの街の住みやすさを評価。
                  </p>
               </Link>
            </div>
            
            <div className="p-12 border-b-8 border-black bg-mondrian-yellow">
               <h2 className="text-5xl font-headline mb-8 uppercase text-black">Resources</h2>
               <div className="space-y-8">
                  <div className="p-8 border-8 border-black bg-white">
                    <h4 className="text-2xl font-headline mb-4 uppercase">Journalist Toolkit</h4>
                    <p className="text-lg font-serif italic mb-6">
                      すべてのデータはCSV形式でダウンロード可能です。
                    </p>
                    <button 
                      onClick={exportToCSV}
                      className="w-full py-4 bg-black text-white font-headline text-xl hover:bg-secondary transition-all"
                    >
                      DOWNLOAD CSV
                    </button>
                  </div>
                  <div className="aspect-square bg-secondary border-8 border-black flex items-center justify-center">
                     <Database className="w-32 h-32 text-white" />
                  </div>
               </div>
            </div>
            
            <div className="flex-1 bg-black p-12 flex items-end">
               <span className="text-white font-headline text-4xl tracking-tighter opacity-40">PROJECT MANA ARCHIVE</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
