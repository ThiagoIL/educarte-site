import { GraduationCap, Award, Heart } from "lucide-react";
import { EditableText } from "./EditableText";
import { EditableImage } from "./EditableImage";

interface TeachersProps {
  content?: Record<string, any>;
}

export function Teachers({ content = {} }: TeachersProps) {
  return (
    <section id="profissionais" className="py-20 bg-gradient-to-br from-amber-50/40 via-white to-purple-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <EditableText 
              contentKey="teachers_badge" 
              defaultValue="Nossas Profissionais" 
              as="span" 
              className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold block shadow-sm border border-emerald-200"
            />
          </div>
          <EditableText 
            contentKey="teachers_title" 
            defaultValue="Nossas Profissionais" 
            as="h2" 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 block font-display"
          />
          <EditableText 
            contentKey="teachers_subtitle" 
            defaultValue="Equipe especializada e comprometida com a excelência" 
            as="p" 
            className="text-lg text-gray-600 max-w-2xl mx-auto block font-medium"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Professora 1 */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100 flex flex-col">
            <div className="relative h-80 bg-gray-50">
              <EditableImage
                contentKey="teacher1_image"
                defaultSrc="https://images.unsplash.com/photo-1551989745-347c28b620e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwd29tYW4lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY4MjM0OTU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Profª. Ana Paula Silva"
                className="w-full h-full object-cover rounded-t-3xl"
              />
            </div>
 
            <div className="p-6 space-y-4 flex-grow flex flex-col">
              <div className="border-b border-gray-100 pb-3">
                <EditableText 
                  contentKey="teacher1_name" 
                  defaultValue="Profª. Ana Paula Silva" 
                  as="h3" 
                  className="text-2xl font-bold text-gray-900 mb-1 block font-display"
                />
                <EditableText 
                  contentKey="teacher1_title" 
                  defaultValue="Especialista em Língua Portuguesa" 
                  as="p" 
                  className="text-purple-600 block text-sm font-semibold"
                />
              </div>

              <EditableText 
                contentKey="teacher1_bio" 
                defaultValue="Formada em Letras - Língua Portuguesa, com mais de 10 anos de experiência em educação e reforço escolar." 
                as="p" 
                className="text-gray-600 block font-medium"
              />

              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <EditableText 
                  contentKey="teacher1_exp" 
                  defaultValue="10 anos de experiência" 
                  as="span" 
                  className="font-semibold text-gray-700 block"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="font-bold text-gray-900">Especialidades:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Gramática", "Redação", "Literatura"].map((specialty, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-50 border border-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold shadow-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600 pt-2 border-t">
                <Heart className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <EditableText 
                  contentKey="teacher1_quote" 
                  defaultValue="Dedicada a fazer a diferença na vida dos alunos" 
                  as="span" 
                  className="text-sm italic text-gray-600 block font-medium"
                />
              </div>
            </div>
          </div>

          {/* Professora 2 */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100 flex flex-col">
            <div className="relative h-80 bg-gray-50">
              <EditableImage
                contentKey="teacher2_image"
                defaultSrc="https://images.unsplash.com/photo-1544191046-397b734b0891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwY2xhc3Nyb29tJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc2ODI3MDUyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Profª. Maria Eduarda Costa"
                className="w-full h-full object-cover rounded-t-3xl"
              />
            </div>
 
            <div className="p-6 space-y-4 flex-grow flex flex-col">
              <div className="border-b border-gray-100 pb-3">
                <EditableText 
                  contentKey="teacher2_name" 
                  defaultValue="Profª. Maria Eduarda Costa" 
                  as="h3" 
                  className="text-2xl font-bold text-gray-900 mb-1 block font-display"
                />
                <EditableText 
                  contentKey="teacher2_title" 
                  defaultValue="Especialista em Língua Portuguesa" 
                  as="p" 
                  className="text-purple-600 block text-sm font-semibold"
                />
              </div>

              <EditableText 
                contentKey="teacher2_bio" 
                defaultValue="Graduada em Letras - Língua Portuguesa, apaixonada por ensinar e desenvolver o potencial de cada aluno." 
                as="p" 
                className="text-gray-600 block font-medium"
              />

              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="w-5 h-5 text-sky-500 flex-shrink-0" />
                <EditableText 
                  contentKey="teacher2_exp" 
                  defaultValue="8 anos de experiência" 
                  as="span" 
                  className="font-semibold text-gray-700 block"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="font-bold text-gray-900">Especialidades:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Interpretação de Texto", "Ortografia", "Produção Textual"].map((specialty, idx) => (
                    <span
                      key={idx}
                      className="bg-sky-50 border border-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm font-semibold shadow-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600 pt-2 border-t">
                <Heart className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <EditableText 
                  contentKey="teacher2_quote" 
                  defaultValue="Dedicada a fazer a diferença na vida dos alunos" 
                  as="span" 
                  className="text-sm italic text-gray-600 block font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-to-r from-purple-500 via-rose-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white max-w-2xl w-full shadow-xl shadow-rose-500/10">
            <EditableText 
              contentKey="teachers_why_title" 
              defaultValue="Por que escolher o EDUCART?" 
              as="h3" 
              className="text-2xl font-bold mb-3 block text-white font-display"
            />
            <EditableText 
              contentKey="teachers_why_description" 
              defaultValue="Nossas professoras possuem formação acadêmica sólida, experiência prática em sala de aula e, acima de tudo, paixão por ensinar. Cada aula é planejada com carinho para garantir o melhor aprendizado." 
              as="p" 
              className="text-rose-50 font-semibold block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}