import React, { useRef, useState } from "react";
import { Camera, Trash2, X, Upload } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface EditableImageProps {
  contentKey: string;
  defaultSrc: string;
  alt: string;
  className?: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  contentKey,
  defaultSrc,
  alt,
  className = "",
}) => {
  const { isAdminMode, content, uploadImage, removeImage } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const currentSrc = content[contentKey] || defaultSrc;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setShowOptions(false);
    try {
      const oldUrl = currentSrc !== defaultSrc ? currentSrc : undefined;
      await uploadImage(file, contentKey, oldUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    removeImage(contentKey);
    setShowOptions(false);
  };

  if (!isAdminMode) {
    return <ImageWithFallback src={currentSrc || defaultSrc} alt={alt} className={className} />;
  }

  return (
    <div className="relative group/img-editable inline-block w-full h-full">
      <div 
        onClick={() => setShowOptions(true)}
        className="cursor-pointer relative overflow-hidden rounded-3xl"
      >
        <ImageWithFallback 
          src={currentSrc || defaultSrc} 
          alt={alt} 
          className={`${className} transition-opacity duration-200 group-hover/img-editable:opacity-90`} 
        />
        
        {/* Overlay showing prompt on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img-editable:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200 rounded-3xl">
          <Camera className="w-8 h-8 mb-2 animate-bounce" />
          <span className="font-semibold text-sm">Clique para alterar imagem</span>
        </div>
      </div>

      {isUploading && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold z-20 rounded-3xl">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span>Enviando...</span>
          </div>
        </div>
      )}

      {showOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowOptions(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-4 pr-6">Editar Imagem</h3>
            
            <div className="flex flex-col gap-3">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors cursor-pointer"
              >
                <Upload className="w-5 h-5" />
                Upload de Nova Imagem
              </button>

              {currentSrc && (
                <button
                  onClick={handleRemove}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                  Remover Imagem Atual
                </button>
              )}

              <button
                onClick={() => setShowOptions(false)}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
