'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from '@/app/[locale]/login/actions';
import { User } from '@supabase/supabase-js';

import { useTranslations } from 'next-intl'; // <--- IMPORT

export default function UserMenu({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Header'); // <--- Section Header

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold hover:bg-gray-800 transition shadow-sm border-2 border-transparent focus:border-blue-500 outline-none"
      >
        {initial}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            {/* Traduction ici */}
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{t('connectedAs')}</p>
            <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          
          <div className="py-1">
            <form action={signOut}>
              <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2 group">
                <span className="group-hover:-translate-x-1 transition-transform">🚪</span> 
                {t('logout')} {/* Traduction */}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}