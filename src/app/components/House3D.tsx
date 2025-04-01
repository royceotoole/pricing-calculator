'use client'

import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { useCalculator } from '../context/CalculatorContext'
import dynamic from 'next/dynamic'

// Define the prop types for the ThreeScene component
interface ThreeSceneProps {
  totalSize: number;
  secondStorySize: number;
  onCanvasRef?: (canvas: HTMLCanvasElement) => void;
}

// Type definition for external methods
export interface House3DRef {
  captureScreenshot: () => Promise<string | null>;
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

const House3D = forwardRef<House3DRef, {}>((props, ref) => {
  const { totalSize, secondStorySize } = useCalculator()
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Track container dimensions for responsive sizing and maintain aspect ratio
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        
        // Always set height equal to width for perfect square on both mobile and desktop
        containerRef.current.style.height = `${containerWidth}px`;
      }
    };
    
    // Initial size
    updateSize();
    
    // Update on resize
    window.addEventListener('resize', updateSize);
    
    // Create a ResizeObserver to handle container size changes
    // This handles cases when the parent container changes size without a window resize event
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', updateSize);
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  // Function to save the canvas reference from ThreeScene
  const handleCanvasRef = (canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  };
  
  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    captureScreenshot: async () => {
      try {
        if (!canvasRef.current) {
          console.warn('Canvas not available for screenshot');
          return null;
        }
        
        // Create a data URL from the canvas
        const dataUrl = canvasRef.current.toDataURL('image/png');
        return dataUrl;
      } catch (error) {
        console.error('Error capturing 3D model screenshot:', error);
        return null;
      }
    }
  }));
  
  return (
    <ErrorBoundary>
      {/* Use an aspect ratio container with padding-bottom trick for responsive square */}
      <div className="w-full relative">
        <div 
          ref={containerRef}
          className="w-full relative bg-gray-100 rounded-lg overflow-hidden border border-[rgba(0,0,0,0.08)]"
          style={{ 
            marginBottom: '1rem' // Ensure consistent bottom margin
          }}
        >
          <ThreeScene 
            totalSize={totalSize} 
            secondStorySize={secondStorySize} 
            onCanvasRef={handleCanvasRef}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
})

House3D.displayName = 'House3D';

export default House3D; 