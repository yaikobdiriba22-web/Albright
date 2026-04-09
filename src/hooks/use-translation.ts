
"use client"

import { useState, useEffect } from 'react';
import { translations, Language } from '@/lib/translations';

export function useTranslation() {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('app_lang') as Language;
    if (saved) setLang(saved);
  }, []);

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
    window.dispatchEvent(new Event('language-change'));
  };

  // Listen for changes from other components
  useEffect(() => {
    const sync = () => {
      const current = localStorage.getItem('app_lang') as Language;
      if (current) setLang(current);
    };
    window.addEventListener('language-change', sync);
    return () => window.removeEventListener('language-change', sync);
  }, []);

  const t = (key: keyof typeof translations['en']) => {
    return translations[lang][key] || translations['en'][key];
  };

  return { t, lang, changeLanguage };
}
