import React, { useState, useEffect } from 'react';
import type { ParsedOutput } from '../types';
import Loader from './Loader';
import CopyButton from './CopyButton';

interface OutputSectionProps {
  outputSections: ParsedOutput[];
  isLoading: boolean;
  error: string | null;
  onSaveHistory: (content: string, title: string) => void;
  showSuccessMessage: boolean;
}

const OutputSection: React.FC<OutputSectionProps> = ({ outputSections, isLoading, error, onSaveHistory, showSuccessMessage }) => {
  const [titleToSave, setTitleToSave] = useState('');
  const currentContent = outputSections[0]?.content || '';

  useEffect(() => {
    if (!currentContent) {
      setTitleToSave('');
    }
  }, [currentContent]);


  const handleSaveClick = () => {
    if (currentContent) {
        onSaveHistory(currentContent, titleToSave || 'Sem título');
        setTitleToSave('');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return (
        <div className="text-center text-red-600 bg-red-50 p-6 rounded-xl border border-red-100">
          <p className="font-bold mb-1">Oops! Algo deu errado.</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    if (!currentContent) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-20">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
             <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          </div>
          <p className="text-lg font-medium text-gray-500">Aguardando texto...</p>
          <p className="mt-1 text-sm">O resultado da conversão aparecerá aqui.</p>
        </div>
      );
    }
    return (
      <pre className="text-sm text-brand-dark whitespace-pre-wrap font-sans leading-relaxed bg-white flex-1">{currentContent}</pre>
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col min-h-[300px]">
        {showSuccessMessage && (
            <div className="absolute top-5 right-5 bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg z-10">
                Salvo com sucesso!
            </div>
        )}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 shrink-0">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="text-xl">📤</span> Resultado (WhatsApp)
          </h2>
          <div className="flex gap-2 w-full sm:w-auto">
            {currentContent && <CopyButton textToCopy={currentContent} />}
            {currentContent && (
                <button 
                    onClick={handleSaveClick}
                    className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-700"
                >
                    Salvar no Histórico
                </button>
            )}
          </div>
      </div>
      
      <div className="bg-gray-50/50 p-4 rounded-xl flex-grow flex flex-col mb-4 border border-gray-100 max-h-[500px] overflow-y-auto custom-scrollbar">
        {renderContent()}
      </div>

      {currentContent && (
        <div className="mt-auto pt-4 border-t border-gray-100 shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Título para o Histórico</label>
            <div className="relative">
                <input 
                    type="text" 
                    value={titleToSave}
                    onChange={(e) => setTitleToSave(e.target.value)}
                    placeholder="Ex.: Azul → ALL 30% bônus"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition text-sm"
                />
            </div>
        </div>
      )}
    </div>
  );
};

export default OutputSection;