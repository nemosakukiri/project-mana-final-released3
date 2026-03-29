import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Bell, UserCircle } from 'lucide-react';
import Home from './pages/Home';
import Library from './pages/Library';
import Report from './pages/Report';
import Analysis from './pages/Analysis';
import Collector from './pages/Collector';
import React, { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isHome ? 'bg-primary/80 text-white' : 'bg-background/80 text-on-surface'
      } backdrop-blur-xl border-b border-outline-variant/20`}>
        <div className="max-w-screen-2xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link to="/" className={`text-2xl font-bold tracking-tight font-headline ${isHome ? 'text-white' : 'text-primary'}`}>
            Project Mana
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className={`font-headline font-bold text-lg transition-colors ${
              isHome ? 'text-white border-b-2 border-white pb-1' : 'text-on-surface-variant hover:text-primary'
            }`}>ホーム</Link>
            <a href="https://fusakui-db.vercel.app/" target="_blank" rel="noopener noreferrer" className={`font-headline font-bold text-lg transition-colors ${
              isHome ? 'text-primary-fixed-dim hover:text-white' : 'text-on-surface-variant hover:text-primary'
            }`}>不作為DB</a>
            <a href="https://misconduct-db.vercel.app/" target="_blank" rel="noopener noreferrer" className={`font-headline font-bold text-lg transition-colors ${
              isHome ? 'text-primary-fixed-dim hover:text-white' : 'text-on-surface-variant hover:text-primary'
            }`}>不祥事DB</a>
            <Link to="/library" className={`font-headline font-bold text-lg transition-colors ${
              location.pathname === '/library' ? 'text-secondary border-b-2 border-secondary pb-1' : (isHome ? 'text-primary-fixed-dim hover:text-white' : 'text-on-surface-variant hover:text-primary')
            }`}>公文書ライブラリ</Link>
            <Link to="/report" className={`font-headline font-bold text-lg transition-colors ${
              location.pathname === '/report' ? 'text-secondary border-b-2 border-secondary pb-1' : (isHome ? 'text-primary-fixed-dim hover:text-white' : 'text-on-surface-variant hover:text-primary')
            }`}>体験報告</Link>
            <Link to="/analysis" className={`font-headline font-bold text-lg transition-colors ${
              location.pathname === '/analysis' ? 'text-secondary border-b-2 border-secondary pb-1' : (isHome ? 'text-primary-fixed-dim hover:text-white' : 'text-on-surface-variant hover:text-primary')
            }`}>AI解析</Link>
            <Link to="/collector" className={`font-headline font-bold text-lg transition-colors ${
              location.pathname === '/collector' ? 'text-secondary border-b-2 border-secondary pb-1' : (isHome ? 'text-primary-fixed-dim hover:text-white' : 'text-on-surface-variant hover:text-primary')
            }`}>AI収集</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className={`p-2 rounded-md transition-all active:scale-95 ${isHome ? 'hover:bg-white/10' : 'hover:bg-surface-container-low'}`}>
              <Bell className={`w-6 h-6 ${isHome ? 'text-white' : 'text-primary'}`} />
            </button>
            <button className={`p-2 rounded-md transition-all active:scale-95 ${isHome ? 'hover:bg-white/10' : 'hover:bg-surface-container-low'}`}>
              <UserCircle className={`w-6 h-6 ${isHome ? 'text-white' : 'text-primary'}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant/20">
        <div className="max-w-screen-2xl mx-auto px-12 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-bold text-primary font-headline">Project Mana</div>
          <div className="flex gap-8">
            <a href="#" className="text-sm text-on-surface-variant hover:text-secondary transition-colors underline decoration-outline-variant/20 underline-offset-4">プロジェクトについて</a>
            <a href="#" className="text-sm text-on-surface-variant hover:text-secondary transition-colors underline decoration-outline-variant/20 underline-offset-4">情報の扱い</a>
            <a href="#" className="text-sm text-on-surface-variant hover:text-secondary transition-colors underline decoration-outline-variant/20 underline-offset-4">お問い合わせ</a>
          </div>
          <div className="text-xs text-on-surface-variant opacity-70">
            © 2024 The Open Archive: Project Mana. Promoting transparency through citizen-led documentation.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/report" element={<Report />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/collector" element={<Collector />} />
        </Routes>
      </Layout>
    </Router>
  );
}
