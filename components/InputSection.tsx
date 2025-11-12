import React from 'react';

interface InputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  onGenerate: () => void;
  onClear: () => void;
  isLoading: boolean;
  activeTab: 'promocoes' | 'resgates';
}

const InputSection: React.FC<InputSectionProps> = ({ activeTab, inputText, setInputText, onGenerate, onClear, isLoading }) => {
  const tabTitle = activeTab === 'resgates' ? 'Resgates (passagens, milhas, disponibilidade)' : 'Promoções (transferências, bônus, compra de pontos)';
  const placeholder = activeTab === 'resgates' 
    ? 'Cole aqui os dados do resgate...\n\nExemplo:\nDisponibilidade Air France para Paris, executiva por 90k milhas, datas...' 
    : 'Cole aqui o texto da promoção...\n\nExemplo:\nTransfira seus pontos Azul para o ALL e ganhe até 30% bônus...';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[400px]">
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <div className={`w-3 h-3 rounded-full ${activeTab === 'resgates' ? 'bg-blue-500' : 'bg-brand-green'}`}></div>
        <h2 className="text-lg font-bold text-gray-900">{tabTitle}</h2>
      </div>
      
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder={placeholder}
        className="w-full flex-1 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent transition duration-200 resize-none text-sm leading-6 bg-gray-50 mb-4 min-h-[200px]"
        disabled={isLoading}
      />

      <div className="flex gap-3 mt-auto shrink-0">
        <button
            onClick={onGenerate}
            disabled={isLoading}
            className="flex-grow bg-brand-accent hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base shadow-sm shadow-orange-200"
        >
            {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Convertendo...
            </>
            ) : (
            'Converter para WhatsApp'
            )}
        </button>
        <button
            onClick={onClear}
            disabled={isLoading}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition duration-200 disabled:cursor-not-allowed text-sm sm:text-base"
        >
            Limpar
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center shrink-0">
        Dica: mantenha os links no texto. A IA preserva números, datas e percentuais.
      </p>
    </div>
  );
};

export default InputSection;