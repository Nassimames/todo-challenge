'use server'

import { createClient } from '@/app/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// 1. CREATE : Ajouter une tâche
export async function addTodo(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get('title') as string;
  
  // On vérifie qui est connecté
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from('todos')
    .insert({
      title: title,
      user_id: user.id,
      is_complete: false
    });

  if (error) {
    console.error('Erreur insert:', error);
    return;
  }

  revalidatePath('/todos');
}

// 2. UPDATE : Mettre à jour (Cocher/Décocher)
export async function updateTodo(id: string, is_complete: boolean) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('todos')
    .update({ is_complete: is_complete })
    .eq('id', id);

  if (error) {
    console.error('Erreur update:', error);
    return;
  }

  revalidatePath('/todos');
}
// 5. UPDATE TITLE : Modifier le texte d'une tâche
export async function updateTodoTitle(id: string, newTitle: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('todos')
    .update({ title: newTitle }) // On met à jour SEULEMENT le titre
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Erreur update title:', error);
    return;
  }

  revalidatePath('/todos');
}

// 3. DELETE : Supprimer une tâche
export async function deleteTodo(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erreur delete:', error);
    return;
  }

  revalidatePath('/todos');
}