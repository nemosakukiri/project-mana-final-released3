import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowRight, Activity, Database, Clock, ExternalLink, Loader2, BarChart3, BookOpen, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home() {
  const [latestCases, setLatestCases] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const qCases = query(collection(db, 'misconduct_cases'), orderBy('createdAt', 'desc'), limit(3));
    const unsubscribeCases = onSnapshot(qCases, (snapshot) => {
      setLatestCases(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribeCases();
  }, []);

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch('/api/admin/collect', { method: 'POST' });
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="max-w-screen-2xl mx-auto px-8 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-secondary font-bold tracking-[0.2em] text-xs uppercase mb-6 block"
          >
            Understanding Administrative Inaction
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl lg:text-8xl font-headline font-bold text-primary leading-[1.05] mb-8"
          >
            「何もしない」という<br />
            <span className="serif-italic text-secondary">静かな実害</span>を<br />
            可視化する。
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-on-surface-variant leading-relaxed max-w-xl mb-12 font-serif"
          >
            行政不作為とは、行政機関が法律上の義務があるにもかかわらず、正当な理由なく必要な措置を講じない状態を指します。それは目に見える「失敗」ではなく、放置された「空白」によって市民の生活を蝕みます。
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-6"
          >
            <button className="bg-secondary text-white px-10 py-5 rounded-full font-bold shadow-2xl shadow-secondary/20 hover:brightness-110 transition-all flex items-center gap-3 group">
              解説を詳しく読む
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link to="/collector" className="text-primary font-bold px-8 py-5 rounded-full hover:bg-primary/5 transition-all border border-primary/10">
              最新の報告を見る
            </Link>
          </motion.div>
        </div>
        <div className="lg:col-span-5 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="aspect-[4/5] bg-surface-container-highest rounded-[3rem] overflow-hidden relative shadow-2xl"
          >
            <img 
              alt="Old archive library" 
              className="object-cover w-full h-full opacity-90 mix-blend-multiply grayscale hover:grayscale-0 transition-all duration-700" 
              src="https://picsum.photos/seed/archive/800/1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -bottom-10 -left-10 bg-white p-10 rounded-3xl shadow-2xl max-w-[280px] border border-outline-variant/20"
          >
            <p className="text-lg font-serif italic text-primary leading-relaxed">
              「制度は存在するが、運用が止まっている。それが最も深い孤独を生む。」
            </p>
          </motion.div>
        </div>
      </section>

      {/* Index & Comparison Section */}
      <section className="bg-surface-container-low py-24 lg:py-32">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="editorial-label">Data Analysis</span>
              <h2 className="text-5xl font-bold text-primary mb-6">不作為指数：地域別比較</h2>
              <p className="text-on-surface-variant text-lg font-serif">
                各自治体の対応速度、情報公開度、市民満足度を独自のアルゴリズムで指数化。
                「沈黙の度合い」を客観的に比較します。
              </p>
            </div>
            <div className="flex gap-4">
              <button className="bg-white border border-outline-variant/30 px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-surface-container-high transition-all">
                <TrendingUp className="w-4 h-4" />
                ランキング詳細
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <IndexCard 
              region="東京都 A区" 
              score={78} 
              trend="up" 
              details="福祉サービスの申請遅延が目立つ。前月比+5pt。"
              tags={["福祉", "窓口対応"]}
            />
            <IndexCard 
              region="大阪府 B市" 
              score={42} 
              trend="down" 
              details="情報公開請求への回答が迅速化。改善傾向。"
              tags={["情報公開", "教育"]}
            />
            <IndexCard 
              region="神奈川県 C市" 
              score={92} 
              trend="up" 
              details="インフラ整備の長期放置が深刻。過去最高値を記録。"
              tags={["インフラ", "安全"]}
            />
          </div>

          <div className="mt-16 bg-white p-8 lg:p-12 rounded-[3rem] shadow-xl border border-outline-variant/20">
            <div className="flex items-center gap-4 mb-8">
              <BarChart3 className="w-8 h-8 text-secondary" />
              <h3 className="text-2xl font-bold text-primary">分野別不作為トレンド</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              <TrendMini score={85} label="福祉・介護" />
              <TrendMini score={45} label="教育・文化" />
              <TrendMini score={62} label="都市計画" />
              <TrendMini score={94} label="環境保護" />
              <TrendMini score={30} label="医療・衛生" />
            </div>
          </div>
        </div>
      </section>

      {/* Columns Section */}
      <section className="py-24 lg:py-32 max-w-screen-2xl mx-auto px-8">
        <div className="text-center mb-20">
          <span className="editorial-label">Insights & Columns</span>
          <h2 className="text-5xl font-bold text-primary mb-6">視点：不作為を読み解く</h2>
          <p className="text-on-surface-variant text-lg font-serif max-w-2xl mx-auto">
            専門家やジャーナリストによる、制度の隙間と市民生活の交差点を描くコラム集。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <ColumnCard 
            title="「待機」という名の暴力"
            author="佐藤 健一"
            date="2024.03.15"
            category="社会保障"
            image="https://picsum.photos/seed/column1/600/400"
            excerpt="なぜ福祉の現場では「調査中」という言葉が半年以上も続くのか。制度の疲弊と不作為の境界線を探る。"
          />
          <ColumnCard 
            title="デジタル庁の死角"
            author="田中 美咲"
            date="2024.03.10"
            category="行政DX"
            image="https://picsum.photos/seed/column2/600/400"
            excerpt="オンライン申請の裏側で止まっているアナログな承認プロセス。効率化の影に隠れた新しい不作為の形。"
          />
          <ColumnCard 
            title="地方自治の再生と監視"
            author="Robert Wilson"
            date="2024.03.02"
            category="政治学"
            image="https://picsum.photos/seed/column3/600/400"
            excerpt="市民による監視が機能しない時、自治体はどのようにして「何もしない」選択を正当化するのか。"
          />
        </div>

        <div className="mt-16 text-center">
          <button className="text-primary font-bold text-lg flex items-center gap-2 mx-auto hover:gap-4 transition-all group">
            すべてのコラムを読む
            <ArrowRight className="w-6 h-6 group-hover:text-secondary transition-colors" />
          </button>
        </div>
      </section>

      {/* Latest Feed Section */}
      <section className="py-24 lg:py-32 bg-primary text-white overflow-hidden relative">
        <div className="max-w-screen-2xl mx-auto px-8 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-5xl font-bold mb-6 flex items-center gap-4">
                <Activity className="w-10 h-10 text-secondary animate-pulse" />
                リアルタイム・フィード
              </h2>
              <p className="text-primary-fixed text-lg font-serif opacity-80 max-w-xl">
                AIによる自動収集と市民からの報告。現在進行形の不作為を秒単位で追跡します。
              </p>
            </div>
            <button 
              onClick={handleForceRefresh}
              disabled={isRefreshing}
              className="bg-secondary text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
            >
              {isRefreshing ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
              AI収集を更新
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {latestCases.map((item) => (
              <div key={item.id} className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">AI Discovery</span>
                  <span className="text-xs opacity-50">{item.createdAt?.toDate().toLocaleDateString('ja-JP')}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-secondary transition-colors">{item.title}</h3>
                <p className="text-sm opacity-70 line-clamp-3 mb-6 font-serif">{item.description}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-secondary">
                  <AlertTriangle className="w-4 h-4" />
                  深刻度: {item.severityIndex || 5}/10
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/10 to-transparent pointer-events-none"></div>
      </section>
    </div>
  );
}

function IndexCard({ region, score, trend, details, tags }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-outline-variant/10 hover:shadow-2xl transition-all group">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-2xl font-bold text-primary mb-1">{region}</h3>
          <div className="flex gap-2">
            {tags.map((tag: string) => (
              <span key={tag} className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/60">#{tag}</span>
            ))}
          </div>
        </div>
        <div className={`flex items-center gap-1 font-bold ${trend === 'up' ? 'text-error' : 'text-green-600'}`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
          {trend === 'up' ? '+5%' : '-3%'}
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Inaction Index</span>
          <span className="text-5xl font-headline font-bold text-primary">{score}</span>
        </div>
        <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${score}%` }}
            className={`h-full ${score > 70 ? 'bg-error' : score > 40 ? 'bg-secondary' : 'bg-green-500'}`}
          />
        </div>
      </div>

      <p className="text-sm text-on-surface-variant font-serif leading-relaxed italic">
        "{details}"
      </p>
    </div>
  );
}

function TrendMini({ score, label }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</span>
        <span className="text-lg font-headline font-bold text-primary">{score}</span>
      </div>
      <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${score}%` }}
          className={`h-full ${score > 70 ? 'bg-error' : 'bg-secondary'}`}
        />
      </div>
    </div>
  );
}

function ColumnCard({ title, author, date, category, image, excerpt }: any) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 shadow-lg relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
          {category}
        </div>
      </div>
      <div className="flex items-center gap-3 mb-3 text-xs text-on-surface-variant font-medium">
        <span>{author}</span>
        <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
        <span>{date}</span>
      </div>
      <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-secondary transition-colors leading-snug">
        {title}
      </h3>
      <p className="text-on-surface-variant font-serif leading-relaxed line-clamp-2 opacity-80">
        {excerpt}
      </p>
    </div>
  );
}
