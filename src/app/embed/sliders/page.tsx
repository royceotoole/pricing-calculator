'use client'

import React from 'react'
import SliderControls from '../../../components/SliderControls'
import { useCalculator } from '../../context/CalculatorContext'

export default function SlidersEmbed() {
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
    <div className="p-4">
      <SliderControls />
      
      {/* Custom Proposal Button */}
      <div className="mt-8">
        <button 
          className="w-full py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-['NeueHaasGroteskDisplayPro']"
          onClick={openTypeform}
        >
          Get your custom proposal
        </button>
      </div>
    </div>
  )
} 