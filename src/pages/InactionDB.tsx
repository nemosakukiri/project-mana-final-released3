import React, { useState, useEffect } from 'react';
import { Search, BookOpen, FileText, BarChart3, Image as ImageIcon, Download, Eye, HelpCircle, ChevronDown, Scale, Send, ArrowRight, Filter, Archive, Database, Cpu, Loader2, AlertCircle, Save, MapPin, Clock, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { GoogleGenAI } from "@google/genai";

const INITIAL_INACTION = [
  {
    project: "都市計画道路 3・4・12号線 整備事業",
    budget: 1200000000,
    delay: "15年",
    location: "某地方都市",
    impact: "周辺住民の交通利便性低下、救急車両の通行困難",
    status: "停滞中",
    reportedAt: "2024-03-15T10:00:00Z"
  },
  {
    project: "公立小中学校 体育館エアコン設置事業",
    budget: 450000000,
    delay: "3年",
    location: "全国複数自治体",
    impact: "夏季の熱中症リスク増大、避難所としての機能不全",
    status: "遅延",
    reportedAt: "2024-03-10T10:00:00Z"
  }
];

export default function InactionDB() {
  const [keyword, setKeyword] = useState('');
  const [isCollecting, setIsCollecting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [inactionRecords, setInactionRecords] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'inaction'), orderBy('reportedAt', 'desc'), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setInactionRecords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'inaction');
    });
    return () => unsubscribe();
  }, []);

  const handleCollect = async () => {
    if (!keyword.trim()) return;
    setIsCollecting(true);
    setError('');
    setSuccess('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const prompt = `Search for recent examples of administrative inaction, unexecuted budgets, or delayed public projects in Japan related to: ${keyword}. 
      Return a list of cases in JSON format with the following fields: 
      project, budget (number in JPY), delay (string), location, impact, status.
      Focus on factual reports from official documents or reputable news.`;

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
        setError('No evidence of inaction found for the given parameters.');
        return;
      }

      for (const caseData of cases) {
        try {
          await addDoc(collection(db, 'inaction'), {
            ...caseData,
            reportedAt: new Date().toISOString(),
            createdAt: serverTimestamp()
          });
        } catch (err) {
          console.error('Error saving record:', err);
        }
      }

      setSuccess(`${cases.length} inaction records successfully digitized and archived.`);
      setKeyword('');
    } catch (err) {
      console.error('Collection error:', err);
      setError('AI Inaction collection protocol failed.');
    } finally {
      setIsCollecting(false);
    }
  };

  const displayItems = inactionRecords.length > 0 ? inactionRecords : INITIAL_INACTION;

  return (
    <div className="min-h-screen bg-[#F5F5F4] pt-24 pb-32 font-sans selection:bg-primary selection:text-on-primary">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        
        {/* Hero Section */}
        <section className="mb-24 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start border-b-4 border-primary pb-20">
            <div className="lg:col-span-8 space-y-12">
              <div className="flex items-center gap-6">
                <div className="px-4 py-1 bg-primary text-on-primary text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
                  Archive v4.2
                </div>
                <div className="h-[1px] w-12 bg-primary/30"></div>
                <span className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase">Project MANA Archive</span>
              </div>
              
              <h1 className="text-primary font-headline text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] uppercase">
                Inaction<br/>
                <span className="text-tertiary italic">Wealth</span><br/>
                Database
              </h1>
              <div className="text-primary/40 text-sm font-bold tracking-[0.2em] uppercase mt-4">
                不作為蓄財データベース：執行されない予算と放置された課題の記録
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                <p className="text-secondary text-xl leading-relaxed font-medium border-l-4 border-tertiary pl-8 italic">
                  "行政の不作為をデータ化し、執行されない予算という『負の資産』を可視化します。"
                </p>
                <div className="space-y-6">
                  <p className="text-sm text-secondary/70 font-medium leading-relaxed">
                    本データベースは、予算が計上されながら執行されない事業や、長期間放置されている行政課題を「不作為」として記録・蓄積します。
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/report" className="bg-primary text-on-primary px-8 py-4 font-headline text-lg uppercase tracking-widest hover:bg-tertiary transition-all flex items-center gap-3">
                      <Send className="w-5 h-5" />
                      Submit Evidence
                    </Link>
                    <Link to="/analysis" className="border-2 border-primary text-primary px-8 py-4 font-headline text-lg uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all flex items-center gap-3">
                      <Scale className="w-5 h-5" />
                      AI Audit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-4 hidden lg:block relative">
              <div className="aspect-[3/4] bg-white border-2 border-primary p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary text-on-tertiary flex items-center justify-center font-headline font-black text-4xl -rotate-12 translate-x-8 -translate-y-8">
                  DATA
                </div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-1 bg-tertiary"></div>
                    <div className="text-5xl font-headline font-black text-primary uppercase leading-none tracking-tighter">
                      Digitize<br/>Inaction
                    </div>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] opacity-40">Evidence Collection</p>
                  </div>
                  <div className="space-y-6">
                    <p className="text-sm font-medium text-secondary leading-relaxed italic">
                      AIを活用して公開情報から不作為の証拠を抽出し、データベースへ統合します。
                    </p>
                  </div>
                </div>
                <BookOpen className="w-64 h-64 text-primary/5 absolute -bottom-16 -right-16 rotate-12" />
              </div>
            </div>
          </div>
        </section>

        {/* AI Collection Area */}
        <section className="mb-24">
          <div className="bg-white border-4 border-primary p-12 lg:p-16 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-tertiary"></div>
            <div className="max-w-4xl space-y-10">
              <div className="flex items-center gap-4">
                <Cpu className="w-6 h-6 text-tertiary" />
                <h2 className="text-2xl font-headline font-black tracking-tight uppercase">AI Inaction Digitizer / AI不作為データ化エンジン</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative group">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="事業名や地域を入力（例：道路建設 遅延）..."
                    className="w-full bg-[#FBFBFB] border-b-4 border-primary/10 focus:border-tertiary transition-all px-0 py-6 text-2xl font-headline font-black text-primary outline-none placeholder:text-primary/10 uppercase tracking-tighter"
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
                        <span className="text-xl font-headline font-black uppercase tracking-widest">Digitize / データ化開始</span>
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
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8 space-y-16">
            <div className="flex justify-between items-end border-b-2 border-primary/10 pb-8">
              <div className="space-y-2">
                <h2 className="text-primary font-headline text-4xl font-black tracking-tight uppercase">Latest Records</h2>
                <div className="text-xs font-bold text-primary/40 uppercase tracking-widest">最新の不作為記録</div>
                <div className="h-[2px] w-16 bg-tertiary mt-2"></div>
              </div>
              <span className="text-[10px] font-mono font-bold text-secondary uppercase tracking-widest opacity-40">Total Entries: {displayItems.length}_Verified / 検証済み総数</span>
            </div>

            <div className="space-y-12">
              {displayItems.map((item, idx) => (
                <DocumentCard 
                  key={item.id || idx}
                  type="INACTION"
                  id={item.id ? `REC-${item.id.slice(0, 8)}` : `INIT-${idx}`}
                  date={item.reportedAt ? new Date(item.reportedAt).toLocaleDateString() : "2024.03.15"}
                  title={item.project}
                  description={item.impact}
                  budget={item.budget}
                  delay={item.delay}
                  location={item.location}
                  status={item.status}
                  icon={<FileText className="w-8 h-8" />}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-16">
            <div className="sticky top-32 space-y-16">
              <div className="bg-primary text-on-primary p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-x-8 -translate-y-8"></div>
                <h3 className="text-3xl font-headline font-black mb-10 flex items-center gap-4 tracking-tight uppercase">
                  <HelpCircle className="w-8 h-8 text-tertiary" />
                  Audit Tips / 診断のヒント
                </h3>
                <ul className="space-y-10">
                  <li className="flex gap-6 group">
                    <span className="text-tertiary font-headline text-3xl font-black opacity-40 group-hover:opacity-100 transition-opacity">01.</span>
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-widest text-white/40">Definition</div>
                      <p className="text-lg font-medium leading-relaxed italic">「不作為」とは、行政が法的義務を負いながら、正当な理由なくその義務を履行しない状態を指します。</p>
                    </div>
                  </li>
                  <li className="flex gap-6 group">
                    <span className="text-tertiary font-headline text-3xl font-black opacity-40 group-hover:opacity-100 transition-opacity">02.</span>
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-widest text-white/40">Data Usage</div>
                      <p className="text-lg font-medium leading-relaxed italic">本リポジトリの全データは、CC BY 4.0ライセンスに基づき、出典を明記することで自由な二次利用が可能です。</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function DocumentCard({ type, id, date, title, description, budget, delay, location, status, icon }: any) {
  return (
    <motion.article 
      whileHover={{ x: 10 }}
      className="group bg-white border-l-8 border-primary p-10 hover:border-tertiary transition-all cursor-pointer shadow-sm hover:shadow-2xl"
    >
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <div className="p-8 bg-primary/5 text-primary border border-primary/10 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500 shrink-0">
          {icon}
        </div>
        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap gap-6 items-center">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-tertiary bg-tertiary/10 px-3 py-1">{type}</span>
            <span className="text-[10px] font-mono font-bold text-secondary/40 uppercase tracking-widest">{id}</span>
            <div className="h-1 w-1 bg-primary/20 rounded-full"></div>
            <span className="text-[10px] font-mono font-bold text-secondary/40 uppercase tracking-widest">{date} RECORDED</span>
          </div>
          
          <h3 className="text-3xl font-headline font-black text-primary group-hover:text-tertiary transition-colors leading-none tracking-tight uppercase">
            {title}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-y border-primary/5">
            <div>
              <span className="block text-[8px] font-bold text-primary/30 uppercase tracking-widest">Budget / 予算</span>
              <span className="text-sm font-black text-primary">¥{budget?.toLocaleString()}</span>
            </div>
            <div>
              <span className="block text-[8px] font-bold text-primary/30 uppercase tracking-widest">Delay / 遅延期間</span>
              <span className="text-sm font-black text-primary">{delay}</span>
            </div>
            <div>
              <span className="block text-[8px] font-bold text-primary/30 uppercase tracking-widest">Location / 場所</span>
              <span className="text-sm font-black text-primary">{location}</span>
            </div>
            <div>
              <span className="block text-[8px] font-bold text-primary/30 uppercase tracking-widest">Status / 状況</span>
              <span className="text-sm font-black text-tertiary">{status}</span>
            </div>
          </div>

          <p className="text-secondary text-lg leading-relaxed font-medium italic border-l-2 border-primary/10 pl-6">
            {description}
          </p>
          
          <div className="flex justify-end pt-6">
            <Link 
              to="/analysis" 
              state={{ report: { title, description, category: 'inaction', date, location, budget, delay, status } }}
              className="group/link flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary border-b-2 border-primary/20 pb-1 hover:border-primary transition-all"
            >
              <Scale className="w-4 h-4" />
              AI Legal Audit / AI法的精査
              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
