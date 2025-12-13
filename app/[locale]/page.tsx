import Link from "next/link";
import { getTranslations } from 'next-intl/server';
import { Github, ArrowRight, LayoutDashboard } from 'lucide-react'; 
import { createClient } from '@/app/utils/supabase/server'; 

export default async function Home() {
  // 1. Chargement des traductions
  // 'Home' pour le titre/sous-titre
  const t = await getTranslations('Home'); 
  // 'Header' pour réutiliser le mot "Mes Tâches" sans modifier le JSON
  const tHeader = await getTranslations('Header');

  // 2. Vérification de la session utilisateur
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-8 bg-white text-center">
      
      {/* Badge décoratif */}
      <div className="mb-8 animate-fade-in opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]">
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-widest border border-gray-200">
          Productivity v2.0
        </span>
      </div>

      <div className="max-w-3xl animate-fade-in-up">
        {/* TITRE */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-black to-gray-600 mb-8 tracking-tight leading-tight">
          {t('title')}
        </h1>
        
        {/* PARAGRAPHE INSPIRANT */}
        <p className="text-xl text-gray-500 mb-12 leading-relaxed max-w-2xl mx-auto font-light">
           {t('subtitle')}
        </p>

        {/* BOUTONS D'ACTION */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            
            {/* LOGIQUE INTELLIGENTE DU BOUTON PRINCIPAL */}
            {user ? (
                // CAS 1 : CONNECTÉ -> Redirection vers /todos
                <Link 
                    href="/todos"
                    className="group flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                    <LayoutDashboard size={18} />
                    {/* Affiche "Mes Tâches" (FR) ou "My Tasks" (EN) */}
                    {tHeader('tasks')} 
                </Link>
            ) : (
                // CAS 2 : VISITEUR -> Redirection vers /login
                <Link 
                    href="/login"
                    className="group flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                    {t('cta')}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            )}
            
            {/* Bouton Code Github Traduit */}
             <Link 
                href="https://github.com/Nassimames/todo-challenge"
                target="_blank"
                className="flex items-center gap-2 text-gray-600 bg-gray-50 border border-gray-200 px-8 py-4 rounded-full font-semibold hover:bg-white hover:border-gray-300 transition-all"
            >
                <Github size={20} />
                {t('code')}
            </Link>
        </div>
      </div>
    </main>
  );
}