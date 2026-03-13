import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://propdata-ten.vercel.app'),
  title: 'PropData.es — Inteligencia Inmobiliaria para Profesionales',
  description: 'Datos de 5,000+ parcelas en Costa del Sol y Costa Blanca. Informacion urbanistica, propietarios, valores estimados. La herramienta que usan los mejores agentes inmobiliarios de Espana.',
  keywords: 'datos inmobiliarios, parcelas espana, informacion urbanistica, costa del sol, costa blanca, inmobiliaria datos, propdata',
  openGraph: {
    title: 'PropData.es — Inteligencia Inmobiliaria',
    description: 'Datos de 5,000+ parcelas. La ventaja competitiva de los mejores agentes.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'PropData.es',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropData.es — Inteligencia Inmobiliaria',
    description: 'Datos de 5,000+ parcelas en Costa del Sol y Costa Blanca.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'PropData.es',
              applicationCategory: 'BusinessApplication',
              description: 'Inteligencia inmobiliaria para profesionales. Datos de 5,000+ parcelas en Costa del Sol y Costa Blanca.',
              operatingSystem: 'Web',
              offers: [
                { '@type': 'Offer', name: 'Explorer', price: '49', priceCurrency: 'EUR' },
                { '@type': 'Offer', name: 'Pro', price: '149', priceCurrency: 'EUR' },
                { '@type': 'Offer', name: 'Enterprise', price: '499', priceCurrency: 'EUR' },
              ],
            }),
          }}
        />
      </body>
    </html>
  )
}
