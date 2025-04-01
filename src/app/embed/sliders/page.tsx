'use client'

import React from 'react'
import SliderControls from '../../../components/SliderControls'
import { useCalculator } from '../../context/CalculatorContext'
import { getTypeformUrl, isDevelopment } from '../../../config/typeform'

export default function SlidersEmbed() {
  const { 
    estimatedPrice, 
    totalSize, 
    location, 
    isEarlyAdopter, 
    mainFloorSize, 
    secondStorySize,
    getPriceDataForTypeForm
  } = useCalculator()

  const openTypeform = () => {
    // Get all data from context
    const typeformData = getPriceDataForTypeForm();
    
    // Convert to URL parameters
    const typeformParams = new URLSearchParams({
      // Location details
      'province': typeformData.location,
      
      // Size details (using display values based on selected floor area type)
      'total_size': typeformData.totalSize.toString(),
      'main_floor_size': typeformData.mainFloorSize.toString(),
      'second_floor_size': typeformData.secondStorySize.toString(),
      'floor_area_type': typeformData.floorAreaType,
      
      // Price details
      'base_price': typeformData.baseEstimate.toString(),
      'price_per_sqft': Math.round(typeformData.baseEstimate / typeformData.totalSize).toString(),
      
      // Additional costs
      'foundation_estimate': typeformData.foundationEstimate.toString(),
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
      
      // Add embed source
      'source': 'embed-sliders'
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
    <div className="p-4">
      <SliderControls />
      
      {/* Custom Proposal Button */}
      <div className="mt-8">
        <button 
          className="w-full py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-['NeueHaasGroteskDisplayPro']"
          style={{ letterSpacing: "0.01em" }}
          onClick={openTypeform}
        >
          Get your custom proposal
        </button>
      </div>
    </div>
  )
} 