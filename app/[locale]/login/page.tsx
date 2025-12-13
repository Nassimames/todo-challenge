'use client'

import { useState } from 'react'
import { login, signup, signInWithGoogle, forgotPassword } from './actions'
import { useTranslations } from 'next-intl'; // <--- IMPORT DU HOOK

export default function LoginPage() {
  const [isLoginView, setIsLoginView] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  
  // Charge les traductions de la section "Auth"
  const t = useTranslations('Auth'); 

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)

    const action = isLoginView ? login : signup
    const result = await action(formData)

    if ('error' in result && result.error) {
      // Note: Idéalement, les erreurs serveur devraient aussi être des clés de traduction
      // Mais pour l'instant, on affiche ce que le serveur renvoie.
      setMessage(result.error) 
    } else if ('success' in result && result.success && 'message' in result && result.message) {
      setMessage(result.message)
    }
    
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md animate-fade-in-up">
        
        {/* --- ONGLETS (TABS) --- */}
        <div className="flex mb-6 border-b">
          <button
            onClick={() => { setIsLoginView(true); setMessage(null) }}
            className={`flex-1 pb-2 text-center transition-colors ${isLoginView ? 'border-b-2 border-black font-bold text-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {t('tabLogin')}
          </button>
          <button
            onClick={() => { setIsLoginView(false); setMessage(null) }}
            className={`flex-1 pb-2 text-center transition-colors ${!isLoginView ? 'border-b-2 border-black font-bold text-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {t('tabSignup')}
          </button>
        </div>

        <h2 className="text-xl font-bold text-center mb-6 text-gray-900">
          {isLoginView ? t('loginTitle') : t('signupTitle')}
        </h2>
        
        {/* --- BOUTON GOOGLE --- */}
        <button
          onClick={() => signInWithGoogle()}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 p-2.5 rounded-lg hover:bg-gray-50 transition mb-4 font-medium text-sm"
          type="button"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
          {t('googleBtn')}
        </button>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-gray-400 text-xs font-bold uppercase">{t('or')}</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* --- FORMULAIRE DYNAMIQUE --- */}
        <form action={handleSubmit} className="flex flex-col gap-4">
          
          {/* Champ Nom (Seulement si Inscription) */}
          {!isLoginView && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('nameLabel')}</label>
              <input 
                name="fullName" 
                type="text" 
                required 
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition" 
                placeholder={t('namePlaceholder')} 
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('emailLabel')}</label>
            <input 
                name="email" 
                type="email" 
                required 
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition" 
                placeholder={t('emailPlaceholder')} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('passwordLabel')}</label>
            <input 
                name="password" 
                type="password" 
                required 
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition" 
                placeholder={t('passwordPlaceholder')} 
            />
          </div>

          {/* MESSAGE D'ERREUR OU SUCCÈS */}
          {message && (
            <div className={`p-3 rounded-lg text-sm font-medium ${message.includes('succès') || message.includes('Vérifiez') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-2.5 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed mt-2 transition shadow-lg hover:shadow-xl"
          >
            {loading ? t('loading') : (isLoginView ? t('loginBtn') : t('signupBtn'))}
          </button>
          
          {/* Lien Forgot Password */}
          {isLoginView && (
            <button 
                type="submit" 
                formAction={async (formData) => {
                    const res = await forgotPassword(formData)
                    if (res?.error) setMessage(res.error)
                    // Utilise la traduction JSON pour le succès si possible, ou le message serveur
                    if (res?.message) setMessage(t('successSent')) 
                }}
                className="text-xs text-gray-500 hover:text-black text-center hover:underline mt-4 w-full transition"
            >
                {t('forgotLink')}
            </button>
          )}

        </form>
      </div>
    </div>
  )
}