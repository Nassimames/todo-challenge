'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function SearchBar({ placeholder }: { placeholder: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus automatique quand on ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Fermer si on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // On ferme seulement si le champ est vide
        if (!inputRef.current?.value) setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set('query', term);
    else params.delete('query');
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div ref={containerRef} className={`relative flex items-center transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-10'}`}>
      
      {/* ICÔNE DE RECHERCHE (Déclencheur) */}
      <div 
        onClick={() => setIsOpen(true)}
        className={`absolute left-0 z-10 p-2 rounded-full cursor-pointer transition-colors ${isOpen ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        <Search size={20} />
      </div>

      {/* CHAMP INPUT (Animé) */}
      <input
        ref={inputRef}
        className={`
            w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-8 text-sm outline-none 
            transition-all duration-300 origin-right
            ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-x-0 cursor-none pointer-events-none'}
        `}
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />

      {/* CROIX POUR FERMER/EFFACER */}
      {isOpen && (
        <button 
            onClick={() => {
                handleSearch(''); // Vide la recherche
                if(inputRef.current) inputRef.current.value = '';
                setIsOpen(false); // Ferme
            }}
            className="absolute right-2 text-gray-400 hover:text-gray-600"
        >
            <X size={16} />
        </button>
      )}
    </div>
  );
}