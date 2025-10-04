import type { Metadata } from 'next'
import GameLayout from '@/components/game/layout/GameLayout'

export const metadata: Metadata = {
  title: 'Space Farm - Simulador Agrícola Espacial',
  description: 'Simulador avanzado de agricultura espacial para el Challenge NASA 2025',
  keywords: 'space, farm, NASA, agricultura, espacial, simulador, cultivos, investigación',
}

export default function GamePage() {
  return (
    <main className="w-full">
      <GameLayout />
    </main>
  )
}