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
      
      // Price details
      'base_price': typeformData.baseEstimate.toString(),
      'price_per_sqft': Math.round(typeformData.baseEstimate / typeformData.totalSize).toString(),
      
      // Base price breakdown - now included
      'base_price_only': typeformData.detailedPriceBreakdown?.basePrice.toString() || '',
      'main_floor_cost': typeformData.detailedPriceBreakdown?.mainFloorCost.toString() || '',
      'second_floor_cost': typeformData.detailedPriceBreakdown?.secondFloorCost.toString() || '',
      'provincial_multiplier': typeformData.detailedPriceBreakdown?.provincialMultiplier.toString() || '',
      'early_adopter_discount': typeformData.detailedPriceBreakdown?.earlyAdopterDiscount.toString() || '',
      
      // Additional costs
      'foundation_estimate': typeformData.foundationEstimate.toString(),
      'foundation_bearing_piles': typeformData.detailedPriceBreakdown?.additionalCosts.foundation.bearingPiles.quantity.toString() || '',
      'foundation_bracing_piles': typeformData.detailedPriceBreakdown?.additionalCosts.foundation.bracingPiles.quantity.toString() || '',
      
      // Appliance costs - now included
      'appliances_estimate_min': typeformData.appliancesEstimateMin.toString(),
      'appliances_estimate_max': typeformData.appliancesEstimateMax.toString(),
      
      // Delivery breakdown - now included
      'delivery_estimate': typeformData.deliveryEstimate.toString(),
      'delivery_containers': typeformData.detailedPriceBreakdown?.additionalCosts.delivery.containers.quantity.toString() || '',
      'delivery_distance_km': typeformData.detailedPriceBreakdown?.additionalCosts.delivery.distance.km.toString() || '',
      
      // Remaining costs
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