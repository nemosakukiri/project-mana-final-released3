import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Database, FileSearch, ArrowRight, Activity, Users, Globe, Scale, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home() {
  const [latestCases, setLatestCases] = useState<any[]>([]);
  const [latestReports, setLatestReports] = useState<any[]>([]);

  useEffect(() => {
    // Fetch latest misconduct cases (AI collected)
    const qCases = query(collection(db, 'misconduct_cases'), orderBy('createdAt', 'desc'), limit(3));
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
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#a1cfcf_0%,transparent_50%)]"></div>
        </div>
        
        <div className="relative z-10 text-center px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-block bg-secondary/20 text-secondary-fixed px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase"
          >
            Project Mana: 尊厳の奪還作戦
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-8xl font-bold text-white mb-8 leading-tight font-headline"
          >
            不作為を、<br />可視化する。
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-primary-fixed-dim mb-12 leading-relaxed font-body max-w-2xl mx-auto"
          >
            なされるべきことが、なされない。その空白を記録し、<br />
            市民の力で行政の責任を問い直します。
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link to="/report" className="bg-secondary text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-secondary/90 transition-all flex items-center gap-2 group">
              体験を報告する
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/library" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
              ライブラリを探索
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Database Grid */}
      <section className="py-24 px-8 max-w-screen-2xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">統合データベース</h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Project Manaが提供する3つの主要なアーカイブ。それぞれの視点から行政の透明性を追求します。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DBLinkCard 
            title="不作為DB"
            description="なすべき公務が行われなかった事例を体系的に記録。市民の権利を守るためのデータベース。"
            icon={<Shield className="w-12 h-12" />}
            color="bg-primary-container"
            textColor="text-primary-fixed"
            link="https://fusakui-db.vercel.app/"
          />
          <DBLinkCard 
            title="不祥事DB"
            description="AIがネット上のニュースや公開資料から、行政の不祥事や不作為を自動的に収集・要約。市民による常時監視を実現します。"
            icon={<Database className="w-12 h-12" />}
            color="bg-secondary-fixed"
            textColor="text-on-secondary-fixed"
            link="/collector"
          />
          <DBLinkCard 
            title="公文書ライブラリ"
            description="開示された公文書をデジタル化して保存。誰でも自由に閲覧・検索が可能です。"
            icon={<FileSearch className="w-12 h-12" />}
            color="bg-tertiary-fixed"
            textColor="text-on-tertiary-fixed"
            link="/library"
          />
          <DBLinkCard 
            title="体験報告"
            description="あなたの体験をデータ化し、不作為のデータベースへ。沈黙を強いられた人々の記録。"
            icon={<Activity className="w-12 h-12" />}
            color="bg-error-container"
            textColor="text-on-error-container"
            link="/report"
          />
          <DBLinkCard 
            title="AI法的精査"
            description="記録された証言をAIが法的・倫理的観点から解析。証拠としての価値を最大化します。"
            icon={<Scale className="w-12 h-12" />}
            color="bg-primary-fixed"
            textColor="text-primary-fixed-dim"
            link="/analysis"
          />
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
              AIによる自動収集と市民からの報告。現在進行形の不作為をリアルタイムで追跡します。
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.reload()} 
              className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant"
              title="最新の情報に更新"
            >
              <Activity className="w-5 h-5" />
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
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">AI Discovery</span>
                    <span className="text-xs text-on-surface-variant">
                      {item.createdAt?.toDate().toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-primary mb-2 line-clamp-1">{item.keyword}</h4>
                  <p className="text-sm text-on-surface-variant line-clamp-2 mb-4">{item.summary}</p>
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
                <div className="p-12 text-center bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30 text-on-surface-variant italic">
                  AIが情報を収集中です...
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

function DBLinkCard({ title, description, icon, color, textColor, link }: any) {
  const isExternal = link.startsWith('http');
  const isPlaceholder = link === '#';
  
  const content = (
    <div className={`p-10 rounded-3xl ${color} ${textColor} hover:scale-[1.02] transition-all cursor-pointer shadow-sm flex flex-col h-full`}>
      <div className="mb-8 opacity-80">{icon}</div>
      <h3 className="text-3xl font-bold mb-4">{title}</h3>
      <p className="text-lg opacity-90 leading-relaxed mb-8 flex-1">{description}</p>
      <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm">
        {isPlaceholder ? '準備中' : 'アクセスする'}
        {!isPlaceholder && <ArrowRight className="w-4 h-4" />}
      </div>
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
