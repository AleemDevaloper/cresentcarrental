import { useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import translations from '../data/translations';

export const useTranslation = () => {
  const { language } = useApp();

  const t = useCallback((key) => {
    const lang = language || 'English';
    const translationSet = translations[lang] || translations['English'];
    return translationSet[key] || key;
  }, [language]);

  return useMemo(() => ({ t, language }), [t, language]);
};
