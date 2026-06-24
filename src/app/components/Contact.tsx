import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { useState } from "react";
import { EditableText } from "./EditableText";
import { useAdmin } from "../context/AdminContext";

interface ContactProps {
  content?: Record<string, any>;
}

export function Contact({ content = {} }: ContactProps) {
  const { isAdminMode } = useAdmin();
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
    // Aqui você pode adicionar a lógica de envio do formulário
    alert("Mensagem enviada! Entraremos em contato em breve.");
    setFormData({ name: "", email: "", phone: "", grade: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contato" className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm mb-4">
            Entre em Contato
          </div>
          <EditableText 
            contentKey="contact_title" 
            defaultValue="Entre em Contato" 
            as="h2" 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 block"
          />
          <EditableText 
            contentKey="contact_subtitle" 
            defaultValue="Estamos prontos para ajudar seu filho a ter sucesso" 
            as="p" 
            className="text-lg text-gray-600 max-w-2xl mx-auto block"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 font-semibold">
                Informações de Contato
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-purple-600" />
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
                  <div className="bg-pink-100 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-pink-600" />
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
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-purple-600" />
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

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">WhatsApp</div>
                    <EditableText 
                      contentKey="contact_phone" 
                      defaultValue="(11) 98765-4321" 
                      as="div" 
                      className="text-gray-600 block mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-3">Horário de Atendimento</h3>
              <div className="space-y-2 text-purple-100">
                <p>Segunda a Sexta: 8h às 20h</p>
                <p>Sábado: 8h às 14h</p>
                <p className="pt-2 border-t border-purple-400 mt-4">
                  🎁 Primeira aula experimental GRATUITA!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  placeholder="Conte-nos mais sobre as necessidades do seu filho..."
                />
              </div>

              <button
                type="submit"
                disabled={isAdminMode}
                className={`w-full px-8 py-4 rounded-lg flex items-center justify-center gap-2 transition-all ${isAdminMode ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:scale-105"}`}
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