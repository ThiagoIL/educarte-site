import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Teachers } from "../components/Teachers";
import { Services } from "../components/Services";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { AdminProvider, useAdmin } from "../context/AdminContext";
import { Save, LogOut, CheckCircle, Settings, MessageCircle } from "lucide-react";
import AdminSettingsModal from "../components/AdminSettingsModal";

function HomeContent() {
  const { content, isAdminMode, saveChanges, saving, loading } = useAdmin();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Dynamically update favicon when favicon_url changes
  useEffect(() => {
    const faviconUrl = content?.favicon_url;
    if (faviconUrl) {
      const link = document.getElementById("dynamic-favicon") as HTMLLinkElement;
      if (link) {
        link.href = faviconUrl;
      }
    }
  }, [content?.favicon_url]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("educart_token");
    localStorage.removeItem("educart_user");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Floating admin banner if loggined */}
      {isAdminMode && (
        <div className="sticky top-0 left-0 right-0 bg-gradient-to-r from-purple-800 to-pink-800 text-white py-3 px-4 shadow-xl z-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="font-semibold text-sm sm:text-base">
              Modo de Edição Visual Ativo
            </span>
            <span className="text-purple-200 text-xs hidden sm:inline">
              | Clique no lápis nos textos ou clique nas imagens para alterar
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 py-1.5 px-3 bg-purple-600 hover:bg-purple-700 border border-purple-500 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all scale-100 hover:scale-[1.02] cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              Configurações
            </button>
            <button
              onClick={saveChanges}
              disabled={saving}
              className="flex items-center gap-1.5 py-1.5 px-4 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all scale-100 hover:scale-[1.02] cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 py-1.5 px-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      )}

      <Header />
      <main>
        <Hero content={content} />
        <About content={content} />
        <Teachers content={content} />
        <Services content={content} />
        <Contact content={content} />
      </main>
      <Footer />

      {/* Floating WhatsApp Button */}
      {!isAdminMode && (() => {
        const phoneValue = content?.contact_phone || "(11) 98765-4321";
        const cleanedPhone = phoneValue.replace(/\D/g, "");
        const formattedPhone = cleanedPhone.length === 10 || cleanedPhone.length === 11 ? `55${cleanedPhone}` : cleanedPhone;
        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent("Olá! Gostaria de saber mais sobre o reforço escolar e suporte pedagógico.")}`;
        
        return (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/30 transition-all z-40 flex items-center justify-center scale-100 hover:scale-110 active:scale-95 group cursor-pointer"
            title="Fale Conosco no WhatsApp"
          >
            <MessageCircle className="w-7 h-7" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out font-bold text-sm whitespace-nowrap pl-0 group-hover:pl-2">
              WhatsApp
            </span>
          </a>
        );
      })()}

      {/* Admin Settings Modal */}
      {isAdminMode && (
        <AdminSettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <AdminProvider>
      <HomeContent />
    </AdminProvider>
  );
}
