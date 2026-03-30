import { motion } from 'motion/react';
import { Shield, AlertTriangle, Scale, Gavel, History, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Manifesto() {
  return (
    <div className="min-h-screen bg-[#F5F5F4] pt-24 pb-32 font-sans selection:bg-primary selection:text-on-primary">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        
        {/* Header Section */}
        <header className="mb-24 border-b-4 border-primary pb-12">
          <div className="flex items-center gap-6 mb-8">
            <div className="px-4 py-1 bg-tertiary text-on-tertiary text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
              Official Manifesto / 公式マニフェスト
            </div>
            <div className="h-[1px] w-12 bg-primary/30"></div>
            <span className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase">Project MANA Archive / プロジェクト・マナ アーカイブ</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-headline text-6xl lg:text-8xl font-black tracking-tighter leading-[0.85] uppercase mb-8"
          >
            PROJECT MANA<br/>
            <span className="text-tertiary italic">Official Manifesto</span>
          </motion.h1>
          <p className="text-2xl text-secondary font-medium italic border-l-8 border-tertiary pl-10 max-w-4xl">
            「記録は消えない。行政の不作為は、時間をかけて『犯罪』へと変質する。」
          </p>
        </header>

        {/* Main Content - Editorial Style */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Left Column: The Indictment */}
          <div className="lg:col-span-8 space-y-24">
            
            <section className="space-y-12">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-8 h-8 text-tertiary" />
                <h2 className="text-4xl font-headline font-black text-primary uppercase tracking-tight">Urgent Indictment Log #001 / 緊急告発ログ #001</h2>
              </div>
              
              <div className="bg-white border-4 border-primary p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary text-on-primary flex items-center justify-center font-headline font-black text-4xl -rotate-12 translate-x-8 -translate-y-8">
                  !
                </div>
                <h3 className="text-3xl font-headline font-black text-primary uppercase mb-8 leading-tight">
                  京都市右京区生活福祉課による<br/>
                  「組織的虚偽」と「法治主義の放棄」
                </h3>
                <div className="prose prose-xl text-secondary leading-relaxed italic">
                  <p className="mb-6">
                    不適切な対応の積み重ねが、生存権を侵害している状態そのものが、「違法」である。
                  </p>
                  <p className="mb-6">
                    日本国憲法 第25条（生存権） / 障害者虐待防止法（行政による心理的虐待）
                  </p>
                  <p className="font-black text-primary uppercase tracking-tight">
                    「法に基づかない仕事」の自白は、法治国家における公務員の自己否定である。
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4">
                <Scale className="w-8 h-8 text-tertiary" />
                <h2 className="text-4xl font-headline font-black text-primary uppercase tracking-tight">Analysis / 組織的加害の構造の分析</h2>
              </div>
              <div className="space-y-8 text-xl text-secondary leading-relaxed font-medium italic border-l-4 border-primary/10 pl-10">
                <p>
                  この回答は、実態調査を放棄した本庁が、現場の「捏造された報告」を「適切な対応」とすり替えた証拠である。
                </p>
                <p>
                  相談員（村田氏）のような誠実な支援者すらも、この組織的な「不誠実の壁」によって疲弊させられ、有効な支援を阻まれている。
                </p>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4">
                <History className="w-8 h-8 text-tertiary" />
                <h2 className="text-4xl font-headline font-black text-primary uppercase tracking-tight">Archive / 不誠実な回答の記録アーカイブ</h2>
              </div>
              <div className="bg-primary text-on-primary p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                  <FileText className="w-64 h-64 rotate-12" />
                </div>
                <blockquote className="relative z-10 text-2xl font-medium italic leading-relaxed border-l-4 border-tertiary pl-8 space-y-6">
                  <p>「……本件に関する貴殿の主張については、既に担当部署において適切に対応済みであると認識しております。今後の個別のご相談については、原則として窓口での対応とさせていただきます。」</p>
                  <p>「なお、法務局や厚生労働省等への通報については、貴殿の権利であり、当方として妨げるものではありません。ご自由になさってください。」</p>
                </blockquote>
                <div className="mt-12 text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">
                  Confidential Document | Case File 001 | © 2026 Project MANA
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Meta Info & Vision */}
          <div className="lg:col-span-4 space-y-12">
            <div className="bg-white border-4 border-primary p-10 space-y-8">
              <div className="space-y-2">
                <span className="text-tertiary text-[10px] font-bold tracking-[0.3em] uppercase block">Mission Statement / ミッション・ステートメント</span>
                <h4 className="text-primary font-headline text-3xl font-black uppercase tracking-tighter">Evidence Management / 証拠管理</h4>
              </div>
              <p className="text-lg text-secondary leading-tight italic font-medium">
                Project MANAは、MANAの思考を構造化し、行政の不祥事、不作為、そして法的精査を記録し、市民の知る権利を拡張するための統合アーカイブです。
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-primary font-black text-[10px] uppercase tracking-widest">
                  <Shield className="w-4 h-4 text-tertiary" />
                  Fact-Based Integrity
                </div>
                <div className="flex items-center gap-4 text-primary font-black text-[10px] uppercase tracking-widest">
                  <Gavel className="w-4 h-4 text-tertiary" />
                  Legal Scrutiny
                </div>
                <div className="flex items-center gap-4 text-primary font-black text-[10px] uppercase tracking-widest">
                  <History className="w-4 h-4 text-tertiary" />
                  Permanent Archive
                </div>
              </div>
            </div>

            <div className="p-10 bg-tertiary text-on-tertiary space-y-6">
              <h4 className="text-2xl font-headline font-black uppercase tracking-tight italic">
                沈黙は現状を維持させます。
              </h4>
              <p className="text-lg font-medium italic opacity-80 leading-relaxed">
                透明な社会への第一歩は、事実を記録し、公開することから始まります。
              </p>
              <Link to="/report" className="flex items-center justify-between group pt-4 border-t border-white/20">
                <span className="text-xs font-black uppercase tracking-widest">Submit Evidence / 証拠を報告する</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <footer className="mt-32 pt-12 border-t-2 border-primary/10 text-center">
          <p className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.5em]">
            Project MANA: Evidence Management System / All Rights Reserved 2026
          </p>
        </footer>

      </div>
    </div>
  );
}
