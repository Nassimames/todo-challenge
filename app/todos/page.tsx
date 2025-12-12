import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import AddTodoForm from '@/components/AddTodoForm'; // Nouveau composant
import TodoItem from './TodoItem';

export default async function TodosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect('/login');

  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-2xl mx-auto p-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Vos Tâches</h1>
        <p className="text-gray-500 mt-1">Organisez votre journée, {user.email?.split('@')[0]}.</p>
      </div>

      <AddTodoForm />

      <ul className="space-y-3">
        {todos?.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
         {todos?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Tout est calme ici... 🍃</p>
          </div>
        )}
      </ul>
    </div>
  );
}