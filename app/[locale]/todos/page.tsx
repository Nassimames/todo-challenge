import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import AddTodoForm from '@/components/AddTodoForm'; 
import TodoItem from './TodoItem';
import { getTranslations } from 'next-intl/server';
import { CheckCircle2, ListTodo, Sparkles, SearchX } from 'lucide-react'; // Ajoute SearchX

// Ajout de "searchParams" dans les props de la page
export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect('/login');

  // Récupération du mot clé de recherche (ex: "image")
  const query = (await searchParams).query || '';

  const t = await getTranslations('Todos');

  // 1. REQUÊTE SUPABASE FILTRÉE
  let request = supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  // Si on a une recherche, on filtre par titre
  if (query) {
    request = request.ilike('title', `%${query}%`);
  }

  const { data: todos } = await request;

  // 2. Séparation des listes
  const activeTodos = todos?.filter(todo => !todo.is_complete) || [];
  const completedTodos = todos?.filter(todo => todo.is_complete) || [];
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0];

  return (
    <div className="max-w-7xl mx-auto p-6 py-10">
      
      {/* HEADER */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{t('title')}</h1>
        <p className="text-gray-500 mt-2 text-lg font-light">
            {/* Si recherche active, on change le texte */}
            {query 
              ? t('searchResults', { query }) 
              : t('welcome', { name: userName })
            }
        </p>
      </div>

      {/* FORMULAIRE (On le cache si on fait une recherche pour ne pas encombrer) */}
      {!query && (
        <div className="max-w-2xl mx-auto mb-14 relative z-10">
            <AddTodoForm />
        </div>
      )}

      {/* GESTION DU CAS "AUCUN RÉSULTAT DE RECHERCHE" */}
      {query && todos?.length === 0 ? (
        <div className="text-center py-20">
            <div className="inline-flex bg-gray-50 p-4 rounded-full mb-4">
                <SearchX size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
                {t('noResultsTitle')}
            </h3>
            <p className="text-gray-500">
                {t('noResultsDesc')}
            </p>
        </div>
      ) : (
        /* GRILLE NORMALE */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mt-8">
            {/* ... Le reste de ton code de colonnes (En cours / Terminé) ... */}
            {/* Copie-colle tes colonnes actuelles ici, elles afficheront les données filtrées */}
            
            {/* === COLONNE GAUCHE === */}
             <div className="space-y-6">
                 {/* ... ton code existant ... */}
                 <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-gray-900">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shadow-sm">
                        <ListTodo size={22} />
                    </div>
                    {t('sectionActive')}
                    </h2>
                    <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {activeTodos.length}
                    </span>
                </div>
                <ul className="space-y-4">
                    {activeTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
                </ul>
             </div>

             {/* === COLONNE DROITE === */}
             <div className="space-y-6">
                {/* ... ton code existant ... */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-gray-400">
                    <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl">
                        <CheckCircle2 size={22} />
                    </div>
                    {t('sectionCompleted')}
                    </h2>
                    <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full">
                    {completedTodos.length}
                    </span>
                </div>
                <ul className="space-y-4 opacity-70 hover:opacity-100 transition-all duration-300">
                    {completedTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
                </ul>
             </div>
        </div>
      )}
    </div>
  );
}