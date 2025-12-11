import Link from 'next/link';
import { createClient } from '@/app/utils/supabase/server';
import { signOut } from '@/app/login/actions'; // Ton action de déconnexion

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="flex justify-between items-center p-4 border-b bg-white shadow-sm">
      <Link href="/" className="font-bold text-xl">
        📝 GoBeldi Task
      </Link>
      
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:block">
              {user.email}
            </span>
            <form action={signOut}>
              <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm">
                Se déconnecter
              </button>
            </form>
          </div>
        ) : (
          <Link 
            href="/login" 
            className="bg-black text-white px-4 py-2 rounded text-sm"
          >
            Se connecter
          </Link>
        )}
      </div>
    </nav>
  );
}