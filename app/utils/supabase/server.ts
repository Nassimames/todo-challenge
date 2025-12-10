import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // 1. Récupération du "sac à cookies" du navigateur.
  // Note : C'est 'await' car dans Next.js 15/16, l'accès aux cookies est asynchrone.
  const cookieStore = await cookies()

  // 2. Création de l'instance Supabase configurée pour le Serveur
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, 
    {
      // 3. Configuration de l'adaptateur de Cookies
      // C'est ici qu'on explique à Supabase comment lire/écrire dans Next.js
      cookies: {
        // A. LECTURE : Supabase demande "Donne-moi tous les cookies"
        // pour vérifier si un utilisateur est connecté (token de session).
        getAll() {
          return cookieStore.getAll()
        },
        
        // B. ÉCRITURE : Supabase demande "Enregistre ces nouveaux cookies"
        // (par exemple quand il rafraîchit une session qui va expirer).
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // C. GESTION D'ERREUR SPÉCIFIQUE NEXT.JS
            // Parfois, ce code est appelé depuis un "Server Component" qui n'a pas
            // le droit d'écrire des cookies (il peut juste lire).
            // On ignore l'erreur volontairement car le Middleware s'occupera
            // de rafraîchir la session si besoin.
          }
        },
      },
    }
  )
}