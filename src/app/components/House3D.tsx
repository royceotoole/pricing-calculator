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
    console.log('Canvas reference saved:', canvas);
  };
  
  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    captureScreenshot: async () => {
      try {
        if (!canvasRef.current) {
          console.warn('Canvas not available for screenshot - no canvas reference');
          return null;
        }
        
        console.log('Preparing to capture screenshot from WebGL canvas');
        
        try {
          // Force a complete render cycle first
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Get the WebGL renderer from the canvas
          const gl = canvasRef.current.getContext('webgl') || canvasRef.current.getContext('webgl2');
          if (!gl) {
            console.error('No WebGL context available on canvas');
          } else {
            // Force the WebGL context to finish any pending commands
            gl.finish();
          }
          
          console.log('Rendering complete, capturing screenshot now');
          
          // Direct access to the WebGL canvas is the most reliable way to get JUST the 3D model
          // without any UI elements, legends, or labels
          const dataUrl = canvasRef.current.toDataURL('image/png');
          console.log('Direct WebGL canvas screenshot captured, data URL length:', dataUrl.length);
          
          // Verify the image isn't empty by checking the length and content
          if (dataUrl.length < 5000) {
            console.warn('Screenshot may be empty or contain minimal data (length:', dataUrl.length, ')');
            
            // Try using preserveDrawingBuffer option
            console.log('Falling back to alternate capture method');
            
            // Get the scene through the parent of the canvas (ThreeScene div)
            const sceneContainer = canvasRef.current.parentElement;
            if (!sceneContainer) {
              console.warn('Cannot find scene container');
              return dataUrl; // Return what we have, even if it might be empty
            }
            
            // Prepare for html2canvas capture
            await new Promise(resolve => setTimeout(resolve, 200));
            
            try {
              // @ts-ignore - Dynamic import
              const html2canvasModule = await import('html2canvas');
              const html2canvas = html2canvasModule.default;
              
              // Use html2canvas with special options for WebGL
              const canvas = await html2canvas(sceneContainer, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: null, // Transparent background
                scale: 2, // Higher quality
                logging: true,
                ignoreElements: (element) => {
                  // Only include the canvas and 3D model, ignore text/legend elements
                  if (element.classList && 
                     (element.classList.contains('legend') || 
                      element.textContent === 'CONFIGURATION' ||
                      element.textContent?.includes('FLOOR AREA') ||
                      element.textContent?.includes('OPEN TO BELOW'))) {
                    return true;
                  }
                  return false;
                }
              });
              
              const alternateDataUrl = canvas.toDataURL('image/png');
              console.log('html2canvas screenshot captured, data URL length:', alternateDataUrl.length);
              
              // Return the better image (the one with more data)
              return alternateDataUrl.length > dataUrl.length ? alternateDataUrl : dataUrl;
            } catch (html2canvasError) {
              console.error('html2canvas fallback failed:', html2canvasError);
              return dataUrl; // Return original even if it might be empty
            }
          }
          
          return dataUrl;
        } catch (canvasError) {
          console.error('Error capturing from direct canvas:', canvasError);
          
          // Fallback to html2canvas if direct canvas capture fails
          try {
            console.log('Falling back to html2canvas approach');
            // @ts-ignore - Dynamic import
            const html2canvasModule = await import('html2canvas');
            const html2canvas = html2canvasModule.default;
            
            if (!containerRef.current) {
              console.warn('Container not available for html2canvas fallback');
              return null;
            }
            
            // Find the canvas element within the container
            const canvasElement = containerRef.current.querySelector('canvas');
            if (!canvasElement) {
              console.warn('Could not find canvas element for html2canvas fallback');
              return null;
            }
            
            console.log('Found canvas element for html2canvas fallback');
            
            // Wait longer for any rendering to complete
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Try to capture the scene container rather than just the canvas
            const sceneContainer = canvasElement.parentElement;
            if (!sceneContainer) {
              console.warn('Cannot find scene container, falling back to canvas element');
            }
            
            // Use html2canvas to capture the scene with the model
            const canvas = await html2canvas(sceneContainer || canvasElement, {
              useCORS: true,
              allowTaint: true,
              backgroundColor: null, // Transparent
              scale: 2, // Higher quality
              logging: true,
              ignoreElements: (element) => {
                // Only include the canvas and 3D model, ignore text/legend elements
                if (element.classList && 
                   (element.classList.contains('legend') || 
                    element.textContent === 'CONFIGURATION' ||
                    element.textContent?.includes('FLOOR AREA') ||
                    element.textContent?.includes('OPEN TO BELOW'))) {
                  return true;
                }
                return false;
              }
            });
            
            console.log('Canvas captured to image via html2canvas');
            const dataUrl = canvas.toDataURL('image/png');
            console.log('Screenshot captured via html2canvas fallback, data URL length:', dataUrl.length);
            return dataUrl;
          } catch (html2canvasError) {
            console.error('Both direct canvas and html2canvas methods failed:', html2canvasError);
            return null;
          }
        }
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