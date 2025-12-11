'use client'

import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Oups ! Erreur dauthentification</h1>
        <p className="text-gray-600 mb-6">
          Le lien de connexion est invalide ou a expiré. Cela arrive souvent si :
        </p>
        <ul className="text-left text-sm text-gray-500 list-disc pl-5 mb-6">
          <li>Vous avez cliqué deux fois sur le lien.</li>
          <li>Le lien a été ouvert dans un autre navigateur.</li>
          <li>Le délai de sécurité est dépassé.</li>
        </ul>
        <Link 
          href="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Retourner à la connexion
        </Link>
      </div>
    </div>
  )
}