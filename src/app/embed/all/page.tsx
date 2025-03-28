'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import SliderControls from '../../../components/SliderControls'
import { useCalculator } from '../../context/CalculatorContext'

// Dynamically import the House3D component with no SSR
const House3D = dynamic(() => import('../../components/House3D'), { ssr: false })

export default function AllEmbed() {
  const { estimatedPrice, totalSize, location, isEarlyAdopter, mainFloorSize, secondStorySize } = useCalculator()

  const openTypeform = () => {
    // Get all slider values from context
    const typeformParams = new URLSearchParams({
      'province': location,
      'total_size': totalSize.toString(),
      'main_floor_size': mainFloorSize.toString(),
      'second_floor_size': secondStorySize.toString(),
      'early_adopter': isEarlyAdopter ? 'Yes' : 'No',
      'estimated_price': estimatedPrice.toString(),
      'price_per_sqft': Math.round(estimatedPrice / totalSize).toString()
    }).toString();
    
    // Replace with your actual Typeform URL
    const typeformUrl = `https://form.typeform.com/to/XXXXX?${typeformParams}`;
    window.open(typeformUrl, '_blank');
  };

  return (
    <main className="p-4 font-['NeueHaasGroteskDisplayPro']">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slider Controls - DIV 1 */}
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <SliderControls />
          
          {/* Custom Proposal Button */}
          <div className="mt-8">
            <button 
              className="w-full py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-['NeueHaasGroteskDisplayPro']"
              onClick={openTypeform}
            >
              Get your custom proposal
            </button>
            
            {/* Price Display */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-600">Estimated price:</span>
              <span className="mono-display-large">${estimatedPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {/* 3D Model - DIV 2 */}
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden relative border border-[rgba(0,0,0,0.08)]">
            <House3D />
            
            {/* Display size information overlay */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-80 text-white px-3 py-1 rounded-md text-sm pointer-events-none">
              <div>{totalSize.toLocaleString()} total sqft</div>
              <div>{secondStorySize.toLocaleString()} sqft second floor</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 