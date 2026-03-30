import { motion } from 'motion/react';
import { 
  Shield, 
  ArrowRight, 
  TrendingUp, 
  AlertTriangle, 
  History, 
  MapPin, 
  Clock, 
  Link as LinkIcon,
  Share2,
  ChevronRight,
  Gavel,
  Database,
  Activity,
  FileText,
  Search,
  Cpu,
  Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F4] pt-24 pb-32 font-sans selection:bg-primary selection:text-on-primary">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        
        {/* Hero Section - Bold Portal Entry */}
        <section className="mb-32 border-b-4 border-primary pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-end">
            <div className="lg:col-span-8 space-y-12">
              <div className="flex items-center gap-6">
                <div className="px-4 py-1 bg-primary text-on-primary text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
                  Portal v4.0
                </div>
                <div className="h-[1px] w-12 bg-primary/30"></div>
                <span className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase">Civic Integrity Ledger</span>
              </div>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary font-headline text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.82] uppercase"
              >
                Civic<br/>
                <span className="text-tertiary italic">Integrity</span><br/>
                Portal
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-secondary text-2xl lg:text-3xl max-w-3xl leading-tight font-medium border-l-8 border-tertiary pl-10 italic"
              >
                行政の不祥事、不作為、そして法的精査。市民の知る権利を拡張し、透明な社会を構築するための統合ポータルサイト。
              </motion.p>
            </div>
            <div className="lg:col-span-4 space-y-10">
              <Link to="/manifesto" className="aspect-square bg-tertiary border-4 border-primary p-12 flex flex-col justify-between relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="text-[10px] font-bold text-on-tertiary group-hover:text-on-primary uppercase tracking-widest mb-4">Foundation</div>
                  <h3 className="text-4xl font-headline font-black text-on-tertiary group-hover:text-on-primary uppercase tracking-tighter leading-none">Our<br/>Manifesto</h3>
                </div>
                <div className="relative z-10 flex items-center justify-between group/btn">
                  <span className="text-lg font-headline font-black text-on-tertiary group-hover:text-on-primary uppercase border-b-2 border-on-tertiary group-hover:border-on-primary transition-all">Read Vision</span>
                  <ArrowRight className="w-8 h-8 text-white group-hover:translate-x-4 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Portal Grid - The Three Pillars */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Pillar 1: Inaction DB */}
            <Link to="/inaction-db" className="group relative bg-white border-4 border-primary p-12 flex flex-col justify-between aspect-[4/5] overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary text-on-tertiary flex items-center justify-center font-headline font-black text-4xl -rotate-12 translate-x-8 -translate-y-8 group-hover:rotate-0 transition-transform">
                01
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <FileText className="w-8 h-8 text-tertiary" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40">Database Alpha</span>
                </div>
                <h2 className="text-6xl font-headline font-black text-primary uppercase tracking-tighter leading-none mb-8">
                  Inaction<br/>
                  <span className="text-tertiary italic">Digitized</span><br/>
                  DB
                </h2>
                <p className="text-lg font-medium text-secondary leading-relaxed italic border-l-4 border-primary/10 pl-6">
                  「何もしないこと」の罪を、AIがデータ化。行政の不作為による損失と、放置された市民課題をアーカイブ。
                </p>
              </div>
              <div className="relative z-10 flex items-center justify-between border-t-2 border-primary/5 pt-8">
                <span className="text-xs font-black uppercase tracking-widest text-primary group-hover:text-tertiary transition-colors">Enter Database</span>
                <ArrowRight className="w-8 h-8 text-tertiary group-hover:translate-x-4 transition-transform" />
              </div>
              <div className="absolute bottom-[-10%] right-[-10%] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <FileText className="w-64 h-64 rotate-12" />
              </div>
            </Link>

            {/* Pillar 2: Misconduct DB */}
            <Link to="/misconduct-db" className="group relative bg-primary text-on-primary p-12 flex flex-col justify-between aspect-[4/5] overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white text-primary flex items-center justify-center font-headline font-black text-4xl -rotate-12 translate-x-8 -translate-y-8 group-hover:rotate-0 transition-transform">
                02
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <Database className="w-8 h-8 text-tertiary" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Database Beta</span>
                </div>
                <h2 className="text-6xl font-headline font-black text-white uppercase tracking-tighter leading-none mb-8">
                  Misconduct<br/>
                  <span className="text-tertiary italic">AI News</span><br/>
                  DB
                </h2>
                <p className="text-lg font-medium text-white/70 leading-relaxed italic border-l-4 border-white/10 pl-6">
                  Gemini AIによる常時ニュース収集と記録。行政の不祥事を、記者や学者のための「一次ソース」として体系化。
                </p>
              </div>
              <div className="relative z-10 flex items-center justify-between border-t-2 border-white/5 pt-8">
                <span className="text-xs font-black uppercase tracking-widest text-white group-hover:text-tertiary transition-colors">Access Archive</span>
                <ArrowRight className="w-8 h-8 text-tertiary group-hover:translate-x-4 transition-transform" />
              </div>
              <div className="absolute bottom-[-10%] right-[-10%] opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                <Database className="w-64 h-64 rotate-12" />
              </div>
            </Link>

            {/* Pillar 3: Analysis Site */}
            <Link to="/analysis" className="group relative bg-white border-4 border-primary p-12 flex flex-col justify-between aspect-[4/5] overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary text-on-tertiary flex items-center justify-center font-headline font-black text-4xl -rotate-12 translate-x-8 -translate-y-8 group-hover:rotate-0 transition-transform">
                03
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <Cpu className="w-8 h-8 text-tertiary" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40">Analysis Engine</span>
                </div>
                <h2 className="text-6xl font-headline font-black text-primary uppercase tracking-tighter leading-none mb-8">
                  AI Column<br/>
                  <span className="text-tertiary italic">Portal</span><br/>
                  Site
                </h2>
                <p className="text-lg font-medium text-secondary leading-relaxed italic border-l-4 border-primary/10 pl-6">
                  蓄積されたデータをAIが多角的に指数化。独自の「市民整合性指数」と「不作為コスト」による定期コラムを配信。
                </p>
              </div>
              <div className="relative z-10 flex items-center justify-between border-t-2 border-primary/5 pt-8">
                <span className="text-xs font-black uppercase tracking-widest text-primary group-hover:text-tertiary transition-colors">Launch Audit</span>
                <ArrowRight className="w-8 h-8 text-tertiary group-hover:translate-x-4 transition-transform" />
              </div>
              <div className="absolute bottom-[-10%] right-[-10%] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Cpu className="w-64 h-64 rotate-12" />
              </div>
            </Link>
          </div>
        </section>

        {/* Comparative Dashboard - Technical Analysis */}
        <section className="mb-32">
          <div className="flex items-end justify-between mb-16 border-b-2 border-primary/10 pb-8">
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Comparative Metrics</div>
              <h2 className="text-5xl font-headline font-black tracking-tighter uppercase text-primary">Civic Integrity Dashboard</h2>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">National Avg</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-tertiary"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Local Ledger</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Metric 1: Inaction Wealth Index */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-8 bg-white border-4 border-primary p-12 lg:p-16 relative overflow-hidden shadow-2xl shadow-primary/5"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-tertiary"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-16">
                  <div className="space-y-2">
                    <span className="text-tertiary text-[10px] font-bold tracking-[0.3em] uppercase block">Index 01</span>
                    <h3 className="text-primary font-headline text-5xl font-black uppercase tracking-tighter">Inaction Wealth Index</h3>
                  </div>
                  <div className="px-4 py-1 bg-error text-white text-[10px] font-bold tracking-widest uppercase rounded-full animate-pulse">Critical Alert</div>
                </div>

                <div className="flex flex-col lg:flex-row items-end gap-20">
                  <div className="flex-1 w-full space-y-10">
                    <div className="relative h-64 flex items-end gap-8 border-b-2 border-primary/10 pb-6">
                      {[
                        { city: 'YOKOHAMA', val: '40%', amount: '¥120B' },
                        { city: 'NAGOYA', val: '35%', amount: '¥95B' },
                        { city: 'OSAKA', val: '45%', amount: '¥140B' },
                        { city: 'KYOTO', val: '85%', amount: '¥182B', highlight: true },
                      ].map((item, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-4 group cursor-crosshair">
                          <motion.div 
                            initial={{ height: 0 }}
                            whileInView={{ height: item.val }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className={`w-full transition-all duration-700 relative ${
                              item.highlight ? 'bg-tertiary' : 'bg-primary/10 group-hover:bg-primary/20'
                            }`}
                          >
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-primary text-on-primary text-[10px] font-bold px-3 py-2 rounded-none whitespace-nowrap transition-all uppercase tracking-widest">
                              {item.amount}
                            </div>
                            {item.highlight && (
                              <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-tertiary text-on-tertiary text-[10px] px-4 py-2 font-black whitespace-nowrap shadow-xl border border-white/20 uppercase tracking-widest">
                                KYOTO: +82%
                              </div>
                            )}
                          </motion.div>
                          <span className={`text-[10px] font-black tracking-widest uppercase ${item.highlight ? 'text-tertiary' : 'text-primary/30'}`}>
                            {item.city}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xl text-secondary leading-relaxed font-medium italic border-l-4 border-primary/10 pl-8">
                      不作為蓄財（予算の未執行）に対し、市民課題の放置率が他都市平均を大幅に上回っています。
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-tertiary font-headline text-[10rem] font-black leading-none tracking-tighter">8.4</div>
                    <div className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.4em] mt-4">Scale / 10.0</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Metric 2: Stagnation Rate */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-4 bg-primary text-on-primary p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-primary/20"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-x-10 -translate-y-10"></div>
              <div className="relative z-10">
                <span className="text-tertiary text-[10px] font-bold tracking-[0.3em] uppercase block mb-2">Index 02</span>
                <h3 className="text-4xl font-headline font-black uppercase tracking-tighter leading-none">Update<br/>Stagnation</h3>
              </div>
              <div className="py-16 relative z-10">
                <div className="relative w-48 h-48 mx-auto">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9155" fill="none" className="stroke-white/10" strokeWidth="4" />
                    <motion.circle 
                      cx="18" cy="18" r="15.9155" fill="none" className="stroke-tertiary" strokeWidth="4"
                      strokeDasharray="72, 100"
                      initial={{ strokeDasharray: "0, 100" }}
                      whileInView={{ strokeDasharray: "72, 100" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      strokeLinecap="butt"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-headline font-black">72<small className="text-2xl ml-1">%</small></span>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-4 relative z-10">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">System Performance</p>
                <p className="text-2xl font-headline font-black text-tertiary uppercase tracking-tight">Worst in Class</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Archive Feed - Editorial List Style */}
        <section className="mb-32">
          <div className="flex items-end justify-between mb-16 border-b-2 border-primary/10 pb-8">
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Intelligence Feed</div>
              <h2 className="text-5xl font-headline font-black tracking-tighter uppercase text-primary">Recent Documentation</h2>
            </div>
            <Link to="/misconduct-db" className="group flex items-center gap-4 text-primary font-black text-[10px] uppercase tracking-[0.3em] hover:text-tertiary transition-all">
              Explore Full Archive
              <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-16">
            {[
              {
                id: 'AS-2024-089',
                date: '2024.10.12',
                location: 'NAKAGYO WARD',
                title: '【福祉不作為】生活保護申請窓口における水際作戦と記録の未作成',
                desc: '相談者が3度にわたり来庁したにも関わらず、正式な受付を行わず「相談」として処理。法律で定められた教示義務を放棄し、困窮者の生存権を脅かす不作為が確認された。',
                tags: ['PROCEDURAL LAW', 'WELFARE'],
                img: 'https://picsum.photos/seed/integrity-089/1200/600?grayscale'
              },
              {
                id: 'AS-2024-072',
                date: '2024.09.28',
                location: 'KYOTO CITY HALL',
                title: '【環境不作為】アスベスト含有疑い施設における調査報告の2年間放置',
                desc: '民間企業からの調査依頼に対し、受理後24ヶ月間にわたり実地調査を延期。担当部署の「人員不足」を理由とした組織的不作為による周辺住民への健康被害リスク。',
                tags: ['ENVIRONMENTAL SAFETY', 'NEGLECT'],
                img: 'https://picsum.photos/seed/integrity-072/1200/600?grayscale'
              }
            ].map((item, i) => (
              <motion.article 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-b-2 border-primary/5 pb-16 last:border-0"
              >
                <div className="lg:col-span-5 relative overflow-hidden">
                  <div className="aspect-[16/9] bg-white border-2 border-primary/5 overflow-hidden">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute top-4 left-4 bg-primary text-on-primary px-4 py-1 text-[10px] font-bold tracking-widest uppercase">
                    ID: {item.id}
                  </div>
                </div>
                <div className="lg:col-span-7 space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-tertiary" />
                      <span className="text-[10px] font-black tracking-widest text-primary/40 uppercase">{item.date}</span>
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
                  <p className="text-xl font-medium text-secondary/60 leading-relaxed italic border-l-4 border-primary/5 pl-8">
                    {item.desc}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-primary/30 border border-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">#{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Accountability Timeline - Technical Vertical Rail */}
        <section className="mb-32">
          <div className="flex items-center gap-6 mb-20">
            <div className="w-16 h-16 bg-primary text-on-primary flex items-center justify-center">
              <History className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Temporal Analysis</div>
              <h2 className="text-4xl font-headline font-black tracking-tighter uppercase text-primary">
                Chain of Inaction
              </h2>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[2px] bg-primary/10 -translate-x-1/2"></div>
            
            <div className="space-y-24">
              {[
                {
                  date: '2024.11.01',
                  title: 'SYSTEM DEPLOYMENT POSTPONED',
                  desc: '5年前から計画されていたデジタル化予算が「他事業への補填」を理由に凍結。市民サービスのアップデートが停止。',
                  side: 'left'
                },
                {
                  date: '2024.10.15',
                  title: 'INFORMATION REQUEST DENIED',
                  desc: '不作為蓄財に関する詳細データの開示を拒否。「意思決定の過程」であることを理由に透明性を遮断。',
                  side: 'right'
                }
              ].map((item, i) => (
                <div key={i} className={`relative flex flex-col md:flex-row items-center justify-between ${item.side === 'right' ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`hidden md:block md:w-[45%] ${item.side === 'left' ? 'text-right' : 'text-left'} space-y-2`}>
                    <span className="text-tertiary font-black text-2xl tracking-tighter uppercase">{item.date}</span>
                    <h4 className="text-primary text-2xl font-headline font-black uppercase tracking-tight">{item.title}</h4>
                  </div>
                  
                  <div className="absolute left-0 md:left-1/2 w-6 h-6 bg-tertiary border-4 border-[#F5F5F4] -translate-x-1/2 z-10"></div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: item.side === 'left' ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="ml-12 md:ml-0 md:w-[45%] bg-white p-12 border-4 border-primary/5 shadow-2xl shadow-primary/5"
                  >
                    <div className="md:hidden mb-6 space-y-2">
                      <span className="text-tertiary font-black text-xl tracking-tighter uppercase">{item.date}</span>
                      <h4 className="text-primary font-headline font-black text-2xl uppercase tracking-tight">{item.title}</h4>
                    </div>
                    <p className="text-lg font-medium text-secondary/70 leading-relaxed italic border-l-4 border-tertiary/20 pl-6">{item.desc}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Immersive Full-Bleed */}
        <section className="bg-primary text-on-primary p-16 lg:p-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[150%] aspect-square bg-tertiary blur-[150px] rounded-full"></div>
          </div>
          <div className="relative z-10 max-w-4xl space-y-12">
            <div className="text-[10px] font-bold text-tertiary uppercase tracking-[0.4em]">Final Protocol</div>
            <h2 className="font-headline text-7xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
              Record the<br/>
              <span className="text-tertiary italic">Unspoken</span>
            </h2>
            <p className="text-2xl lg:text-3xl text-white/70 leading-tight font-medium italic border-l-8 border-tertiary pl-12">
              沈黙は現状を維持させます。匿名での報告、AIによる法的精査、そして公開。透明な社会への第一歩は、あなたの告発から始まります。
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-10 pt-12">
              <Link to="/report" className="group relative px-16 py-6 bg-tertiary text-on-tertiary overflow-hidden transition-all active:scale-95">
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="relative z-10 text-xl font-headline font-black uppercase tracking-widest group-hover:text-primary">Submit Report</span>
              </Link>
              <Link to="/misconduct-db" className="group flex items-center gap-4 text-xl font-headline font-black uppercase tracking-widest hover:text-tertiary transition-all">
                Explore Archive
                <ChevronRight className="w-8 h-8 group-hover:translate-x-4 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
