import { Star, TrendingUp, Users } from "lucide-react";
import { EditableText } from "./EditableText";
import { EditableImage } from "./EditableImage";
import { useAdmin } from "../context/AdminContext";

interface HeroProps {
  content?: Record<string, any>;
}

export function Hero({ content = {} }: HeroProps) {
  const { isAdminMode } = useAdmin();

  const scrollToSection = (id: string) => {
    if (isAdminMode) return;
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="inicio" className="pt-24 pb-12 md:pt-32 md:pb-20 bg-gradient-to-br from-rose-50/60 via-amber-50/40 via-emerald-50/30 to-sky-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block">
              <EditableText 
                contentKey="hero_badge" 
                defaultValue="✨ Reforço Escolar de Qualidade" 
                as="span" 
                className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold block shadow-sm border border-emerald-200"
              />
            </div>
            
            <EditableText 
                contentKey="hero_title" 
                defaultValue="Transforme o Futuro do Seu Filho com Reforço Escolar de Qualidade" 
                as="h1" 
                className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight block font-display"
              />

            <EditableText 
              contentKey="hero_subtitle" 
              defaultValue="Atendimento personalizado para alunos do 1º ao 9º ano com profissionais especializadas em Língua Portuguesa" 
              as="p" 
              className="text-lg text-gray-600 block font-medium"
            />

            <div className="flex flex-wrap gap-4">
              <button
                onClick={(e) => {
                  if (isAdminMode) {
                    e.preventDefault();
                    return;
                  }
                  scrollToSection("contato");
                }}
                className={`transition-all ${isAdminMode ? "bg-rose-50 text-rose-900 border border-rose-200 px-8 py-4 rounded-full" : "bg-[#F14B29] hover:bg-[#db3716] text-white hover:shadow-xl hover:shadow-red-500/20 transform hover:scale-105 cursor-pointer px-8 py-4 rounded-full font-bold"}`}
              >
                <EditableText 
                  contentKey="hero_cta" 
                  defaultValue="Agende uma Aula Experimental" 
                  as="span" 
                  className="font-inherit"
                />
              </button>
              <button
                onClick={(e) => {
                  if (isAdminMode) {
                    e.preventDefault();
                    return;
                  }
                  scrollToSection("sobre");
                }}
                className={`transition-all ${isAdminMode ? "border-2 border-dashed border-rose-300 text-rose-700 px-8 py-4 rounded-full hover:bg-rose-50" : "border-2 border-[#E61F93] text-[#E61F93] px-8 py-4 rounded-full hover:bg-pink-50 cursor-pointer font-bold"}`}
              >
                <EditableText 
                  contentKey="hero_secondary_cta" 
                  defaultValue="Saiba Mais" 
                  as="span" 
                  className="font-inherit"
                />
              </button>
            </div>


            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="bg-sky-100 p-2 rounded-lg flex-shrink-0">
                  <Users className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <EditableText 
                    contentKey="hero_stat1_value" 
                    defaultValue="200+" 
                    as="div" 
                    className="font-bold text-gray-900 block"
                  />
                  <EditableText 
                    contentKey="hero_stat1_label" 
                    defaultValue="Alunos" 
                    as="div" 
                    className="text-sm text-gray-600 block"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                  <Star className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <EditableText 
                    contentKey="hero_stat2_value" 
                    defaultValue="5.0" 
                    as="div" 
                    className="font-bold text-gray-900 block"
                  />
                  <EditableText 
                    contentKey="hero_stat2_label" 
                    defaultValue="Avaliação" 
                    as="div" 
                    className="text-sm text-gray-600 block"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <EditableText 
                    contentKey="hero_stat3_value" 
                    defaultValue="95%" 
                    as="div" 
                    className="font-bold text-gray-900 block"
                  />
                  <EditableText 
                    contentKey="hero_stat3_label" 
                    defaultValue="Aprovação" 
                    as="div" 
                    className="text-sm text-gray-600 block"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-amber-300 to-sky-400 rounded-3xl transform rotate-3 shadow-md"></div>
            <EditableImage
              contentKey="hero_image"
              defaultSrc="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwaGFwcHl8ZW58MXx8fHwxNzY4MzQ3NzIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Estudantes felizes aprendendo"
              className="relative rounded-3xl shadow-2xl w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}