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
}

// Structure for data to be sent to TypeForm
export interface TypeFormPriceData {
  location: ProvinceCode
  floorAreaType: FloorAreaType
  totalSize: number
  secondStorySize: number
  mainFloorSize: number
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

  // Determine the current module size based on floor area type
  const moduleSize = floorAreaType === 'gross' ? MODULE_SIZES.GROSS : MODULE_SIZES.NET;

  // Keep mainFloorSize in sync when total or second story changes
  useEffect(() => {
    const newMainFloorSize = totalSize - secondStorySize
    setMainFloorSize(newMainFloorSize)
  }, [totalSize, secondStorySize])

  // Handle area type toggle to convert between gross and net
  useEffect(() => {
    if (floorAreaType === 'net') {
      // When switching to net, maintain the same number of modules but with smaller sqft
      const grossModules = Math.round(totalSize / MODULE_SIZES.GROSS);
      const netTotalSize = grossModules * MODULE_SIZES.NET;
      
      const grossSecondFloorModules = Math.round(secondStorySize / MODULE_SIZES.GROSS);
      const netSecondFloorSize = grossSecondFloorModules * MODULE_SIZES.NET;
      
      setTotalSize(netTotalSize);
      setSecondStorySize(netSecondFloorSize);
    } else {
      // When switching to gross, maintain the same number of modules but with larger sqft
      const netModules = Math.round(totalSize / MODULE_SIZES.NET);
      const grossTotalSize = netModules * MODULE_SIZES.GROSS;
      
      const netSecondFloorModules = Math.round(secondStorySize / MODULE_SIZES.NET);
      const grossSecondFloorSize = netSecondFloorModules * MODULE_SIZES.GROSS;
      
      setTotalSize(grossTotalSize);
      setSecondStorySize(grossSecondFloorSize);
    }
  }, [floorAreaType]);

  // Adjust secondStorySize when mainFloorSize changes to maintain totalSize
  const updateMainFloorSize = (size: number) => {
    // Ensure the value is a multiple of the current module size
    const adjustedSize = Math.floor(size / moduleSize) * moduleSize
    
    // Calculate the new second story size
    const newSecondStorySize = totalSize - adjustedSize
    
    // Make sure second story size doesn't exceed max (50% of total)
    const maxSecondStory = Math.floor(totalSize / 2)
    
    // Set minimum second story size (3 modules)
    const minSecondStory = 3 * moduleSize
    
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
      totalSize,
      secondStorySize,
      mainFloorSize,
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
      grandTotalAverage: breakdown.grandTotal.average
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
        moduleSize
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