'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { ProvinceCode, calculatePrice, calculateDetailedPrice, DetailedPriceBreakdown } from '../../data/pricingData'

// Define floor area type - gross or net
export type FloorAreaType = 'gross' | 'net';

// Constants for module sizes
export const MODULE_SIZES = {
  GROSS: 104, // Gross floor area module size
  NET: 96,    // Net floor area module size (approximately 8% less)
};

// Conversion factor from gross to net (approximately 8% less)
export const NET_TO_GROSS_RATIO = 96 / 104; // Approx 0.92

interface CalculatorContextType {
  location: ProvinceCode
  floorAreaType: FloorAreaType
  totalSize: number
  secondStorySize: number
  mainFloorSize: number
  isEarlyAdopter: boolean
  estimatedPrice: number
  detailedPriceBreakdown: DetailedPriceBreakdown | null
  setLocation: (location: ProvinceCode) => void
  setFloorAreaType: (areaType: FloorAreaType) => void
  setTotalSize: (size: number) => void
  setSecondStorySize: (size: number) => void
  setMainFloorSize: (size: number) => void
  setIsEarlyAdopter: (isEarlyAdopter: boolean) => void
  getPriceDataForTypeForm: () => TypeFormPriceData
  moduleSize: number // Current module size based on area type
  
  // Display values (what the user sees, based on floor area type)
  displayTotalSize: number
  displaySecondStorySize: number
  displayMainFloorSize: number
}

