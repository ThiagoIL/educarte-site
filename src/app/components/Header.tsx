import { BookOpen, Menu, X, LogOut, Save, Settings } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { EditableText } from "./EditableText";
import AdminSettingsModal from "./AdminSettingsModal";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { content, isAdminMode, saveChanges, saving } = useAdmin();

  const handleLogout = () => {
    localStorage.removeItem("educart_token");
    localStorage.removeItem("educart_user");
    window.location.href = "/";
  };

  const scrollToSection = (id: string) => {
    if (isAdminMode) return;
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-md z-50">
      {/* Floating admin banner if logged in */}
      {isAdminMode && (
        <div className="bg-gradient-to-r from-purple-800 to-pink-800 text-white py-2.5 px-4 shadow-xl flex flex-wrap items-center justify-between gap-4 border-b border-purple-900">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="font-semibold text-xs sm:text-sm">
              Modo de Edição Visual Ativo
            </span>
            <span className="text-purple-200 text-xs hidden md:inline">
              | Clique nos textos com pontilhado roxo ou clique nas fotos para alterar
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 py-1 px-2.5 bg-purple-600 hover:bg-purple-700 border border-purple-500 rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transition-all scale-100 hover:scale-[1.02] cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              Configurações
            </button>
            <button
              onClick={saveChanges}
              disabled={saving}
              className="flex items-center gap-1.5 py-1 px-3 bg-green-500 hover:bg-green-600 rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all scale-100 hover:scale-[1.02] cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 py-1 px-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </div>
      )}

      {/* Admin Settings Modal */}
      {isAdminMode && (
        <AdminSettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            {content?.logo_url ? (
              <img src={content.logo_url} alt="Logo" className="w-10 h-10 object-contain rounded" />
            ) : (
              <div className="bg-[#1559C3] p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            )}
            {isAdminMode ? (
              <EditableText
                contentKey="brand_name"
                defaultValue="EDUCART"
                as="span"
                className="text-2xl font-black text-gray-800 block font-display tracking-wider"
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

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6 font-semibold">
            <button
              onClick={() => scrollToSection("inicio")}
              disabled={isAdminMode}
              className={`text-gray-700 transition-colors ${isAdminMode ? "opacity-50 cursor-not-allowed" : "hover:text-rose-500 cursor-pointer"}`}
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection("sobre")}
              disabled={isAdminMode}
              className={`text-gray-700 transition-colors ${isAdminMode ? "opacity-50 cursor-not-allowed" : "hover:text-rose-500 cursor-pointer"}`}
            >
              Sobre
            </button>
            <button
              onClick={() => scrollToSection("profissionais")}
              disabled={isAdminMode}
              className={`text-gray-700 transition-colors ${isAdminMode ? "opacity-50 cursor-not-allowed" : "hover:text-rose-500 cursor-pointer"}`}
            >
              Profissionais
            </button>
            <button
              onClick={() => scrollToSection("servicos")}
              disabled={isAdminMode}
              className={`text-gray-700 transition-colors ${isAdminMode ? "opacity-50 cursor-not-allowed" : "hover:text-rose-500 cursor-pointer"}`}
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection("contato")}
              disabled={isAdminMode}
              className={`transition-all ${isAdminMode ? "bg-gray-300 text-gray-500 cursor-not-allowed px-6 py-2 rounded-full font-bold" : "bg-[#1559C3] hover:bg-[#1149a1] text-white hover:shadow-lg hover:shadow-blue-500/10 px-6 py-2 rounded-full cursor-pointer font-bold"}`}
            >
              Contato
            </button>
            
            {isAdminMode && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-full transition-all font-bold cursor-pointer hover:shadow"
                title="Sair do Modo Admin"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <div className="flex items-center gap-2">
                {isAdminMode && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">Admin</span>}
                <Menu className="w-6 h-6 text-gray-700" />
              </div>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
         {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t">
            <button
              onClick={() => scrollToSection("inicio")}
              disabled={isAdminMode}
              className={`block w-full text-left px-4 py-2 rounded font-semibold ${isAdminMode ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-rose-50"}`}
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection("sobre")}
              disabled={isAdminMode}
              className={`block w-full text-left px-4 py-2 rounded font-semibold ${isAdminMode ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-rose-50"}`}
            >
              Sobre
            </button>
            <button
              onClick={() => scrollToSection("profissionais")}
              disabled={isAdminMode}
              className={`block w-full text-left px-4 py-2 rounded font-semibold ${isAdminMode ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-rose-50"}`}
            >
              Profissionais
            </button>
            <button
              onClick={() => scrollToSection("servicos")}
              disabled={isAdminMode}
              className={`block w-full text-left px-4 py-2 rounded font-semibold ${isAdminMode ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-rose-50"}`}
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection("contato")}
              disabled={isAdminMode}
              className={`block w-full text-left px-4 py-2 rounded font-bold ${isAdminMode ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#1559C3] text-white active:bg-[#1149a1]"}`}
            >
              Contato
            </button>

            {isAdminMode && (
              <div className="px-4 pt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full text-center px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sair do Modo Admin
                </button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
