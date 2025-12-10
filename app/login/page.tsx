export default function LoginPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Connectez-vous</h1>
        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Se connecter avec Google
        </button>
      </div>
    );
  }