'use client'

import React from 'react'
import { useCalculator } from '../app/context/CalculatorContext'
import InfoIcon from './InfoIcon'

interface PriceSummaryProps {
  className?: string;
  showButton?: boolean;
}

export default function PriceSummary({ className = '', showButton = true }: PriceSummaryProps) {
  const { estimatedPrice, totalSize, location, isEarlyAdopter } = useCalculator()
  
  const openTypeform = () => {
    // Get all slider values from context
    const typeformParams = new URLSearchParams({
      'province': location,
      'total_size': totalSize.toString(),
      'main_floor_size': (totalSize - totalSize).toString(),
      'second_floor_size': totalSize.toString(),
      'early_adopter': isEarlyAdopter ? 'Yes' : 'No',
      'estimated_price': estimatedPrice.toString(),
      'price_per_sqft': Math.round(estimatedPrice / totalSize).toString()
    }).toString();
    
    // Replace with your actual Typeform URL
    const typeformUrl = `https://form.typeform.com/to/XXXXX?${typeformParams}`;
    window.open(typeformUrl, '_blank');
  };

  return (
    <div className={`${className}`}>
      {/* Price Display */}
      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <span className="text-gray-600">Base Price</span>
            <InfoIcon 
              position="left"
              content={
                <>
                  <p className="text-sm font-bold mb-2">Base Price</p>
                  <p className="text-sm mb-2">
                    Our Base Price includes our entire kit, complete with our Take Place base finish package, premium Fisher & Paykel appliances, white-glove design service, on-site assembly, and MEP trades.
                  </p>
                  <p className="text-sm font-bold mb-2">Extra Costs</p>
                  <p className="text-sm mb-2">
                    We don't include certain items in our Base Price because they can vary significantly based on the specifics of your location, property, and individual preferences. These items are:
                  </p>
                  <ul className="text-sm list-disc pl-5 mb-2">
                    <li>Foundation</li>
                    <li>Delivery</li>
                    <li>Site hookups (electrical, sewer/septic, water)</li>
                    <li>Permit fees</li>
                    <li>Optional add-ons (decks, balconies, built-ins, etc.)</li>
                  </ul>
                  <p className="text-sm mb-2">
                    Typically, these items will add about 10% (+/- 5%) to the Base Price, depending on the factors listed above.
                  </p>
                  <p className="text-sm italic">All prices are before tax.</p>
                </>
              }
            />
          </div>
          <span className="mono-display-large">${estimatedPrice.toLocaleString()}</span>
        </div>
        <div className="text-right flex justify-end items-center">
          <span className="mono-display-gray">${Math.round(estimatedPrice / totalSize)}/SQFT</span>
          
          {/* Cost per SQFT info button */}
          <InfoIcon
            position="right"
            content={
              <>
                <p className="text-sm">Price per sqft is measured to the exterior face of the building.</p>
              </>
            }
          />
        </div>
      </div>

      {/* Book Meeting Button */}
      {showButton && (
        <button 
          className="w-full py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-['NeueHaasGroteskDisplayPro']"
          style={{ letterSpacing: "0.01em" }}
          onClick={openTypeform}
        >
          Get your custom proposal
        </button>
      )}
    </div>
  )
} 