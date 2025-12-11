import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import { addTodo } from '../todos/actions'; // On va le créer juste après

export default async function TodosPage() {
  // 1. Initialisation du client Supabase Serveur
  const supabase = await createClient();

  // 2. Vérification Auth (Protection de route)
  // On demande : "Qui est connecté ?"
  const { data: { user } } = await supabase.auth.getUser();

  // Si personne n'est connecté, oust ! Retour au login.
  if (!user) {
    return redirect('/login');
  }

  // 3. READ : Récupération des tâches (SELECT)
  // Grâce à fichier types/supabase.ts, TypeScript sait que 'todos' existe !
  const { data: todos, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false }); 

  if (error) {
    console.error('Erreur SQL:', error);
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Mes Tâches 📝</h1>
        <p className="text-sm text-gray-500">Utilisateur : {user.email}</p>
      </div>

      {/* --- FORMULAIRE D'AJOUT (CREATE) --- */}
      <form action={addTodo} className="flex gap-2 mb-8">
        <input
          name="title"
          type="text"
          placeholder="Nouvelle tâche..."
          className="flex-1 border p-2 rounded"
          required
        />
        <button className="bg-black text-white px-4 py-2 rounded">
          Ajouter
        </button>
      </form>

      {/* --- LISTE DES TÂCHES (READ) --- */}
      <ul className="space-y-3">
        {todos?.map((todo) => (
          <li key={todo.id} className="border p-3 rounded flex justify-between items-center bg-white shadow-sm">
            <span className={todo.is_complete ? 'line-through text-gray-400' : ''}>
              {todo.title}
            </span>
            <div className="text-xs text-gray-400">
                {/* On ajoutera les boutons Check/Delete ici plus tard */}
                {todo.is_complete ? '✅ Fait' : '⏳ À faire'}
            </div>
          </li>
        ))}
        {todos?.length === 0 && (
          <p className="text-center text-gray-500 italic">Aucune tâche pour le moment.</p>
        )}
      </ul>
    </div>
  );
}