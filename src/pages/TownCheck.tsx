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
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header - Mondrian Style */}
        <header className="grid grid-cols-12 border-b-8 border-black bg-white">
          <div className="col-span-12 lg:col-span-8 p-16 border-r-8 border-black">
            <span className="editorial-label">Audit No. 03</span>
            <h1 className="text-[10vw] font-headline mb-6 leading-none tracking-tighter">TOWN<br />CHECK</h1>
            <p className="text-3xl font-serif italic text-on-surface-variant leading-relaxed max-w-2xl">
              あなたの街の「人権・住みやすさ」を客観的に診断。市民の視点から行政の質を可視化し、より良い街づくりへの一歩を。
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4 grid grid-rows-2">
            <div className="bg-mondrian-blue border-b-8 border-black p-12 flex items-center justify-center">
               <MapPin className="w-24 h-24 text-white" />
            </div>
            <div className="bg-mondrian-yellow p-12 flex flex-col items-center justify-center">
               <span className="text-black font-headline text-5xl rotate-12">AUDIT</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b-8 border-black">
          {/* Main Form Area */}
          <div className="lg:col-span-7 border-r-8 border-black bg-white p-16">
            <div className="max-w-3xl">
              <h2 className="text-5xl font-headline mb-12 uppercase">診断を開始する</h2>
              
              <div className="space-y-16">
                {/* Town Selection */}
                <div className="p-10 border-8 border-black bg-mondrian-yellow/5">
                  <label className="block text-xl font-bold uppercase tracking-widest mb-6">診断対象の街</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={townName}
                      onChange={(e) => setTownName(e.target.value)}
                      placeholder="例: 東京都新宿区, 兵庫県庁"
                      className="w-full bg-white border-4 border-black px-12 py-6 text-2xl font-serif italic outline-none focus:bg-mondrian-yellow/10 transition-colors"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-black" />
                  </div>
                </div>

                {/* Evaluation Categories */}
                <div className="space-y-12">
                  {EVALUATION_DIMENSIONS.map((dim, index) => (
                    <div key={dim.key} className="p-8 border-8 border-black bg-white hover:bg-mondrian-yellow/5 transition-colors">
                      <div className="flex justify-between items-end mb-6">
                        <div className="flex items-center gap-6">
                          <span className="font-headline text-6xl text-black/20">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <h3 className="font-headline text-2xl uppercase tracking-widest">{dim.label}</h3>
                            <p className="text-sm text-on-surface-variant italic font-serif">{dim.description}</p>
                          </div>
                        </div>
                        <span className="text-5xl font-headline text-secondary">{scores[dim.key]}<span className="text-sm text-black ml-1 font-sans">/ 10</span></span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={scores[dim.key]}
                        onChange={(e) => handleScoreChange(dim.key, parseInt(e.target.value))}
                        className="w-full h-4 bg-black/10 rounded-none appearance-none cursor-pointer accent-secondary border-2 border-black"
                      />
                    </div>
                  ))}
                </div>

                <div className="p-10 border-8 border-black bg-black text-white">
                  <label className="block text-xl font-bold uppercase tracking-widest mb-6">具体的な理由・コメント</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="最近の行政の対応や、街の雰囲気について感じていることを自由に記述してください。"
                    rows={6}
                    className="w-full bg-white/10 border-2 border-white/20 p-6 text-xl font-serif italic outline-none focus:bg-white/20 transition-colors text-white"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={isSaving || !townName.trim()}
                  className="w-full py-10 bg-secondary text-white font-headline text-4xl hover:bg-black transition-all border-8 border-black disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-12 h-12 animate-spin mx-auto" /> : "SUBMIT AUDIT"}
                </button>

                {error && (
                  <div className="p-6 bg-secondary text-white border-8 border-black flex items-center gap-4">
                    <AlertCircle className="w-8 h-8" />
                    <span className="font-bold uppercase tracking-widest">{error}</span>
                  </div>
                )}
                {success && (
                  <div className="p-6 bg-mondrian-blue text-white border-8 border-black flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8" />
                    <span className="font-bold uppercase tracking-widest">{success}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / Visualization */}
          <aside className="lg:col-span-5 bg-white flex flex-col">
            <div className="p-12 border-b-8 border-black bg-mondrian-yellow aspect-square flex flex-col">
               <span className="editorial-label !mb-8 text-black/60">Visual Analysis</span>
               <h2 className="text-5xl font-headline text-black mb-12 text-center tracking-tighter">
                 HUMAN RIGHTS<br />RADAR CHART
               </h2>
               <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke="#000" strokeDasharray="3 3" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#000', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                      <Radar
                        name="Score"
                        dataKey="A"
                        stroke="#000"
                        strokeWidth={4}
                        fill="#F27D26"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="p-12 border-b-8 border-black bg-mondrian-blue text-white flex-1">
               <span className="editorial-label !mb-4 text-white/60">Community Voices</span>
               <h2 className="text-5xl font-headline mb-12 uppercase tracking-tighter">
                 AUDIT LOG: {townName || "GLOBAL"}
               </h2>
               <div className="space-y-8 max-h-[600px] overflow-y-auto pr-6 scrollbar-mondrian">
                  {otherEvaluations.length > 0 ? otherEvaluations.map((evalItem) => (
                    <div key={evalItem.id} className="p-8 bg-white border-8 border-black text-black hover:translate-x-2 transition-transform">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-secondary text-white border-4 border-black flex items-center justify-center font-headline text-2xl">
                            {evalItem.townName.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-bold uppercase tracking-widest block">Citizen Auditor</span>
                            <span className="text-[10px] font-mono">
                              {evalItem.createdAt?.toDate().toLocaleDateString('ja-JP')}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                           <div className="w-8 h-8 bg-mondrian-yellow border-2 border-black" />
                           <div className="w-8 h-8 bg-mondrian-blue border-2 border-black" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-headline mb-4">{evalItem.townName}</h3>
                      <p className="text-lg font-serif italic line-clamp-3 mb-6">
                        {evalItem.comment}
                      </p>
                      <div className="grid grid-cols-3 gap-4 border-t-4 border-black pt-4">
                         <div className="text-center">
                            <div className="text-[10px] font-bold uppercase">HR</div>
                            <div className="font-headline text-xl">{evalItem.humanRights}</div>
                         </div>
                         <div className="text-center">
                            <div className="text-[10px] font-bold uppercase">TR</div>
                            <div className="font-headline text-xl">{evalItem.transparency}</div>
                         </div>
                         <div className="text-center">
                            <div className="text-[10px] font-bold uppercase">QoL</div>
                            <div className="font-headline text-xl">{evalItem.qol}</div>
                         </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-12 border-8 border-black border-dashed text-center opacity-40">
                       <span className="font-headline text-2xl">NO AUDITS YET</span>
                    </div>
                  )}
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
