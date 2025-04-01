'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useCalculator, FloorAreaType, MODULE_SIZES } from '../context/CalculatorContext'
import { PRICING_CONSTANTS, PROVINCIAL_MULTIPLIERS } from '../../data/pricingData'
import PriceDataLogger from '../components/PriceDataLogger'
import InfoIcon from '../../components/InfoIcon'
import { getTypeformUrl, isDevelopment, uploadImageToS3 } from '../../config/typeform'
import House3D, { House3DRef } from '../components/House3D'

// Dynamically import the House3D component with no SSR
// const House3D = dynamic(() => import('../components/House3D'), { 
//   ssr: false,
//   loading: () => <div className="w-full h-full flex items-center justify-center">Loading 3D model...</div>
// })

export default function Calculator() {
  const {
    totalSize,
    secondStorySize,
    mainFloorSize,
    location,
    isEarlyAdopter,
    floorAreaType,
    setTotalSize,
    setSecondStorySize,
    setMainFloorSize,
    setIsEarlyAdopter,
    setFloorAreaType,
    estimatedPrice,
    moduleSize,
    getPriceDataForTypeForm,
    // Display values
    displayTotalSize,
    displaySecondStorySize,
    displayMainFloorSize
  } = useCalculator()
  
  const mainContentRef = useRef<HTMLDivElement>(null);
  const house3DRef = useRef<House3DRef>(null);
  const [isCapturingModel, setIsCapturingModel] = useState(false);

  // Keep mainFloorSize in sync when total or second story changes
  useEffect(() => {
    const newMainFloorSize = totalSize - secondStorySize
    setMainFloorSize(newMainFloorSize)
  }, [totalSize, secondStorySize])

  // Ensure second story size doesn't exceed half of total size when total size changes
  // Also ensure it doesn't go below the minimum of 312 sqft
  React.useEffect(() => {
    const maxSecondStory = Math.floor(totalSize / 2)
    const minSecondStory = 312
    
    if (secondStorySize > maxSecondStory) {
      // Adjust to nearest 104 sqft increment that's within the max
      setSecondStorySize(Math.floor(maxSecondStory / 104) * 104)
    } else if (secondStorySize < minSecondStory) {
      // If below minimum, set to minimum
      setSecondStorySize(minSecondStory)
      
      // Also adjust main floor to maintain total
      const newMainFloor = totalSize - minSecondStory
      setMainFloorSize(newMainFloor)
    }
  }, [totalSize, secondStorySize, setSecondStorySize, setMainFloorSize])

  // Function to open TypeForm with all calculator data
  const openTypeform = async () => {
    setIsCapturingModel(true);
    
    try {
      // Try to capture a screenshot of the 3D model
      let modelScreenshotUrl = null;
      if (house3DRef.current) {
        const dataUrl = await house3DRef.current.captureScreenshot();
        if (dataUrl) {
          // Upload the screenshot to S3 and get a permanent URL
          modelScreenshotUrl = await uploadImageToS3(dataUrl);
          
          // Log the S3 URL in development mode
          if (isDevelopment && modelScreenshotUrl) {
            console.log('Model Screenshot uploaded to S3:', modelScreenshotUrl);
          }
        }
      }
      
      // Get all data from context
      const typeformData = getPriceDataForTypeForm();
      
      // Convert to URL parameters
      const params: Record<string, string> = {
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
        'source': 'calculator_page'
      };
      
      // Add model screenshot URL if available
      if (modelScreenshotUrl) {
        params['model_screenshot_url'] = modelScreenshotUrl;
      }
      
      // Convert params object to URL parameters
      const typeformParams = new URLSearchParams(params).toString();
      
      // Show parameter log in development
      if (isDevelopment) {
        console.log('TypeForm Parameters:', Object.fromEntries(new URLSearchParams(typeformParams)));
      }
      
      // Get the full TypeForm URL from config
      const typeformUrl = getTypeformUrl(typeformParams);
      
      // Open TypeForm in a new tab
      window.open(typeformUrl, '_blank');
    } catch (error) {
      console.error('Error preparing TypeForm data:', error);
      
      // Fallback to opening TypeForm without screenshot
      const fallbackParams = new URLSearchParams({
        'province': location,
        'total_size': totalSize.toString(),
        'source': 'calculator_page_error',
      }).toString();
      
      window.open(getTypeformUrl(fallbackParams), '_blank');
    } finally {
      setIsCapturingModel(false);
    }
  };

  return (
    <main 
      className="min-h-screen px-8 py-8 w-full mx-auto font-['NeueHaasGroteskDisplayPro'] relative" 
      style={{ maxWidth: "36rem", letterSpacing: "0.01em" }}
      ref={mainContentRef}
    >
      {/* Hidden component to log detailed price data */}
      <PriceDataLogger />
      
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

      <div className="space-y-9 mb-[150px]">
        {/* Total Size Slider */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label>Total size</label>
            <span className="mono-display-small inline-block btn-grey py-2 px-4">
              {displayTotalSize.toLocaleString()} SQFT
            </span>
          </div>
          <input
            type="range"
            min={832} // Fixed at 8 * 104 (gross modules)
            max={4160} // Fixed at 40 * 104 (gross modules)
            step={104} // Fixed gross module size
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
              {displayMainFloorSize.toLocaleString()} SQFT
            </span>
          </div>
          <input
            type="range"
            min={Math.ceil(totalSize / 2)}
            max={totalSize - 312} // Ensure at least 3 gross modules (312 sqft) remain for second floor
            step={104} // Fixed gross module size
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
              <InfoIcon 
                position="left"
                content={
                  <>
                    <p className="text-sm font-bold mb-2">Second Floor Area</p>
                    <p className="text-sm mb-2">
                      Our homes are designed as two-storey structures, but you choose how much second-floor area you want and how much remains as vaulted, 23-foot-high open-to-above spaces.
                    </p>
                    <p className="text-sm">
                      Adding second-floor space is an economical way to increase practical living area, while open-to-above sections create exciting, dynamic spaces.
                    </p>
                  </>
                }
              />
            </div>
            <span className="mono-display-small inline-block btn-grey py-2 px-4">
              {displaySecondStorySize.toLocaleString()} SQFT
            </span>
          </div>
          <input
            type="range"
            min={312} // Fixed at 3 * 104 (gross modules)
            max={Math.floor(totalSize / 2)}
            step={104} // Fixed gross module size
            value={secondStorySize}
            onChange={(e) => {
              const newValue = Number(e.target.value)
              // Ensure the value is a multiple of 104, at least 312, and doesn't exceed half of total size
              const maxValue = Math.floor(totalSize / 2)
              const minValue = 312
              const adjustedValue = Math.max(minValue, Math.min(maxValue, Math.floor(newValue / 104) * 104))
              setSecondStorySize(adjustedValue)
            }}
            className="w-full accent-black"
          />
        </div>

        {/* Configuration Viewer */}
        <div>
          <div className="w-full relative">
            <House3D ref={house3DRef} />
            {isCapturingModel && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                <div className="flex flex-col items-center text-sm">
                  <svg className="animate-spin h-8 w-8 text-black mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Capturing model...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floor Area Type Toggle */}
        <div className="flex items-center relative">
          <div className="flex-grow flex items-center">
            <label className="flex items-center cursor-pointer">
              <span>Floor area calculation</span>
              <InfoIcon
                position="right"
                content={
                  <>
                    <p className="text-sm font-bold mb-2">Floor area calculation</p>
                    <p className="text-sm mb-2">
                      Gross floor area is measured to the exterior face of the perimeter of the home.
                    </p>
                    <p className="text-sm mb-2">
                      Net, or 'livable' floor area is measured to the interior face of the perimeter of the home.
                    </p>
                    <p className="text-sm mb-2">
                      Due to our thick super-insulated walls, the net floor area of a Take Place home will be approximately 8% less than the gross floor area.
                    </p>
                    <p className="text-sm">
                      Toggling between these options changes the displayed square footage but does not affect the actual home configuration or price.
                    </p>
                  </>
                }
              />
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <span 
              className={`text-sm cursor-pointer ${floorAreaType === 'gross' ? 'font-bold' : 'text-gray-500'}`}
              onClick={() => setFloorAreaType('gross')}
            >
              Gross
            </span>
            
            {/* Toggle switch */}
            <div 
              className="relative w-12 h-6 bg-gray-200 rounded-full cursor-pointer"
              onClick={() => setFloorAreaType(floorAreaType === 'gross' ? 'net' : 'gross')}
            >
              <div 
                className="absolute top-1 w-4 h-4 rounded-full bg-black transition-all"
                style={{ 
                  left: floorAreaType === 'gross' ? '4px' : 'calc(100% - 20px)'
                }}
              />
            </div>
            
            <span 
              className={`text-sm cursor-pointer ${floorAreaType === 'net' ? 'font-bold' : 'text-gray-500'}`}
              onClick={() => setFloorAreaType('net')}
            >
              Net
            </span>
          </div>
        </div>

        {/* Early Adopter Checkbox with Tooltip */}
        <div className="flex items-center relative">
          <div className="flex-grow flex items-center">
            <label className="flex items-center cursor-pointer">
              <span>Are you interested in the Early Adopter Incentive?</span>
              <InfoIcon
                position="right"
                content={
                  <>
                    <p className="text-sm font-bold mb-2">Early Adopter Incentive</p>
                    <p className="text-sm mb-2">
                      We're a new company, and although we're already underway on our first homes, we'll continue fine-tuning our process and timelines over the next year. As a show of appreciation to clients who recognize this, we're offering an exclusive discount of <span className="font-bold">$10 per sqft</span> for commitments made before July 1, 2025.
                    </p>
                  </>
                }
              />
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
        <div className="px-8 w-full mx-auto" style={{ maxWidth: "36rem" }}>
          {/* Mobile reduced padding, desktop regular padding */}
          <div className="pt-[1.4rem] pb-[1.5rem] md:py-8">
            {/* Price Display - Always visible */}
            <div>
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
              </div>
            </div>

            {/* Book Meeting Button */}
            <div className="mt-4">
              <button 
                className="w-full py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-['NeueHaasGroteskDisplayPro']" 
                style={{ letterSpacing: "0.01em" }}
                onClick={openTypeform}
                disabled={isCapturingModel}
              >
                {isCapturingModel ? 'Preparing proposal...' : 'Get your custom proposal'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 