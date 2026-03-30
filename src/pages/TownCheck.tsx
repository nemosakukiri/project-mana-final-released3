import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Shield, Users, Eye, Heart, MessageSquare, Save, Loader2, AlertCircle, CheckCircle2, BarChart3, ChevronRight } from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const EVALUATION_DIMENSIONS = [
  { key: 'transparency', label: 'Institutional Transparency', sublabel: '機関の透明性', description: '情報の公開状況、意思決定プロセスの可視化、および市民への説明責任の履行状況。' },
  { key: 'accountability', label: 'Accountability Mechanism', sublabel: '責任追及メカニズム', description: '不祥事や不作為に対する内部調査の独立性、および再発防止策の実効性。' },
  { key: 'inclusion', label: 'Social Equity Index', sublabel: '社会的公平性指数', description: 'マイノリティ、社会的弱者、および多様な背景を持つ市民に対する包摂的な政策とリソース配分。' },
  { key: 'safety', label: 'Civic Safety Protocol', sublabel: '市民安全プロトコル', description: '構造的な暴力の抑止、行政サービスのアクセシビリティ、および緊急時の対応能力。' },
  { key: 'humanRights', label: 'Human Rights Compliance', sublabel: '人権遵守状況', description: '国際的な人権基準に照らした個人の尊厳の保護、および差別的な慣行の排除。' },
];

