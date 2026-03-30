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
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10 selection:text-primary">
      {/* Top Navigation Bar */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${
        isHome ? 'bg-background/80 backdrop-blur-xl' : 'bg-background/95 backdrop-blur-md border-b border-border/50'
      }`}>
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 flex justify-between items-center h-24">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-primary/10">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-headline font-bold tracking-tighter text-foreground leading-none">Project Mana</span>
              <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-primary mt-1">Civic Transparency</span>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-10 h-full">
            {[
              { path: '/', label: 'ホーム' },
              { path: '/collector', label: '不祥事DB' },
              { path: '/town-check', label: '街の診断' },
              { path: '/analysis', label: 'AI分析' },
              { path: '/library', label: 'ライブラリ' },
              { path: '/report', label: '体験報告' },
            ].map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`h-full flex items-center font-body font-semibold text-xs uppercase tracking-widest transition-all hover:text-primary relative group ${
                  location.pathname === item.path ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform duration-300 origin-left ${
                  location.pathname === item.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-3 rounded-full hover:bg-primary/5 transition-all active:scale-95 text-on-surface-variant hover:text-primary">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-full bg-primary/5 hover:bg-primary transition-all active:scale-95 text-primary hover:text-white border border-primary/10">
              <UserCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border/50 py-20">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-4 space-y-6">
              <div className="text-3xl font-bold text-foreground font-headline tracking-tighter">Project Mana</div>
              <p className="text-on-surface-variant font-serif italic text-lg leading-relaxed">
                行政の不作為を可視化し、市民一人ひとりが声を上げられる社会を目指すオープンアーカイブ・プロジェクト。
              </p>
            </div>
            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary">Navigation</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-sm text-on-surface-variant hover:text-primary transition-colors">ホーム</Link></li>
                  <li><Link to="/collector" className="text-sm text-on-surface-variant hover:text-primary transition-colors">不祥事DB</Link></li>
                  <li><Link to="/town-check" className="text-sm text-on-surface-variant hover:text-primary transition-colors">街の診断</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary">Resources</h4>
                <ul className="space-y-2">
                  <li><Link to="/analysis" className="text-sm text-on-surface-variant hover:text-primary transition-colors">AI分析レポート</Link></li>
                  <li><Link to="/library" className="text-sm text-on-surface-variant hover:text-primary transition-colors">公文書ライブラリ</Link></li>
                  <li><Link to="/report" className="text-sm text-on-surface-variant hover:text-primary transition-colors">体験報告フォーム</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary">About</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">プロジェクトについて</a></li>
                  <li><a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">情報の扱い</a></li>
                  <li><a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">お問い合わせ</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[10px] font-mono text-on-surface-variant/60 uppercase tracking-widest">
              © 2024 The Open Archive: Project Mana. Promoting transparency through citizen-led documentation.
            </div>
            <div className="flex gap-6">
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all cursor-pointer">
                <Database className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all cursor-pointer">
                <FileSearch className="w-4 h-4" />
              </div>
            </div>
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
