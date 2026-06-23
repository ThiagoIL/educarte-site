import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              EDUCART
            </span>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("inicio")}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection("sobre")}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Sobre
            </button>
            <button
              onClick={() => scrollToSection("profissionais")}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Profissionais
            </button>
            <button
              onClick={() => scrollToSection("servicos")}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection("contato")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all"
            >
              Contato
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t">
            <button
              onClick={() => scrollToSection("inicio")}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 rounded"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection("sobre")}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 rounded"
            >
              Sobre
            </button>
            <button
              onClick={() => scrollToSection("profissionais")}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 rounded"
            >
              Profissionais
            </button>
            <button
              onClick={() => scrollToSection("servicos")}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 rounded"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection("contato")}
              className="block w-full text-left px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded"
            >
              Contato
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
