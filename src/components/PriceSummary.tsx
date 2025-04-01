'use client'

import React from 'react'
import { useCalculator } from '../app/context/CalculatorContext'
import InfoIcon from './InfoIcon'
import { getTypeformUrl, isDevelopment } from '../config/typeform'

interface PriceSummaryProps {
  className?: string;
  showButton?: boolean;
}

export default function PriceSummary({ className = '', showButton = true }: PriceSummaryProps) {
  const { estimatedPrice, totalSize, location, isEarlyAdopter, getPriceDataForTypeForm, displayTotalSize } = useCalculator()
  
  const openTypeform = () => {
    // Get all data from context
    const typeformData = getPriceDataForTypeForm();
    
    // Convert to URL parameters
    const typeformParams = new URLSearchParams({
      // Location details
      'province': typeformData.location,
      
      // Size details (always in gross sqft regardless of toggle)
      'total_size': typeformData.totalSize.toString(),
      'main_floor_size': typeformData.mainFloorSize.toString(),
      'second_floor_size': typeformData.secondStorySize.toString(),
      
      // Display size values (what the user sees based on toggle)
      'display_total_size': typeformData.displayTotalSize.toString(),
      'display_main_floor_size': typeformData.displayMainFloorSize.toString(),
      'display_second_floor_size': typeformData.displaySecondStorySize.toString(),
      
      // Which floor area type was toggled
      'floor_area_type': typeformData.floorAreaType,
      
      // Price details - simplified
      'base_price': typeformData.baseEstimate.toString(),
      'price_per_sqft': Math.round(typeformData.baseEstimate / typeformData.totalSize).toString(),
      
      // Additional costs - simplified to only final values
      'foundation_estimate': typeformData.foundationEstimate.toString(),
      'appliances_estimate_min': typeformData.appliancesEstimateMin.toString(),
      'appliances_estimate_max': typeformData.appliancesEstimateMax.toString(),
      'delivery_estimate': typeformData.deliveryEstimate.toString(),
      'electrical_hookup_estimate': typeformData.electricalHookupEstimate.toString(),
      'sewer_water_septic_min': typeformData.sewerWaterSepticEstimateMin.toString(),
      'sewer_water_septic_max': typeformData.sewerWaterSepticEstimateMax.toString(),
      'permit_fees_estimate': typeformData.permitFeesEstimate.toString(),
      
      // Total estimates
      'grand_total_min': typeformData.grandTotalMin.toString(),
      'grand_total_max': typeformData.grandTotalMax.toString(),
      'grand_total_average': typeformData.grandTotalAverage.toString(),
      
      // Early adopter status
      'early_adopter': typeformData.isEarlyAdopter ? 'Yes' : 'No',
      
      // Add source
      'source': 'price_summary'
    }).toString();
    
    // Show parameter log in development
    if (isDevelopment) {
      console.log('TypeForm Parameters:', Object.fromEntries(new URLSearchParams(typeformParams)));
    }
    
    // Get the full TypeForm URL from config
    const typeformUrl = getTypeformUrl(typeformParams);
    
    // Open TypeForm in a new tab
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
          <span className="mono-display-gray">${Math.round(estimatedPrice / displayTotalSize)}/SQFT</span>
          
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