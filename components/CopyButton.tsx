
import React, { useState } from 'react';

interface CopyButtonProps {
  textToCopy: string;
}

const CheckIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm flex-1 sm:flex-none ${
        copied
          ? 'bg-brand-dark text-white'
          : 'bg-[#17BF5E] text-white hover:bg-[#14a651]'
      }`}
    >
      {copied ? <CheckIcon /> : null}
      {copied ? 'Copiado!' : (
        <>
            Copiar texto
        </>
      )}
    </button>
  );
};

export default CopyButton;
