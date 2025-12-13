import Link from 'next/link';
// Import corrigé avec /app
import { createClient } from '@/app/utils/supabase/server'; 
import UserMenu from './UserMenu';
import NavBar from './NavBar';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';

import { getTranslations } from 'next-intl/server'; // Utilise la version serveur

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // AWAIT ici pour les composants serveur
  const t = await getTranslations('Header'); 

  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b bg-white/80 backdrop-blur sticky top-0 z-50">
      
      {/* LOGO */}
      <Link href="/" className="font-bold text-2xl flex items-center gap-2 text-black hover:opacity-80 transition">
        TaskFlow
      </Link>

      {/* MENU NAVIGATION (Home / Tâches) */}
      <NavBar />
      
      <div className="flex items-center gap-4">
        
        {/* SÉLECTEUR DE LANGUE (FR/EN) */}
        <LanguageSwitcher />

        {/* SECTION UTILISATEUR */}
        {user ? (
          // Si connecté : On affiche le menu utilisateur
          <UserMenu user={user} />
        ) : (
          // Si pas connecté : Bouton Login traduit
          <Link 
            href="/login" 
            className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
          >
            {t('login')} {/* Affiche "Se connecter" ou "Login" */}
          </Link>
        )}
      </div>
    </nav>
  );
}