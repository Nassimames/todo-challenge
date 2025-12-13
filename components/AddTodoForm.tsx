'use client';

import { useState, useRef, useEffect } from 'react';
import { addTodo } from '@/app/[locale]/todos/actions';
import { ImagePlus, Loader2, Plus } from 'lucide-react'; 
import { useTranslations } from 'next-intl';

export default function AddTodoForm() {
  const [isExpanded, setIsExpanded] = useState(false); // <--- NOUVEL ÉTAT
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const t = useTranslations('Todos');

  // Fermer le formulaire si on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        // On ne ferme que si le champ est vide pour ne pas perdre de données
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form 
      ref={formRef}
      action={async (formData) => {
        setLoading(true);
        await addTodo(formData);
        setLoading(false);
        setFileName(null);
        formRef.current?.reset();
        setIsExpanded(false); // On referme après l'envoi
      }} 
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-200 
        transition-all duration-300 ease-in-out overflow-hidden
        ${isExpanded ? 'p-6 ring-2 ring-black/5' : 'p-4 hover:shadow-md cursor-text'}
      `}
      onClick={() => setIsExpanded(true)} // Ouvre au clic
    >
      <div className="flex flex-col gap-3">
        
        {/* CHAMP TITRE (Toujours visible) */}
        <div className="flex items-center gap-3">
            {!isExpanded && <Plus className="text-gray-400" size={20} />}
            <input
            name="title"
            type="text"
            placeholder={t('placeholderTitle')}
            className={`
                w-full font-medium outline-none placeholder:text-gray-500 bg-transparent
                ${isExpanded ? 'text-lg text-black' : 'text-base text-gray-600'}
            `}
            required
            autoComplete="off"
            />
        </div>

        {/* SECTION CACHÉE (Description + Boutons) */}
        {isExpanded && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <input
                    name="description"
                    type="text"
                    placeholder={t('placeholderDesc')}
                    className="w-full text-sm text-gray-600 outline-none mt-3 pb-2 border-b border-gray-100 focus:border-gray-300 transition"
                />
                
                <div className="flex justify-between items-center mt-4">
                    <label className={`
                        flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition
                        ${fileName ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
                    `}>
                        <ImagePlus size={16} />
                        {fileName ? fileName : t('addImage')}
                        <input 
                            type="file" 
                            name="image" 
                            accept="image/*" 
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files?.[0]) setFileName(e.target.files[0].name);
                            }}
                        />
                    </label>

                    <div className="flex gap-2">
                        {/* Bouton Annuler (Optionnel) */}
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(false);
                            }}
                            className="text-gray-400 hover:text-gray-600 text-sm font-medium px-3"
                        >
                            {t('cancel')}
                        </button>

                        <button disabled={loading} className="bg-black text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 disabled:opacity-50 transition-transform active:scale-95">
                            {loading ? <Loader2 className="animate-spin" size={18} /> : t('addBtn')}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </form>
  );
}