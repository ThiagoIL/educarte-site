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
  const { content, isAdminMode, loading } = useAdmin();

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

  return (
    <div className="min-h-screen bg-white relative">
      <Header />
      <main className={isAdminMode ? "pt-[130px] md:pt-[56px]" : ""}>
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
