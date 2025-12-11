'use client';

import { updateTodo, deleteTodo, updateTodoTitle } from './actions';
import { Tables } from '@/app/types/supabase';
import { useState, useRef, useEffect } from 'react';

export default function TodoItem({ todo }: { todo: Tables<'todos'> }) {
  const [isPending, setIsPending] = useState(false);
  
  // --- NOUVEAUX ÉTATS POUR L'ÉDITION ---
  const [isEditing, setIsEditing] = useState(false); // Est-ce qu'on modifie ?
  const [editedTitle, setEditedTitle] = useState(todo.title); // Le texte en cours de modif
  const inputRef = useRef<HTMLInputElement>(null); // Pour mettre le focus automatiquement

  // Quand on passe en mode édition, on met le focus dans l'input
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // 1. UPDATE STATUT (Cocher)
  const handleToggle = async () => {
    if (isEditing) return; // On ne coche pas si on est en train d'écrire
    setIsPending(true);
    await updateTodo(todo.id, !todo.is_complete);
    setIsPending(false);
  };

  // 2. DELETE (Supprimer)
  const handleDelete = async () => {
    if (confirm('Supprimer ?')) {
      setIsPending(true);
      await deleteTodo(todo.id);
    }
  };

  // 3. UPDATE TITRE (Sauvegarder)
  const handleSaveTitle = async () => {
    if (editedTitle.trim() === '') return; // Pas de titre vide
    if (editedTitle === todo.title) {
        setIsEditing(false); // Rien n'a changé, on ferme juste
        return;
    }

    setIsPending(true);
    await updateTodoTitle(todo.id, editedTitle);
    setIsPending(false);
    setIsEditing(false); // On quitte le mode édition
  };

  // Annuler l'édition (Touche Echap ou bouton Annuler)
  const handleCancel = () => {
    setEditedTitle(todo.title); // On remet le vieux titre
    setIsEditing(false);
  };

  return (
    <li 
      className={`
        flex justify-between items-center p-4 rounded-lg border transition-all duration-200
        ${todo.is_complete ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 shadow-sm'}
        ${isPending ? 'opacity-50' : ''}
      `}
    >
      {/* --- ZONE GAUCHE --- */}
      <div className="flex items-center gap-3 flex-1">
        
        {/* CHECKBOX (Cachée en mode édition pour pas gêner) */}
        {!isEditing && (
          <div 
            onClick={handleToggle} 
            className={`text-2xl cursor-pointer ${todo.is_complete ? 'text-green-500' : 'text-gray-300'}`}
          >
            {todo.is_complete ? '✅' : '⬜'} 
          </div>
        )}

        {/* --- LOGIQUE D'AFFICHAGE DU TEXTE --- */}
        {isEditing ? (
          // MODE ÉDITION : Input
          <div className="flex gap-2 flex-1 mr-2">
            <input
              ref={inputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') handleCancel();
              }}
              className="flex-1 border p-1 rounded px-2"
            />
            <button onClick={handleSaveTitle} className="text-xs bg-green-100 text-green-700 px-2 rounded">OK</button>
            <button onClick={handleCancel} className="text-xs bg-gray-100 text-gray-700 px-2 rounded">X</button>
          </div>
        ) : (
          // MODE LECTURE : Texte
          <div className="flex flex-col flex-1 cursor-pointer" onClick={handleToggle}>
            <span className={`font-medium ${todo.is_complete ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {todo.title}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${todo.is_complete ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {todo.is_complete ? 'Terminé' : 'À faire'}
            </span>
          </div>
        )}
      </div>

      {/* --- ZONE DROITE (BOUTONS ACTIONS) --- */}
      {!isEditing && (
        <div className="flex gap-2">
          {/* Bouton Éditer (Crayon) */}
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
            title="Modifier"
          >
            ✏️
          </button>

          {/* Bouton Supprimer (Poubelle) */}
          <button 
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      )}
    </li>
  );
}