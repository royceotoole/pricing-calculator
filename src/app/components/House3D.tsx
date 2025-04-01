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
        console.log('Starting screenshot capture with focused approach');
        
        // Use specific ID to get the Three.js container
        const threeContainer = document.getElementById('three-scene-container');
        if (!threeContainer) {
          console.warn('Three.js container element not found');
          return null;
        }
        
        // Force a complete render cycle and wait for animations to settle
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          // Try to find the canvas element directly - most reliable method
          const canvasElement = threeContainer.querySelector('canvas[data-screenshot-target="true"]');
          
          if (canvasElement) {
            // Use domtoimage for a direct capture of the WebGL content
            try {
              // @ts-ignore - Dynamic import
              const html2canvasModule = await import('html2canvas');
              const html2canvas = html2canvasModule.default;
              
              console.log('Found canvas element, capturing directly with html2canvas');
              
              // Force the WebGL context to render a complete frame
              const gl = (canvasElement as HTMLCanvasElement).getContext('webgl') || 
                         (canvasElement as HTMLCanvasElement).getContext('webgl2');
              if (gl) {
                gl.flush();
                gl.finish();
              }
              
              // Wait for rendering to complete
              await new Promise(resolve => setTimeout(resolve, 300));
              
              // Focus only on the canvas itself
              const canvas = await html2canvas(canvasElement as HTMLCanvasElement, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                scale: 2,
                logging: true,
                ignoreElements: (element) => {
                  // Ignore any elements that are not the canvas itself
                  return element !== canvasElement;
                }
              });
              
              // Convert to data URL
              const dataUrl = canvas.toDataURL('image/png');
              console.log('Canvas screenshot captured, length:', dataUrl.length);
              
              if (dataUrl.length > 5000) {
                return dataUrl;
              }
            } catch (error) {
              console.error('Error capturing with html2canvas:', error);
            }
            
            // If html2canvas fails, try direct canvas toDataURL approach
            try {
              console.log('Trying direct canvas.toDataURL approach');
              const directDataUrl = (canvasElement as HTMLCanvasElement).toDataURL('image/png');
              console.log('Direct canvas capture, length:', directDataUrl.length);
              
              if (directDataUrl.length > 5000) {
                return directDataUrl;
              }
            } catch (canvasError) {
              console.error('Error with direct canvas capture:', canvasError);
            }
          }
          
          // If we couldn't get the canvas or direct methods failed, try the whole container
          console.log('Canvas capture failed, trying container capture');
          
          // @ts-ignore - Dynamic import
          const html2canvasModule = await import('html2canvas');
          const html2canvas = html2canvasModule.default;
          
          // Capture just the container with the 3D view, hiding UI elements
          const tempClone = threeContainer.cloneNode(true) as HTMLElement;
          document.body.appendChild(tempClone);
          
          // Find and remove UI elements from clone
          const uiElements = tempClone.querySelectorAll('.legend-container, .configuration-label');
          uiElements.forEach(el => {
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
          });
          
          // Capture the cleaned clone
          const containerCanvas = await html2canvas(tempClone, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            scale: 2,
            logging: true
          });
          
          // Clean up
          document.body.removeChild(tempClone);
          
          // Convert to data URL
          const containerDataUrl = containerCanvas.toDataURL('image/png');
          console.log('Container screenshot captured, length:', containerDataUrl.length);
          
          return containerDataUrl;
        } catch (error) {
          console.error('Error during screenshot capture:', error);
          
          // Last resort: try the stored canvas reference directly
          if (canvasRef.current) {
            console.log('Last resort: using stored canvas reference');
            try {
              const lastResortDataUrl = canvasRef.current.toDataURL('image/png');
              console.log('Last resort data URL length:', lastResortDataUrl.length);
              return lastResortDataUrl;
            } catch (refError) {
              console.error('Last resort failed:', refError);
            }
          }
          
          return null;
        }
      } catch (error) {
        console.error('Fatal error in screenshot capture:', error);
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