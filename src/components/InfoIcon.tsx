'use client'

import React, { useState, useEffect, useRef } from 'react'

interface InfoIconProps {
  content: React.ReactNode;
  position?: 'left' | 'right' | 'center';
}

/**
 * InfoIcon - A standardized circular information icon with tooltip
 * 
 * This component ensures that all info icons in the application have
 * a consistent circular appearance and proper mobile display.
 * It also manages its own tooltip visibility state.
 */
export default function InfoIcon({ content, position = 'right' }: InfoIconProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Tooltip & arrow positioning styles
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Toggle visibility on click (won't immediately close)
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setIsVisible(!isVisible);
  };
  
  // Show on hover
  const handleMouseEnter = () => {
    setIsVisible(true);
  };
  
  // Hide on mouse leave only if not clicked
  const handleMouseLeave = () => {
    // We don't automatically hide on mouse leave anymore
    // to allow for better mobile experience
  };
  
  // Close tooltip when clicking outside
  useEffect(() => {
    if (!isVisible) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };
    
    // Add a slight delay before attaching the event listener
    // to prevent immediate closing on the first click
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isVisible]);
  
  // Effect for measuring and positioning the tooltip
  useEffect(() => {
    if (!isVisible || !containerRef.current || !tooltipRef.current) return;
    
    // Calculate tooltip position based on container and window dimensions
    const calcTooltipPosition = () => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      const tooltipRect = tooltipRef.current?.getBoundingClientRect();
      
      if (!containerRect || !tooltipRect) return;
      
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const isMobile = windowWidth < 768;
      setIsMobileView(isMobile);
      
      const safeMargin = 16; // Safety margin from viewport edges (px)
      
      let newTooltipStyle: React.CSSProperties = {};
      let newArrowStyle: React.CSSProperties = {};
      
      // On mobile, always center the tooltip on screen
      if (isMobile) {
        // Fixed position centered in the screen
        newTooltipStyle = {
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100vw - 48px)',  // Full width minus margins
          maxWidth: '320px',            // Max width for larger phones
          zIndex: 100,
          boxShadow: '0 0 0 5000px rgba(0,0,0,0.5)' // Dim the background
        };
        
        // For mobile, we don't need an arrow since it's a centered modal
        newArrowStyle = { display: 'none' };
      } else {
        // Desktop positioning logic - standard dropdown
        newTooltipStyle = {
          bottom: '100%',
          marginBottom: '8px',
          maxWidth: '288px', // Fixed width for consistency
          width: '288px',
        };
        
        // Calculate horizontal position for desktop
        const iconCenterX = containerRect.left + (containerRect.width / 2);
        
        // Position based on specified preference
        if (position === 'left') {
          newTooltipStyle.left = '0px';
          newArrowStyle = { left: '10px', marginLeft: '-1.5px' };
        } 
        else if (position === 'right') {
          newTooltipStyle.right = '0px';
          newArrowStyle = { right: '10px', marginRight: '-1.5px' };
        } 
        else {
          // Center positioning
          newTooltipStyle.left = '50%';
          newTooltipStyle.transform = 'translateX(-50%)';
          newArrowStyle = { left: '50%', marginLeft: '-1.5px' };
        }
      }
      
      // Update the styles
      setTooltipStyle(newTooltipStyle);
      setArrowStyle(newArrowStyle);
    };
    
    // Calculate position after render to get correct measurements
    calcTooltipPosition();
    
    // Recalculate on resize
    const handleResize = () => calcTooltipPosition();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible, position]);
  
  return (
    <div className="relative inline-block" ref={containerRef}>
      <div 
        className="inline-flex items-center justify-center rounded-full cursor-pointer ml-2 relative"
        style={{ 
          width: '20px', 
          height: '20px', 
          minWidth: '20px', 
          minHeight: '20px',
          backgroundColor: 'rgb(229, 231, 235)' // gray-200 
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <span className="font-serif text-sm">i</span>
      </div>
      
      {isVisible && (
        <div 
          className="absolute z-50"
          style={tooltipStyle}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the tooltip
          ref={tooltipRef}
        >
          <div className="relative p-4 bg-black text-white rounded shadow-lg z-20">
            {isMobileView && (
              <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-1 right-1 p-2 text-white opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Close tooltip"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            
            {content}
            
            {!isMobileView && (
              <div 
                className="absolute bottom-0 translate-y-1/2 rotate-45 w-3 h-3 bg-black" 
                style={arrowStyle}
              ></div>
            )}
            
            {isMobileView && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setIsVisible(false)}
                  className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-white text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 