import { motion } from 'motion/react';
import { Shield, Database, FileSearch, ArrowRight, Activity, Users, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#a1cfcf_0%,transparent_50%)]"></div>
        </div>
        
        <div className="relative z-10 text-center px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-block bg-secondary/20 text-secondary-fixed px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase"
          >
            Project Mana: 尊厳の奪還作戦
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-8xl font-bold text-white mb-8 leading-tight font-headline"
          >
            透明性が、<br />未来を創る。
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-primary-fixed-dim mb-12 leading-relaxed font-body max-w-2xl mx-auto"
          >
            行政の不作為、不祥事、そして埋もれた公文書。<br />
            私たちは市民の力で、真実を記録し、共有します。
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link to="/library" className="bg-secondary text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-secondary/90 transition-all flex items-center gap-2 group">
              ライブラリを探索
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#about" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
              プロジェクトについて
            </a>
          </motion.div>
        </div>
      </section>

      {/* Database Grid */}
      <section className="py-24 px-8 max-w-screen-2xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">統合データベース</h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Project Manaが提供する3つの主要なアーカイブ。それぞれの視点から行政の透明性を追求します。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <DBLinkCard 
            title="不作為DB"
            description="なすべき公務が行われなかった事例を体系的に記録。市民の権利を守るためのデータベース。"
            icon={<Shield className="w-12 h-12" />}
            color="bg-primary-container"
            textColor="text-primary-fixed"
            link="#"
          />
          <DBLinkCard 
            title="不祥事DB"
            description="行政内部で発生した不祥事や不正を記録。再発防止と責任追及のためのアーカイブ。"
            icon={<Database className="w-12 h-12" />}
            color="bg-secondary-fixed"
            textColor="text-on-secondary-fixed"
            link="#"
          />
          <DBLinkCard 
            title="公文書ライブラリ"
            description="開示された公文書をデジタル化して保存。誰でも自由に閲覧・検索が可能です。"
            icon={<FileSearch className="w-12 h-12" />}
            color="bg-tertiary-fixed"
            textColor="text-on-tertiary-fixed"
            link="/library"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-surface-container-low py-24">
        <div className="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <StatItem icon={<Activity />} value="1,240+" label="記録された事例" />
          <StatItem icon={<Users />} value="8,500+" label="アクティブユーザー" />
          <StatItem icon={<FileSearch />} value="24,000+" label="公開ドキュメント" />
          <StatItem icon={<Globe />} value="12" label="連携自治体" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-8 max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-5xl font-bold text-primary mb-8 leading-tight">
            尊厳の奪還作戦、<br />その第一歩。
          </h2>
          <div className="space-y-6 text-lg text-on-surface-variant leading-relaxed">
            <p>
              Project Manaは、市民が行政の監視者として機能するためのデジタル基盤です。情報の非対称性を解消し、民主主義をより強固なものにすることを目指しています。
            </p>
            <p>
              私たちは、単なるデータの蓄積ではなく、そのデータが「市民の武器」となるようなプラットフォームを構築しています。
            </p>
          </div>
          <button className="mt-12 text-secondary font-bold text-xl flex items-center gap-2 hover:gap-4 transition-all">
            詳細なマニフェストを読む
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
        <div className="relative">
          <div className="aspect-square bg-primary-fixed rounded-3xl overflow-hidden shadow-2xl rotate-3">
             <img 
               src="https://picsum.photos/seed/mana-portal/800/800" 
               alt="Project Mana Vision" 
               className="w-full h-full object-cover opacity-80 mix-blend-multiply"
               referrerPolicy="no-referrer"
             />
          </div>
          <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl max-w-xs -rotate-3">
            <p className="text-primary font-headline italic text-xl">
              「記録は、沈黙を拒むための唯一の手段である。」
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function DBLinkCard({ title, description, icon, color, textColor, link }: any) {
  const isExternal = link === '#';
  const Component = isExternal ? 'div' : Link;
  
  return (
    <Component 
      to={isExternal ? undefined : link} 
      className={`p-10 rounded-3xl ${color} ${textColor} hover:scale-[1.02] transition-all cursor-pointer shadow-sm flex flex-col h-full`}
    >
      <div className="mb-8 opacity-80">{icon}</div>
      <h3 className="text-3xl font-bold mb-4">{title}</h3>
      <p className="text-lg opacity-90 leading-relaxed mb-8 flex-1">{description}</p>
      <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm">
        {isExternal ? '準備中' : 'アクセスする'}
        {!isExternal && <ArrowRight className="w-4 h-4" />}
      </div>
    </Component>
  );
}

function StatItem({ icon, value, label }: any) {
  return (
    <div className="text-center">
      <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm text-secondary mb-6">
        {icon}
      </div>
      <div className="text-4xl font-bold text-primary mb-2">{value}</div>
      <div className="text-on-surface-variant font-medium">{label}</div>
    </div>
  );
}
