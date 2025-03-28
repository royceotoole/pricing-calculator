'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { ProvinceCode, calculatePrice } from '../../data/pricingData'

interface CalculatorContextType {
  location: ProvinceCode
  totalSize: number
  secondStorySize: number
  mainFloorSize: number
  isEarlyAdopter: boolean
  estimatedPrice: number
  setLocation: (location: ProvinceCode) => void
  setTotalSize: (size: number) => void
  setSecondStorySize: (size: number) => void
  setMainFloorSize: (size: number) => void
  setIsEarlyAdopter: (isEarlyAdopter: boolean) => void
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined)

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<ProvinceCode>('MB')
  // Default total size is 1,920 sq ft
  const [totalSize, setTotalSize] = useState<number>(1920)
  // Default second story is 960 sq ft (half of total)
  const [secondStorySize, setSecondStorySize] = useState<number>(960)
  // Main floor size is derived from total - second story
  const [mainFloorSize, setMainFloorSize] = useState<number>(960)
  // Early adopter toggle
  const [isEarlyAdopter, setIsEarlyAdopter] = useState<boolean>(false)

  // Keep mainFloorSize in sync when total or second story changes
  useEffect(() => {
    const newMainFloorSize = totalSize - secondStorySize
    setMainFloorSize(newMainFloorSize)
  }, [totalSize, secondStorySize])

  // Adjust secondStorySize when mainFloorSize changes to maintain totalSize
  const updateMainFloorSize = (size: number) => {
    // Ensure the value is a multiple of 96
    const adjustedSize = Math.floor(size / 96) * 96
    
    // Calculate the new second story size
    const newSecondStorySize = totalSize - adjustedSize
    
    // Make sure second story size doesn't exceed max (50% of total)
    const maxSecondStory = Math.floor(totalSize / 2)
    
    // Set minimum second story size
    const minSecondStory = 288
    
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

  // Calculate estimated price using our pricing data
  const estimatedPrice = calculatePrice(
    location, 
    mainFloorSize, 
    secondStorySize, 
    isEarlyAdopter
  )

  return (
    <CalculatorContext.Provider
      value={{
        location,
        totalSize,
        secondStorySize,
        mainFloorSize,
        isEarlyAdopter,
        estimatedPrice,
        setLocation,
        setTotalSize,
        setSecondStorySize,
        setMainFloorSize: updateMainFloorSize,
        setIsEarlyAdopter,
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