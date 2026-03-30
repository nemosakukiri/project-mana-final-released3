import { Search, Bell, UserCircle, BookOpen, FileText, BarChart3, Image as ImageIcon, Download, Eye, HelpCircle, ChevronDown, Scale, Send, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Library() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        {/* Hero Section - Elegant Editorial */}
        <section className="py-20 border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-8"
              >
                Archive & Resources
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl lg:text-8xl font-headline mb-8 leading-[0.9] tracking-tighter"
              >
                不作為の証拠を、<br /><span className="text-secondary italic">市民の手に。</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl lg:text-2xl text-on-surface-variant leading-relaxed font-serif italic max-w-2xl mb-12"
              >
                公文書は、行政が「何をしたか」だけでなく、「何をすべきだったか」を証明する唯一の手段です。沈黙の中に隠された不作為を、私たちは見逃しません。
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-6"
              >
                <Link to="/report" className="bg-primary text-white px-10 py-5 font-headline text-xl hover:bg-primary/90 transition-all flex items-center gap-3">
                  <Send className="w-6 h-6" />
                  体験を報告する
                </Link>
                <Link to="/analysis" className="bg-surface text-foreground px-10 py-5 font-headline text-xl border border-border hover:bg-muted transition-all flex items-center gap-3">
                  <Scale className="w-6 h-6" />
                  AI解析を利用
                </Link>
              </motion.div>
            </div>
            <div className="lg:col-span-4 hidden lg:block">
              <div className="aspect-[3/4] bg-surface border border-border p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                <BookOpen className="w-full h-full text-primary/20 absolute -bottom-10 -right-10 rotate-12" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="text-4xl font-headline italic text-primary">Glossary</div>
                  <div>
                    <p className="text-sm font-body text-on-surface-variant mb-4">行政用語解説辞典</p>
                    <a href="#" className="inline-flex items-center gap-2 text-lg font-headline border-b border-primary text-primary hover:gap-4 transition-all">
                      用語集を見る <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter Area */}
        <section className="py-12 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-6">
              <label className="block text-xs font-bold uppercase tracking-widest mb-4 text-on-surface-variant">キーワードで探す</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full bg-surface border border-border px-12 py-5 text-xl font-serif italic outline-none focus:border-primary transition-colors"
                  placeholder="プロジェクト名、内容..."
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-widest mb-4 text-on-surface-variant">ファイル形式</label>
              <div className="relative">
                <select className="w-full bg-surface border border-border px-6 py-5 text-lg font-serif italic appearance-none outline-none focus:border-primary transition-colors">
                  <option>すべての形式</option>
                  <option>PDF (報告書)</option>
                  <option>CSV (データ)</option>
                  <option>JPG (記録写真)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-widest mb-4 text-on-surface-variant">更新時期</label>
              <div className="relative">
                <select className="w-full bg-surface border border-border px-6 py-5 text-lg font-serif italic appearance-none outline-none focus:border-primary transition-colors">
                  <option>全期間</option>
                  <option>直近1年以内</option>
                  <option>2023年度</option>
                  <option>2022年度</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-12">
          {/* List Column */}
          <div className="lg:col-span-8">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl font-headline tracking-tighter">最新のアーカイブ</h2>
              <span className="text-sm font-serif italic text-on-surface-variant">245件の資料</span>
            </div>

            <div className="space-y-12">
              <DocumentCard 
                type="REPORTS"
                date="2024.03.15"
                title="令和5年度 都市計画審議会 第3回議事録（抜粋）"
                description="本資料は、再開発事業に伴う住民説明会のフィードバックおよび、環境影響評価に関する専門部会の報告内容をまとめたものです。"
                fileInfo="PDF (2.4MB)"
                actionLabel="プレビュー可能"
                icon={<FileText className="w-8 h-8" />}
              />

              <DocumentCard 
                type="DATA"
                date="2024.03.10"
                title="地域交通量調査データ一式（オープンデータ）"
                description="市内主要交差点20箇所における歩行者および車両の通過数推移。二次利用可能なCSV形式での提供です。"
                fileInfo="CSV (15MB)"
                actionLabel="一括ダウンロード"
                icon={<BarChart3 className="w-8 h-8" />}
              />

              <DocumentCard 
                type="ARCHIVE"
                date="2024.02.28"
                title="旧庁舎解体記録写真集：市民の記憶"
                description="50年間にわたり街の象徴であった旧庁舎の最後の日々を記録したデジタル写真集です。"
                fileInfo="JPG (45枚)"
                actionLabel="ギャラリー表示"
                icon={<ImageIcon className="w-8 h-8" />}
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            {/* Preview Widget */}
            <div className="p-8 bg-surface border border-border">
              <h3 className="text-2xl font-headline mb-6 tracking-tighter">Quick Preview</h3>
              <div className="aspect-[3/4] bg-background border border-border overflow-hidden flex flex-col p-6 relative">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="relative z-10 flex-1 flex flex-col gap-4">
                  <div className="h-6 bg-foreground/10 w-3/4"></div>
                  <div className="h-3 bg-foreground/5 w-full"></div>
                  <div className="h-3 bg-foreground/5 w-5/6"></div>
                  <div className="h-3 bg-foreground/5 w-full"></div>
                  <div className="mt-8 flex gap-4">
                    <div className="w-16 h-16 bg-primary/10 border border-primary/20"></div>
                    <div className="flex-1 h-3 bg-foreground/5 mt-4"></div>
                  </div>
                </div>
                <div className="mt-auto pt-6 border-t border-border">
                  <p className="text-xs font-serif italic text-on-surface-variant">※ 選択中の資料をここに表示します</p>
                </div>
              </div>
              <button className="w-full mt-8 bg-foreground text-background py-4 font-headline text-lg hover:bg-primary transition-all">
                全画面で閲覧する
              </button>
            </div>

            {/* Help Widget */}
            <div className="p-8 bg-primary text-white">
              <h3 className="text-2xl font-headline mb-6 flex items-center gap-3 tracking-tighter">
                <HelpCircle className="w-6 h-6" />
                Tips
              </h3>
              <ul className="space-y-6 text-lg font-serif italic text-white/80">
                <li className="flex gap-4">
                  <span className="text-secondary font-headline text-2xl">01.</span>
                  <span>「不作為」とは、なすべき公務を行わなかった状態を指します。</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-secondary font-headline text-2xl">02.</span>
                  <span>「オープンデータ」は、どなたでも二次利用が可能です。</span>
                </li>
              </ul>
              <a href="#" className="mt-8 inline-flex items-center gap-2 text-lg font-headline border-b border-secondary text-secondary hover:gap-4 transition-all pb-1">
                View All Guides <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function DocumentCard({ type, date, title, description, fileInfo, actionLabel, icon }: any) {
  return (
    <motion.article 
      whileHover={{ x: 10 }}
      className="group bg-surface p-8 border border-border flex flex-col md:flex-row gap-8 items-start transition-all cursor-pointer hover:border-primary/30"
    >
      <div className="p-6 bg-primary/5 text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex gap-4 mb-4 items-center">
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary bg-primary/10 px-2 py-0.5">{type}</span>
          <span className="text-xs font-mono text-on-surface-variant">{date} 更新</span>
        </div>
        <h3 className="text-3xl font-headline mb-4 group-hover:text-primary transition-colors leading-tight tracking-tighter">
          {title}
        </h3>
        <p className="text-lg font-serif italic text-on-surface-variant line-clamp-2 leading-relaxed mb-6">
          {description}
        </p>
        <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          <span className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            {fileInfo}
          </span>
          <span className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            {actionLabel}
          </span>
          <Link to="/analysis" className="md:ml-auto text-primary border-b border-primary/30 hover:border-primary transition-all flex items-center gap-2 pb-0.5">
            <Scale className="w-4 h-4" />
            AI法的精査
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
