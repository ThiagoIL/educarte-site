import React, { useState, useEffect } from "react";
import { Edit2, Check, X } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

interface EditableTextProps {
  contentKey: string;
  defaultValue: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "p" | "span" | "div";
}

export const EditableText: React.FC<EditableTextProps> = ({
  contentKey,
  defaultValue,
  className = "",
  as: Component = "span",
}) => {
  const { isAdminMode, content, updateContent } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState("");

  const currentValue = content[contentKey] ?? defaultValue;

  useEffect(() => {
    setTempValue(currentValue);
  }, [currentValue]);

  const handleSave = () => {
    updateContent(contentKey, tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(currentValue);
    setIsEditing(false);
  };

  if (!isAdminMode) {
    return <Component className={className}>{currentValue}</Component>;
  }

  if (isEditing) {
    return (
      <div className={`relative inline-block w-full ${className}`}>
        <textarea
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          className="w-full bg-white text-gray-800 border-2 border-purple-500 rounded px-2 py-1 focus:ring-2 focus:ring-purple-200 outline-none resize-y min-h-[40px] font-inherit"
          rows={Math.max(2, tempValue.split("\n").length)}
          autoFocus
        />
        <div className="absolute right-2 bottom-3 flex gap-1 z-10 bg-white/90 p-1 rounded shadow-md">
          <button
            onClick={handleSave}
            className="p-1 bg-green-500 hover:bg-green-600 text-white rounded cursor-pointer transition-colors"
            title="Salvar"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 bg-red-500 hover:bg-red-600 text-white rounded cursor-pointer transition-colors"
            title="Cancelar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <span className={`relative group/edit inline-block border border-dashed border-purple-300 hover:border-purple-600 hover:bg-purple-50/50 rounded px-1 transition-all ${className}`}>
      <Component className="inline">{currentValue}</Component>
      <button
        onClick={() => setIsEditing(true)}
        className="absolute -top-3 -right-3 hidden group-hover/edit:flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white p-1 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer z-10"
        title="Editar texto"
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>
    </span>
  );
};
