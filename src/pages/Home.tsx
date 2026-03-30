import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Database, FileSearch, ArrowRight, Activity, Users, Globe, Scale, Clock, ExternalLink, Loader2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home() {
  const [latestCases, setLatestCases] = useState<any[]>([]);
  const [latestReports, setLatestReports] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/admin/collect', { method: 'POST' });
      if (!response.ok) throw new Error('Refresh failed');
      // The onSnapshot will pick up changes automatically
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Fetch latest misconduct cases (AI collected) - showing 5 as requested
    const qCases = query(collection(db, 'misconduct_cases'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribeCases = onSnapshot(qCases, (snapshot) => {
      setLatestCases(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch latest citizen reports
    const qReports = query(collection(db, 'reports'), orderBy('createdAt', 'desc'), limit(3));
    const unsubscribeReports = onSnapshot(qReports, (snapshot) => {
      setLatestReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeCases();
      unsubscribeReports();
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Mondrian Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-24">
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-6">
          <div className="col-span-8 row-span-4 border-r-8 border-b-8 border-black bg-white relative overflow-hidden">
            <img 
              src="https://picsum.photos/seed/mondrian-1/1200/800?grayscale" 
              alt="" 
              className="w-full h-full object-cover opacity-20 grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.h1 
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[12vw] font-headline text-black leading-[0.75] select-none"
              >
                PROJECT<br />MANA
              </motion.h1>
            </div>
          </div>
          <div className="col-span-4 row-span-2 border-b-8 border-black bg-secondary flex items-center justify-center">
             <span className="text-white font-headline text-4xl rotate-90">TRUTH</span>
          </div>
          <div className="col-span-4 row-span-2 border-b-8 border-black bg-mondrian-blue flex items-center justify-center">
             <span className="text-white font-headline text-4xl -rotate-90">JUSTICE</span>
          </div>
          <div className="col-span-2 row-span-2 border-r-8 border-black bg-mondrian-yellow"></div>
          <div className="col-span-6 row-span-2 border-r-8 border-black bg-white p-8 flex items-center">
             <h2 className="text-5xl font-serif italic text-black tracking-tight">
                不作為を、可視化する。
             </h2>
          </div>
          <div className="col-span-4 row-span-2 bg-black flex flex-col items-center justify-center gap-4">
            <Link to="/report" className="w-full h-1/2 flex items-center justify-center bg-secondary text-white font-headline text-3xl hover:bg-white hover:text-black transition-all border-b-4 border-black">
              REPORT NOW
            </Link>
            <Link to="/library" className="w-full h-1/2 flex items-center justify-center bg-mondrian-yellow text-black font-headline text-3xl hover:bg-black hover:text-white transition-all">
              EXPLORE
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Grid Section - Mondrian Style */}
      <section className="py-32 px-8 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-8 border-black">
          <div className="lg:col-span-5 p-12 border-r-8 border-black bg-white">
            <span className="editorial-label">The Mission</span>
            <h2 className="text-8xl mb-8">沈黙を、<br />記録に。</h2>
            <p className="text-2xl font-serif italic text-on-surface-variant leading-relaxed mb-12">
              行政の「不作為」を可視化すること。何が行われたかだけでなく、何が行われなかったかを記録することで、真の透明性を追求します。
            </p>
            <div className="grid grid-cols-2 gap-4">
               <div className="aspect-square bg-secondary border-4 border-black"></div>
               <div className="aspect-square bg-mondrian-blue border-4 border-black"></div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-0">
            <DBLinkCard 
              title="不作為DB"
              description="なすべき公務が行われなかった事例を体系的に記録。"
              icon={<Shield className="w-12 h-12" />}
              color="bg-white"
              textColor="text-black"
              link="https://fusakui-db.vercel.app/"
              className="border-b-8 md:border-b-8 md:border-r-8 border-black"
            />
            <DBLinkCard 
              title="不祥事DB"
              description="AIがネット上のニュースや公開資料から自動収集。"
              icon={<Database className="w-12 h-12" />}
              color="bg-mondrian-yellow"
              textColor="text-black"
              link="/collector"
              className="border-b-8 border-black"
            />
            <DBLinkCard 
              title="街の診断"
              description="あなたの住む街の「人権・住みやすさ」を客観的に診断。"
              icon={<MapPin className="w-12 h-12" />}
              color="bg-mondrian-blue"
              textColor="text-white"
              link="/town-check"
              className="md:border-r-8 border-black"
            />
            <DBLinkCard 
              title="公文書"
              description="開示された公文書をデジタル化して保存。"
              icon={<FileSearch className="w-12 h-12" />}
              color="bg-secondary"
              textColor="text-white"
              link="/library"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-surface-container-low py-24">
        <div className="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <StatItem icon={<Activity />} value="1,240+" label="記録された事例" />
          <StatItem icon={<Users />} value="8,500+" label="アクティブユーザー" />
          <StatItem icon={<FileSearch />} value="24,000+" label="公開ドキュメント" />
          <StatItem icon={<Globe />} value="12" label="連携自治体" />
        </div>
      </section>

      {/* Live Feed Section */}
      <section className="py-24 px-8 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-primary mb-4 flex items-center gap-3">
              <Clock className="w-8 h-8 text-secondary" />
              ライブ・フィード
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-container text-on-error-container animate-pulse">
                LIVE
              </span>
            </h2>
            <p className="text-on-surface-variant max-w-xl">
              AIによる毎時自動収集と市民からの報告。現在進行形の不作為をリアルタイムで追跡します。
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleForceRefresh} 
              disabled={isRefreshing}
              className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant disabled:opacity-50"
              title="最新の情報にAI収集を強制実行"
            >
              {isRefreshing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
            </button>
            <Link to="/collector" className="text-secondary font-bold flex items-center gap-2 hover:gap-4 transition-all">
              全ての収集データを見る
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* AI Discoveries */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-6">
              <Database className="w-5 h-5 text-secondary" />
              AI自動収集：最新の不祥事
            </h3>
            <div className="space-y-4">
              {latestCases.length > 0 ? latestCases.map((item) => (
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
                  <p className="text-sm text-on-surface-variant line-clamp-2 mb-4">{item.description}</p>
                  
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

                  <div className="flex gap-3">
                    {item.sources?.slice(0, 2).map((source: any, idx: number) => (
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
              )) : (
                <div className="p-12 text-center bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30">
                  <p className="text-on-surface-variant italic mb-6">AIが情報を収集中です...</p>
                  <button 
                    onClick={handleForceRefresh}
                    disabled={isRefreshing}
                    className="bg-secondary text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 mx-auto hover:bg-secondary/90 transition-all disabled:opacity-50"
                  >
                    {isRefreshing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
                    今すぐAI収集を実行
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Citizen Reports */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-secondary" />
              市民報告：最新の不作為
            </h3>
            <div className="space-y-4">
              {latestReports.length > 0 ? latestReports.map((report) => (
                <div key={report.id} className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10 hover:border-secondary transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{report.category}</span>
                    <span className="text-xs text-on-surface-variant">
                      {report.createdAt?.toDate().toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-primary mb-2 line-clamp-1">{report.title}</h4>
                  <p className="text-sm text-on-surface-variant line-clamp-2 mb-4">{report.description}</p>
                  <Link to="/analysis" className="text-xs font-bold text-secondary flex items-center gap-1 hover:underline">
                    AI法的精査を見る
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )) : (
                <div className="p-12 text-center bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30 text-on-surface-variant italic">
                  報告を待っています...
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-8 max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-5xl font-bold text-primary mb-8 leading-tight">
            沈黙を、<br />記録に変える。
          </h2>
          <div className="space-y-6 text-lg text-on-surface-variant leading-relaxed">
            <p>
              Project Manaの核心は、行政の「不作為」を可視化することにあります。何が行われたかだけでなく、何が行われなかったかを記録することで、真の透明性を追求します。
            </p>
            <p>
              私たちは、単なるデータの蓄積ではなく、そのデータが「市民の武器」となるようなプラットフォームを構築しています。
            </p>
          </div>
          <div className="flex flex-wrap gap-6 mt-12">
            <Link to="/report" className="bg-secondary text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-secondary/90 transition-all flex items-center gap-2 group">
              体験を報告する
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="text-primary font-bold text-lg flex items-center gap-2 hover:gap-4 transition-all">
              詳細なマニフェストを読む
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square bg-primary-fixed rounded-3xl overflow-hidden shadow-2xl rotate-3">
             <img 
               src="https://picsum.photos/seed/mana-portal/800/800" 
               alt="Project Mana Vision" 
               className="w-full h-full object-cover opacity-80 mix-blend-multiply"
               referrerPolicy="no-referrer"
             />
          </div>
          <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl max-w-xs -rotate-3">
            <p className="text-primary font-headline italic text-xl">
              「記録は、沈黙を拒むための唯一の手段である。」
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function DBLinkCard({ title, description, icon, color, textColor, link, className = "" }: any) {
  const isExternal = link.startsWith('http');
  const isPlaceholder = link === '#';
  
  const content = (
    <div className={`p-12 border-8 border-black ${color} ${textColor} hover:z-10 relative overflow-hidden flex flex-col justify-between h-[450px] transition-all group ${className}`}>
      <div className="relative z-10">
        <div className="mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition-transform inline-block">
          {icon}
        </div>
        <h3 className="text-5xl font-headline mb-4 tracking-tighter uppercase leading-none">{title}</h3>
        <p className="text-xl font-serif italic opacity-80 leading-relaxed max-w-xs">
          {description}
        </p>
      </div>
      
      <div className="relative z-10 flex items-center gap-2 font-headline text-sm tracking-widest uppercase mt-8">
        <span>{isPlaceholder ? 'COMING SOON' : 'EXPLORE DATABASE'}</span>
        {!isPlaceholder && <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />}
      </div>

      {/* Mondrian Hover Effect */}
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
    </div>
  );

  if (isPlaceholder) {
    return content;
  }

  if (isExternal) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
        {content}
      </a>
    );
  }

  return (
    <Link to={link} className="block h-full">
      {content}
    </Link>
  );
}

function StatItem({ icon, value, label }: any) {
  return (
    <div className="text-center">
      <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm text-secondary mb-6">
        {icon}
      </div>
      <div className="text-4xl font-bold text-primary mb-2">{value}</div>
      <div className="text-on-surface-variant font-medium">{label}</div>
    </div>
  );
}
