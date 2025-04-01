import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './components/Providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Build Price Estimator',
  description: 'Calculate your custom home building costs',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <link rel="preload" href="/fonts/SuisseIntlMono-Regular.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/QuadrantText-Light.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/NeueHaasGroteskDisplayPro55Roman.woff" as="font" type="font/woff" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} bg-gray-50`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 