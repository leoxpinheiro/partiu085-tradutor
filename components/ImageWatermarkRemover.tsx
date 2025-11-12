import React, { useState, useCallback } from 'react';
import { processImageWithPrompt } from '../services/geminiService';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });

const ImageWatermarkRemover: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [prompt, setPrompt] = useState<string>("Remova a marca d'água desta imagem.");

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      setOriginalImage(file);
      setOriginalImagePreview(URL.createObjectURL(file));
      setProcessedImage(null);
      setError(null);
    } else {
      setError("Por favor, selecione um arquivo de imagem válido.");
    }
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    handleFileChange(file);
  }, []);
  
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleProcessImage = async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setProcessedImage(null);

    try {
      const base64Image = await fileToBase64(originalImage);
      const resultBase64 = await processImageWithPrompt(base64Image, originalImage.type, prompt);
      setProcessedImage(`data:${originalImage.type};base64,${resultBase64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClear = () => {
    setOriginalImage(null);
    setOriginalImagePreview(null);
    setProcessedImage(null);
    setError(null);
  }

  return (
    <div className="space-y-6">
      {!originalImagePreview && (
         <div 
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`relative flex flex-col items-center justify-center p-8 text-center bg-white border-2 border-dashed rounded-2xl cursor-pointer hover:border-brand-accent transition-all duration-300 ${isDragOver ? 'border-brand-accent bg-orange-50' : 'border-gray-300'}`}
        >
            <input
                id="file-upload"
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                accept="image/*"
            />
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <label htmlFor="file-upload" className="font-semibold text-brand-dark">Clique para selecionar ou arraste uma imagem</label>
            <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP. A IA pode remover marcas d'água, mudar fundos e mais.</p>
        </div>
      )}
      
      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-center">{error}</div>}

      {originalImagePreview && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Side */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                <h2 className="text-lg font-bold text-gray-900 mb-4 self-start">Imagem Original</h2>
                <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden mb-4">
                    <img src={originalImagePreview} alt="Original" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="w-full mb-4">
                     <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-700 mb-1.5">O que você quer fazer com a imagem?</label>
                     <input 
                        id="prompt-input"
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ex: Mude o fundo para uma praia"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition text-sm"
                     />
                </div>
                <div className="flex gap-3 w-full">
                    <button onClick={handleProcessImage} disabled={isLoading} className="flex-grow bg-brand-accent hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition duration-300 ease-in-out disabled:bg-gray-400 flex items-center justify-center shadow-sm shadow-orange-200">
                      {isLoading ? 'Processando...' : "✨ Aplicar Mágica"}
                    </button>
                    <button onClick={handleClear} disabled={isLoading} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition">
                      Trocar
                    </button>
                </div>
            </div>

            {/* Output Side */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                <h2 className="text-lg font-bold text-gray-900 mb-4 self-start">Imagem Processada</h2>
                <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden mb-4">
                    {isLoading && <div className="text-center text-gray-600">
                        <svg className="animate-spin h-8 w-8 text-brand-green mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Aplicando mágica...
                    </div>}
                    {processedImage && !isLoading && <img src={processedImage} alt="Processada" className="max-w-full max-h-full object-contain" />}
                    {!processedImage && !isLoading && <span className="text-gray-400">O resultado aparecerá aqui</span>}
                </div>
                 {processedImage && !isLoading && (
                    <a href={processedImage} download={`editada-${originalImage?.name}`} className="w-full text-center bg-brand-green hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 shadow-sm shadow-green-200">
                       Baixar Imagem
                    </a>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default ImageWatermarkRemover;