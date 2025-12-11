import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // On importe le meuble

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GoBeldi Task Manager",
  description: "Challenge Technique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {/* 1. On affiche le Header en haut de toutes les pages */}
        <Header />
        
        {/* 2. On affiche le contenu de la page (Login ou Todos) juste en dessous */}
        <main className="min-h-screen bg-gray-50">
            {children}
        </main>
      </body>
    </html>
  );
}