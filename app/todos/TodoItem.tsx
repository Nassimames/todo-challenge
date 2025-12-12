'use client';

import { useState } from 'react';
import { updateTodo, deleteTodo, updateTodoDetails } from './actions';
import { Tables } from '@/app/types/supabase';
import { X, Calendar, AlignLeft, Trash2 } from 'lucide-react';

export default function TodoItem({ todo }: { todo: Tables<'todos'> }) {
  const [isOpen, setIsOpen] = useState(false); // État de la popup
  const [isPending, setIsPending] = useState(false);
  
  // États pour l'édition dans la popup
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description || '');

  const imageUrl = todo.image_url 
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/todo-images/${todo.image_url}`
    : null;

  // Clic sur le carré SEULEMENT
  const handleCheck = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche d'ouvrir la popup
    await updateTodo(todo.id, !todo.is_complete);
  };

  // Sauvegarder les modifications
  const handleSave = async () => {
    setIsPending(true);
    await updateTodoDetails(todo.id, editTitle, editDesc);
    setIsPending(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* --- LA CARTE (LISTE) --- */}
      <li 
        onClick={() => setIsOpen(true)} // Clic sur la carte -> Ouvre Popup
        className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
      >
        {/* Checkbox isolée */}
        <div 
            onClick={handleCheck}
            className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                ${todo.is_complete ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-500'}
            `}
        >
            {todo.is_complete && <span className="text-white text-xs">✓</span>}
        </div>

        <div className="flex-1">
            <span className={`font-medium text-gray-800 ${todo.is_complete ? 'line-through text-gray-400' : ''}`}>
                {todo.title}
            </span>
        </div>

        {/* Petite vignette image si existe */}
        {imageUrl && (
            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} className="w-full h-full object-cover" alt="task" />
            </div>
        )}
      </li>

      {/* --- LA POPUP (MODALE) --- */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Popup */}
            <div className="p-4 border-b flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Détails de la tâche</span>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                    <X size={20} />
                </button>
            </div>

            {/* Contenu Scrollable */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
                
                {/* Image en grand */}
                {imageUrl && (
                    <div className="mb-6 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageUrl} className="w-full h-auto object-cover" alt="Detail" />
                    </div>
                )}

                {/* Champs Editables */}
                <div className="space-y-4">
                    <div>
                        <input 
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full text-2xl font-bold text-gray-900 outline-none placeholder:text-gray-300"
                            placeholder="Titre de la tâche"
                        />
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <AlignLeft className="text-gray-400 mt-1" size={20} />
                        <textarea 
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="w-full h-32 resize-none text-gray-600 outline-none placeholder:text-gray-400 leading-relaxed"
                            placeholder="Ajouter une description plus détaillée..."
                        />
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-gray-50 flex justify-between items-center">
                <button 
                    onClick={async () => {
                        if(confirm('Supprimer ?')) await deleteTodo(todo.id);
                    }}
                    className="text-red-500 hover:bg-red-100 p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition"
                >
                    <Trash2 size={16} /> Supprimer
                </button>

                <div className="flex gap-2">
                    <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">
                        Annuler
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={isPending}
                        className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50"
                    >
                        {isPending ? 'Sauvegarde...' : 'Enregistrer'}
                    </button>
                </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}