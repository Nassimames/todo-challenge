'use server' // ⚠️ TRES IMPORTANT : Obligatoire en haut

import { createClient } from '@/app/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addTodo(formData: FormData) {
  const supabase = await createClient();

  // 1. Récupérer la donnée du formulaire
  const title = formData.get('title') as string;

  // 2. Récupérer l'utilisateur courant (Pour le user_id)
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return; // Sécurité : On ne fait rien si pas connecté
  }

  // 3. CREATE : Insertion en base
  // TypeScript va vérifier que 'title' et 'user_id' existent bien dans ta table !
  const { error } = await supabase
    .from('todos')
    .insert({
      title: title,
      user_id: user.id, // Important : Lier la tâche à l'utilisateur
      is_complete: false
    });

  if (error) {
    console.error('Erreur insert:', error);
    return;
  }

  // 4. Magie Next.js : Rafraîchir la page
  // Ça dit à Next.js : "Les données ont changé sur /todos, recharge la liste !"
  revalidatePath('/todos');
}