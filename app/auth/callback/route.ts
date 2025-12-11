import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // 1. On parse l'URL pour récupérer le "Code" que Google ou l'Email nous envoie
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // "next" sert à savoir où aller après (ex: /dashboard ou /update-password)
  const next = searchParams.get('next') ?? '/'

  if (code) {
    // 2. On initialise Supabase
    const supabase = await createClient()
    
    // 3. ÉCHANGE DE CODE (PKCE Flow)
    // C'est l'étape CRITIQUE : on échange le code temporaire contre une Session sécurisée.
    // Cette session est ensuite stockée automatiquement dans les Cookies par Supabase.
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 4. Gestion de l'environnement (Local vs Production)
      // C'est nécessaire car en Prod, on passe souvent par un Proxy (Vercel/Cloudflare)
      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // 5. Si le code est invalide ou expiré
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}