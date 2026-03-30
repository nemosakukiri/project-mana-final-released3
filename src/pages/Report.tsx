import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function Report() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'inaction',
    description: '',
    location: '',
    date: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (error) {
        setErrorMessage('ログインに失敗しました。');
        setStatus('error');
        return;
      }
    }

    setStatus('submitting');
    try {
      await addDoc(collection(db, 'reports'), {
        ...formData,
        userId: auth.currentUser?.uid,
        userEmail: auth.currentUser?.email,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setFormData({ title: '', category: 'inaction', description: '', location: '', date: '' });
    } catch (error) {
      console.error('Error submitting report:', error);
      setErrorMessage('送信に失敗しました。後でもう一度お試しください。');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white p-16 border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] text-center"
        >
          <CheckCircle className="w-32 h-32 text-secondary mx-auto mb-12" />
          <h2 className="text-5xl font-headline text-black mb-8 uppercase tracking-tighter">Report Submitted</h2>
          <p className="text-2xl font-serif italic text-on-surface-variant mb-12 leading-relaxed">
            あなたの貴重な証言は、不作為のデータベースに記録されました。沈黙を破る第一歩をありがとうございます。
          </p>
          <div className="flex flex-col gap-6">
            <button 
              onClick={() => setStatus('idle')}
              className="bg-black text-white px-12 py-6 font-headline text-2xl border-4 border-black hover:bg-secondary transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              別の報告を行う
            </button>
            <Link to="/" className="text-2xl font-headline border-b-4 border-black hover:text-secondary hover:border-secondary transition-all pb-2 uppercase tracking-widest">
              ホームへ戻る
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-8">
        <Link to="/" className="inline-flex items-center gap-4 text-2xl font-headline border-b-4 border-black mb-16 hover:text-secondary hover:border-secondary transition-all pb-2 uppercase tracking-widest group">
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
          Back to Home
        </Link>

        {/* Header Section - Mondrian Style */}
        <section className="grid grid-cols-12 border-8 border-black bg-white mb-16">
          <div className="col-span-12 lg:col-span-8 p-12 border-r-8 border-black">
            <h1 className="text-6xl font-headline text-black mb-8 leading-none tracking-tighter">体験を<span className="text-secondary italic">記録する</span></h1>
            <p className="text-xl font-serif italic text-on-surface-variant leading-relaxed">
              行政の不作為や不祥事に関するあなたの体験を、証拠として記録します。
              このデータは、AIによる法的精査とアーカイブの構築に使用されます。
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4 bg-mondrian-blue p-12 flex items-center justify-center">
            <Send className="w-24 h-24 text-white" />
          </div>
        </section>

        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-0 border-8 border-black bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] mb-16">
          <div className="col-span-12 p-12 border-b-8 border-black bg-mondrian-yellow/10">
            <label className="block text-xl font-headline uppercase tracking-widest mb-6">事案のタイトル</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="例：〇〇市役所での窓口対応拒否"
              className="w-full bg-white border-4 border-black px-8 py-6 text-2xl font-serif italic outline-none focus:bg-mondrian-yellow/20 transition-colors"
            />
          </div>

          <div className="col-span-12 md:col-span-6 p-12 border-b-8 md:border-b-0 md:border-r-8 border-black bg-white">
            <label className="block text-xl font-headline uppercase tracking-widest mb-6">カテゴリー</label>
            <div className="relative">
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white border-4 border-black px-8 py-6 text-xl font-serif italic appearance-none outline-none focus:bg-mondrian-blue/10 transition-colors"
              >
                <option value="inaction">不作為 (なすべきことをしない)</option>
                <option value="misconduct">不祥事 (不正・不適切な行為)</option>
                <option value="other">その他</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-4 h-4 border-r-4 border-b-4 border-black rotate-45"></div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 p-12 bg-white">
            <label className="block text-xl font-headline uppercase tracking-widest mb-6">発生場所</label>
            <input 
              required
              type="text" 
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="例：〇〇県〇〇市"
              className="w-full bg-white border-4 border-black px-8 py-6 text-2xl font-serif italic outline-none focus:bg-mondrian-blue/10 transition-colors"
            />
          </div>

          <div className="col-span-12 p-12 border-t-8 border-black bg-mondrian-blue/5">
            <label className="block text-xl font-headline uppercase tracking-widest mb-6">発生時期</label>
            <input 
              required
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-white border-4 border-black px-8 py-6 text-2xl font-serif italic outline-none focus:bg-mondrian-blue/10 transition-colors"
            />
          </div>

          <div className="col-span-12 p-12 border-t-8 border-black bg-white">
            <label className="block text-xl font-headline uppercase tracking-widest mb-6">詳細な内容</label>
            <textarea 
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="どのような不作為や不祥事があったのか、具体的に記入してください。"
              className="w-full bg-white border-4 border-black px-8 py-6 text-2xl font-serif italic outline-none focus:bg-mondrian-yellow/10 transition-colors resize-none"
            />
          </div>

          {status === 'error' && (
            <div className="col-span-12 p-12 bg-secondary text-white flex items-center gap-8 border-t-8 border-black">
              <AlertCircle className="w-12 h-12 shrink-0" />
              <p className="text-2xl font-headline uppercase tracking-tighter">{errorMessage}</p>
            </div>
          )}

          <div className="col-span-12 p-12 border-t-8 border-black bg-black">
            <button 
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-secondary text-white px-12 py-8 font-headline text-4xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-8 disabled:opacity-50 disabled:scale-100"
            >
              {status === 'submitting' ? 'SENDING...' : 'SUBMIT REPORT'}
              <Send className="w-12 h-12" />
            </button>
          </div>
        </form>

        <div className="grid grid-cols-12 border-8 border-black bg-white">
          <div className="col-span-12 md:col-span-4 bg-mondrian-yellow p-12 flex items-center justify-center border-b-8 md:border-b-0 md:border-r-8 border-black">
            <ShieldCheck className="w-24 h-24 text-black" />
          </div>
          <div className="col-span-12 md:col-span-8 p-12">
            <h3 className="text-4xl font-headline text-black mb-6 uppercase tracking-tighter">Privacy & Security</h3>
            <p className="text-xl font-serif italic text-on-surface-variant leading-relaxed">
              送信された情報は、Project Manaのデータベースに安全に保存されます。
              個人を特定できる情報は、本人の同意なく公開されることはありません。
              記録されたデータは、行政の透明性向上と法的精査の目的でのみ使用されます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
