'use client'

import React from 'react'

interface InfoIconProps {
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/**
 * InfoIcon - A standardized circular information icon
 * 
 * This component ensures that all info icons in the application have
 * a consistent circular appearance and proper mobile display.
 */
export default function InfoIcon({ onClick, onMouseEnter, onMouseLeave }: InfoIconProps) {
  return (
    <div 
      className="inline-flex items-center justify-center rounded-full cursor-pointer ml-2 relative"
      style={{ 
        width: '20px', 
        height: '20px', 
        minWidth: '20px', 
        minHeight: '20px',
        backgroundColor: 'rgb(229, 231, 235)' // gray-200 
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <span className="font-serif text-sm">i</span>
    </div>
  )
}

/**
 * renderTooltip - A helper function for rendering tooltips with smart positioning
 * 
 * Handles tooltip positioning with mobile-friendly adjustments to prevent
 * content from being cut off the screen edge.
 */
export function renderTooltip(
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