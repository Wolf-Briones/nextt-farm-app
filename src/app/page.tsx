import Globe from "@/components/earth/Globe";

export default function Home() {
  return (
    <main className="h-screen w-full flex flex-col items-center justify-center bg-black text-white">
      
      {/* Globo con universo de fondo */}
      <div className="w-full h-[500px]">
        <Globe />
      </div>

      {/* Botón */}
      <button className="mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-2xl shadow-lg hover:scale-105 transition-transform">
        Explorar 🚀 Challenge NASA 2025
      </button>
    </main>
  );
}
