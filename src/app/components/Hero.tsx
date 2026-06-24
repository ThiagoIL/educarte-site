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
    <section id="inicio" className="pt-24 pb-12 md:pt-32 md:pb-20 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm">
              ✨ Reforço Escolar de Qualidade
            </div>
            
            <EditableText 
              contentKey="hero_title" 
              defaultValue="Transforme o Futuro do Seu Filho com Reforço Escolar de Qualidade" 
              as="h1" 
              className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight block"
            />

            <EditableText 
              contentKey="hero_subtitle" 
              defaultValue="Atendimento personalizado para alunos do 1º ao 9º ano com profissionais especializadas em Língua Portuguesa" 
              as="p" 
              className="text-lg text-gray-600 block"
            />

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection("contato")}
                disabled={isAdminMode}
                className={`transition-all ${isAdminMode ? "bg-gray-300 text-gray-500 cursor-not-allowed px-8 py-4 rounded-full" : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl transform hover:scale-105 cursor-pointer px-8 py-4 rounded-full"}`}
              >
                <EditableText 
                  contentKey="hero_cta" 
                  defaultValue="Agende uma Aula Experimental" 
                  as="span" 
                  className="font-inherit"
                />
              </button>
              <button
                onClick={() => scrollToSection("sobre")}
                disabled={isAdminMode}
                className={`transition-all ${isAdminMode ? "border-2 border-gray-300 text-gray-400 cursor-not-allowed px-8 py-4 rounded-full" : "border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full hover:bg-purple-50 cursor-pointer"}`}
              >
                Saiba Mais
              </button>
            </div>


            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">200+</div>
                  <div className="text-sm text-gray-600">Alunos</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-pink-100 p-2 rounded-lg">
                  <Star className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">5.0</div>
                  <div className="text-sm text-gray-600">Avaliação</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Aprovação</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl transform rotate-3"></div>
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