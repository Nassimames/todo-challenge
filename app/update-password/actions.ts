'use server'

import { createClient } from '@/app/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  // 1. D'ABORD : Vérifions si Supabase sait qui est connecté
  const { data: { user } } = await supabase.auth.getUser()
  console.log("👤 Utilisateur connecté pour update :", user?.email || "AUCUN")

  if (!user) {
    return { error: "Session expirée. Veuillez recliquer sur le lien email." }
  }

  // 2. Ensuite la mise à jour
  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    console.error("🔴 Erreur Supabase :", error.message) // Affiche l'erreur dans ton terminal
    return { error: error.message } // Renvoie la vraie erreur à l'écran
  }

  return { success: true, message: "Mot de passe mis à jour avec succès !" }
  // SUCCÈS : On redirige directement vers l'accueil (Dashboard)
redirect('/') 
}