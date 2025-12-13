import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import AddTodoForm from '@/components/AddTodoForm'; // Nouveau composant
import TodoItem from './TodoItem';

import { getTranslations } from 'next-intl/server'; // <--- IMPORT

export default async function TodosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect('/login');

  // Récupérer les traductions (C'est async !)
  const t = await getTranslations('Todos');

  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  // On extrait le nom pour l'injecter dans la phrase traduite
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0];

  return (
    <div className="max-w-2xl mx-auto p-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">{t('title')}</h1>
        {/* On passe une variable {name} à la traduction */}
        <p className="text-gray-500 mt-1">{t('welcome', { name: userName })}</p>
      </div>

      <AddTodoForm />

      <ul className="space-y-3">
        {todos?.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
         {todos?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">{t('empty')}</p>
          </div>
        )}
      </ul>
    </div>
  );
}