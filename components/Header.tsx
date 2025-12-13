import Link from 'next/link';
import { createClient } from '@/app/utils/supabase/server';
import { getTranslations } from 'next-intl/server';
import UserMenu from './UserMenu';
import NavBar from './NavBar';
import LanguageSwitcher from './LanguageSwitcher';
import SearchBar from './SearchBar'; 

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = await getTranslations('Header'); 

  return (
    // Ajout de 'relative' pour permettre le positionnement absolu de la NavBar
    <nav className="relative flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
      
      {/* 1. GAUCHE : LOGO SEUL */}
      <div className="flex items-center">
        <Link href="/" className="font-bold text-xl flex items-center gap-2 text-black hover:opacity-80 transition tracking-tight">
          TaskFlow
        </Link>
      </div>

      {/* 2. CENTRE : NAVIGATION (Position Absolue) */}
      {/* 
          absolute left-1/2 -translate-x-1/2 : 
          Cela force l'élément à être exactement au milieu de la barre, 
          indépendamment de ce qu'il y a à gauche ou à droite.
      */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
        <NavBar />
      </div>

      {/* 3. DROITE : OUTILS */}
      <div className="flex items-center gap-2 md:gap-4">
        
        {user && (
           <div className="mr-1"> 
             <SearchBar placeholder={t('searchPlaceholder') || "Rechercher..."} /> 
           </div>
        )}
        
        <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

        <LanguageSwitcher />

        {user ? (
          <UserMenu user={user} />
        ) : (
          <Link 
            href="/login" 
            className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition shadow-sm"
          >
            {t('login')}
          </Link>
        )}
      </div>
    </nav>
  );
}