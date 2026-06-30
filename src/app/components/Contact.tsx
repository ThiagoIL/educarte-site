import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { useState } from "react";
import { EditableText } from "./EditableText";
import { useAdmin } from "../context/AdminContext";

interface ContactProps {
  content?: Record<string, any>;
}

export function Contact({ content: propContent = {} }: ContactProps) {
  const { content, isAdminMode } = useAdmin();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdminMode) return;
    
    const phoneValue = content.contact_phone || propContent.contact_phone || "(11) 98765-4321";
    const cleaned = phoneValue.replace(/\D/g, "");
    const formattedPhone = cleaned.length === 10 || cleaned.length === 11 ? `55${cleaned}` : cleaned;
    
    const messageText = `Olá! Gostaria de entrar em contato através do formulário do site.\n\n` +
      `*Nome:* ${formData.name}\n` +
      `*E-mail:* ${formData.email}\n` +
      `*Telefone:* ${formData.phone}\n` +
      `*Ano Escolar:* ${formData.grade}° ano\n\n` +
      `*Mensagem:* ${formData.message}`;
      
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(url, "_blank");
    
    setFormData({ name: "", email: "", phone: "", grade: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contato" className="py-20 bg-gradient-to-br from-rose-50/40 via-amber-50/20 to-sky-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <EditableText 
              contentKey="contact_badge" 
              defaultValue="Entre em Contato" 
              as="span" 
              className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold block shadow-sm border border-emerald-200"
            />
          </div>
          <EditableText 
            contentKey="contact_title" 
            defaultValue="Entre em Contato" 
            as="h2" 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 block font-display"
          />
          <EditableText 
            contentKey="contact_subtitle" 
            defaultValue="Estamos prontos para ajudar seu filho a ter sucesso" 
            as="p" 
            className="text-lg text-gray-600 max-w-2xl mx-auto block font-medium"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Informações de Contato
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-sky-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Telefone</div>
                    <EditableText 
                      contentKey="contact_phone" 
                      defaultValue="(11) 98765-4321" 
                      as="div" 
                      className="text-gray-600 block mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-rose-100 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">E-mail</div>
                    <EditableText 
                      contentKey="contact_email" 
                      defaultValue="contato@educart.com.br" 
                      as="div" 
                      className="text-gray-600 block mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Endereço</div>
                    <EditableText 
                      contentKey="contact_address" 
                      defaultValue="Rua das Flores, 123 - São Paulo, SP" 
                      as="div" 
                      className="text-gray-600 block mt-1"
                    />
                  </div>
                </div>

                <a
                  href={`https://wa.me/${(content.contact_phone || propContent.contact_phone || "11987654321").replace(/\D/g, "").replace(/^(?![0-9]{12,14}$)/, "55")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-start gap-4 p-3 -m-3 rounded-xl hover:bg-green-50 transition-colors ${isAdminMode ? "pointer-events-none" : ""}`}
                >
                  <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 flex items-center gap-1.5">
                      WhatsApp
                      {!isAdminMode && <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">Chamar</span>}
                    </div>
                    <EditableText 
                      contentKey="contact_phone" 
                      defaultValue="(11) 98765-4321" 
                      as="div" 
                      className="text-gray-600 block mt-1 hover:underline font-semibold"
                    />
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-[#C81EA5] rounded-2xl p-8 text-white shadow-lg shadow-purple-500/10">
              <EditableText 
                contentKey="contact_hours_title" 
                defaultValue="Horário de Atendimento" 
                as="h3" 
                className="text-2xl font-bold mb-3 block text-white font-display"
              />
              <div className="space-y-2 text-white/90">
                <EditableText 
                  contentKey="contact_hours_week" 
                  defaultValue="Segunda a Sexta: 8h às 20h" 
                  as="p" 
                  className="text-white/90 block font-semibold"
                />
                <EditableText 
                  contentKey="contact_hours_sat" 
                  defaultValue="Sábado: 8h às 14h" 
                  as="p" 
                  className="text-white/90 block font-semibold"
                />
                <div className="pt-2 border-t border-white/20 mt-4">
                  <EditableText 
                    contentKey="contact_hours_promo" 
                    defaultValue="🎁 Primeira aula experimental GRATUITA!" 
                    as="p" 
                    className="text-white font-bold block"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Envie uma Mensagem
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Responsável *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isAdminMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isAdminMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={isAdminMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  placeholder="(11) 98765-4321"
                />
              </div>

              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                  Ano Escolar do Aluno *
                </label>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                  disabled={isAdminMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <option value="">Selecione o ano</option>
                  <option value="1">1° ano</option>
                  <option value="2">2° ano</option>
                  <option value="3">3° ano</option>
                  <option value="4">4° ano</option>
                  <option value="5">5° ano</option>
                  <option value="6">6° ano</option>
                  <option value="7">7° ano</option>
                  <option value="8">8° ano</option>
                  <option value="9">9° ano</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  disabled={isAdminMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  placeholder="Conte-nos mais sobre as necessidades do seu filho..."
                />
              </div>

              <button
                type="submit"
                disabled={isAdminMode}
                className={`w-full px-8 py-4 rounded-lg flex items-center justify-center gap-2 transition-all font-bold ${isAdminMode ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#F14B29] hover:bg-[#db3716] text-white hover:shadow-xl hover:shadow-red-500/10 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"}`}
              >
                <Send className="w-5 h-5" />
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}