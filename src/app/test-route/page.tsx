'use client'

import React from 'react'
import Link from 'next/link'

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Route Page</h1>
      <p className="mb-4">If you can see this page, Next.js routing is working correctly.</p>
      <div className="space-y-4">
        <p><Link href="/" className="text-blue-500 underline">Go to Home Page</Link></p>
        <p><Link href="/calculator" className="text-blue-500 underline">Go to Calculator Page</Link></p>
      </div>
    </div>
  )
} 