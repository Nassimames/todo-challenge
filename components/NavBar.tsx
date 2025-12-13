'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

export default function NavBar() {
  const pathname = usePathname();
  const locale = useLocale(); // Récupère 'fr' ou 'en'
  const t = useTranslations('Header');

  // Fonction pour vérifier si le lien est actif
  const isActive = (path: string) => {
    // 1. On retire la locale de l'URL actuelle (ex: /fr/todos -> /todos, /fr -> '')
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    
    // 2. Si le path est '/', on vérifie l'exactitude. Sinon, on vérifie si ça commence par (pour les sous-pages)
    return path === '/' ? pathWithoutLocale === '/' : pathWithoutLocale.startsWith(path);
  };

  const linkStyle = (path: string) => `
    px-5 py-2 rounded-full transition-all duration-300 text-sm font-medium relative
    ${isActive(path) 
      ? 'bg-black text-white shadow-lg shadow-black/10' 
      : 'text-gray-500 hover:text-black hover:bg-gray-100'}
  `;

  return (
    <div className="flex bg-gray-50/80 backdrop-blur-md p-1.5 rounded-full border border-gray-200/50">
      <Link href="/" className={linkStyle('/')}>
        {t('home')}
      </Link>
      <Link href="/todos" className={linkStyle('/todos')}>
        {t('tasks')}
      </Link>
    </div>
  );
}