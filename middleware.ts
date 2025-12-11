import { type NextRequest } from "next/server";
// Importe la logique depuis ton fichier proxy
import { updateSession } from "@/app/utils/supabase/proxy"; 

export async function middleware(request: NextRequest) {
  // C'est ici qu'on active le proxy
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Applique le middleware à toutes les routes SAUF :
     * - les fichiers statiques (_next/static, _next/image)
     * - le favicon.ico
     * - les images (svg, png, jpg...)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};