'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import { headers } from 'next/headers'

// --- 1. CONNEXION GOOGLE (OAUTH) ---
export async function signInWithGoogle() {
  const supabase = await createClient()
  // On récupère l'origine (ex: http://localhost:3000 ou https://gobeldi.com)
  const origin = (await headers()).get('origin')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Important : C'est ici qu'on dit à Google où renvoyer l'utilisateur
      // après qu'il a cliqué sur son compte. On l'envoie vers notre route API 'callback'.
      redirectTo: `${origin}/auth/callback`, 
    },
  })

  if (error) {
    console.error(error)
    return { error: error.message }
  }

  // Si ça marche, on part chez Google !
  if (data.url) {
    redirect(data.url) 
  }
}

// --- 2. LOGIN CLASSIQUE (EMAIL/PASS) ---
export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Email ou mot de passe incorrect.' }
  }

  // On rafraîchit le cache pour que le Layout sache qu'on est connecté
  revalidatePath('/', 'layout')
  redirect('/')
}

// --- 3. INSCRIPTION (SIGN UP) ---
export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string // Ajout du nom complet
  
  const origin = (await headers()).get('origin')

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Redirection après le clic dans l'email de confirmation
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName, // On stocke le nom dans les méta-données utilisateur
      }
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Inscription réussie ! Vérifiez vos emails pour confirmer.' }
}

// --- 4. MOT DE PASSE OUBLIÉ (NOUVEAU) ---
export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const origin = (await headers()).get('origin')

  // Supabase va envoyer un email avec un lien magique
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // Une fois le lien cliqué, on redirige vers une page pour changer le mot de passe
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  })

  if (error) {
    return { error: "Impossible d'envoyer l'email. Vérifiez l'adresse." }
  }

  return { success: true, message: 'Lien de réinitialisation envoyé par email.' }
}

// --- 5. DÉCONNEXION (SIGN OUT) ---
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}