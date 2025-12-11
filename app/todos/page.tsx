import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import { addTodo } from './actions';
import TodoItem from './TodoItem'; // <--- IMPORTANT : Importer le composant

export default async function TodosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-2xl mx-auto p-4 mt-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Mes Tâches 📝</h1>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      <form action={addTodo} className="flex gap-2 mb-8">
        <input
          name="title"
          type="text"
          placeholder="Nouvelle tâche..."
          className="flex-1 border p-2 rounded shadow-sm"
          required
        />
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Ajouter
        </button>
      </form>

      <ul className="space-y-3">
        {todos?.map((todo) => (
          // C'EST ICI LE CHANGEMENT : On utilise TodoItem au lieu de <li>
          <TodoItem key={todo.id} todo={todo} />
        ))}
        
        {todos?.length === 0 && (
          <p className="text-center text-gray-500 italic">Aucune tâche pour le moment.</p>
        )}
      </ul>
    </div>
  );
}