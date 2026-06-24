import { BookOpen, FileText, Users, Clock, CheckCircle, Lightbulb } from "lucide-react";
import { EditableText } from "./EditableText";

interface ServicesProps {
  content?: Record<string, any>;
}

export function Services({ content = {} }: ServicesProps) {
  return (
    <section id="servicos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <EditableText 
              contentKey="services_badge" 
              defaultValue="Nossos Serviços" 
              as="span" 
              className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold block"
            />
          </div>
          <EditableText 
            contentKey="services_title" 
            defaultValue="Nossos Serviços" 
            as="h2" 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 block"
          />
          <EditableText 
            contentKey="services_subtitle" 
            defaultValue="Soluções personalizadas para cada necessidade" 
            as="p" 
            className="text-lg text-gray-600 max-w-2xl mx-auto block"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Serviço 1 */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <EditableText 
              contentKey="service1_title" 
              defaultValue="Reforço Escolar Individual" 
              as="h3" 
              className="text-xl font-bold text-gray-900 mb-2 block"
            />
            <EditableText 
              contentKey="service1_description" 
              defaultValue="Aulas personalizadas focadas nas dificuldades específicas de cada aluno" 
              as="p" 
              className="text-gray-600 mb-4 block"
            />
            <ul className="space-y-2">
              {["Aulas personalizadas", "Material didático incluso", "Exercícios práticos"].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviço 2 */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <EditableText 
              contentKey="service2_title" 
              defaultValue="Reforço em Grupo" 
              as="h3" 
              className="text-xl font-bold text-gray-900 mb-2 block"
            />
            <EditableText 
              contentKey="service2_description" 
              defaultValue="Turmas reduzidas para melhor aproveitamento e interação" 
              as="p" 
              className="text-gray-600 mb-4 block"
            />
            <ul className="space-y-2">
              {["Correção detalhada", "Feedback individual", "Preparação para provas"].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviço 3 */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <EditableText 
              contentKey="service3_title" 
              defaultValue="Preparação para Provas" 
              as="h3" 
              className="text-xl font-bold text-gray-900 mb-2 block"
            />
            <EditableText 
              contentKey="service3_description" 
              defaultValue="Revisão intensiva e estratégias para melhor desempenho" 
              as="p" 
              className="text-gray-600 mb-4 block"
            />
            <ul className="space-y-2">
              {["Ritmo personalizado", "Horários flexíveis", "Foco total no aluno"].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviço 4 */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <EditableText 
              contentKey="service4_title" 
              defaultValue="Acompanhamento Escolar" 
              as="h3" 
              className="text-xl font-bold text-gray-900 mb-2 block"
            />
            <EditableText 
              contentKey="service4_description" 
              defaultValue="Suporte contínuo para o desenvolvimento do aluno" 
              as="p" 
              className="text-gray-600 mb-4 block"
            />
            <ul className="space-y-2">
              {["Material de apoio", "Técnicas de estudo", "Acompanhamento contínuo"].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <EditableText 
              contentKey="services_banner_title" 
              defaultValue="Atendemos do 1° ao 9° ano" 
              as="h3" 
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 block"
            />
            <EditableText 
              contentKey="services_banner_subtitle" 
              defaultValue="Programa completo para todas as séries do ensino fundamental" 
              as="p" 
              className="text-gray-600 block"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["1° ano", "2° ano", "3° ano", "4° ano", "5° ano", "6° ano", "7° ano", "8° ano", "9° ano"].map((grade, index) => (
              <div
                key={index}
                className="bg-white px-4 py-2 rounded-full shadow-sm border border-purple-100"
              >
                <span className="font-medium text-purple-700">{grade}</span>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <EditableText 
                contentKey="services_features_card1_title" 
                defaultValue="Horários Flexíveis" 
                as="h4" 
                className="font-bold text-gray-900 mb-2 block"
              />
              <EditableText 
                contentKey="services_features_card1_desc" 
                defaultValue="Agendamento que se adapta à sua rotina" 
                as="p" 
                className="text-sm text-gray-600 block"
              />
            </div>

            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <EditableText 
                contentKey="services_features_card2_title" 
                defaultValue="Turmas Pequenas" 
                as="h4" 
                className="font-bold text-gray-900 mb-2 block"
              />
              <EditableText 
                contentKey="services_features_card2_desc" 
                defaultValue="Atenção individualizada para cada aluno" 
                as="p" 
                className="text-sm text-gray-600 block"
              />
            </div>

            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <EditableText 
                contentKey="services_features_card3_title" 
                defaultValue="Material Incluso" 
                as="h4" 
                className="font-bold text-gray-900 mb-2 block"
              />
              <EditableText 
                contentKey="services_features_card3_desc" 
                defaultValue="Todo material didático fornecido" 
                as="p" 
                className="text-sm text-gray-600 block"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}