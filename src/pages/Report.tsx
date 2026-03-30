import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle, AlertCircle, ArrowLeft, ShieldCheck, Loader2, FileText, MapPin, Calendar, Info, ChevronDown } from 'lucide-react';
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
        setErrorMessage('Authentication failed. Please try again.');
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
      setErrorMessage('Submission failed. Please verify your connection and try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F4] px-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl w-full bg-white p-16 lg:p-24 border-4 border-primary text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary text-on-primary flex items-center justify-center font-headline font-black text-4xl -rotate-12 translate-x-12 -translate-y-12">
            OK
          </div>
          <div className="w-24 h-24 border-4 border-primary rounded-full flex items-center justify-center mx-auto mb-12">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-6xl font-headline text-primary mb-8 font-black uppercase tracking-tighter leading-none">
            Evidence<br/>Recorded
          </h2>
          <div className="h-[2px] w-24 bg-tertiary mx-auto mb-10"></div>
          <p className="text-xl font-medium text-secondary leading-relaxed mb-16 italic border-l-4 border-primary/10 pl-8 text-left">
            "Your testimony has been successfully integrated into the Civic Integrity Ledger. This record serves as primary evidence for future institutional audits."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => setStatus('idle')}
              className="bg-primary text-on-primary px-10 py-6 font-headline text-xl uppercase tracking-widest hover:bg-tertiary transition-all"
            >
              New Submission
            </button>
            <Link to="/" className="border-2 border-primary text-primary px-10 py-6 font-headline text-xl uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all">
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F4] pt-24 pb-32 font-sans selection:bg-primary selection:text-on-primary">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <Link to="/" className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40 hover:text-primary transition-all mb-16 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
          Return to Dashboard
        </Link>

        {/* Header Section - Formal Editorial */}
        <header className="mb-24 relative">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 border-b-4 border-primary pb-16">
            <div className="max-w-3xl space-y-10">
              <div className="flex items-center gap-6">
                <div className="px-4 py-1 bg-primary text-on-primary text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
                  Form v2.1.0
                </div>
                <div className="h-[1px] w-12 bg-primary/30"></div>
                <span className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase">Evidence Submission Portal</span>
              </div>
              <h1 className="text-primary font-headline text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
                Document<br/>
                <span className="text-tertiary italic">Inaction</span>
              </h1>
              <p className="text-secondary text-xl leading-relaxed font-medium border-l-4 border-tertiary pl-8 italic">
                行政の不作為、不祥事、または制度的な欠陥に関する証言を記録します。入力された情報は、AIによる法的精査および公共のアーカイブとして活用されます。
              </p>
            </div>
            <div className="hidden lg:flex flex-col items-end gap-6">
              <div className="w-24 h-24 border-2 border-primary/10 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-primary/20" />
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-40">Protocol</div>
                <div className="text-sm font-black text-primary uppercase tracking-tighter">Scholarly Audit</div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Main Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="bg-white border-2 border-primary relative overflow-hidden shadow-2xl shadow-primary/5">
              <div className="absolute top-0 left-0 w-full h-2 bg-tertiary"></div>
              <div className="p-12 lg:p-20 space-y-16">
                
                {/* Title Input */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40">01. Case Title</label>
                    <div className="h-[1px] flex-1 bg-primary/5"></div>
                  </div>
                  <input 
                    required
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="ENTER CASE TITLE..."
                    className="w-full bg-transparent border-b-4 border-primary/10 focus:border-tertiary transition-all px-0 py-6 text-4xl font-headline font-black text-primary outline-none placeholder:text-primary/5 uppercase tracking-tighter"
                  />
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40">02. Classification</label>
                      <div className="h-[1px] flex-1 bg-primary/5"></div>
                    </div>
                    <div className="relative border-b-4 border-primary/10 focus-within:border-tertiary transition-all">
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-transparent px-0 py-6 text-xl font-headline font-black text-primary appearance-none outline-none uppercase tracking-widest cursor-pointer"
                      >
                        <option value="inaction">Inaction (不作為)</option>
                        <option value="misconduct">Misconduct (不祥事)</option>
                        <option value="other">Other (その他)</option>
                      </select>
                      <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/20 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40">03. Jurisdiction</label>
                      <div className="h-[1px] flex-1 bg-primary/5"></div>
                    </div>
                    <div className="relative border-b-4 border-primary/10 focus-within:border-tertiary transition-all">
                      <input 
                        required
                        type="text" 
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="MUNICIPALITY / REGION"
                        className="w-full bg-transparent px-0 py-6 text-xl font-headline font-black text-primary outline-none placeholder:text-primary/5 uppercase tracking-widest"
                      />
                      <MapPin className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/20" />
                    </div>
                  </div>
                </div>

                {/* Date Input */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40">04. Occurrence Date</label>
                    <div className="h-[1px] flex-1 bg-primary/5"></div>
                  </div>
                  <div className="relative border-b-4 border-primary/10 focus-within:border-tertiary transition-all">
                    <input 
                      required
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-transparent px-0 py-6 text-xl font-headline font-black text-primary outline-none uppercase tracking-widest"
                    />
                    <Calendar className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/20" />
                  </div>
                </div>

                {/* Description Input */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40">05. Detailed Testimony</label>
                    <div className="h-[1px] flex-1 bg-primary/5"></div>
                  </div>
                  <textarea 
                    required
                    rows={8}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="どのような不作為や不祥事があったのか、客観的な事実に基づき具体的に記述してください..."
                    className="w-full bg-[#FBFBFB] border-2 border-primary/5 p-10 text-xl text-primary font-medium outline-none focus:border-tertiary transition-all resize-none placeholder:text-primary/5 shadow-inner"
                  />
                </div>

                {status === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-8 bg-error/5 text-error border-l-8 border-error flex items-center gap-6"
                  >
                    <AlertCircle className="w-8 h-8 shrink-0" />
                    <p className="text-sm font-bold uppercase tracking-widest leading-relaxed">{errorMessage}</p>
                  </motion.div>
                )}

                <button 
                  type="submit"
                  disabled={status === 'submitting'}
                  className="group relative w-full py-10 bg-primary text-on-primary overflow-hidden transition-all active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-tertiary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <div className="relative z-10 flex items-center justify-center gap-6">
                    {status === 'submitting' ? <Loader2 className="w-8 h-8 animate-spin" /> : (
                      <>
                        <Send className="w-8 h-8" />
                        <span className="text-3xl font-headline font-black uppercase tracking-[0.2em]">Commit to Ledger</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar Info */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="sticky top-32 space-y-12">
              
              {/* Security Widget */}
              <div className="bg-white border-2 border-primary p-12 relative">
                <div className="absolute -top-4 -left-4 bg-tertiary text-on-tertiary px-4 py-1 text-[10px] font-bold uppercase tracking-widest">Security Protocol</div>
                <div className="space-y-10">
                  <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-primary font-headline text-3xl font-black uppercase tracking-tight leading-none">Privacy &<br/>Integrity</h3>
                    <div className="h-[2px] w-16 bg-tertiary"></div>
                    <p className="text-sm font-medium text-secondary leading-relaxed italic border-l-4 border-primary/10 pl-6">
                      送信された情報は、Project Manaの独立したデータベースに暗号化され保存されます。個人を特定できる情報は、法的義務または本人の明示的な同意がない限り、第三者に公開されることはありません。
                    </p>
                  </div>
                </div>
              </div>

              {/* Guidelines Widget */}
              <div className="bg-primary text-on-primary p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-x-8 -translate-y-8"></div>
                <h3 className="text-2xl font-headline font-black mb-10 flex items-center gap-4 tracking-tight uppercase">
                  <Info className="w-6 h-6 text-tertiary" />
                  Submission Guide
                </h3>
                <ul className="space-y-8">
                  <li className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tip 01</div>
                    <p className="text-sm font-medium leading-relaxed italic">可能な限り、日時、場所、関与した部署名などの具体的な事実を記述してください。</p>
                  </li>
                  <li className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tip 02</div>
                    <p className="text-sm font-medium leading-relaxed italic">感情的な表現よりも、客観的な「不作為」の事実に焦点を当てて記述することが、AIによる精査の精度を高めます。</p>
                  </li>
                </ul>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
