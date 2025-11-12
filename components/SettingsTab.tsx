import React, { useState } from 'react';

interface SettingsTabProps {
  promoFooter: string;
  setPromoFooter: (text: string) => void;
  resgateFooter: string;
  setResgateFooter: (text: string) => void;
  autoAppend: boolean;
  setAutoAppend: (value: boolean) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  promoFooter,
  setPromoFooter,
  resgateFooter,
  setResgateFooter,
  autoAppend,
  setAutoAppend
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    localStorage.setItem('promoFooter', promoFooter);
    localStorage.setItem('resgateFooter', resgateFooter);
    localStorage.setItem('autoAppendLinks', String(autoAppend));

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xl">⚙️</span>
        <h2 className="text-xl font-bold text-gray-900">Configurações Gerais</h2>
      </div>
      
      <div className="space-y-6">
        {/* Promo Footer Input */}
        <div>
          <label htmlFor="promo-footer" className="block text-sm font-medium text-gray-700 mb-1.5">
            Rodapé para Promoções
          </label>
          <textarea
            id="promo-footer"
            value={promoFooter}
            onChange={(e) => setPromoFooter(e.target.value)}
            placeholder="Digite o texto e/ou link para adicionar ao final das promoções..."
            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-green focus:border-transparent transition text-base min-h-[100px] resize-y"
            rows={3}
          />
        </div>

        {/* Resgate Footer Input */}
        <div>
          <label htmlFor="resgate-footer" className="block text-sm font-medium text-gray-700 mb-1.5">
            Rodapé para Resgates
          </label>
          <textarea
            id="resgate-footer"
            value={resgateFooter}
            onChange={(e) => setResgateFooter(e.target.value)}
            placeholder="Digite o texto e/ou link para adicionar ao final dos resgates..."
            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-green focus:border-transparent transition text-base min-h-[100px] resize-y"
            rows={3}
          />
        </div>

        {/* Auto-append Checkbox */}
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              id="auto-append"
              aria-describedby="auto-append-description"
              name="auto-append"
              type="checkbox"
              checked={autoAppend}
              onChange={(e) => setAutoAppend(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="auto-append" className="font-medium text-gray-900">
              Adicionar rodapé automaticamente
            </label>
            <p id="auto-append-description" className="text-gray-500">
              Se ativo, o rodapé correspondente será adicionado ao final de cada frase gerada.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-4">
            {showSuccess && (
                <span className="text-sm text-brand-green font-medium">Configurações salvas!</span>
            )}
          <button
            onClick={handleSave}
            className="bg-brand-accent hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition duration-300 ease-in-out shadow-sm shadow-orange-200"
          >
            Salvar Ajustes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;