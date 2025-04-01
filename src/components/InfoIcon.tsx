'use client'

import React, { useState } from 'react'

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
  React.useEffect(() => {
    if (!isVisible) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      setIsVisible(false);
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
  
  return (
    <div className="relative inline-block">
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
      
      {renderTooltip(isVisible, content, position)}
    </div>
  )
}

/**
 * renderTooltip - A helper function for rendering tooltips with smart positioning
 * 
 * Handles tooltip positioning with mobile-friendly adjustments to prevent
 * content from being cut off the screen edge.
 */
function renderTooltip(
  visible: boolean, 
  content: React.ReactNode, 
  position: 'left' | 'right' | 'center' = 'right'
) {
  if (!visible) return null;
  
  let tooltipStyle = {};
  let arrowStyle = {};
  
  // For left position, position arrow at 10px from left (center of icon)
  if (position === 'left') {
    tooltipStyle = { left: '0px', maxWidth: 'calc(100vw - 32px)' };
    arrowStyle = { left: '10px', marginLeft: '-1.5px' };
  } 
  // For right position, position arrow at 10px from right (center of icon)
  else if (position === 'right') {
    tooltipStyle = { right: '0px', maxWidth: 'calc(100vw - 32px)' };
    arrowStyle = { right: '10px', marginRight: '-1.5px' };
  } 
  // For center position, center everything
  else {
    tooltipStyle = { left: '50%', transform: 'translateX(-50%)', maxWidth: 'calc(100vw - 32px)' };
    arrowStyle = { left: '50%', marginLeft: '-1.5px' };
  }
  
  return (
    <div 
      className="absolute bottom-full mb-2 w-72"
      style={tooltipStyle}
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the tooltip
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
} 