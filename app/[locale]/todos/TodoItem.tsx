'use client';

import { useState } from 'react';
import { updateTodo, deleteTodo, updateTodoDetails } from './actions';
import { Tables } from '@/app/types/supabase';
import { X, Calendar, AlignLeft, Trash2 } from 'lucide-react';

import { useTranslations } from 'next-intl'; 

export default function TodoItem({ todo }: { todo: Tables<'todos'> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description || '');

  const t = useTranslations('Todos'); // <--- IMPORT TRADUCTIONS

  const imageUrl = todo.image_url 
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/todo-images/${todo.image_url}`
    : null;

  const handleCheck = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await updateTodo(todo.id, !todo.is_complete);
  };

  const handleSave = async () => {
    setIsPending(true);
    await updateTodoDetails(todo.id, editTitle, editDesc);
    setIsPending(false);
    setIsOpen(false);
  };

  return (
    <>
      <li 
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
      >
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

        {imageUrl && (
            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} className="w-full h-full object-cover" alt="task" />
            </div>
        )}
      </li>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-4 border-b flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {t('detailsTitle')} {/* Traduit */}
                </span>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                    <X size={20} />
                </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
                {imageUrl && (
                    <div className="mb-6 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageUrl} className="w-full h-auto object-cover" alt="Detail" />
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <input 
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full text-2xl font-bold text-gray-900 outline-none placeholder:text-gray-300"
                        />
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <AlignLeft className="text-gray-400 mt-1" size={20} />
                        <textarea 
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="w-full h-32 resize-none text-gray-600 outline-none placeholder:text-gray-400 leading-relaxed"
                            placeholder={t('placeholderDesc')}
                        />
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 flex justify-between items-center">
                <button 
                    onClick={async () => {
                        if(confirm(t('confirmDelete'))) await deleteTodo(todo.id);
                    }}
                    className="text-red-500 hover:bg-red-100 p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition"
                >
                    <Trash2 size={16} /> {t('delete')}
                </button>

                <div className="flex gap-2">
                    <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">
                        {t('cancel')}
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={isPending}
                        className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50"
                    >
                        {isPending ? t('saving') : t('save')}
                    </button>
                </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}