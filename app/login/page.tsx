'use client' 

import { useState } from 'react'
import { login, signup, signInWithGoogle , forgotPassword} from './actions'

export default function LoginPage() {
  const [isLoginView, setIsLoginView] = useState(true) // Gestion des onglets
  const [loading, setLoading] = useState(false) // Gestion du chargement
  const [message, setMessage] = useState<string | null>(null) // Gestion des erreurs/succès

  // Fonction générique pour gérer la soumission
  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)

    // On choisit l'action selon la vue (Login ou Signup)
    const action = isLoginView ? login : signup
    
    // On appelle la Server Action
    const result = await action(formData)

    if ('error' in result && result.error) {
      setMessage(result.error) // Affiche l'erreur (ex: "Mot de passe faux")
    } else if ('success' in result && result.success && 'message' in result && result.message) {
      setMessage(result.message) // Affiche le succès (ex: "Vérifiez vos emails")
    }
    
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        
        {/* --- ONGLETS (TABS) --- */}
        <div className="flex mb-6 border-b">
          <button
            onClick={() => { setIsLoginView(true); setMessage(null) }}
            className={`flex-1 pb-2 text-center ${isLoginView ? 'border-b-2 border-blue-600 font-bold' : 'text-gray-500'}`}
          >
            Connexion
          </button>
          <button
            onClick={() => { setIsLoginView(false); setMessage(null) }}
            className={`flex-1 pb-2 text-center ${!isLoginView ? 'border-b-2 border-blue-600 font-bold' : 'text-gray-500'}`}
          >
            Inscription
          </button>
        </div>

        <h2 className="text-xl font-bold text-center mb-6">
          {isLoginView ? 'Content de vous revoir !' : 'Rejoignez  Nous'}
        </h2>
        
        {/* --- BOUTON GOOGLE --- */}
        <button
          onClick={() => signInWithGoogle()}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 p-2 rounded hover:bg-gray-50 transition mb-4"
          type="button"
        >
          {/* SVG Google (Je l'ai raccourci pour la lisibilité ici, garde le tien) */}
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
          Continuer avec Google
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-400 text-sm">OU</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* --- FORMULAIRE DYNAMIQUE --- */}
        <form action={handleSubmit} className="flex flex-col gap-4">
          
          {/* Champ Nom (Seulement si Inscription) */}
          {!isLoginView && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom Complet</label>
              <input name="fullName" type="text" required className="w-full border p-2 rounded mt-1" placeholder="Nassima Mesbah" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" required className="w-full border p-2 rounded mt-1" placeholder="exemple@mail.com" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input name="password" type="password" required className="w-full border p-2 rounded mt-1" placeholder="••••••" />
          </div>

          {/* MESSAGE D'ERREUR OU SUCCÈS */}
          {message && (
            <div className={`p-3 rounded text-sm ${message.includes('succès') || message.includes('Vérifiez') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300 mt-2"
          >
            {loading ? 'Chargement...' : (isLoginView ? 'Se connecter' : "S'inscrire")}
          </button>
          
          {/* Lien Forgot Password (seulement en mode login) */}
          {/* Lien Forgot Password (seulement en mode login) */}
{isLoginView && (
  <button 
    type="submit" 
    formAction={async (formData) => {
        // 1. On appelle la vraie fonction serveur
        const res = await forgotPassword(formData)
        
        // 2. On affiche le résultat (Erreur ou Succès) dans le message
        if (res?.error) setMessage(res.error)
        if (res?.message) setMessage(res.message) // "Lien envoyé !"
    }}
    className="text-xs text-blue-600 text-center hover:underline mt-2 w-full"
  >
    Mot de passe oublié ?
  </button>
)}

        </form>
      </div>
    </div>
  )
}