import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo Challenge",
  description: "Challenge technique Supabase + Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {/* --- DÉBUT DE LA NAVBAR (Le Cadre) --- */}
        <nav className="border-b border-gray-200 p-4 flex justify-between items-center bg-white shadow-sm">
          <Link href="/" className="font-bold text-xl text-gray-800 flex items-center gap-2">
            📝 Todo Challenge
          </Link>

          {/* Les liens de navigation */}
          <div className="space-x-4">
            <Link href="/" className="text-gray-600 hover:text-black transition-colors">
              Accueil
            </Link>
            
            <Link 
              href="/login" 
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </nav>
        {/* --- FIN DE LA NAVBAR --- */}

        <main className="max-w-4xl mx-auto p-4">
          {children}
        </main>
        
      </body>
    </html>
  );
}