'use client'

import React, { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useCalculator } from '../../context/CalculatorContext'

// Dynamically import the House3D component with no SSR
const House3D = dynamic(() => import('../../components/House3D'), { ssr: false })

export default function ModelEmbed() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { totalSize, secondStorySize } = useCalculator()
  
  // Adjust container height based on width for mobile responsiveness
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        // For square-ish display on mobile
        if (window.innerWidth < 768) {
          const width = containerRef.current.clientWidth
          containerRef.current.style.height = `${width}px`
        } else {
          containerRef.current.style.height = '500px'
        }
      }
    }
    
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  return (
    <div className="p-4 h-full">
      <div 
        ref={containerRef}
        className="w-full bg-gray-100 rounded-lg overflow-hidden relative border border-[rgba(0,0,0,0.08)]"
        style={{ height: '500px' }}
      >
        <House3D />
        
        {/* Display size information overlay */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-80 text-white px-3 py-1 rounded-md text-sm pointer-events-none">
          <div>{totalSize.toLocaleString()} total sqft</div>
          <div>{secondStorySize.toLocaleString()} sqft second floor</div>
        </div>
      </div>
    </div>
  )
} 