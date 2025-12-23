
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence logic: Check local storage first
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('nori_language');
    return (saved === 'en' || saved === 'pt') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nori_language', lang);
    // In a real app, you would also trigger an API call here to update the user profile:
    // userService.updateProfile({ language: lang });
  };

  /**
   * Semantic Resolver
   * Resolves nested paths like 'audit.table.columns.action'
   */
  const t = (path: string): string => {
    const keys = path.split('.');
    let result: any = translations[language];
    let fallback: any = translations['en'];

    for (const key of keys) {
      result = result?.[key];
      fallback = fallback?.[key];
    }

    return result || fallback || path;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useTranslation must be used within I18nProvider');
  return context;
};
