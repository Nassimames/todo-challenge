import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // 1. Récupérer la locale demandée (c'est une promesse)
  let locale = await requestLocale;

  // 2. Vérifier si elle est valide, sinon mettre 'fr' par défaut
  if (!locale || !['fr', 'en'].includes(locale)) {
    locale = 'fr';
  }

  return {
    locale, 
    
    // Chargement des messages
    messages: (await import(`./../messages/${locale}.json`)).default
  };
});