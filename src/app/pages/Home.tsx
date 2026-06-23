import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Teachers } from "../components/Teachers";
import { Services } from "../components/Services";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { AdminProvider, useAdmin } from "../context/AdminContext";
import { Save, LogOut, CheckCircle } from "lucide-react";

function HomeContent() {
  const { content, isAdminMode, saveChanges, saving, loading } = useAdmin();

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

          <div className="flex gap-2">
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
