import React from 'react';

type Language = 'pt' | 'en' | 'es';

interface LanguageSelectorProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  locale: { [key: string]: string };
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  setLanguage,
  locale
}) => {
  return (
    <div className="mt-auto px-2 py-2 sm:px-4 sm:py-3 border-t border-gray-100">
      <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
        {locale['Select_Language'] || 'Select Language'}
      </h3>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="w-full bg-gray-50 border border-gray-200 text-gray-600 py-1.5 px-2 rounded 
                   text-xs sm:text-sm
                   focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent
                   transition-all duration-200"
      >
        <option value="pt">Português</option>
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
}

export default LanguageSelector;