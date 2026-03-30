import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Bell, UserCircle, Shield, Database, FileSearch, Activity, MapPin } from 'lucide-react';
import Home from './pages/Home';
import Library from './pages/Library';
import Report from './pages/Report';
import Analysis from './pages/Analysis';
import Collector from './pages/Collector';
import TownCheck from './pages/TownCheck';
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
      <header className={`sticky top-0 z-50 transition-all duration-300 border-b-8 border-black ${
        isHome ? 'bg-black text-white' : 'bg-white text-black'
      }`}>
        <div className="max-w-screen-2xl mx-auto px-8 flex justify-between items-center h-24">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-secondary border-4 border-black flex items-center justify-center group-hover:rotate-90 transition-transform">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <span className="text-4xl font-headline tracking-tighter uppercase">Project Mana</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-0 h-full">
            <Link to="/" className={`h-full px-6 flex items-center font-headline font-bold text-xl transition-colors border-l-4 border-black ${
              location.pathname === '/' ? 'bg-mondrian-yellow text-black' : (isHome ? 'text-white/60 hover:bg-white/10' : 'text-on-surface-variant hover:bg-surface-container-low')
            }`}>ダッシュボード</Link>
            <Link to="/collector" className={`h-full px-6 flex items-center font-headline font-bold text-xl transition-colors border-l-4 border-black ${
              location.pathname === '/collector' ? 'bg-secondary text-white' : (isHome ? 'text-white/60 hover:bg-white/10' : 'text-on-surface-variant hover:bg-surface-container-low')
            }`}>不祥事DB</Link>
            <Link to="/town-check" className={`h-full px-6 flex items-center font-headline font-bold text-xl transition-colors border-l-4 border-black ${
              location.pathname === '/town-check' ? 'bg-mondrian-blue text-white' : (isHome ? 'text-white/60 hover:bg-white/10' : 'text-on-surface-variant hover:bg-surface-container-low')
            }`}>街の診断</Link>
            <Link to="/library" className={`h-full px-6 flex items-center font-headline font-bold text-xl transition-colors border-l-4 border-black ${
              location.pathname === '/library' ? 'bg-black text-white' : (isHome ? 'text-white/60 hover:bg-white/10' : 'text-on-surface-variant hover:bg-surface-container-low')
            }`}>ライブラリ</Link>
            <Link to="/report" className={`h-full px-6 flex items-center font-headline font-bold text-xl transition-colors border-l-4 border-black ${
              location.pathname === '/report' ? 'bg-secondary text-white' : (isHome ? 'text-white/60 hover:bg-white/10' : 'text-on-surface-variant hover:bg-surface-container-low')
            }`}>体験報告</Link>
            <div className="h-full border-l-4 border-black" />
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
          <Route path="/town-check" element={<TownCheck />} />
        </Routes>
      </Layout>
    </Router>
  );
}
