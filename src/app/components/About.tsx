import { Award, Target, Heart, Sparkles } from "lucide-react";
import { EditableText } from "./EditableText";

interface AboutProps {
  content?: Record<string, any>;
}

export function About({ content = {} }: AboutProps) {
  const features = [
    {
      icon: Target,
      title: "Foco no Aluno",
      description: "Metodologia personalizada para as necessidades de cada estudante",
      color: "purple",
    },
    {
      icon: Award,
      title: "Qualidade Comprovada",
      description: "Professoras com formação em Língua Portuguesa",
      color: "pink",
    },
    {
      icon: Heart,
      title: "Ensino Humanizado",
      description: "Ambiente acolhedor que estimula o aprendizado",
      color: "purple",
    },
    {
      icon: Sparkles,
      title: "Resultados Reais",
      description: "Melhoria comprovada no desempenho escolar",
      color: "pink",
    },
  ];

  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm mb-4">
            Sobre o EDUCART
          </div>
          <EditableText 
            contentKey="about_title" 
            defaultValue="Sobre o EDUCART" 
            as="h2" 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 block"
          />
          <EditableText 
            contentKey="about_text" 
            defaultValue="O EDUCART é um espaço dedicado ao reforço escolar, oferecendo suporte educacional personalizado para alunos do 1º ao 9º ano do Ensino Fundamental. Nossa missão é ajudar cada estudante a alcançar seu máximo potencial através de metodologias modernas e acompanhamento individualizado." 
            as="p" 
            className="text-lg text-gray-600 max-w-2xl mx-auto block"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                <div
                  className={`${
                    feature.color === "purple"
                      ? "bg-purple-100"
                      : "bg-pink-100"
                  } w-12 h-12 rounded-xl flex items-center justify-center mb-4`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      feature.color === "purple"
                        ? "text-purple-600"
                        : "text-pink-600"
                    }`}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1° - 9°</div>
              <div className="text-purple-100">Anos de Ensino</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-purple-100">Dedicação</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2</div>
              <div className="text-purple-100">Professoras Especializadas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}