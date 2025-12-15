import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

export async function middleware(request: NextRequest) {
  // 1. Créer la réponse de base avec next-intl (gestion de la langue)
  const handleI18nRouting = createMiddleware({
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    localePrefix: 'always'
  });
  
  const response = handleI18nRouting(request);

  // 2. Créer le client Supabase pour gérer la session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            // C'est ici qu'on injecte les cookies Supabase dans la réponse i18n
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 3. Rafraîchir la session (important pour ne pas être déconnecté)
  // On ignore le résultat 'user', on veut juste que le cookie se mette à jour si besoin
  await supabase.auth.getUser();

  // 4. Retourner la réponse fusionnée
  return response;
}

export const config = {
  // Le matcher qui ignore les fichiers internes, les images, et le dossier auth
  matcher: ["/((?!api|_next|auth|.*\\..*).*)"],
};