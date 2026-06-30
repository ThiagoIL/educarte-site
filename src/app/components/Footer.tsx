import { BookOpen, Instagram, Facebook, Mail } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { EditableText } from "./EditableText";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { content, isAdminMode } = useAdmin();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isAdminMode) {
      e.preventDefault();
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              {content?.logo_url ? (
                <img src={content.logo_url} alt="Logo" className="w-10 h-10 object-contain rounded" />
              ) : (
                <div className="bg-[#1559C3] p-2 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              )}
              {isAdminMode ? (
                <EditableText
                  contentKey="footer_brand_name"
                  defaultValue="EDUCART"
                  as="span"
                  className="text-2xl font-bold block text-white font-display"
                />
              ) : (
                <span className="text-2xl font-black block font-display tracking-wider flex select-none">
                  <span className="text-[#F14B29]">E</span>
                  <span className="text-[#1559C3]">D</span>
                  <span className="text-[#E61F93]">U</span>
                  <span className="text-[#00B96B]">C</span>
                  <span className="text-[#C81EA5]">A</span>
                  <span className="text-[#0F0CBE]">R</span>
                  <span className="text-[#F14B29]">T</span>
                </span>
              )}
            </div>
            <EditableText
              contentKey="footer_description"
              defaultValue="Reforço escolar de qualidade do 1° ao 9° ano. Educação que transforma vidas."
              as="p"
              className="text-gray-400 mb-4 block text-sm font-medium"
            />
            <div className="flex gap-4">
              <a
                href="#"
                onClick={handleLinkClick}
                className={`bg-gray-800 p-2 rounded-lg transition-colors ${isAdminMode ? "opacity-50 cursor-not-allowed" : "hover:bg-rose-500"}`}
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                onClick={handleLinkClick}
                className={`bg-gray-800 p-2 rounded-lg transition-colors ${isAdminMode ? "opacity-50 cursor-not-allowed" : "hover:bg-rose-500"}`}
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                onClick={handleLinkClick}
                className={`bg-gray-800 p-2 rounded-lg transition-colors ${isAdminMode ? "opacity-50 cursor-not-allowed" : "hover:bg-rose-500"}`}
                aria-label="E-mail"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a 
                  href="#inicio" 
                  onClick={handleLinkClick}
                  className={`transition-colors ${isAdminMode ? "opacity-50 cursor-not-allowed" : "hover:text-orange-400 font-medium"}`}
                >
                  Início
                </a>
              </li>
              <li>
                <a 
                  href="#sobre" 
                  onClick={handleLinkClick}
                  className={`transition-colors ${isAdminMode ? "opacity-50 cursor-not-allowed" : "hover:text-orange-400 font-medium"}`}
                >
                  Sobre
                </a>
              </li>
              <li>
                <a 
                  href="#profissionais" 
                  onClick={handleLinkClick}
                  className={`transition-colors ${isAdminMode ? "opacity-50 cursor-not-allowed" : "hover:text-orange-400 font-medium"}`}
                >
                  Profissionais
                </a>
              </li>
              <li>
                <a 
                  href="#servicos" 
                  onClick={handleLinkClick}
                  className={`transition-colors ${isAdminMode ? "opacity-50 cursor-not-allowed" : "hover:text-orange-400 font-medium"}`}
                >
                  Serviços
                </a>
              </li>
              <li>
                <a 
                  href="#contato" 
                  onClick={handleLinkClick}
                  className={`transition-colors ${isAdminMode ? "opacity-50 cursor-not-allowed" : "hover:text-orange-400 font-medium"}`}
                >
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Contato</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <EditableText
                  contentKey="contact_phone"
                  defaultValue="(11) 98765-4321"
                  as="span"
                  className="text-gray-400 font-inherit block"
                />
              </li>
              <li>
                <EditableText
                  contentKey="contact_email"
                  defaultValue="contato@educart.com.br"
                  as="span"
                  className="text-gray-400 font-inherit block"
                />
              </li>
              <li>
                <EditableText
                  contentKey="contact_address"
                  defaultValue="Rua das Flores, 123 - São Paulo, SP"
                  as="span"
                  className="text-gray-400 font-inherit block"
                />
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p className="flex items-center justify-center gap-1 flex-wrap text-sm">
            <span>© {currentYear} </span>
            <EditableText
              contentKey="footer_copyright"
              defaultValue="EDUCART - Todos os direitos reservados."
              as="span"
              className="text-gray-400 font-inherit block"
            />
          </p>
        </div>
      </div>
    </footer>
  );
}
