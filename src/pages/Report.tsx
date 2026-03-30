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
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-surface p-12 lg:p-20 border border-border rounded-[2.5rem] text-center shadow-2xl shadow-primary/5"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-10">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-5xl font-headline text-foreground mb-8 tracking-tighter">Report Submitted</h2>
          <p className="text-xl font-serif italic text-on-surface-variant mb-12 leading-relaxed">
            あなたの貴重な証言は、不作為のデータベースに記録されました。沈黙を破る第一歩をありがとうございます。
          </p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setStatus('idle')}
              className="bg-primary text-white px-10 py-5 rounded-full font-headline text-xl uppercase tracking-widest hover:bg-foreground transition-all"
            >
              別の報告を行う
            </button>
            <Link to="/" className="text-sm font-mono uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors py-4">
              ホームへ戻る
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <Link to="/" className="inline-flex items-center gap-3 text-xs font-mono uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-all mb-16 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header Section - Elegant Editorial Style */}
        <section className="mb-16">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8 border-b border-border pb-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[1px] bg-primary"></span>
                <span className="editorial-label text-primary font-bold">Documenting Inaction</span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-headline text-foreground mb-8 leading-[0.9] tracking-tighter">
                体験を<span className="text-primary italic font-serif lowercase">記録する</span>
              </h1>
              <p className="text-xl font-serif italic text-on-surface-variant leading-relaxed">
                行政の不作為や不祥事に関するあなたの体験を、証拠として記録します。
                このデータは、AIによる法的精査とアーカイブの構築に使用されます。
              </p>
            </div>
            <div className="hidden lg:flex w-20 h-20 rounded-full border border-border items-center justify-center">
              <Send className="w-8 h-8 text-primary" />
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 mb-16">
          <div className="p-10 lg:p-16 space-y-12">
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">事案のタイトル</label>
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="例：〇〇市役所での窓口対応拒否"
                className="w-full bg-transparent border-b border-border px-0 py-4 text-2xl font-serif italic outline-none focus:border-primary transition-colors placeholder:text-border/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">カテゴリー</label>
                <div className="relative">
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-transparent border-b border-border px-0 py-4 text-lg font-serif italic appearance-none outline-none focus:border-primary transition-colors"
                  >
                    <option value="inaction">不作為 (なすべきことをしない)</option>
                    <option value="misconduct">不祥事 (不正・不適切な行為)</option>
                    <option value="other">その他</option>
                  </select>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-2 h-2 border-r border-b border-on-surface-variant rotate-45"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">発生場所</label>
                <input 
                  required
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="例：〇〇県〇〇市"
                  className="w-full bg-transparent border-b border-border px-0 py-4 text-lg font-serif italic outline-none focus:border-primary transition-colors placeholder:text-border/50"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">発生時期</label>
              <input 
                required
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-transparent border-b border-border px-0 py-4 text-lg font-serif italic outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">詳細な内容</label>
              <textarea 
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="どのような不作為や不祥事があったのか、具体的に記入してください。"
                className="w-full bg-transparent border border-border rounded-2xl p-6 text-lg font-serif italic outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            {status === 'error' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-secondary/10 text-secondary border border-secondary/20 rounded-2xl flex items-center gap-4"
              >
                <AlertCircle className="w-6 h-6 shrink-0" />
                <p className="text-sm font-bold uppercase tracking-widest">{errorMessage}</p>
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-primary text-white px-12 py-6 rounded-full font-headline text-2xl uppercase tracking-[0.2em] hover:bg-foreground transition-all flex items-center justify-center gap-6 disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              {status === 'submitting' ? 'Sending...' : 'Submit Report'}
              <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </form>

        <div className="bg-surface border border-border rounded-[2.5rem] p-10 lg:p-16 flex flex-col md:flex-row items-center gap-12">
          <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-headline text-foreground tracking-tight">Privacy & Security</h3>
            <p className="text-base font-serif italic text-on-surface-variant leading-relaxed">
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
