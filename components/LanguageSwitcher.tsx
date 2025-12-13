'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react'; // Assure-toi d'avoir installé lucide-react

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();

  const toggleLanguage = () => {
    const nextLocale = currentLocale === 'fr' ? 'en' : 'fr';
    // Remplace la locale actuelle par la nouvelle dans l'URL
    const newPath = pathname.replace(`/${currentLocale}`, `/${nextLocale}`);
    router.push(newPath);
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="group flex items-center gap-2 px-3 py-2 rounded-full border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all duration-300"
      title={currentLocale === 'fr' ? "Switch to English" : "Passer en Français"}
    >
      <div className="bg-gray-100 p-1.5 rounded-full group-hover:bg-white group-hover:shadow-sm transition-all">
        <Globe size={16} className="text-gray-600 group-hover:text-black transition-colors" />
      </div>
      
      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider group-hover:text-black">
        {currentLocale}
      </span>
    </button>
  );
}