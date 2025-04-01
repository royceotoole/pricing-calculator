'use client'

import React from 'react'
import { Inter } from 'next/font/google'
import { CalculatorProvider } from '../context/CalculatorContext'
import '../globals.css'

// Use Inter font
const inter = Inter({ subsets: ['latin'] })

/**
 * Special layout for embedded calculators
 * This version has minimal UI and is meant to be embedded in iframes
 */
export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-transparent`}>
        <CalculatorProvider>
          <div className="font-['NeueHaasGroteskDisplayPro']" style={{ letterSpacing: "0.01em" }}>
            {children}
          </div>
        </CalculatorProvider>
      </body>
    </html>
  )
} 