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
      const safeMargin = 16; // Safety margin from viewport edges (px)
      
      let newTooltipStyle: React.CSSProperties = {
        bottom: '100%',
        marginBottom: '8px',
        maxWidth: `calc(100vw - ${safeMargin * 2}px)`,
        width: '288px', // Fixed width for consistency
      };
      
      let newArrowStyle: React.CSSProperties = {};
      
      // Calculate horizontal position
      const iconCenterX = containerRect.left + (containerRect.width / 2);
      
      // Clamp positions to ensure tooltip stays within viewport
      if (position === 'left' || (position === 'center' && iconCenterX < windowWidth / 3)) {
        // Left-aligned positioning with boundary checks
        newTooltipStyle.left = '0px';
        newArrowStyle = { left: '10px', marginLeft: '-1.5px' };
        
        // Check if tooltip would overflow right edge
        const rightEdge = containerRect.left + tooltipRect.width;
        if (rightEdge > windowWidth - safeMargin) {
          newTooltipStyle.left = 'auto';
          newTooltipStyle.right = '0px';
          newArrowStyle = { right: '10px', marginRight: '-1.5px' };
        }
      } 
      else if (position === 'right' || (position === 'center' && iconCenterX > windowWidth * 2/3)) {
        // Right-aligned positioning with boundary checks
        newTooltipStyle.right = '0px';
        newArrowStyle = { right: '10px', marginRight: '-1.5px' };
        
        // Check if tooltip would overflow left edge
        const leftEdge = containerRect.right - tooltipRect.width;
        if (leftEdge < safeMargin) {
          newTooltipStyle.right = 'auto';
          newTooltipStyle.left = '0px';
          newArrowStyle = { left: '10px', marginLeft: '-1.5px' };
        }
      } 
      else {
        // Center positioning with boundary checks
        newTooltipStyle.left = '50%';
        newTooltipStyle.transform = 'translateX(-50%)';
        newArrowStyle = { left: '50%', marginLeft: '-1.5px' };
        
        // Check if tooltip would overflow left edge
        const leftEdge = iconCenterX - (tooltipRect.width / 2);
        if (leftEdge < safeMargin) {
          newTooltipStyle.left = '0px';
          newTooltipStyle.transform = 'none';
          newArrowStyle = { left: Math.max(10, iconCenterX - containerRect.left), marginLeft: '-1.5px' };
        }
        
        // Check if tooltip would overflow right edge
        const rightEdge = iconCenterX + (tooltipRect.width / 2);
        if (rightEdge > windowWidth - safeMargin) {
          newTooltipStyle.left = 'auto';
          newTooltipStyle.right = '0px';
          newTooltipStyle.transform = 'none';
          newArrowStyle = { right: Math.max(10, containerRect.right - iconCenterX), marginRight: '-1.5px' };
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
            {content}
            <div 
              className="absolute bottom-0 translate-y-1/2 rotate-45 w-3 h-3 bg-black" 
              style={arrowStyle}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
} 