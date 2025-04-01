'use client'

import React from 'react'
import { useCalculator } from '../context/CalculatorContext'
import dynamic from 'next/dynamic'

// Define the prop types for the ThreeScene component
interface ThreeSceneProps {
  totalSize: number;
  secondStorySize: number;
}

// Use noSSR pattern with properly typed component to avoid async/await issues
const ThreeScene = dynamic<ThreeSceneProps>(() => 
  Promise.resolve().then(() => require('./ThreeScene').default), 
{
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-gray-500">
      Loading 3D viewer...
    </div>
  ),
})

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const handleError = () => setHasError(true)
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Unable to load 3D viewer
      </div>
    )
  }

  return <>{children}</>
}

export default function House3D() {
  const { totalSize, secondStorySize } = useCalculator()
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  
  // Track container dimensions for responsive sizing
  React.useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // More compact sizing for mobile devices
      const isMobile = width < 768;
      
      // For mobile: 60% of viewport height as requested
      // For desktop: maintain aspect ratio but cap at 500px
      const height = isMobile 
        ? Math.min(viewportHeight * 0.6, 500) 
        : Math.min(500, width * 0.7);
        
      setDimensions({ width, height });
    };
    
    // Initial size
    updateDimensions();
    
    // Update on resize
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  return (
    <ErrorBoundary>
      {/* Container with proper dimensions */}
      <div 
        className="w-full relative"
        style={{ 
          height: dimensions.height,
          maxHeight: '500px',
          overflow: 'hidden',
          borderRadius: '8px',
          margin: '0 auto',
          marginBottom: '1rem' // Ensure consistent bottom margin
        }}
      >
        <ThreeScene totalSize={totalSize} secondStorySize={secondStorySize} />
      </div>
    </ErrorBoundary>
  )
} 