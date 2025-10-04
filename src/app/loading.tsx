export default function Loading() {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border border-blue-400 opacity-20"></div>
        </div>
        <div className="text-white text-xl font-semibold">
          Explorando SPACE FARM
        </div>
        <div className="text-blue-300 text-sm">
          Inicializando sistema...
        </div>
      </div>
    </div>
  )
}