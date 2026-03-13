import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'PropData.es — Inteligencia Inmobiliaria para Profesionales',
  description: 'Datos de 5,000+ parcelas en Costa del Sol y Costa Blanca. Informacion urbanistica, propietarios, valores estimados. La herramienta que usan los mejores agentes inmobiliarios de Espana.',
  keywords: 'datos inmobiliarios, parcelas espana, informacion urbanistica, costa del sol, costa blanca, inmobiliaria datos, propdata',
  openGraph: {
    title: 'PropData.es — Inteligencia Inmobiliaria',
    description: 'Datos de 5,000+ parcelas. La ventaja competitiva de los mejores agentes.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
