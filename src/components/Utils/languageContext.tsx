// src/context/LanguageContext.tsx
'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

interface LanguageContextProps {
  language: string;
  setLanguage: (language: string) => void;
}

{/* Crear el contexto de idioma */}
const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('pt');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

{/* Hook para obtener el idioma */}
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};