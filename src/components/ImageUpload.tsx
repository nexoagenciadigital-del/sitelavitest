import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { resizeImage, validateImageFile } from '../utils/imageUtils';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageBase64: string) => void;
  label?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  currentImage, 
  onImageChange, 
  label = "Imagem do Produto",
  className = ""
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError('');
    setIsUploading(true);

    try {
      // Validar arquivo
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Arquivo inválido');
        return;
      }

      // Redimensionar e converter para base64
      const base64Image = await resizeImage(file);
      onImageChange(base64Image);
    } catch (err) {
      setError('Erro ao processar imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = () => {
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.02 }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${dragOver 
              ? 'border-pink-500 bg-pink-50' 
              : 'border-gray-300 hover:border-pink-400 hover:bg-gray-50'
            }
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center space-y-3">
              <Loader className="text-pink-500 animate-spin" size={32} />
              <p className="text-gray-600">Processando imagem...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                {dragOver ? (
                  <Upload className="text-pink-500" size={24} />
                ) : (
                  <ImageIcon className="text-pink-500" size={24} />
                )}
              </div>
              
              <div>
                <p className="text-gray-700 font-medium">
                  {dragOver ? 'Solte a imagem aqui' : 'Clique ou arraste uma imagem'}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  JPG, PNG ou WebP até 5MB
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
        >
          {error}
        </motion.div>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        💡 Dica: A imagem será automaticamente redimensionada e otimizada
      </div>
    </div>
  );
};

export default ImageUpload;
