import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white pt-6 px-6 pb-4 border-b border-gray-100">
      <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-4 items-center">
            <div className="h-12 w-12 bg-brand-green rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-2xl">🌵</span>
            </div>
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-brand-dark tracking-tight flex items-center gap-3">
                Partiu085 – Adaptador & Miles Studio
                </h1>
                <p className="text-gray-500 mt-0.5 text-sm flex items-center gap-2">
                  WhatsApp conversado • 5 abas • Histórico salvo no navegador
                </p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600 border border-gray-200">Versão v3.1</span>
            <a href="https://ai.google.dev/gemini-api/docs" target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded-full bg-blue-50 text-xs font-medium text-blue-600 border border-blue-100 hover:bg-blue-100 transition">Gemini API docs</a>
        </div>
      </div>
    </header>
  );
};

export default Header;