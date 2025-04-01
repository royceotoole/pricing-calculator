'use client'

import React, { useEffect } from 'react'
import { useCalculator } from '../context/CalculatorContext'

/**
 * This is a hidden component that logs the detailed price data to the console.
 * It's useful for debugging and confirming that the TypeForm integration will work correctly.
 * This component doesn't render anything visible on the page.
 */
export default function PriceDataLogger() {
  const { 
    location, 
    totalSize, 
    secondStorySize, 
    mainFloorSize, 
    isEarlyAdopter,
    detailedPriceBreakdown,
    getPriceDataForTypeForm
  } = useCalculator()

  // Log the detailed price data whenever it changes
  useEffect(() => {
    if (detailedPriceBreakdown) {
      console.log('Detailed Price Breakdown:', detailedPriceBreakdown)
      console.log('TypeForm Data:', getPriceDataForTypeForm())
    }
  }, [detailedPriceBreakdown, getPriceDataForTypeForm])

  // This component doesn't render anything visible
  return null
} 