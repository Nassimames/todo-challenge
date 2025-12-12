import Link from 'next/link';
// 👇 CORRECTION ICI (Ajout de /app)
import { createClient } from '@/app/utils/supabase/server'; 
import UserMenu from './UserMenu';
import NavBar from './NavBar';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b bg-white/80 backdrop-blur sticky top-0 z-50">
      <Link href="/" className="font-bold text-2xl flex items-center gap-2">
         TaskFlow
      </Link>

      <NavBar />
      
      <div className="flex items-center gap-4">
        {user ? (
          <UserMenu user={user} />
        ) : (
          <Link href="/login" className="bg-black text-white px-5 py-2 rounded-full text-sm">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}