'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCalculator } from './context/CalculatorContext'
import { ProvinceCode } from '../data/pricingData'

export default function Home() {
  const [selectedProvince, setSelectedProvince] = useState<ProvinceCode | "">("")
  const [showError, setShowError] = useState(false)
  const [email, setEmail] = useState("")
  
  // Get the setLocation function from context
  const { setLocation } = useCalculator()
  
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvince(e.target.value as ProvinceCode)
    setShowError(false)
  }
  
  const handleNextClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!selectedProvince) {
      e.preventDefault()
      setShowError(true)
      // Scroll to the province dropdown
      document.querySelector('.province-error')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Update the context with the selected province
      setLocation(selectedProvince)
    }
  }

  return (
    <main className="min-h-screen px-8 py-8 w-full mx-auto font-['NeueHaasGroteskDisplayPro'] relative" style={{ maxWidth: "36rem", letterSpacing: "0.01em" }}>
      <nav className="mb-12">
        <Link href="/" className="inline-flex items-center btn-grey py-2 px-4">
          ← home
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
        <h1 className="mb-8 text-[28px]">Build Price Estimator</h1>
      </div>

      <hr className="w-full border-t border-gray-200 my-8" />

      <div className="mb-8">
        <div className="mb-8">
          <p className="mb-4">Welcome to our <strong>Build Price Estimator</strong>!</p>
          
          <p className="mb-4">We created this tool to give you a quick and easy way to see how much a Take Place home costs and how your design choices influence the final price.</p>
          
          <p>There are just a few simple inputs, and it only takes about a minute. Feel free to experiment with the sliders on the next page to find your perfect fit!</p>
        </div>

        <hr className="w-full border-t border-gray-200 my-8" />

        <div className="mb-8">
          <label className="block mb-4">Where is your property located?</label>
          <div className="relative">
            <select 
              className={`w-full p-4 pr-32 border rounded-lg bg-white font-['NeueHaasGroteskDisplayPro'] appearance-none ${showError ? 'border-red-500' : ''}`}
              style={{ letterSpacing: "0.01em" }}
              value={selectedProvince}
              onChange={handleProvinceChange}
            >
              <option value="" disabled>Select a province</option>
              <option value="AB">Alberta</option>
              <option value="BC">British Columbia</option>
              <option value="MB">Manitoba</option>
              <option value="NB">New Brunswick</option>
              <option value="NL">Newfoundland and Labrador</option>
              <option value="NS">Nova Scotia</option>
              <option value="ON">Ontario</option>
              <option value="PE">Prince Edward Island</option>
              <option value="QC">Quebec</option>
              <option value="SK">Saskatchewan</option>
              <option value="NT">Northwest Territories</option>
              <option value="NU">Nunavut</option>
              <option value="YT">Yukon</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          {showError && (
            <p className="mt-2 text-red-500 text-sm province-error">
              Please select a province before continuing
            </p>
          )}
        </div>

        <div className="mb-8">
          <label className="block mb-4">Enter your email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-4 pr-32 border rounded-lg bg-white font-['NeueHaasGroteskDisplayPro'] appearance-none ${showError ? 'border-red-500' : ''}`}
            style={{ letterSpacing: "0.01em" }}
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Link
          href="/calculator"
          className="inline-flex items-center btn-grey py-2 px-4"
          onClick={handleNextClick}
        >
          next →
        </Link>
      </div>
    </main>
  )
} 