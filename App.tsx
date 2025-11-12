import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import ImageWatermarkRemover from './components/ImageWatermarkRemover';
import SettingsTab from './components/SettingsTab';
import { generateAdaptedText, appendFooterToSentences } from './services/geminiService';
import type { ParsedOutput, HistoryItem } from './types';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<ParsedOutput[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'promocoes' | 'resgates' | 'historico' | 'imagem' | 'configuracoes'>('promocoes');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Settings state
  const [promoFooter, setPromoFooter] = useState('');
  const [resgateFooter, setResgateFooter] = useState('');
  const [autoAppendLinks, setAutoAppendLinks] = useState(false);

  // Load settings and history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('app_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    
    setPromoFooter(localStorage.getItem('promoFooter') || '');
    setResgateFooter(localStorage.getItem('resgateFooter') || '');
    setAutoAppendLinks(localStorage.getItem('autoAppendLinks') === 'true');

  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('app_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to convert.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutputText([]);

    try {
      const result = await generateAdaptedText(inputText);
      let finalResult = result;

      if (autoAppendLinks) {
        const footerToAppend = activeTab === 'promocoes' ? promoFooter : resgateFooter;
        finalResult = appendFooterToSentences(result, footerToAppend);
      }
      
      setOutputText([{ title: 'Texto para WhatsApp 💬', content: finalResult }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText([]);
    setError(null);
  };

  const handleSaveToHistory = (content: string, title: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      title: title || 'Sem título',
      originalText: inputText,
      generatedContent: content,
    };
    setHistory([newItem, ...history]);
    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
      setActiveTab('historico');
    }, 1500);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
  };
  
  const handleReuseFromHistory = (item: HistoryItem) => {
    setInputText(item.originalText);
    setActiveTab('promocoes');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-brand-dark font-sans pb-12">
      <Header />
      
      <main className="p-4 sm:p-6 lg:p-8 container mx-auto max-w-7xl space-y-6">
        {/* Navigation Tabs */}
        <div className="flex justify-center w-full">
            <div className="bg-white p-1 rounded-full shadow-sm inline-flex space-x-1 border border-gray-100 overflow-x-auto max-w-full">
              <button 
                onClick={() => setActiveTab('promocoes')}
                className={`px-4 sm:px-6 py-2.5 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 ${activeTab === 'promocoes' ? 'bg-white shadow-sm text-gray-900 ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Promoções
              </button>
              <button 
                onClick={() => setActiveTab('resgates')}
                className={`px-4 sm:px-6 py-2.5 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 ${activeTab === 'resgates' ? 'bg-white shadow-sm text-gray-900 ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Resgates
              </button>
               <button 
                onClick={() => setActiveTab('imagem')}
                className={`px-4 sm:px-6 py-2.5 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === 'imagem' ? 'bg-white shadow-sm text-gray-900 ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Imagem ✨
              </button>
              <button 
                onClick={() => setActiveTab('historico')}
                className={`px-4 sm:px-6 py-2.5 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 ${activeTab === 'historico' ? 'bg-white shadow-sm text-gray-900 ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Histórico
              </button>
              <button 
                onClick={() => setActiveTab('configuracoes')}
                className={`px-4 sm:px-6 py-2.5 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === 'configuracoes' ? 'bg-white shadow-sm text-gray-900 ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Configurações ⚙️
              </button>
            </div>
        </div>

        {/* Tab Content */}
        {(activeTab === 'promocoes' || activeTab === 'resgates') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InputSection
              activeTab={activeTab}
              inputText={inputText}
              setInputText={setInputText}
              onGenerate={handleGenerate}
              onClear={handleClear}
              isLoading={isLoading}
            />
            <OutputSection
              outputSections={outputText}
              isLoading={isLoading}
              error={error}
              onSaveHistory={handleSaveToHistory}
              showSuccessMessage={showSaveSuccess}
            />
          </div>
        )}
        
        {activeTab === 'imagem' && (
            <ImageWatermarkRemover />
        )}

        {activeTab === 'configuracoes' && (
            <SettingsTab 
                promoFooter={promoFooter}
                setPromoFooter={setPromoFooter}
                resgateFooter={resgateFooter}
                setResgateFooter={setResgateFooter}
                autoAppend={autoAppendLinks}
                setAutoAppend={setAutoAppendLinks}
            />
        )}

        {activeTab === 'historico' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Histórico de Conversões</h2>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum histórico salvo ainda.</p>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                         <h3 className="font-semibold text-brand-green">{item.title}</h3>
                         <span className="text-xs text-gray-400">{item.date}</span>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => handleReuseFromHistory(item)} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Reutilizar</button>
                         <button onClick={() => {
                            navigator.clipboard.writeText(item.generatedContent);
                         }} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Copiar</button>
                         <button onClick={() => deleteHistoryItem(item.id)} className="text-xs text-red-500 px-2 py-1 rounded hover:bg-red-50">Excluir</button>
                      </div>
                    </div>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto custom-scrollbar">{item.generatedContent}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;