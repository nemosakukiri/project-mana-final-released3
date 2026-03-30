import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Shield, Users, Eye, Heart, MessageSquare, Save, Loader2, AlertCircle, CheckCircle2, BarChart3 } from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const EVALUATION_DIMENSIONS = [
  { key: 'transparency', label: '行政の透明性', description: '情報の公開状況や説明責任' },
  { key: 'accountability', label: '責任追及の仕組み', description: '不祥事への対応や自浄作用' },
  { key: 'inclusion', label: '多様性の尊重', description: 'マイノリティや弱者への配慮' },
  { key: 'safety', label: '市民の安全', description: '犯罪抑止や行政サービスの質' },
  { key: 'humanRights', label: '人権意識', description: '個人の尊厳が守られているか' },
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
  const [isSearching, setIsSearching] = useState(false);

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
        comment,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setSuccess('あなたの街の評価を保存しました。');
      setComment('');
    } catch (err) {
      console.error('Save error:', err);
      setError('保存中にエラーが発生しました。');
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
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        {/* Header - Elegant Editorial Style */}
        <header className="mb-16 border-b border-border pb-12">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[1px] bg-primary"></span>
                <span className="editorial-label text-primary font-bold">Audit No. 03</span>
              </div>
              <h1 className="text-7xl lg:text-9xl font-headline mb-8 leading-[0.9] tracking-tighter text-foreground">
                TOWN<br />CHECK
              </h1>
              <p className="text-2xl lg:text-3xl font-serif italic text-on-surface-variant leading-relaxed">
                あなたの街の「人権・住みやすさ」を客観的に診断。市民の視点から行政の質を可視化し、より良い街づくりへの一歩を。
              </p>
            </div>
            <div className="hidden lg:flex flex-col items-end text-right">
              <div className="w-24 h-24 rounded-full border border-border flex items-center justify-center mb-4">
                <MapPin className="w-10 h-10 text-primary" />
              </div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-on-surface-variant">Civic Audit System v2.0</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form Area */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-16"
            >
              <section>
                <h2 className="text-3xl font-headline mb-10 flex items-center gap-4">
                  <span className="text-sm font-mono text-primary/50">01</span>
                  <span className="uppercase tracking-widest">診断を開始する</span>
                </h2>
                
                <div className="space-y-12">
                  {/* Town Selection */}
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] mb-4 text-on-surface-variant">診断対象の街</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={townName}
                        onChange={(e) => setTownName(e.target.value)}
                        placeholder="例: 東京都新宿区, 兵庫県庁"
                        className="w-full bg-surface border-b border-border px-0 py-6 text-3xl font-serif italic outline-none focus:border-primary transition-colors placeholder:text-border/50"
                      />
                      <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                    </div>
                  </div>

                  {/* Evaluation Categories */}
                  <div className="grid gap-8">
                    {EVALUATION_DIMENSIONS.map((dim, index) => (
                      <div key={dim.key} className="p-8 bg-surface border border-border rounded-2xl hover:border-primary/30 transition-all group">
                        <div className="flex justify-between items-start mb-8">
                          <div className="flex gap-6">
                            <span className="font-headline text-4xl text-primary/10 group-hover:text-primary/20 transition-colors">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <div>
                              <h3 className="font-headline text-xl uppercase tracking-widest mb-1">{dim.label}</h3>
                              <p className="text-sm text-on-surface-variant italic font-serif">{dim.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-4xl font-headline text-primary">{scores[dim.key]}</span>
                            <span className="text-xs text-on-surface-variant ml-1 font-mono uppercase">/ 10</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          value={scores[dim.key]}
                          onChange={(e) => handleScoreChange(dim.key, parseInt(e.target.value))}
                          className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">具体的な理由・コメント</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="最近の行政の対応や、街の雰囲気について感じていることを自由に記述してください。"
                      rows={6}
                      className="w-full bg-surface border border-border rounded-2xl p-8 text-xl font-serif italic outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={isSaving || !townName.trim()}
                    className="w-full py-8 bg-primary text-white font-headline text-2xl uppercase tracking-[0.2em] hover:bg-foreground transition-all rounded-full disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Audit"}
                  </button>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 bg-secondary/10 text-secondary border border-secondary/20 rounded-2xl flex items-center gap-4"
                    >
                      <AlertCircle className="w-6 h-6" />
                      <span className="text-sm font-bold uppercase tracking-widest">{error}</span>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 bg-primary/10 text-primary border border-primary/20 rounded-2xl flex items-center gap-4"
                    >
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="text-sm font-bold uppercase tracking-widest">{success}</span>
                    </motion.div>
                  )}
                </div>
              </section>
            </motion.div>
          </div>

          {/* Sidebar / Visualization */}
          <aside className="lg:col-span-5 space-y-12">
            <div className="sticky top-32 space-y-12">
              <div className="p-10 bg-surface border border-border rounded-3xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary mb-6 block">Visual Analysis</span>
                  <h2 className="text-4xl font-headline text-foreground mb-10 leading-tight tracking-tighter">
                    HUMAN RIGHTS<br />RADAR CHART
                  </h2>
                  <div className="aspect-square w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="var(--border)" strokeDasharray="4 4" />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={{ fill: 'var(--on-surface-variant)', fontSize: 10, fontWeight: 500, letterSpacing: '0.1em' }} 
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                        <Radar
                          name="Score"
                          dataKey="A"
                          stroke="var(--primary)"
                          strokeWidth={2}
                          fill="var(--primary)"
                          fillOpacity={0.15}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h2 className="text-xl font-headline uppercase tracking-widest">
                    Audit Log: <span className="text-primary italic font-serif lowercase">{townName || "Global"}</span>
                  </h2>
                  <MessageSquare className="w-5 h-5 text-on-surface-variant" />
                </div>
                
                <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 scrollbar-thin">
                  {otherEvaluations.length > 0 ? otherEvaluations.map((evalItem, idx) => (
                    <motion.div 
                      key={evalItem.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-8 bg-surface border border-border rounded-2xl hover:border-primary/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-headline text-lg">
                            {evalItem.townName.charAt(0)}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest block text-on-surface-variant">Citizen Auditor</span>
                            <span className="text-[10px] font-mono text-border">
                              {evalItem.createdAt?.toDate().toLocaleDateString('ja-JP')}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-1 h-1 rounded-full bg-border" />
                          ))}
                        </div>
                      </div>
                      <h3 className="text-xl font-headline mb-4 text-foreground">{evalItem.townName}</h3>
                      <p className="text-base font-serif italic text-on-surface-variant line-clamp-3 mb-6 leading-relaxed">
                        "{evalItem.comment}"
                      </p>
                      <div className="flex items-center gap-6 border-t border-border pt-6">
                         <div className="flex flex-col">
                            <span className="text-[9px] font-mono uppercase tracking-widest text-border">HR</span>
                            <span className="font-headline text-lg text-primary">{evalItem.humanRights}</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[9px] font-mono uppercase tracking-widest text-border">TR</span>
                            <span className="font-headline text-lg text-primary">{evalItem.transparency}</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[9px] font-mono uppercase tracking-widest text-border">AC</span>
                            <span className="font-headline text-lg text-primary">{evalItem.accountability}</span>
                         </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="py-20 border border-dashed border-border rounded-3xl text-center">
                       <p className="font-serif italic text-on-surface-variant">No audits recorded yet for this location.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
