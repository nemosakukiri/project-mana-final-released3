import { Search, Bell, UserCircle, BookOpen, FileText, BarChart3, Image as ImageIcon, Download, Eye, HelpCircle, ChevronDown, Scale, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Library() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-screen-2xl mx-auto">
        {/* Hero Section - Mondrian Style */}
        <section className="grid grid-cols-12 border-b-8 border-black bg-white">
          <div className="col-span-12 lg:col-span-8 p-16 border-r-8 border-black">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[8vw] font-headline mb-8 leading-none tracking-tighter"
            >
              不作為の証拠を、<br /><span className="text-secondary italic">市民の手に。</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl text-on-surface-variant leading-relaxed font-serif italic max-w-2xl mb-12"
            >
              公文書は、行政が「何をしたか」だけでなく、「何をすべきだったか」を証明する唯一の手段です。沈黙の中に隠された不作為を、私たちは見逃しません。
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-8"
            >
              <Link to="/report" className="bg-secondary text-white px-12 py-6 font-headline text-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-4">
                <Send className="w-8 h-8" />
                体験を報告する
              </Link>
              <Link to="/analysis" className="bg-black text-white px-12 py-6 font-headline text-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-4">
                <Scale className="w-8 h-8" />
                AI解析を利用
              </Link>
            </motion.div>
          </div>
          <div className="col-span-12 lg:col-span-4 grid grid-rows-2">
            <div className="bg-mondrian-blue border-b-8 border-black p-12 flex items-center justify-center">
               <BookOpen className="w-32 h-32 text-white" />
            </div>
            <div className="bg-mondrian-yellow p-12 flex flex-col items-center justify-center">
               <span className="text-black font-headline text-4xl mb-4 uppercase tracking-widest">Glossary</span>
               <a href="#" className="text-xl font-bold border-b-4 border-black hover:bg-black hover:text-white transition-all px-4 py-2">
                  行政用語解説辞典
               </a>
            </div>
          </div>
        </section>

        {/* Search & Filter Area */}
        <section className="grid grid-cols-12 border-b-8 border-black bg-white">
          <div className="col-span-12 md:col-span-6 p-12 border-r-8 border-black bg-mondrian-yellow/5">
            <label className="block text-xl font-headline uppercase tracking-widest mb-6">キーワードで探す</label>
            <div className="relative">
              <input 
                type="text" 
                className="w-full bg-white border-4 border-black px-12 py-6 text-2xl font-serif italic outline-none focus:bg-mondrian-yellow/10 transition-colors"
                placeholder="プロジェクト名、内容..."
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-black" />
            </div>
          </div>
          <div className="col-span-12 md:col-span-3 p-12 border-r-8 border-black bg-mondrian-blue/5">
            <label className="block text-xl font-headline uppercase tracking-widest mb-6">ファイル形式</label>
            <div className="relative">
              <select className="w-full bg-white border-4 border-black px-6 py-6 text-xl font-serif italic appearance-none outline-none focus:bg-mondrian-blue/10 transition-colors">
                <option>すべての形式</option>
                <option>PDF (報告書)</option>
                <option>CSV (データ)</option>
                <option>JPG (記録写真)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-black pointer-events-none" />
            </div>
          </div>
          <div className="col-span-12 md:col-span-3 p-12 bg-secondary/5">
            <label className="block text-xl font-headline uppercase tracking-widest mb-6">更新時期</label>
            <div className="relative">
              <select className="w-full bg-white border-4 border-black px-6 py-6 text-xl font-serif italic appearance-none outline-none focus:bg-secondary/10 transition-colors">
                <option>全期間</option>
                <option>直近1年以内</option>
                <option>2023年度</option>
                <option>2022年度</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-black pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-12 gap-0 border-b-8 border-black">
          {/* List Column */}
          <div className="col-span-12 lg:col-span-8 border-r-8 border-black bg-white">
            <div className="p-12 border-b-8 border-black bg-black text-white flex justify-between items-center">
              <h2 className="text-5xl font-headline uppercase tracking-tighter">最新のアーカイブ</h2>
              <span className="text-xl font-serif italic opacity-60">245件の資料</span>
            </div>

            <div className="divide-y-8 divide-black">
              <DocumentCard 
                type="REPORTS"
                date="2024.03.15"
                title="令和5年度 都市計画審議会 第3回議事録（抜粋）"
                description="本資料は、再開発事業に伴う住民説明会のフィードバックおよび、環境影響評価に関する専門部会の報告内容をまとめたものです。"
                fileInfo="PDF (2.4MB)"
                actionLabel="プレビュー可能"
                icon={<FileText className="w-12 h-12" />}
                iconBg="bg-secondary"
              />

              <DocumentCard 
                type="DATA"
                date="2024.03.10"
                title="地域交通量調査データ一式（オープンデータ）"
                description="市内主要交差点20箇所における歩行者および車両の通過数推移。二次利用可能なCSV形式での提供です。"
                fileInfo="CSV (15MB)"
                actionLabel="一括ダウンロード"
                icon={<BarChart3 className="w-12 h-12" />}
                iconBg="bg-mondrian-blue"
              />

              <DocumentCard 
                type="ARCHIVE"
                date="2024.02.28"
                title="旧庁舎解体記録写真集：市民の記憶"
                description="50年間にわたり街の象徴であった旧庁舎の最後の日々を記録したデジタル写真集です。"
                fileInfo="JPG (45枚)"
                actionLabel="ギャラリー表示"
                icon={<ImageIcon className="w-12 h-12" />}
                iconBg="bg-mondrian-yellow"
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-4 bg-white flex flex-col">
            {/* Preview Widget */}
            <div className="p-12 border-b-8 border-black bg-mondrian-yellow flex-1">
              <h3 className="text-4xl font-headline text-black mb-8 uppercase tracking-tighter">Quick Preview</h3>
              <div className="aspect-[3/4] bg-white border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col p-8">
                <div className="flex-1 flex flex-col gap-4">
                  <div className="h-8 bg-black/10 w-3/4"></div>
                  <div className="h-4 bg-black/5 w-full"></div>
                  <div className="h-4 bg-black/5 w-5/6"></div>
                  <div className="h-4 bg-black/5 w-full"></div>
                  <div className="mt-8 flex gap-4">
                    <div className="w-20 h-20 bg-secondary border-4 border-black"></div>
                    <div className="flex-1 h-4 bg-black/5 mt-4"></div>
                  </div>
                </div>
                <div className="mt-auto pt-8 border-t-4 border-black">
                  <p className="text-sm font-serif italic opacity-60">※ 選択中の資料をここに表示します</p>
                </div>
              </div>
              <button className="w-full mt-12 bg-black text-white py-6 font-headline text-2xl border-4 border-black hover:bg-secondary transition-all">
                全画面で閲覧する
              </button>
            </div>

            {/* Help Widget */}
            <div className="p-12 bg-mondrian-blue text-white">
              <h3 className="text-4xl font-headline mb-8 flex items-center gap-4 uppercase tracking-tighter">
                <HelpCircle className="w-10 h-10" />
                Tips
              </h3>
              <ul className="space-y-8 text-xl font-serif italic">
                <li className="flex gap-4">
                  <span className="text-mondrian-yellow font-headline text-3xl">01.</span>
                  <span>「不作為」とは、なすべき公務を行わなかった状態を指します。</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-mondrian-yellow font-headline text-3xl">02.</span>
                  <span>「オープンデータ」は、どなたでも二次利用が可能です。</span>
                </li>
              </ul>
              <a href="#" className="mt-12 inline-block text-2xl font-headline border-b-4 border-mondrian-yellow hover:text-mondrian-yellow transition-all pb-2 uppercase tracking-widest">
                View All Guides
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function DocumentCard({ type, date, title, description, fileInfo, actionLabel, icon, iconBg }: any) {
  return (
    <motion.article 
      whileHover={{ x: 10 }}
      className="group bg-white p-12 flex gap-12 items-start transition-all cursor-pointer"
    >
      <div className={`${iconBg} p-8 border-8 border-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex gap-4 mb-4 items-center">
          <span className="bg-black px-4 py-1 font-headline text-sm text-white tracking-widest">{type}</span>
          <span className="text-sm font-mono opacity-60">{date} 更新</span>
        </div>
        <h3 className="text-4xl font-headline mb-4 group-hover:text-secondary transition-colors leading-none tracking-tighter">
          {title}
        </h3>
        <p className="text-xl font-serif italic text-on-surface-variant line-clamp-2 leading-relaxed mb-8">
          {description}
        </p>
        <div className="flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            {fileInfo}
          </span>
          <span className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            {actionLabel}
          </span>
          <Link to="/analysis" className="ml-auto bg-mondrian-yellow text-black px-6 py-2 border-2 border-black hover:bg-black hover:text-white transition-all flex items-center gap-2">
            <Scale className="w-5 h-5" />
            AI法的精査
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
