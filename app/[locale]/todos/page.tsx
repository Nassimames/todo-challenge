import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import AddTodoForm from '@/components/AddTodoForm'; 
import TodoItem from '@/app/[locale]/todos/TodoItem'; // Vérifie ton chemin d'import
import { getTranslations } from 'next-intl/server';
import { CheckCircle2, ListTodo } from 'lucide-react'; // Icônes pour le style

export default async function TodosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect('/login');

  const t = await getTranslations('Todos');

  // 1. On récupère TOUTES les tâches
  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  // 2. On SÉPARE les tâches en deux listes (Filtrage Côté Serveur)
  const activeTodos = todos?.filter(todo => !todo.is_complete) || [];
  const completedTodos = todos?.filter(todo => todo.is_complete) || [];

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0];

  return (
    <div className="max-w-2xl mx-auto p-4 py-12">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">{t('title')}</h1>
        <p className="text-gray-500 mt-1">{t('welcome', { name: userName })}</p>
      </div>

      {/* FORMULAIRE D'AJOUT */}
      <AddTodoForm />

      <div className="space-y-10">
        
        {/* --- SECTION 1 : TÂCHES EN COURS --- */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
              <ListTodo className="text-blue-600" size={20} />
              {t('sectionActive')}
            </h2>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-full border border-blue-100">
              {activeTodos.length}
            </span>
          </div>

          <ul className="space-y-3">
            {activeTodos.length > 0 ? (
              activeTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))
            ) : (
              // Message si rien à faire (Optionnel)
              <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-gray-400 text-sm">{t('empty')}</p>
              </div>
            )}
          </ul>
        </section>

        {/* --- SECTION 2 : TÂCHES TERMINÉES (S'affiche seulement s'il y en a) --- */}
        {completedTodos.length > 0 && (
          <section className="opacity-75 hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center justify-between mb-4 mt-8 border-t pt-8">
              <h2 className="text-lg font-bold flex items-center gap-2 text-gray-600">
                <CheckCircle2 className="text-green-600" size={20} />
                {t('sectionCompleted')}
              </h2>
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                {completedTodos.length}
              </span>
            </div>

            <ul className="space-y-3">
              {completedTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </ul>
          </section>
        )}

      </div>
    </div>
  );
}