// Structure for data to be sent to TypeForm
export interface TypeFormPriceData {
  location: ProvinceCode
  floorAreaType: FloorAreaType
  totalSize: number
  secondStorySize: number
  mainFloorSize: number
  displayTotalSize: number
  displaySecondStorySize: number
  displayMainFloorSize: number
  isEarlyAdopter: boolean
  baseEstimate: number
  foundationEstimate: number
  appliancesEstimateMin: number
  appliancesEstimateMax: number
  deliveryEstimate: number
  electricalHookupEstimate: number
  sewerWaterSepticEstimateMin: number
  sewerWaterSepticEstimateMax: number
  permitFeesEstimate: number
  grandTotalMin: number
  grandTotalMax: number
  grandTotalAverage: number
  detailedPriceBreakdown: DetailedPriceBreakdown | null
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined)

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<ProvinceCode>('MB')
  // Track floor area type (gross or net)
  const [floorAreaType, setFloorAreaType] = useState<FloorAreaType>('gross')
  // Default total size is 2,080 sq ft (20 x 104 sqft)
  const [totalSize, setTotalSize] = useState<number>(2080)
  // Default second story is 1,040 sq ft (half of total, 10 x 104 sqft)
  const [secondStorySize, setSecondStorySize] = useState<number>(1040)
  // Main floor size is derived from total - second story
  const [mainFloorSize, setMainFloorSize] = useState<number>(1040)
  // Early adopter toggle
  const [isEarlyAdopter, setIsEarlyAdopter] = useState<boolean>(false)
  // Store detailed price breakdown
  const [detailedPriceBreakdown, setDetailedPriceBreakdown] = useState<DetailedPriceBreakdown | null>(null)

  // Determine the current module size based on floor area type - for UI only
  const moduleSize = floorAreaType === 'gross' ? MODULE_SIZES.GROSS : MODULE_SIZES.NET;

  // Keep mainFloorSize in sync when total or second story changes
  useEffect(() => {
    const newMainFloorSize = totalSize - secondStorySize
    setMainFloorSize(newMainFloorSize)
  }, [totalSize, secondStorySize])

  // Calculate display values based on floor area type
  // These are used only for display and don't affect the actual configuration
  const displayTotalSize = floorAreaType === 'gross' 
    ? totalSize 
    : Math.round(totalSize * NET_TO_GROSS_RATIO);
    
  const displaySecondStorySize = floorAreaType === 'gross'
    ? secondStorySize
    : Math.round(secondStorySize * NET_TO_GROSS_RATIO);
    
  const displayMainFloorSize = floorAreaType === 'gross'
    ? mainFloorSize
    : Math.round(mainFloorSize * NET_TO_GROSS_RATIO);

  // Adjust secondStorySize when mainFloorSize changes to maintain totalSize
  const updateMainFloorSize = (size: number) => {
    // Ensure the value is a multiple of 104 (gross module size)
    const adjustedSize = Math.floor(size / 104) * 104
    
    // Calculate the new second story size
    const newSecondStorySize = totalSize - adjustedSize
    
    // Make sure second story size doesn't exceed max (50% of total)
    const maxSecondStory = Math.floor(totalSize / 2)
    
    // Set minimum second story size (3 modules = 312 sqft)
    const minSecondStory = 312
    
    if (newSecondStorySize <= maxSecondStory && newSecondStorySize >= minSecondStory) {
      // Update both values
      setSecondStorySize(newSecondStorySize)
      setMainFloorSize(adjustedSize)
    } else if (newSecondStorySize < minSecondStory) {
      // If the new second story size would be too small,
      // set it to the minimum and adjust main floor accordingly
      setSecondStorySize(minSecondStory)
      setMainFloorSize(totalSize - minSecondStory)
    } else {
      // If the calculated second story would be too large, 
      // set it to the maximum and adjust main floor accordingly
      setSecondStorySize(maxSecondStory)
      setMainFloorSize(totalSize - maxSecondStory)
    }
  }

  // Update detailed price breakdown whenever relevant factors change
  useEffect(() => {
    const breakdown = calculateDetailedPrice(
      location, 
      mainFloorSize, 
      secondStorySize, 
      isEarlyAdopter
    )
    setDetailedPriceBreakdown(breakdown)
  }, [location, mainFloorSize, secondStorySize, isEarlyAdopter])

  // Calculate estimated price using our pricing data (for backwards compatibility)
  const estimatedPrice = detailedPriceBreakdown?.totalPrice || 
    calculatePrice(location, mainFloorSize, secondStorySize, isEarlyAdopter)

  // Function to get all price data for TypeForm
  const getPriceDataForTypeForm = (): TypeFormPriceData => {
    if (!detailedPriceBreakdown) {
      const breakdown = calculateDetailedPrice(
        location, 
        mainFloorSize, 
        secondStorySize, 
        isEarlyAdopter
      )
      setDetailedPriceBreakdown(breakdown)
      return formatTypeFormData(breakdown)
    }
    return formatTypeFormData(detailedPriceBreakdown)
  }

  // Helper to format data for TypeForm
  const formatTypeFormData = (breakdown: DetailedPriceBreakdown): TypeFormPriceData => {
    return {
      location,
      floorAreaType,
      // Always use gross values for TypeForm, regardless of display toggle
      totalSize: totalSize, // Always use gross value
      secondStorySize: secondStorySize, // Always use gross value 
      mainFloorSize: mainFloorSize, // Always use gross value
      // Include display values as separate fields for reference
      displayTotalSize: displayTotalSize, 
      displaySecondStorySize: displaySecondStorySize,
      displayMainFloorSize: displayMainFloorSize,
      isEarlyAdopter,
      baseEstimate: breakdown.totalPrice,
      foundationEstimate: breakdown.additionalCosts.foundation.total,
      appliancesEstimateMin: breakdown.additionalCosts.appliances.minCost,
      appliancesEstimateMax: breakdown.additionalCosts.appliances.maxCost,
      deliveryEstimate: breakdown.additionalCosts.delivery.total,
      electricalHookupEstimate: breakdown.additionalCosts.electricalHookup,
      sewerWaterSepticEstimateMin: breakdown.additionalCosts.sewerWaterSeptic.total.min,
      sewerWaterSepticEstimateMax: breakdown.additionalCosts.sewerWaterSeptic.total.max,
      permitFeesEstimate: breakdown.additionalCosts.permitFees.total,
      grandTotalMin: breakdown.grandTotal.min,
      grandTotalMax: breakdown.grandTotal.max,
      grandTotalAverage: breakdown.grandTotal.average,
      detailedPriceBreakdown: breakdown
    }
  }

  return (
    <CalculatorContext.Provider
      value={{
        location,
        floorAreaType,
        totalSize,
        secondStorySize,
        mainFloorSize,
        isEarlyAdopter,
        estimatedPrice,
        detailedPriceBreakdown,
        setLocation,
        setFloorAreaType,
        setTotalSize,
        setSecondStorySize,
        setMainFloorSize: updateMainFloorSize,
        setIsEarlyAdopter,
        getPriceDataForTypeForm,
        moduleSize,
        displayTotalSize,
        displaySecondStorySize,
        displayMainFloorSize
      }}
    >
      {children}
    </CalculatorContext.Provider>
  )
}

export function useCalculator() {
  const context = useContext(CalculatorContext)
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider')
  }
  return context
} 