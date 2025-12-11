'use client'

import { useRouter } from 'next/navigation'
import { updatePassword } from './actions'
import { useState } from 'react'
import { useEffect } from 'react'

export default function UpdatePasswordPage() {
  const [message, setMessage] = useState('')
  const router = useRouter() // <--- Ajout

  // Ajoute cet effet pour surveiller le message
  useEffect(() => {
    if (message.includes('succès')) {
      // On attend 2 secondes, puis on part à l'accueil
      const timer = setTimeout(() => {
        router.push('/') 
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [message, router])
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">Nouveau mot de passe</h1>
        <form action={async (formData) => {
            const res = await updatePassword(formData)
            setMessage(res?.message || res?.error || '')
        }}>
          <label className="block mb-2 text-sm text-gray-700">Choisissez votre nouveau mot de passe</label>
          <input 
            name="password" 
            type="password" 
            required 
            className="w-full border p-2 rounded mb-4" 
            placeholder="••••••"
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            Mettre à jour
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm font-bold text-blue-600">{message}</p>}
      </div>
    </div>
  )
}