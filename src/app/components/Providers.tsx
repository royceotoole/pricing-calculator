'use client'

import { CalculatorProvider } from '../context/CalculatorContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return <CalculatorProvider>{children}</CalculatorProvider>
} 