import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-surface-container-low px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-3xl shadow-xl text-center"
        >
          <CheckCircle className="w-20 h-20 text-secondary mx-auto mb-8" />
          <h2 className="text-3xl font-bold text-primary mb-4">報告が完了しました</h2>
          <p className="text-on-surface-variant mb-10 leading-relaxed">
            あなたの貴重な証言は、不作為のデータベースに記録されました。沈黙を破る第一歩をありがとうございます。
          </p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setStatus('idle')}
              className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-all"
            >
              別の報告を行う
            </button>
            <Link to="/" className="text-secondary font-bold hover:underline">
              ホームへ戻る
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-low py-20 px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-secondary font-bold mb-12 hover:gap-4 transition-all">
          <ArrowLeft className="w-5 h-5" />
          ホームへ戻る
        </Link>

        <div className="mb-16">
          <h1 className="text-5xl font-bold text-primary mb-6 font-headline">体験を記録する</h1>
          <p className="text-xl text-on-surface-variant leading-relaxed">
            行政の不作為や不祥事に関するあなたの体験を、証拠として記録します。
            このデータは、AIによる法的精査とアーカイブの構築に使用されます。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-10 md:p-16 rounded-3xl shadow-xl space-y-10">
          <div className="space-y-4">
            <label className="block text-sm font-bold text-primary uppercase tracking-wider">事案のタイトル</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="例：〇〇市役所での窓口対応拒否"
              className="w-full px-6 py-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-primary uppercase tracking-wider">カテゴリー</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg appearance-none"
              >
                <option value="inaction">不作為 (なすべきことをしない)</option>
                <option value="misconduct">不祥事 (不正・不適切な行為)</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-bold text-primary uppercase tracking-wider">発生場所</label>
              <input 
                required
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="例：〇〇県〇〇市"
                className="w-full px-6 py-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-primary uppercase tracking-wider">発生時期</label>
            <input 
              required
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-6 py-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-primary uppercase tracking-wider">詳細な内容</label>
            <textarea 
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="どのような不作為や不祥事があったのか、具体的に記入してください。"
              className="w-full px-6 py-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg resize-none"
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-3 p-6 bg-error-container text-on-error-container rounded-2xl border border-error/20">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p className="font-medium">{errorMessage}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-primary text-white px-10 py-6 rounded-full font-bold text-xl shadow-xl hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
          >
            {status === 'submitting' ? '送信中...' : '証言を記録する'}
            <Send className="w-6 h-6" />
          </button>
        </form>

        <div className="mt-16 p-10 bg-primary/5 rounded-3xl border border-primary/10">
          <h3 className="text-xl font-bold text-primary mb-4">情報の取り扱いについて</h3>
          <p className="text-on-surface-variant leading-relaxed">
            送信された情報は、Project Manaのデータベースに安全に保存されます。
            個人を特定できる情報は、本人の同意なく公開されることはありません。
            記録されたデータは、行政の透明性向上と法的精査の目的でのみ使用されます。
          </p>
        </div>
      </div>
    </div>
  );
}
