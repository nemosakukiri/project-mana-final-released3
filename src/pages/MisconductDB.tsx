import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Database, Activity, ArrowRight, Globe, Save, Loader2, AlertCircle, Clock, ExternalLink, Download, MapPin, Cpu, BarChart3, Info, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { GoogleGenAI } from "@google/genai";

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
  const [results, setResults] = useState<any[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recentCollections, setRecentCollections] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'misconduct'), orderBy('collectedAt', 'desc'), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecentCollections(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'misconduct');
    });
    return () => unsubscribe();
  }, []);

  const exportToCSV = () => {
    const dataToExport = recentCollections.length > 0 ? recentCollections : INITIAL_CASES;
    const headers = ['Title', 'Category', 'Summary', 'Date', 'Location', 'Source'];
    const rows = dataToExport.map(item => [
      `"${(item.title || '').replace(/"/g, '""')}"`,
      item.category,
      `"${(item.summary || item.description || '').replace(/"/g, '""')}"`,
      item.date,
      item.location,
      item.url || item.sourceUrl || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `misconduct_archive_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCollect = async () => {
    if (!keyword.trim()) return;
    setIsCollecting(true);
    setError('');
    setSuccess('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const prompt = `Search for recent administrative misconduct, scandals, or corruption news in Japan related to: ${keyword}. 
      Return a list of cases in JSON format with the following fields: 
      title, date, location, category, summary, url, source.
      Focus on factual reports from reputable news sources.`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        },
      });

      const text = response.text;
      const data = JSON.parse(text);
      const cases = Array.isArray(data) ? data : (data.cases || []);

      if (cases.length === 0) {
        setError('No intelligence found for the given parameters.');
        return;
      }

      // Store in Firestore
      for (const caseData of cases) {
        try {
          await addDoc(collection(db, 'misconduct'), {
            ...caseData,
            collectedAt: new Date().toISOString(),
            createdAt: serverTimestamp()
          });
        } catch (err) {
          console.error('Error saving case:', err);
        }
      }

      setSuccess(`${cases.length} intelligence records successfully harvested and archived.`);
      setKeyword('');
    } catch (err) {
      console.error('Collection error:', err);
      setError('AI Intelligence collection protocol failed. Please verify connection.');
    } finally {
      setIsCollecting(false);
    }
  };

  const displayItems = recentCollections.length > 0 ? recentCollections : INITIAL_CASES;

  return (
    <div className="min-h-screen bg-[#F5F5F4] pt-24 pb-32 font-sans selection:bg-primary selection:text-on-primary">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        
        {/* Header - Authoritative Editorial */}
        <header className="mb-24 border-b-4 border-primary pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-9 space-y-10">
              <div className="flex items-center gap-6">
                <div className="px-4 py-1 bg-primary text-on-primary text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
                  AI Harvester v3.0
                </div>
                <div className="h-[1px] w-12 bg-primary/30"></div>
                <span className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase">Intelligence Gathering</span>
              </div>
              <h1 className="text-primary font-headline text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
                Misconduct<br/>
                <span className="text-tertiary italic">Database</span><br/>
                Archive
              </h1>
              <p className="text-secondary text-xl leading-relaxed font-medium border-l-4 border-tertiary pl-8 italic max-w-3xl">
                AIによる常時監視と記録。行政の不祥事を、記者や学者のための「一次ソース」として体系化し、データとして蓄積します。
              </p>
            </div>
            <div className="lg:col-span-3 hidden lg:block">
              <div className="aspect-square border-4 border-primary p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <Database className="w-20 h-20 text-primary group-hover:text-on-primary transition-colors mb-6 relative z-10" />
                <button 
                  onClick={exportToCSV}
                  className="text-lg font-headline font-black text-primary group-hover:text-on-primary border-b-2 border-primary group-hover:border-on-primary transition-all relative z-10 uppercase tracking-tighter"
                >
                  Export Ledger
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Search Area - Technical Dashboard */}
        <section className="mb-24">
          <div className="bg-white border-4 border-primary p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-tertiary"></div>
            <div className="max-w-4xl space-y-10">
              <div className="flex items-center gap-4">
                <Cpu className="w-6 h-6 text-tertiary" />
                <h2 className="text-2xl font-headline font-black tracking-tight uppercase">Autonomous Intelligence Request</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative group">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="ENTER SEARCH PARAMETERS (E.G. MUNICIPAL SCANDAL 2024)..."
                    className="w-full bg-[#FBFBFB] border-b-4 border-primary/10 focus:border-tertiary transition-all px-0 py-6 text-2xl font-headline font-black text-primary outline-none placeholder:text-primary/5 uppercase tracking-tighter"
                  />
                  <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 text-primary/10 group-focus-within:text-tertiary transition-colors" />
                </div>
                <button
                  onClick={handleCollect}
                  disabled={isCollecting || !keyword.trim()}
                  className="group relative px-16 py-6 bg-primary text-on-primary overflow-hidden transition-all active:scale-[0.99] disabled:opacity-30"
                >
                  <div className="absolute inset-0 bg-tertiary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <div className="relative z-10 flex items-center justify-center gap-4">
                    {isCollecting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        <Activity className="w-6 h-6" />
                        <span className="text-xl font-headline font-black uppercase tracking-widest">Collect</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
              {error && (
                <div className="flex items-center gap-3 text-error font-bold uppercase tracking-widest text-xs">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-3 text-success font-bold uppercase tracking-widest text-xs">
                  <Save className="w-4 h-4" />
                  {success}
                </div>
              )}
              <p className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.3em]">Protocol: Deep Web Extraction v4.2</p>
            </div>
          </div>
        </section>

        {/* Results and Archive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-16">
            <div className="flex items-end justify-between border-b-2 border-primary/10 pb-8">
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Archive Status</div>
                <h2 className="text-4xl font-headline font-black tracking-tighter uppercase text-primary">Latest Discoveries</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold tracking-[0.3em] text-primary/40 uppercase">Updated Hourly</span>
              </div>
            </div>

            {isCollecting && (
              <div className="py-32 text-center border-4 border-primary border-dashed bg-white">
                <Loader2 className="w-20 h-20 animate-spin mx-auto text-tertiary mb-10" />
                <p className="font-headline font-black text-3xl text-primary uppercase tracking-tighter">Extracting Intelligence...</p>
              </div>
            )}

            <div className="space-y-20">
              {displayItems.map((item, idx) => (
                <motion.article 
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-12 border-b-2 border-primary/5 pb-20 last:border-0"
                >
                  <div className="md:col-span-5 relative">
                    <div className="aspect-[4/3] bg-[#FBFBFB] border-2 border-primary/5 overflow-hidden relative">
                      <img 
                        src={`https://picsum.photos/seed/${item.id || idx}/800/600?grayscale`} 
                        alt="" 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="absolute -top-4 -left-4 bg-primary text-on-primary px-4 py-1 text-[10px] font-bold tracking-widest uppercase">
                      {item.category}
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-tertiary text-on-tertiary px-4 py-1 text-[10px] font-bold tracking-widest uppercase">
                      ID: {String(item.id || idx).slice(0, 8)}
                    </div>
                  </div>
                  <div className="md:col-span-7 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-tertiary" />
                          <span className="text-[10px] font-black tracking-widest text-primary/40 uppercase">{item.date || "DATE UNKNOWN"}</span>
                        </div>
                        <div className="w-[1px] h-3 bg-primary/10"></div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-tertiary" />
                          <span className="text-[10px] font-black tracking-widest text-primary/40 uppercase">{item.location}</span>
                        </div>
                      </div>
                      <h3 className="text-4xl lg:text-5xl font-headline font-black leading-[0.9] group-hover:text-tertiary transition-colors tracking-tighter uppercase text-primary">
                        {item.title}
                      </h3>
                      <p className="text-lg font-medium text-secondary/60 leading-relaxed italic border-l-4 border-primary/5 pl-6">
                        {item.summary || item.description}
                      </p>
                    </div>
                    
                    <div className="mt-8 flex justify-between items-center">
                      {item.url && (
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-tertiary hover:text-primary transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Source: {item.source || "External"}
                        </a>
                      )}
                      <Link 
                        to="/analysis" 
                        state={{ report: item }}
                        className="group/link flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary border-b-2 border-primary/20 pb-1 hover:border-primary transition-all"
                      >
                        <Cpu className="w-4 h-4 text-tertiary" />
                        Execute AI Scrutiny
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="sticky top-32 space-y-12">
              
              {/* Audit Widget */}
              <div className="bg-primary text-on-primary p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-x-10 -translate-y-10"></div>
                <h2 className="text-3xl font-headline font-black mb-10 tracking-tighter uppercase relative z-10">Citizen Audit</h2>
                <Link to="/town-check" className="group block p-10 bg-white/10 border-2 border-white/20 hover:bg-white/20 transition-all relative z-10">
                  <div className="flex items-center justify-between mb-10">
                    <div className="w-16 h-16 border-2 border-tertiary rounded-full flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-tertiary" />
                    </div>
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition-transform text-tertiary" />
                  </div>
                  <h3 className="text-3xl font-headline font-black mb-4 uppercase tracking-tight">街の診断</h3>
                  <p className="text-sm font-medium text-white/60 leading-relaxed italic">
                    あなたの街の住みやすさと行政の透明性を、独自の指標で評価・記録します。
                  </p>
                </Link>
              </div>
              
              {/* Resources Widget */}
              <div className="bg-white border-4 border-primary p-12 relative">
                <div className="absolute -top-4 -left-4 bg-tertiary text-on-tertiary px-4 py-1 text-[10px] font-bold uppercase tracking-widest">Resources</div>
                <div className="space-y-12">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <BarChart3 className="w-6 h-6 text-primary" />
                      <h4 className="text-2xl font-headline font-black uppercase tracking-tight">Scholarly Toolkit</h4>
                    </div>
                    <p className="text-sm font-medium text-secondary/60 leading-relaxed italic border-l-4 border-primary/10 pl-6">
                      すべてのデータはCSV形式でダウンロード可能です。研究や報道の一次資料として活用してください。
                    </p>
                    <button 
                      onClick={exportToCSV}
                      className="w-full py-6 bg-primary text-on-primary font-headline text-xl font-black uppercase tracking-widest hover:bg-tertiary transition-all"
                    >
                      Download CSV
                    </button>
                  </div>
                  <div className="aspect-square bg-[#FBFBFB] border-2 border-primary/5 flex flex-col items-center justify-center text-center p-10">
                    <Database className="w-20 h-20 text-primary/10 mb-6" />
                    <div className="text-[10px] font-bold text-primary/20 uppercase tracking-[0.4em]">Project Mana Archive</div>
                  </div>
                </div>
              </div>

              {/* Security Alert */}
              <div className="bg-error/5 border-l-8 border-error p-8 flex items-start gap-6">
                <ShieldAlert className="w-8 h-8 text-error shrink-0" />
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-error uppercase tracking-widest">Integrity Alert</h4>
                  <p className="text-xs font-medium text-error/60 leading-relaxed italic">
                    不正確な情報の投稿は、アーカイブの信頼性を損なう可能性があります。事実に即した記録を心がけてください。
                  </p>
                </div>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
