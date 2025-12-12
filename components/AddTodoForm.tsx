'use client';
import { useState } from 'react';
import { addTodo } from '@/app/todos/actions';
import { ImagePlus, Loader2 } from 'lucide-react'; // Installe lucide-react si besoin

export default function AddTodoForm() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form 
      action={async (formData) => {
        setLoading(true);
        await addTodo(formData);
        setLoading(false);
        setFileName(null); // Reset
        // Reset du formulaire via HTML form reset si besoin
        (document.getElementById('add-form') as HTMLFormElement)?.reset();
      }} 
      id="add-form"
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8"
    >
      <div className="flex flex-col gap-3">
        <input
          name="title"
          type="text"
          placeholder="Nouvelle tâche..."
          className="w-full text-lg font-medium outline-none placeholder:text-gray-400"
          required
        />
        <input
          name="description"
          type="text"
          placeholder="Ajouter une description (optionnel)"
          className="w-full text-sm text-gray-500 outline-none pb-2 border-b border-gray-100 focus:border-black transition"
        />
        
        <div className="flex justify-between items-center mt-2">
            {/* BOUTON FICHIER CUSTOM */}
            <label className={`
                flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition
                ${fileName ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
            `}>
                <ImagePlus size={16} />
                {fileName ? fileName : "Ajouter une image"}
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

            <button disabled={loading} className="bg-black text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" /> : 'Ajouter'}
            </button>
        </div>
      </div>
    </form>
  );
}