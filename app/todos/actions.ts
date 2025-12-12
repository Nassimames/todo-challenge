'use server'

import { createClient } from '@/app/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// 1. ADD TODO (Avec Description + Image)
export async function addTodo(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string; // Nouveau !
  const imageFile = formData.get('image') as File;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  let image_url = null;

  if (imageFile && imageFile.size > 0) {
    const fileName = `${user.id}/${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    const { error: uploadError } = await supabase.storage.from('todo-images').upload(fileName, imageFile);
    if (!uploadError) image_url = fileName;
  }

  await supabase.from('todos').insert({
    title,
    description, // On ajoute ça
    user_id: user.id,
    is_complete: false,
    image_url
  });

  revalidatePath('/todos');
}

// 2. UPDATE DETAILS (Titre + Description) - Pour la Popup
export async function updateTodoDetails(id: string, title: string, description: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;

  await supabase
    .from('todos')
    .update({ title, description })
    .eq('id', id)
    .eq('user_id', user.id);

  revalidatePath('/todos');
}

// ... (Garde updateTodo "checkbox" et deleteTodo comme avant)
export async function updateTodo(id: string, is_complete: boolean) {
    const supabase = await createClient();
    await supabase.from('todos').update({ is_complete }).eq('id', id);
    revalidatePath('/todos');
}

export async function deleteTodo(id: string) {
    const supabase = await createClient();
    await supabase.from('todos').delete().eq('id', id);
    revalidatePath('/todos');
}