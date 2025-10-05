"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language, translations } from '@/lib/languages/translations.languages';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['es'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar idioma desde localStorage al montar
  useEffect(() => {
    const savedLang = localStorage.getItem('app-language') as Language;
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
      setLanguageState(savedLang);
    }
    setIsLoaded(true);
  }, []);

  // Guardar idioma en localStorage cuando cambie
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = translations[language];

  // Evitar flash de contenido sin traducir
  if (!isLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}