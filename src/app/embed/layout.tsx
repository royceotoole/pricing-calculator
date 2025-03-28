'use client'

import React from 'react'
import { Inter } from 'next/font/google'
import { CalculatorProvider } from '../context/CalculatorContext'
import '../globals.css'

// Use Inter font
const inter = Inter({ subsets: ['latin'] })

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-transparent`}>
        <CalculatorProvider>
          <div className="font-['NeueHaasGroteskDisplayPro']">
            {children}
          </div>
        </CalculatorProvider>
      </body>
    </html>
  )
} 