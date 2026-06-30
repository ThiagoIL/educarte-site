import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, User, Key, Mail, ShieldAlert, Plus, Trash2, Edit2, Upload, Sparkles, Loader2, Save, Globe, Instagram, Facebook } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { fetchWithAuth } from "../../config/api";
import { toast } from "sonner";

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
}

export default function AdminSettingsModal({ isOpen, onClose }: AdminSettingsModalProps) {
  const { content, uploadImage, saveChanges, saving, updateContent } = useAdmin();
  const [activeTab, setActiveTab] = useState<"users" | "logo" | "favicon" | "social">("users");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Social links states
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialEmail, setSocialEmail] = useState("");
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  
  // States for the user management form
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [actionLoading, setActionLoading] = useState(false);

  // Favicon states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

  // Logo states
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("educart_user") || "{}");

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && content) {
      setSocialInstagram(content.social_instagram || "");
      setSocialFacebook(content.social_facebook || "");
      setSocialEmail(content.social_email || "");
    }
  }, [isOpen, content]);

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSocial(true);
    try {
      await updateContent("social_instagram", socialInstagram, false);
      await updateContent("social_facebook", socialFacebook, false);
      await updateContent("social_email", socialEmail, false);
      toast.success("Links das redes sociais atualizados com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar os links das redes sociais.");
    } finally {
      setIsSavingSocial(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetchWithAuth("/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        toast.error("Não foi possível carregar a lista de administradores.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar administradores.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Nome e e-mail são obrigatórios.");
      return;
    }

    if (!isEditing && !formData.password) {
      toast.error("Senha é obrigatória para criar um novo usuário.");
      return;
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        toast.error("A senha deve ter no mínimo 6 caracteres.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("As senhas digitadas não coincidem.");
        return;
      }
    }

    setActionLoading(true);
    try {
      let response;
      if (isEditing && editingId) {
        response = await fetchWithAuth(`/admin/users/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password || undefined,
          }),
        });
      } else {
        response = await fetchWithAuth("/admin/users", {
          method: "POST",
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });
      }

      if (response.ok) {
        toast.success(isEditing ? "Administrador atualizado!" : "Administrador criado!");
        
        // Se atualizou os próprios dados, atualiza a sessão local e recarrega
        if (isEditing && editingId === currentUser.id) {
          const updatedUser = { ...currentUser, name: formData.name, email: formData.email };
          localStorage.setItem("educart_user", JSON.stringify(updatedUser));
          toast.success("Seus dados foram atualizados. Recarregando a página para aplicar...");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }

        resetForm();
        loadUsers();
      } else {
        const errData = await response.json();
        toast.error(errData.error || "Ocorreu um erro ao salvar.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro de conexão ao salvar administrador.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (user: AdminUser) => {
    setIsEditing(true);
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      confirmPassword: "",
    });
  };

  const handleDeleteClick = async (id: number) => {
    if (id === currentUser.id) {
      toast.error("Você não pode excluir sua própria conta enquanto estiver logado.");
      return;
    }

    if (users.length <= 1) {
      toast.error("Não é possível excluir o único administrador do sistema.");
      return;
    }

    if (!confirm("Tem certeza de que deseja excluir este administrador?")) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetchWithAuth(`/admin/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Administrador removido com sucesso!");
        loadUsers();
      } else {
        const errData = await response.json();
        toast.error(errData.error || "Não foi possível remover o administrador.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao remover administrador.");
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleFaviconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFavicon(true);
    try {
      const oldUrl = content.favicon_url;
      const uploadedUrl = await uploadImage(file, "favicon_url", oldUrl);
      if (uploadedUrl) {
        toast.success("Favicon atualizado na interface visual! Lembre-se de salvar as alterações gerais no banner superior.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao fazer upload do favicon.");
    } finally {
      setIsUploadingFavicon(false);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const oldUrl = content.logo_url;
      const uploadedUrl = await uploadImage(file, "logo_url", oldUrl);
      if (uploadedUrl) {
        toast.success("Logotipo atualizado na interface visual! Lembre-se de salvar as alterações gerais no banner superior.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao fazer upload do logotipo.");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-[100] p-4 animate-fade-in overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl relative animate-scale-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
            <h2 className="text-xl font-bold text-gray-900">Painel de Configurações Administrativas</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "users" 
                ? "bg-purple-600 text-white shadow-md shadow-purple-200" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <User className="w-4 h-4" />
            Gestão de Usuários Adm
          </button>
          <button
            onClick={() => setActiveTab("logo")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "logo" 
                ? "bg-purple-600 text-white shadow-md shadow-purple-200" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Mudar Logotipo (Logo)
          </button>
          <button
            onClick={() => setActiveTab("favicon")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "favicon" 
                ? "bg-purple-600 text-white shadow-md shadow-purple-200" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Mudar Favicon (Ícone)
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "social" 
                ? "bg-purple-600 text-white shadow-md shadow-purple-200" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Globe className="w-4 h-4" />
            Redes Sociais
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Form Section */}
              <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100">
                <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2 text-base">
                  {isEditing ? <Edit2 className="w-4 h-4 text-purple-600" /> : <Plus className="w-4 h-4 text-purple-600" />}
                  {isEditing ? `Editar Administrador: ${formData.name}` : "Adicionar Novo Administrador"}
                </h3>
                
                <form onSubmit={handleUserSubmit} className="grid sm:grid-cols-2 gap-4 items-end">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">Nome</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nome completo"
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="admin@educart.com"
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">
                      {isEditing ? "Nova Senha (Opcional)" : "Senha"}
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        required={!isEditing}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder={isEditing ? "Mantenha em branco" : "Mínimo 6 caracteres"}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        required={!isEditing ? !!formData.password : false}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder={isEditing ? "Confirme a nova senha" : "Repita a senha"}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex justify-end gap-2 pt-2 border-t border-purple-100/50 mt-2">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {isEditing ? "Atualizar" : "Cadastrar"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Users List Section */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 text-base flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-gray-500" />
                  Administradores Ativos ({users.length})
                </h3>

                {loadingUsers ? (
                  <div className="py-8 text-center flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                    <span className="text-sm text-gray-500 font-medium">Carregando lista...</span>
                  </div>
                ) : users.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 border border-dashed rounded-2xl">
                    Nenhum administrador encontrado.
                  </div>
                ) : (
                  <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
                    {users.map((u) => (
                      <div key={u.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                        <div>
                          <div className="font-bold text-gray-800 flex items-center gap-1.5">
                            {u.name}
                            {u.id === currentUser.id && (
                              <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full font-extrabold">Você</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{u.email}</div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditClick(u)}
                            className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Edit2 className="w-4.5 h-4.5" />
                          </button>
                          {u.id !== currentUser.id && (
                            <button
                              onClick={() => handleDeleteClick(u.id)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Excluir"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "logo" && (
            <div className="space-y-6 text-center py-4">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-24 h-24 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto border border-purple-100 shadow-sm overflow-hidden p-2">
                  {content.logo_url ? (
                    <img 
                      src={content.logo_url} 
                      alt="Logo Atual" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-sm text-gray-400 font-bold">Sem Logo</span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Mudar Logotipo (Logo)</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Este logotipo substituirá o ícone padrão de livro no cabeçalho e rodapé da página. Recomendamos uma imagem com fundo transparente ou quadrado.
                  </p>
                </div>

                <div className="pt-4">
                  <input 
                    type="file" 
                    ref={logoInputRef}
                    onChange={handleLogoChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isUploadingLogo}
                    className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all cursor-pointer scale-100 hover:scale-[1.02]"
                  >
                    {isUploadingLogo ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                    {isUploadingLogo ? "Enviando Logotipo..." : "Fazer Upload de Logotipo"}
                  </button>
                </div>

                {content.logo_url && (
                  <div className="text-xs text-amber-600 bg-amber-50 rounded-xl p-3 border border-amber-100 mt-4 font-semibold">
                    💡 Dica: Após fazer o upload, clique no botão <span className="bg-green-500 text-white font-bold px-2 py-0.5 rounded">Salvar Alterações</span> no banner superior da página para gravar de forma permanente!
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "favicon" && (
            <div className="space-y-6 text-center py-4">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto border border-purple-100 shadow-sm">
                  {content.favicon_url ? (
                    <img 
                      src={content.favicon_url} 
                      alt="Favicon Atual" 
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        // fallback if error loading
                        (e.target as HTMLImageElement).src = "/favicon.ico";
                      }}
                    />
                  ) : (
                    <Sparkles className="w-10 h-10 text-purple-600 animate-pulse" />
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Mudar Ícone do Favicon</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    O favicon é o ícone exibido na guia do navegador. Para melhor visualização, envie uma imagem quadrada (Ex: 32x32 ou 64x64 pixels) no formato <strong className="text-purple-700">.ico, .png ou .webp</strong>.
                  </p>
                </div>

                <div className="pt-4">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFaviconChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingFavicon}
                    className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all cursor-pointer scale-100 hover:scale-[1.02]"
                  >
                    {isUploadingFavicon ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                    {isUploadingFavicon ? "Enviando Ícone..." : "Fazer Upload de Ícone"}
                  </button>
                </div>

                {content.favicon_url && (
                  <div className="text-xs text-amber-600 bg-amber-50 rounded-xl p-3 border border-amber-100 mt-4 font-semibold">
                    💡 Dica: Após fazer o upload, clique no botão <span className="bg-green-500 text-white font-bold px-2 py-0.5 rounded">Salvar Alterações</span> no banner superior da página para gravar de forma permanente!
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-6 py-4 animate-fade-in">
              <div className="max-w-md mx-auto space-y-4">
                <div className="text-center">
                  <h3 className="font-bold text-gray-800 text-lg flex items-center justify-center gap-2">
                    <Globe className="w-5 h-5 text-purple-600" />
                    Gerenciar Redes Sociais
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Insira os links completos das redes sociais para atualizar os ícones no rodapé da página.
                  </p>
                </div>

                <form onSubmit={handleSocialSubmit} className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                      <Instagram className="w-4 h-4 text-pink-600" />
                      Link do Instagram
                    </label>
                    <input
                      type="url"
                      value={socialInstagram}
                      onChange={(e) => setSocialInstagram(e.target.value)}
                      placeholder="https://instagram.com/seu-perfil"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                      <Facebook className="w-4 h-4 text-blue-600" />
                      Link do Facebook
                    </label>
                    <input
                      type="url"
                      value={socialFacebook}
                      onChange={(e) => setSocialFacebook(e.target.value)}
                      placeholder="https://facebook.com/sua-pagina"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-purple-600" />
                      E-mail de Contato
                    </label>
                    <input
                      type="email"
                      value={socialEmail}
                      onChange={(e) => setSocialEmail(e.target.value)}
                      placeholder="contato@educart.com.br"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingSocial}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all cursor-pointer mt-6"
                  >
                    {isSavingSocial ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {isSavingSocial ? "Salvando Links..." : "Salvar Redes Sociais"}
                  </button>
                </form>

                <div className="text-xs text-amber-600 bg-amber-50 rounded-xl p-3 border border-amber-100 mt-4 font-semibold">
                  💡 Dica: Após salvar, clique também no botão <span className="bg-green-500 text-white font-bold px-2 py-0.5 rounded">Salvar Alterações</span> no topo da página principal para garantir que todo o estado do site esteja sincronizado!
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