export default function TownCheck() {
  const [townName, setTownName] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({
    transparency: 5,
    accountability: 5,
    inclusion: 5,
    safety: 5,
    humanRights: 5,
  });
  const [comment, setComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otherEvaluations, setOtherEvaluations] = useState<any[]>([]);

  // Calculate Composite Integrity Score
  const compositeScore = (Object.values(scores).reduce((a, b) => a + b, 0) / 5).toFixed(1);

  useEffect(() => {
    if (!townName.trim()) {
      setOtherEvaluations([]);
      return;
    }

    const q = query(
      collection(db, 'town_evaluations'),
      where('townName', '==', townName.trim()),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOtherEvaluations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [townName]);

  const handleScoreChange = (key: string, value: number) => {
    setScores(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!townName.trim()) {
      setError('自治体名を入力してください。');
      return;
    }
    if (!auth.currentUser) {
      setError('評価を保存するにはログインが必要です。');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await addDoc(collection(db, 'town_evaluations'), {
        townName: townName.trim(),
        ...scores,
        compositeScore: parseFloat(compositeScore),
        comment,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });
      setSuccess('Integrity Audit has been successfully recorded in the ledger.');
      setComment('');
    } catch (err) {
      console.error('Save error:', err);
      setError('An error occurred during the audit submission.');
    } finally {
      setIsSaving(false);
    }
  };

  const chartData = EVALUATION_DIMENSIONS.map(dim => ({
    subject: dim.label,
    A: scores[dim.key],
    fullMark: 10,
  }));

  return (
    <div className="min-h-screen bg-[#F5F5F4] pt-24 pb-32 font-sans selection:bg-primary selection:text-on-primary">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        
        {/* Header - Editorial/Scholarly Style */}
        <header className="mb-24 relative">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 border-b-2 border-primary pb-16">
            <div className="max-w-4xl space-y-10">
              <div className="flex items-center gap-6">
                <div className="px-4 py-1 bg-primary text-on-primary text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
                  Protocol v3.0.4
                </div>
                <div className="h-[1px] w-12 bg-primary/30"></div>
                <span className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase">Civic Audit Framework</span>
              </div>
              <h1 className="text-primary font-headline text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] uppercase">
                Integrity<br/>
                <span className="text-tertiary">Ledger</span><br/>
                Audit
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                <p className="text-secondary text-xl leading-relaxed font-medium border-l-4 border-tertiary pl-8 italic">
                  "The first step toward accountability is the rigorous quantification of institutional behavior."
                </p>
                <div className="space-y-4 text-sm text-secondary/70 font-medium">
                  <p>本システムは、ジャーナリスト、学者、および市民活動家が自治体の「不作為」と「誠実性」を客観的に評価・記録するための独立した監査プラットフォームです。</p>
                  <p>入力されたデータは、地域間の比較分析および長期的なガバナンスの推移を追跡するためのオープンデータとして活用されます。</p>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:flex flex-col items-end gap-8">
              <div className="text-right">
                <div className="text-primary font-mono text-xs tracking-widest uppercase opacity-40 mb-2">Current Session ID</div>
                <div className="text-primary font-mono text-lg font-bold">AUDIT-{Math.random().toString(36).substring(7).toUpperCase()}</div>
              </div>
              <div className="w-48 h-48 border-2 border-primary/10 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 animate-spin-slow opacity-20">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                    <text className="text-[8px] font-bold uppercase tracking-[0.2em] fill-primary">
                      <textPath xlinkHref="#circlePath">Civic Integrity Audit System • Data Driven Accountability • </textPath>
                    </text>
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-headline font-black text-primary leading-none">{compositeScore}</div>
                  <div className="text-[8px] font-bold text-secondary uppercase tracking-widest mt-1">Composite</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Main Audit Form */}
          <div className="lg:col-span-7 space-y-24">
            
            {/* Step 01: Target Selection */}
            <section className="space-y-12">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 border-2 border-primary flex items-center justify-center font-headline font-black text-xl">01</div>
                <h2 className="text-primary font-headline text-4xl font-black tracking-tight uppercase">Target Identification</h2>
              </div>
              
              <div className="group relative">
                <label className="text-primary text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block opacity-50">Subject Municipality / Institution</label>
                <div className="relative border-b-4 border-primary/10 focus-within:border-tertiary transition-all pb-4">
                  <input
                    type="text"
                    value={townName}
                    onChange={(e) => setTownName(e.target.value)}
                    placeholder="ENTER MUNICIPALITY NAME..."
                    className="w-full bg-transparent px-0 text-5xl lg:text-6xl font-headline font-black text-primary outline-none placeholder:text-primary/10 uppercase tracking-tighter"
                  />
                  <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 text-primary/20 group-focus-within:text-tertiary transition-colors" />
                </div>
                <p className="mt-4 text-xs text-secondary font-mono uppercase tracking-widest opacity-60">※ 正確な分析のため、正式名称での入力を推奨します。</p>
              </div>
            </section>

            {/* Step 02: Metric Evaluation */}
            <section className="space-y-12">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 border-2 border-primary flex items-center justify-center font-headline font-black text-xl">02</div>
                <h2 className="text-primary font-headline text-4xl font-black tracking-tight uppercase">Metric Quantification</h2>
              </div>
              
              <div className="grid gap-12">
                {EVALUATION_DIMENSIONS.map((dim, index) => (
                  <motion.div 
                    key={dim.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                      <div className="space-y-3 max-w-xl">
                        <div className="flex items-center gap-3">
                          <span className="text-tertiary font-mono text-xs font-bold">[{dim.key.toUpperCase()}]</span>
                          <h3 className="text-primary font-headline text-2xl font-black tracking-tight uppercase">{dim.label}</h3>
                        </div>
                        <div className="text-secondary text-xs font-bold uppercase tracking-widest opacity-60">{dim.sublabel}</div>
                        <p className="text-secondary text-sm leading-relaxed font-medium">{dim.description}</p>
                      </div>
                      <div className="flex items-baseline gap-2 bg-primary text-on-primary px-6 py-3 rounded-sm">
                        <span className="text-4xl font-headline font-black leading-none">{scores[dim.key]}</span>
                        <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">/ 10</span>
                      </div>
                    </div>
                    <div className="relative h-12 flex items-center">
                      <div className="absolute inset-0 h-[2px] bg-primary/10 top-1/2 -translate-y-1/2"></div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={scores[dim.key]}
                        onChange={(e) => handleScoreChange(dim.key, parseInt(e.target.value))}
                        className="w-full h-full bg-transparent appearance-none cursor-pointer relative z-10 accent-tertiary"
                      />
                      <div className="absolute inset-0 flex justify-between pointer-events-none px-1">
                        {[...Array(11)].map((_, i) => (
                          <div key={i} className={`h-3 w-[1px] bg-primary/20 self-center ${i % 5 === 0 ? 'h-6 bg-primary/40' : ''}`}></div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Step 03: Qualitative Testimony */}
            <section className="space-y-12">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 border-2 border-primary flex items-center justify-center font-headline font-black text-xl">03</div>
                <h2 className="text-primary font-headline text-4xl font-black tracking-tight uppercase">Qualitative Testimony</h2>
              </div>
              <div className="relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="具体的な事例、不作為の証拠、または行政の対応に関する詳細な記述を入力してください..."
                  rows={8}
                  className="w-full bg-white border-2 border-primary/10 p-10 text-xl text-primary font-medium outline-none focus:border-tertiary transition-all resize-none placeholder:text-primary/10 shadow-inner"
                />
                <div className="absolute bottom-6 right-6 text-[10px] font-mono font-bold text-secondary/40 uppercase tracking-widest">
                  Character Count: {comment.length}
                </div>
              </div>
            </section>

            {/* Submission */}
            <div className="space-y-8">
              <button
                onClick={handleSave}
                disabled={isSaving || !townName.trim()}
                className="group relative w-full py-10 bg-primary text-on-primary overflow-hidden transition-all active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-tertiary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <div className="relative z-10 flex items-center justify-center gap-6">
                  {isSaving ? <Loader2 className="w-8 h-8 animate-spin" /> : (
                    <>
                      <Shield className="w-8 h-8" />
                      <span className="text-3xl font-headline font-black uppercase tracking-[0.2em]">Commit to Ledger</span>
                    </>
                  )}
                </div>
              </button>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-8 bg-error/5 text-error border-l-8 border-error flex items-center gap-6"
                >
                  <AlertCircle className="w-8 h-8 shrink-0" />
                  <span className="text-sm font-bold uppercase tracking-[0.1em] leading-relaxed">{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-8 bg-primary/5 text-primary border-l-8 border-primary flex items-center gap-6"
                >
                  <CheckCircle2 className="w-8 h-8 shrink-0" />
                  <span className="text-sm font-bold uppercase tracking-[0.1em] leading-relaxed">{success}</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Visualization & Audit Log Sidebar */}
          <aside className="lg:col-span-5 space-y-16">
            <div className="sticky top-32 space-y-16">
              
              {/* Radar Chart Analysis */}
              <div className="bg-white border-2 border-primary p-12 relative">
                <div className="absolute -top-4 -left-4 bg-tertiary text-on-tertiary px-4 py-1 text-[10px] font-bold uppercase tracking-widest">Analysis View</div>
                <div className="space-y-10">
                  <div>
                    <h2 className="text-primary font-headline text-4xl font-black tracking-tight leading-none uppercase mb-4">
                      Integrity<br/>Profile
                    </h2>
                    <div className="h-[2px] w-24 bg-tertiary"></div>
                  </div>
                  
                  <div className="aspect-square w-full bg-[#FBFBFB] border border-primary/5 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="var(--primary)" strokeOpacity={0.1} />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={{ fill: 'var(--primary)', fontSize: 8, fontWeight: 900, letterSpacing: '0.05em' }} 
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                        <Radar
                          name="Score"
                          dataKey="A"
                          stroke="var(--tertiary)"
                          strokeWidth={4}
                          fill="var(--tertiary)"
                          fillOpacity={0.2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-primary/10">
                    <div>
                      <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 opacity-40">Composite Index</div>
                      <div className="text-4xl font-headline font-black text-primary">{compositeScore}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 opacity-40">Confidence Level</div>
                      <div className="text-4xl font-headline font-black text-tertiary">84%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Audit Log Feed */}
              <div className="space-y-10">
                <div className="flex items-center justify-between border-b-4 border-primary pb-6">
                  <h2 className="text-primary font-headline text-2xl font-black uppercase tracking-tighter">
                    Recent Ledger Entries
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Live Feed</span>
                  </div>
                </div>
                
                <div className="space-y-8 max-h-[800px] overflow-y-auto pr-6 scrollbar-thin scrollbar-thumb-primary/20">
                  {otherEvaluations.length > 0 ? otherEvaluations.map((evalItem, idx) => (
                    <motion.div 
                      key={evalItem.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group bg-white border-l-4 border-primary p-8 hover:border-tertiary transition-all shadow-sm hover:shadow-xl"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono font-bold text-tertiary uppercase tracking-widest">Entry #{evalItem.id.substring(0, 8).toUpperCase()}</div>
                          <div className="text-xs font-bold text-secondary opacity-50">
                            {evalItem.createdAt?.toDate().toLocaleString('ja-JP')}
                          </div>
                        </div>
                        <div className="bg-primary/5 px-3 py-1 rounded-sm">
                          <span className="text-xl font-headline font-black text-primary">{evalItem.compositeScore || "N/A"}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-headline font-black text-primary mb-4 uppercase tracking-tight group-hover:text-tertiary transition-colors">
                        {evalItem.townName}
                      </h3>
                      
                      <p className="text-secondary text-sm leading-relaxed font-medium mb-8 line-clamp-4 italic border-l-2 border-primary/10 pl-4">
                        "{evalItem.comment}"
                      </p>
                      
                      <div className="flex flex-wrap gap-4 pt-6 border-t border-primary/5">
                         {[
                           { label: 'Transparency', val: evalItem.transparency },
                           { label: 'Equity', val: evalItem.inclusion },
                           { label: 'Rights', val: evalItem.humanRights }
                         ].map(stat => (
                           <div key={stat.label} className="flex items-baseline gap-2">
                              <span className="text-[9px] font-black uppercase tracking-widest text-secondary/40">{stat.label}:</span>
                              <span className="font-mono text-sm font-bold text-primary">{stat.val}</span>
                           </div>
                         ))}
                      </div>
                    </motion.div>
                  )) : (
                    <div className="py-24 border-4 border-dotted border-primary/10 text-center">
                       <p className="text-primary/20 font-headline font-black text-xl uppercase tracking-widest">No Records Found</p>
                    </div>
                  )}
                </div>
                
                <button className="w-full py-6 border-2 border-primary text-primary font-bold uppercase tracking-[0.3em] hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-4">
                  View Full Archive
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
