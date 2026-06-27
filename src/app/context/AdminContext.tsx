import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { API_URL, fetchWithAuth, uploadFile, deleteFile } from "../../config/api";

interface AdminContextType {
  isAdminMode: boolean;
  content: Record<string, any>;
  updateContent: (key: string, value: string) => Promise<void>;
  uploadImage: (file: File, key: string, oldImageUrl?: string) => Promise<string | null>;
  removeImage: (key: string) => Promise<void>;
  saveChanges: () => Promise<void>;
  saving: boolean;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode; forceAdmin?: boolean }> = ({
  children,
  forceAdmin = false,
}) => {
  const [isAdminMode, setIsAdminMode] = useState(forceAdmin);
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage if forceAdmin is true or if we are verifying permissions
    const token = localStorage.getItem("educart_token");
    if (token) {
      setIsAdminMode(true);
    } else if (forceAdmin) {
      setIsAdminMode(false);
    }
    fetchContent();
  }, [forceAdmin]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_URL}/content`);
      if (!response.ok) {
        throw new Error(`Erro ao carregar conteúdo: ${response.status}`);
      }
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error("Erro ao carregar conteúdo:", error);
      toast.error("Não foi possível carregar o conteúdo do servidor.");
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (key: string, value: string) => {
    // Atualiza o estado local imediatamente para uma interface ágil e responsiva
    setContent((prev) => ({ ...prev, [key]: value }));

    try {
      const response = await fetchWithAuth(`/content/${key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar no servidor");
      }
      toast.success("Salvo com sucesso!");
    } catch (error) {
      console.error(`Erro ao salvar conteúdo para a chave ${key}:`, error);
      toast.error("Erro ao salvar alteração no banco de dados.");
    }
  };

  const uploadImage = async (file: File, key: string, oldImageUrl?: string): Promise<string | null> => {
    try {
      const response = await uploadFile(file, oldImageUrl);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao processar arquivo no servidor");
      }
      const data = await response.json();
      const imageUrl = data.url;
      
      await updateContent(key, imageUrl);
      toast.success("Imagem enviada com sucesso!");
      return imageUrl;
    } catch (error: any) {
      console.error("Erro ao enviar imagem:", error);
      toast.error(`Erro ao enviar imagem: ${error.message || "Verifique as configurações de upload do servidor"}`);
      return null;
    }
  };

  const removeImage = async (key: string) => {
    try {
      const currentUrl = content[key];
      if (currentUrl) {
        const response = await deleteFile(currentUrl, key);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Falha ao remover arquivo no servidor");
        }
      }
      await updateContent(key, "");
      toast.success("Imagem removida com sucesso!");
    } catch (error: any) {
      console.error("Erro ao remover imagem:", error);
      toast.error(`Erro ao remover imagem: ${error.message || "Verifique a exclusão no servidor"}`);
    }
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/content/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: content }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      toast.success("Alterações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      toast.error("Erro ao salvar as alterações no servidor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminMode,
        content,
        updateContent,
        uploadImage,
        removeImage,
        saveChanges,
        saving,
        loading,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
