'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  const linkStyle = (path: string) => `
    px-4 py-2 rounded-full transition-all text-sm font-medium
    ${pathname === path ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}
  `;

  return (
    <div className="flex bg-gray-100 p-1 rounded-full">
      <Link href="/" className={linkStyle('/')}>
        Home
      </Link>
      <Link href="/todos" className={linkStyle('/todos')}>
        Mes Tâches
      </Link>
    </div>
  );
}