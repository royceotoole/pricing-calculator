'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useCalculator } from '../context/CalculatorContext'
import { PRICING_CONSTANTS, PROVINCIAL_MULTIPLIERS } from '../../data/pricingData'

// Dynamically import the House3D component with no SSR
const House3D = dynamic(() => import('../components/House3D'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center">Loading 3D model...</div>
})

export default function Calculator() {
  const {
    totalSize,
    secondStorySize,
    mainFloorSize,
    location,
    isEarlyAdopter,
    setTotalSize,
    setSecondStorySize,
    setMainFloorSize,
    setIsEarlyAdopter,
    estimatedPrice
  } = useCalculator()
  
  // State for tooltips visibility
  const [showTooltip, setShowTooltip] = useState(false)
  const [showSecondFloorTooltip, setShowSecondFloorTooltip] = useState(false)
  const [showBaseCostTooltip, setShowBaseCostTooltip] = useState(false)
  const [showCostPerSqftTooltip, setShowCostPerSqftTooltip] = useState(false)
  const [showExtraCostsTooltip, setShowExtraCostsTooltip] = useState(false)

  // Function to render tooltip with intelligent positioning
  const renderTooltip = (visible: boolean, content: React.ReactNode, position: 'left' | 'right' | 'center' = 'right') => {
    if (!visible) return null;
    
    let tooltipStyle = {};
    let arrowStyle = {};
    
    // For left position, position arrow at 10px from left (center of icon)
    if (position === 'left') {
      tooltipStyle = { left: '-5px' };
      arrowStyle = { left: '10px', marginLeft: '-1.5px' };
    } 
    // For right position, position arrow at 10px from right (center of icon)
    else if (position === 'right') {
      tooltipStyle = { right: '-5px' };
      arrowStyle = { right: '10px', marginRight: '-1.5px' };
    } 
    // For center position, center everything
    else {
      tooltipStyle = { left: '50%', transform: 'translateX(-50%)' };
      arrowStyle = { left: '50%', marginLeft: '-1.5px' };
    }
    
    return (
      <div 
        className="absolute bottom-full mb-2 w-72"
        style={tooltipStyle}
      >
        <div className="relative p-4 bg-black text-white rounded shadow-lg z-20">
          {content}
          <div 
            className="absolute bottom-0 translate-y-1/2 rotate-45 w-3 h-3 bg-black" 
            style={arrowStyle}
          ></div>
        </div>
      </div>
    );
  };

  // Keep mainFloorSize in sync when total or second story changes
  useEffect(() => {
    const newMainFloorSize = totalSize - secondStorySize
    setMainFloorSize(newMainFloorSize)
  }, [totalSize, secondStorySize])

  // Ensure second story size doesn't exceed half of total size when total size changes
  // Also ensure it doesn't go below the minimum of 288 sqft
  React.useEffect(() => {
    const maxSecondStory = Math.floor(totalSize / 2)
    const minSecondStory = 288
    
    if (secondStorySize > maxSecondStory) {
      // Adjust to nearest 96 sqft increment that's within the max
      setSecondStorySize(Math.floor(maxSecondStory / 96) * 96)
    } else if (secondStorySize < minSecondStory) {
      // If below minimum, set to minimum
      setSecondStorySize(minSecondStory)
      
      // Also adjust main floor to maintain total
      const newMainFloor = totalSize - minSecondStory
      setMainFloorSize(newMainFloor)
    }
  }, [totalSize, secondStorySize, setSecondStorySize, setMainFloorSize])

  return (
    <main className="min-h-screen px-8 py-8 w-full mx-auto font-['NeueHaasGroteskDisplayPro'] relative" style={{ maxWidth: "36rem" }}>
      <nav className="mb-12">
        <Link href="/" className="inline-flex items-center btn-grey py-2 px-4">
          ← back
        </Link>
      </nav>

      <div className="mb-12">
        <div className="mb-2">
          <Image 
            src="/images/logo/take place_Wordmark 1.2_2023.png" 
            alt="Take Place Logo" 
            width={92} 
            height={23} 
            priority
            className="h-auto"
          />
        </div>
        <h1 className="mb-4 text-[28px]">Build Price Estimator</h1>
        <div className="text-gray-600">Location: {location}</div>
      </div>

      <div className="space-y-12 mb-[220px]">
        {/* Total Size Slider */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label>Total size</label>
            <span className="mono-display-small inline-block btn-grey py-2 px-4">
              {totalSize.toLocaleString()} SQFT
            </span>
          </div>
          <input
            type="range"
            min="768"
            max="3840"
            step="96"
            value={totalSize}
            onChange={(e) => setTotalSize(Number(e.target.value))}
            className="w-full accent-black"
          />
        </div>

        {/* Main Floor Size Slider */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label>Main floor area</label>
            <span className="mono-display-small inline-block btn-grey py-2 px-4">
              {mainFloorSize.toLocaleString()} SQFT
            </span>
          </div>
          <input
            type="range"
            min={Math.ceil(totalSize / 2)}
            max={totalSize - 288} // Ensure at least 288 sqft remains for second floor
            step="96"
            value={mainFloorSize}
            onChange={(e) => {
              const newValue = Number(e.target.value)
              setMainFloorSize(newValue)
            }}
            className="w-full accent-black"
          />
        </div>

        {/* Second Story Slider */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <label>Second floor area</label>
              <div 
                className="inline-flex items-center justify-center w-5 h-5 bg-gray-200 rounded-full cursor-pointer ml-2 relative"
                onMouseEnter={() => setShowSecondFloorTooltip(true)}
                onMouseLeave={() => setShowSecondFloorTooltip(false)}
                onClick={() => setShowSecondFloorTooltip(!showSecondFloorTooltip)}
              >
                <span className="font-serif text-sm">i</span>
                {renderTooltip(
                  showSecondFloorTooltip, 
                  <>
                    <p className="text-sm font-bold mb-2">Second Floor Area</p>
                    <p className="text-sm mb-2">
                      Our homes are designed as two-storey structures, but you choose how much second-floor area you want and how much remains as vaulted, 23-foot-high open-to-above spaces.
                    </p>
                    <p className="text-sm">
                      Adding second-floor space is an economical way to increase practical living area, while open-to-above sections create exciting, dynamic spaces.
                    </p>
                  </>,
                  'left'
                )}
              </div>
            </div>
            <span className="mono-display-small inline-block btn-grey py-2 px-4">
              {secondStorySize.toLocaleString()} SQFT
            </span>
          </div>
          <input
            type="range"
            min="288"
            max={Math.floor(totalSize / 2)}
            step="96"
            value={secondStorySize}
            onChange={(e) => {
              const newValue = Number(e.target.value)
              // Ensure the value is a multiple of 96, at least 288, and doesn't exceed half of total size
              const maxValue = Math.floor(totalSize / 2)
              const minValue = 288
              const adjustedValue = Math.max(minValue, Math.min(maxValue, Math.floor(newValue / 96) * 96))
              setSecondStorySize(adjustedValue)
            }}
            className="w-full accent-black"
          />
        </div>

        {/* Configuration Viewer */}
        <div>
          <div className="w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden relative border border-[rgba(0,0,0,0.08)]">
            <House3D />
          </div>
        </div>

        {/* Early Adopter Checkbox with Tooltip */}
        <div className="flex items-center relative">
          <div className="flex-grow flex items-center">
            <label className="flex items-center cursor-pointer">
              <span>Are you interested in the Early Adopter Incentive?</span>
              <div 
                className="inline-flex items-center justify-center w-5 h-5 bg-gray-200 rounded-full cursor-pointer ml-2 relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
              >
                <span className="font-serif text-sm">i</span>
                {renderTooltip(
                  showTooltip,
                  <>
                    <p className="text-sm font-bold mb-2">Early Adopter Incentive</p>
                    <p className="text-sm mb-2">
                      We're a new company, and although we're already underway on our first homes, we'll continue fine-tuning our process and timelines over the next year. As a show of appreciation to clients who recognize this, we're offering an exclusive discount of <span className="font-bold">$10 per sqft</span> for commitments made before July 1, 2025.
                    </p>
                  </>,
                  'right'
                )}
              </div>
            </label>
          </div>
          <div className="flex items-center justify-center" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
            <div className="relative w-6 h-6">
              <input 
                type="checkbox" 
                className="w-6 h-6 opacity-0 absolute z-10 cursor-pointer"
                checked={isEarlyAdopter}
                onChange={(e) => setIsEarlyAdopter(e.target.checked)}
              />
              <div 
                className={`absolute top-0 left-0 w-6 h-6 rounded-sm border-2 ${isEarlyAdopter ? 'bg-black border-blue-500' : 'bg-white border-gray-300'}`}
              >
                {isEarlyAdopter && (
                  <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky bottom section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="px-8 py-8 w-full mx-auto" style={{ maxWidth: "36rem" }}>
          {/* Price Display */}
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <span className="text-gray-600">Base Price</span>
                <div 
                  className="inline-flex items-center justify-center w-5 h-5 bg-gray-200 rounded-full cursor-pointer ml-2 relative"
                  onMouseEnter={() => setShowBaseCostTooltip(true)}
                  onMouseLeave={() => setShowBaseCostTooltip(false)}
                  onClick={() => setShowBaseCostTooltip(!showBaseCostTooltip)}
                >
                  <span className="font-serif text-sm">i</span>
                  {renderTooltip(
                    showBaseCostTooltip,
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
                    </>,
                    'left'
                  )}
                </div>
              </div>
              <span className="mono-display-large">${estimatedPrice.toLocaleString()}</span>
            </div>
            <div className="text-right flex justify-end items-center">
              <span className="mono-display-gray">${Math.round(estimatedPrice / totalSize)}/SQFT</span>
              
              {/* Cost per SQFT info button */}
              <div 
                className="inline-flex items-center justify-center w-5 h-5 bg-gray-200 rounded-full cursor-pointer ml-2 relative"
                onMouseEnter={() => setShowCostPerSqftTooltip(true)}
                onMouseLeave={() => setShowCostPerSqftTooltip(false)}
                onClick={() => setShowCostPerSqftTooltip(!showCostPerSqftTooltip)}
              >
                <span className="font-serif text-sm">i</span>
                {renderTooltip(
                  showCostPerSqftTooltip,
                  <>
                    <p className="text-sm">Price per sqft is measured to the exterior face of the building.</p>
                  </>,
                  'right'
                )}
              </div>
            </div>
          </div>

          {/* Book Meeting Button */}
          <button className="w-full py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-['NeueHaasGroteskDisplayPro']">
            Get your custom proposal
          </button>
        </div>
      </div>
    </main>
  )
} 