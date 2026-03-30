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
    <div className="min-h-screen bg-surface-container-low pt-24 pb-12 px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl mb-6"
          >
            <MapPin className="w-10 h-10" />
          </motion.div>
          <h1 className="text-5xl font-bold text-primary mb-4 font-headline">街の人権・住みやすさ診断</h1>
          <p className="text-on-surface-variant text-xl max-w-3xl mx-auto leading-relaxed">
            あなたの住んでいる街を、人権と透明性の観点から客観的に評価してみましょう。<br />
            市民一人一人の「気づき」が、より良い街づくりへの第一歩となります。
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Evaluation Form */}
          <section className="bg-white p-10 rounded-[40px] shadow-sm border border-outline-variant/10">
            <div className="mb-10">
              <label className="block text-sm font-bold text-primary uppercase tracking-widest mb-3">診断対象の自治体</label>
              <div className="relative">
                <input
                  type="text"
                  value={townName}
                  onChange={(e) => setTownName(e.target.value)}
                  placeholder="例: 東京都新宿区, 兵庫県庁"
                  className="w-full bg-surface-container-low border-2 border-outline-variant/30 focus:border-primary focus:ring-0 px-12 py-4 rounded-2xl outline-none text-lg transition-all"
                />
                <Search className="absolute left-4 top-4.5 w-6 h-6 text-on-surface-variant" />
              </div>
            </div>

            <div className="space-y-8 mb-10">
              {EVALUATION_DIMENSIONS.map((dim) => (
                <div key={dim.key} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="font-bold text-primary text-lg">{dim.label}</h3>
                      <p className="text-xs text-on-surface-variant">{dim.description}</p>
                    </div>
                    <span className="text-2xl font-bold text-secondary">{scores[dim.key]}<span className="text-sm text-on-surface-variant ml-1">/ 10</span></span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={scores[dim.key]}
                    onChange={(e) => handleScoreChange(dim.key, parseInt(e.target.value))}
                    className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                </div>
              ))}
            </div>

            <div className="mb-10">
              <label className="block text-sm font-bold text-primary uppercase tracking-widest mb-3">具体的な気づき・コメント</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="最近の行政の対応や、街の雰囲気について感じていることを自由に記述してください。"
                rows={4}
                className="w-full bg-surface-container-low border-2 border-outline-variant/30 focus:border-primary focus:ring-0 px-6 py-4 rounded-2xl outline-none text-lg transition-all"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving || !townName.trim()}
              className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
              診断結果を保存する
            </button>

            {error && (
              <div className="mt-6 p-4 bg-error-container text-on-error-container rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            )}
            {success && (
              <div className="mt-6 p-4 bg-primary-container text-primary-fixed rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">{success}</span>
              </div>
            )}
          </section>

          {/* Visualization & Insights */}
          <div className="space-y-12">
            {/* Radar Chart */}
            <section className="bg-white p-10 rounded-[40px] shadow-sm border border-outline-variant/10 aspect-square flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-primary mb-8 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-secondary" />
                人権・住みやすさチャート
              </h2>
              <div className="w-full h-full max-h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                    <Radar
                      name="Score"
                      dataKey="A"
                      stroke="#F27D26"
                      fill="#F27D26"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Other Evaluations */}
            {townName.trim() && (
              <section className="bg-white p-10 rounded-[40px] shadow-sm border border-outline-variant/10">
                <h2 className="text-2xl font-bold text-primary mb-8 flex items-center gap-2">
                  <Users className="w-6 h-6 text-secondary" />
                  {townName} の他の評価 ({otherEvaluations.length}件)
                </h2>
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-outline-variant/20">
                  {otherEvaluations.length > 0 ? otherEvaluations.map((evalItem) => (
                    <div key={evalItem.id} className="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                            <Users className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold text-primary">市民ユーザー</span>
                        </div>
                        <span className="text-xs text-on-surface-variant">
                          {evalItem.createdAt?.toDate().toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1 mb-4">
                        {EVALUATION_DIMENSIONS.map(dim => (
                          <div key={dim.key} className="text-center">
                            <div className="text-[8px] text-on-surface-variant uppercase font-bold truncate">{dim.label.slice(0, 2)}</div>
                            <div className="text-sm font-bold text-secondary">{evalItem[dim.key]}</div>
                          </div>
                        ))}
                      </div>
                      {evalItem.comment && (
                        <p className="text-on-surface-variant text-sm leading-relaxed italic">
                          "{evalItem.comment}"
                        </p>
                      )}
                    </div>
                  )) : (
                    <div className="text-center py-12 text-on-surface-variant italic">
                      まだこの街の評価はありません。
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
