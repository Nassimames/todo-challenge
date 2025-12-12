import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-gray-50 text-center">
      <div className="max-w-2xl animate-fade-in-up">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-600 mb-6 tracking-tight">
          Organisez votre artisanat.
        </h1>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          Bienvenue sur l'espace de démonstration <span className="font-semibold text-black"> Task</span>. 
          Une application conçue pour allier productivité moderne et simplicité.
          Gérez vos tâches, sécurisez vos idées, et avancez sereinement.
        </p>

        <div className="flex gap-4 justify-center">
            <Link 
                href="/todos"
                className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
                Commencer maintenant →
            </Link>
             <Link 
                href="https://github.com/Nassimames/todo-challenge" // Optionnel
                className="bg-white text-black border border-gray-200 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all"
            >
                Voir le code
            </Link>
        </div>
      </div>
    </main>
  );
}