import { Search, Bell, UserCircle, BookOpen, FileText, BarChart3, Image as ImageIcon, Download, Eye, HelpCircle, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

export default function Library() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-screen-2xl mx-auto px-8 py-12 w-full">
        {/* Hero Section */}
        <section className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-bold text-primary mb-6 leading-tight"
            >
              不作為の証拠を、<br />市民の手に。
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-on-surface-variant leading-relaxed font-body max-w-xl"
            >
              公文書は、行政が「何をしたか」だけでなく、「何をすべきだったか」を証明する唯一の手段です。沈黙の中に隠された不作為を、私たちは見逃しません。
            </motion.p>
          </div>
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-primary-container p-6 rounded-xl text-primary-fixed flex items-center gap-4 shadow-sm"
            >
              <BookOpen className="w-10 h-10" />
              <div>
                <p className="text-sm opacity-80 mb-1">難しい言葉を調べたいときは</p>
                <a href="#" className="font-bold border-b border-primary-fixed/40 hover:border-primary-fixed transition-colors">
                  「行政用語解説辞典」を開く
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search & Filter Area */}
        <section className="mb-12 p-8 bg-surface-container-low rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-on-surface-variant mb-2">キーワードで探す</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full bg-surface-container-high border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-4 py-3 rounded-t-md transition-colors outline-none"
                  placeholder="プロジェクト名、内容..."
                />
                <Search className="absolute right-3 top-3 w-5 h-5 text-on-surface-variant" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">ファイル形式</label>
              <div className="relative">
                <select className="w-full bg-surface-container-high border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-4 py-3 rounded-t-md appearance-none outline-none">
                  <option>すべての形式</option>
                  <option>PDF (報告書)</option>
                  <option>CSV (データ)</option>
                  <option>JPG (記録写真)</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-on-surface-variant pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">更新時期</label>
              <div className="relative">
                <select className="w-full bg-surface-container-high border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-4 py-3 rounded-t-md appearance-none outline-none">
                  <option>全期間</option>
                  <option>直近1年以内</option>
                  <option>2023年度</option>
                  <option>2022年度</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-on-surface-variant pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary">最新のアーカイブ</h2>
              <span className="text-sm text-on-surface-variant">245件の資料が見つかりました</span>
            </div>

            {/* Document Items */}
            <DocumentCard 
              type="REPORTS"
              date="2024.03.15"
              title="令和5年度 都市計画審議会 第3回議事録（抜粋）"
              description="本資料は、再開発事業に伴う住民説明会のフィードバックおよび、環境影響評価に関する専門部会の報告内容をまとめたものです。"
              fileInfo="PDF (2.4MB)"
              actionLabel="プレビュー可能"
              icon={<FileText className="w-8 h-8" />}
              iconBg="bg-primary-fixed"
            />

            <DocumentCard 
              type="DATA"
              date="2024.03.10"
              title="地域交通量調査データ一式（オープンデータ）"
              description="市内主要交差点20箇所における歩行者および車両の通過数推移。二次利用可能なCSV形式での提供です。"
              fileInfo="CSV (15MB)"
              actionLabel="一括ダウンロード"
              icon={<BarChart3 className="w-8 h-8" />}
              iconBg="bg-tertiary-fixed"
            />

            <DocumentCard 
              type="ARCHIVE"
              date="2024.02.28"
              title="旧庁舎解体記録写真集：市民の記憶"
              description="50年間にわたり街の象徴であった旧庁舎の最後の日々を記録したデジタル写真集です。"
              fileInfo="JPG (45枚)"
              actionLabel="ギャラリー表示"
              icon={<ImageIcon className="w-8 h-8" />}
              iconBg="bg-secondary-fixed"
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Preview Widget */}
            <div className="bg-surface-container p-8 rounded-xl relative overflow-hidden">
              <h3 className="text-xl font-bold text-primary mb-6">クイックプレビュー</h3>
              <div className="aspect-[3/4] bg-white rounded-lg shadow-inner overflow-hidden flex flex-col items-center justify-center p-6 border border-outline-variant/10">
                <div className="w-full h-full bg-surface-container-low p-4 flex flex-col gap-3">
                  <div className="h-4 bg-outline-variant/30 w-3/4 rounded animate-pulse"></div>
                  <div className="h-3 bg-outline-variant/20 w-full rounded animate-pulse"></div>
                  <div className="h-3 bg-outline-variant/20 w-5/6 rounded animate-pulse"></div>
                  <div className="h-3 bg-outline-variant/20 w-full rounded animate-pulse"></div>
                  <div className="mt-4 flex gap-2">
                    <div className="w-12 h-12 bg-primary/10 rounded"></div>
                    <div className="flex-1 h-3 bg-outline-variant/20 rounded mt-2"></div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-outline-variant/20">
                    <p className="text-[10px] text-on-surface-variant font-body italic">※ 選択中の資料をここに表示します</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 bg-secondary text-white py-3 rounded-lg font-bold shadow-md hover:bg-secondary/90 transition-all active:scale-95">
                全画面で閲覧する
              </button>
            </div>

            {/* Help Widget */}
            <div className="bg-surface-container-highest p-8 rounded-xl">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                調べ方のヒント
              </h3>
              <ul className="space-y-4 text-sm text-on-surface-variant leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-secondary font-bold">1.</span>
                  <span>「不作為」とは、なすべき公務を行わなかった状態を指します。</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-secondary font-bold">2.</span>
                  <span>「オープンデータ」は、どなたでも二次利用が可能です。</span>
                </li>
              </ul>
              <a href="#" className="mt-6 inline-block text-primary font-bold border-b-2 border-primary/20 hover:border-primary transition-all pb-1">
                全てのガイドを見る
              </a>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function DocumentCard({ type, date, title, description, fileInfo, actionLabel, icon, iconBg }: any) {
  return (
    <motion.article 
      whileHover={{ y: -4 }}
      className="group bg-white p-6 rounded-xl hover:shadow-lg transition-all cursor-pointer flex gap-6 items-start border border-transparent hover:border-outline-variant/20"
    >
      <div className={`${iconBg} p-4 rounded-lg text-primary`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex gap-2 mb-2 items-center">
          <span className="bg-primary-fixed px-2 py-0.5 rounded text-[10px] font-bold text-primary tracking-wider">{type}</span>
          <span className="text-xs text-on-surface-variant">{date} 更新</span>
        </div>
        <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors leading-tight">
          {title}
        </h3>
        <p className="text-on-surface-variant text-sm line-clamp-2 leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex items-center gap-4 text-xs font-bold text-primary">
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            {fileInfo}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {actionLabel}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
