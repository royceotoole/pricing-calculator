// @ts-nocheck
'use client'

import React, { useMemo, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrthographicCamera, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Let TypeScript know that any element prefixed with a lowercase letter is valid in JSX
// This is a common pattern for React Three Fiber
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

interface ThreeSceneProps {
  totalSize: number
  secondStorySize: number
}

// Create materials
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color('#d7e6f5'),
  transparent: true,
  opacity: 0.3,
  roughness: 0.05,
  metalness: 0.1,
  transmission: 0.96,
  thickness: 0.5,
  reflectivity: 0.3,
  side: THREE.DoubleSide
})

const floorMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#000000'), // Changed from white to black
  roughness: 0.8,
  metalness: 0.2
})

const lineMaterial = new THREE.LineBasicMaterial({
  color: '#000000',
  linewidth: 1
})

const translucent = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color('#ffffff'),
  transparent: true,
  opacity: 0.4,
  roughness: 0.1,
  metalness: 0.1,
  transmission: 0.9,
  side: THREE.DoubleSide
})

function HouseModel({ totalSize, secondStorySize }: ThreeSceneProps) {
  // Constants in feet
  const WIDTH = 26          // Adjusted to 26 feet for 104 sqft modules
  const HEIGHT = 26         // Adjusted to maintain proportion
  const MODULE_LENGTH = 4   // Keep 4 feet as module length
  const MODULE_AREA = WIDTH * MODULE_LENGTH  // Now equals 104 sqft
  
  // Calculate house dimensions
  const mainFloorSize = totalSize - secondStorySize
  const numModules = Math.floor(mainFloorSize / MODULE_AREA)
  const length = numModules * MODULE_LENGTH
  
  // Number of white modules on second floor
  const whiteModulesSecondFloor = Math.floor(secondStorySize / MODULE_AREA)
  
  // Number of translucent modules on second floor
  const translucentModulesSecondFloor = numModules - whiteModulesSecondFloor
  
  // Convert to Three.js units (scale down by factor of 10 for better viewing)
  const widthUnits = WIDTH / 10
  const heightUnits = HEIGHT / 10
  const lengthUnits = length / 10
  const moduleLength = MODULE_LENGTH / 10
  
  // Create floor modules
  const firstFloorModules = []
  const secondFloorWhiteModules = []
  const secondFloorTranslucentModules = []
  
  for (let i = 0; i < numModules; i++) {
    // Position of this module
    const posZ = -lengthUnits / 2 + (i * moduleLength) + moduleLength / 2
    
    // First floor modules (all white)
    firstFloorModules.push(
      // @ts-ignore -- Valid react-three-fiber element
      <mesh key={`first-floor-${i}`} position={[0, 0, posZ]}>
        {/* @ts-ignore -- Valid react-three-fiber element */}
        <boxGeometry args={[widthUnits, 0.0005, moduleLength]} />
        {/* @ts-ignore -- Valid react-three-fiber element */}
        <meshStandardMaterial {...floorMaterial} />
      </mesh>
    )
    
    // Second floor modules - flipped condition
    if (i >= numModules - whiteModulesSecondFloor) {
      // White modules (now at the back of the house)
      secondFloorWhiteModules.push(
        // @ts-ignore -- Valid react-three-fiber element
        <mesh key={`second-floor-white-${i}`} position={[0, heightUnits/2, posZ]}>
          {/* @ts-ignore -- Valid react-three-fiber element */}
          <boxGeometry args={[widthUnits, 0.0005, moduleLength]} />
          {/* @ts-ignore -- Valid react-three-fiber element */}
          <meshStandardMaterial {...floorMaterial} />
        </mesh>
      )
    } else {
      // Translucent modules (now at the front of the house)
      secondFloorTranslucentModules.push(
        // @ts-ignore -- Valid react-three-fiber element
        <mesh key={`second-floor-trans-${i}`} position={[0, heightUnits/2, posZ]}>
          {/* @ts-ignore -- Valid react-three-fiber element */}
          <boxGeometry args={[widthUnits, 0.0005, moduleLength]} />
          {/* @ts-ignore -- Valid react-three-fiber element */}
          <meshStandardMaterial {...translucent} />
        </mesh>
      )
    }
  }
  
  // Create grid lines for the first floor
  const gridLinesFirstFloor = []
  for (let i = 0; i <= numModules; i++) {
    const lineZ = -lengthUnits / 2 + (i * moduleLength)
    const points = [
      new THREE.Vector3(-widthUnits/2, 0.06, lineZ),
      new THREE.Vector3(widthUnits/2, 0.06, lineZ)
    ]
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    gridLinesFirstFloor.push(
      <lineSegments key={`grid-first-${i}`} geometry={geometry}>
        <lineBasicMaterial attach="material" color="#ffffff" linewidth={1} />
      </lineSegments>
    )
  }
  
  // Create longitudinal grid lines 
  const longitudinalLinesFirstFloor = []
  longitudinalLinesFirstFloor.push(
    <lineSegments key="grid-long-left" geometry={
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-widthUnits/2, 0.06, -lengthUnits/2),
        new THREE.Vector3(-widthUnits/2, 0.06, lengthUnits/2)
      ])
    }>
      <lineBasicMaterial attach="material" color="#ffffff" linewidth={1} />
    </lineSegments>
  )
  longitudinalLinesFirstFloor.push(
    <lineSegments key="grid-long-right" geometry={
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(widthUnits/2, 0.06, -lengthUnits/2),
        new THREE.Vector3(widthUnits/2, 0.06, lengthUnits/2)
      ])
    }>
      <lineBasicMaterial attach="material" color="#ffffff" linewidth={1} />
    </lineSegments>
  )
  
  // Create grid lines for the second floor
  const gridLinesSecondFloor = []
  const dashedGridLinesSecondFloor = [] // New array for dashed lines in translucent area
  
  for (let i = 0; i <= numModules; i++) {
    const lineZ = -lengthUnits / 2 + (i * moduleLength)
    
    // Check if this line is in the translucent section or white section
    const isInTranslucentSection = i <= translucentModulesSecondFloor
    
    if (isInTranslucentSection) {
      // Create simpler dashed black lines - use shorter segments (now 4x smaller than original)
      const segmentCount = 40 // Doubled again from 20 to make dashes 2x smaller
      const segmentWidth = widthUnits / segmentCount
      
      for (let j = 0; j < segmentCount; j += 2) { // Skip every other segment to create gaps
        const startX = -widthUnits/2 + j * segmentWidth
        const endX = startX + segmentWidth
        
        const dashPoints = [
          new THREE.Vector3(startX, heightUnits/2 + 0.06, lineZ),
          new THREE.Vector3(endX, heightUnits/2 + 0.06, lineZ)
        ]
        const dashGeometry = new THREE.BufferGeometry().setFromPoints(dashPoints)
        dashedGridLinesSecondFloor.push(
          <lineSegments key={`dashed-grid-second-${i}-${j}`} geometry={dashGeometry}>
            <lineBasicMaterial attach="material" color="#000000" linewidth={1} />
          </lineSegments>
        )
      }
    } else {
      // Regular white line for solid section
      const points = [
        new THREE.Vector3(-widthUnits/2, heightUnits/2 + 0.06, lineZ),
        new THREE.Vector3(widthUnits/2, heightUnits/2 + 0.06, lineZ)
      ]
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      gridLinesSecondFloor.push(
        <lineSegments key={`grid-second-${i}`} geometry={geometry}>
          <lineBasicMaterial attach="material" color="#ffffff" linewidth={1} />
        </lineSegments>
      )
    }
  }
  
  // Create longitudinal grid lines for second floor 
  const longitudinalLinesSecondFloor = []
  longitudinalLinesSecondFloor.push(
    <lineSegments key="grid-long-left-second" geometry={
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-widthUnits/2, heightUnits/2 + 0.06, -lengthUnits/2),
        new THREE.Vector3(-widthUnits/2, heightUnits/2 + 0.06, lengthUnits/2)
      ])
    }>
      <lineBasicMaterial attach="material" color="#ffffff" linewidth={1} />
    </lineSegments>
  )
  longitudinalLinesSecondFloor.push(
    <lineSegments key="grid-long-right-second" geometry={
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(widthUnits/2, heightUnits/2 + 0.06, -lengthUnits/2),
        new THREE.Vector3(widthUnits/2, heightUnits/2 + 0.06, lengthUnits/2)
      ])
    }>
      <lineBasicMaterial attach="material" color="#ffffff" linewidth={1} />
    </lineSegments>
  )
  
  // Create the walls (glass)
  const walls = [
    // Front wall
    <mesh key="front-wall" position={[0, heightUnits/4, -lengthUnits/2]}>
      <planeGeometry args={[widthUnits, heightUnits/2]} />
      <meshPhysicalMaterial {...glassMaterial} />
    </mesh>,
    // Back wall
    <mesh key="back-wall" position={[0, heightUnits/4, lengthUnits/2]}>
      <planeGeometry args={[widthUnits, heightUnits/2]} />
      <meshPhysicalMaterial {...glassMaterial} />
    </mesh>,
    // Left wall
    <mesh key="left-wall" position={[-widthUnits/2, heightUnits/4, 0]} rotation={[0, Math.PI/2, 0]}>
      <planeGeometry args={[lengthUnits, heightUnits/2]} />
      <meshPhysicalMaterial {...glassMaterial} />
    </mesh>,
    // Right wall
    <mesh key="right-wall" position={[widthUnits/2, heightUnits/4, 0]} rotation={[0, Math.PI/2, 0]}>
      <planeGeometry args={[lengthUnits, heightUnits/2]} />
      <meshPhysicalMaterial {...glassMaterial} />
    </mesh>,
    // Second floor front wall - reduced height to 1/4 of height (half of first floor)
    <mesh key="front-wall-second" position={[0, heightUnits * 0.625, -lengthUnits/2]}>
      <planeGeometry args={[widthUnits, heightUnits/4]} />
      <meshPhysicalMaterial {...glassMaterial} />
    </mesh>,
    // Second floor back wall - reduced height to 1/4 of height (half of first floor)
    <mesh key="back-wall-second" position={[0, heightUnits * 0.625, lengthUnits/2]}>
      <planeGeometry args={[widthUnits, heightUnits/4]} />
      <meshPhysicalMaterial {...glassMaterial} />
    </mesh>,
    // Second floor left wall - reduced height to 1/4 of height (half of first floor)
    <mesh key="left-wall-second" position={[-widthUnits/2, heightUnits * 0.625, 0]} rotation={[0, Math.PI/2, 0]}>
      <planeGeometry args={[lengthUnits, heightUnits/4]} />
      <meshPhysicalMaterial {...glassMaterial} />
    </mesh>,
    // Second floor right wall - reduced height to 1/4 of height (half of first floor)
    <mesh key="right-wall-second" position={[widthUnits/2, heightUnits * 0.625, 0]} rotation={[0, Math.PI/2, 0]}>
      <planeGeometry args={[lengthUnits, heightUnits/4]} />
      <meshPhysicalMaterial {...glassMaterial} />
    </mesh>
  ]
  
  // Create the gable roof (45-degree slope)
  const roofHeight = widthUnits / 2 // For 45-degree slope
  // Adjusted roof position to match the lower second floor height
  const roofBaseY = heightUnits * 0.75 // now at 3/4 of total height instead of full height
  const roof = [
    // Left roof panel - lowered
    <mesh key="roof-left" position={[-widthUnits/4, roofBaseY + roofHeight/2, 0]} rotation={[0, 0, Math.PI/4]}>
      <boxGeometry args={[Math.sqrt(2) * widthUnits/2, 0.00025, lengthUnits]} />
      <meshPhysicalMaterial {...glassMaterial} />
    </mesh>,
    // Right roof panel - lowered
    <mesh key="roof-right" position={[widthUnits/4, roofBaseY + roofHeight/2, 0]} rotation={[0, 0, -Math.PI/4]}>
      <boxGeometry args={[Math.sqrt(2) * widthUnits/2, 0.00025, lengthUnits]} />
      <meshPhysicalMaterial {...glassMaterial} />
    </mesh>,
    // Front gable - using a simple approach: rectangle with triangles cut from corners
    <mesh key="gable-front" position={[0, heightUnits * 0.375, -lengthUnits/2 - 0.002]}>
      {(() => {
        // Create a shape for the gable
        const shape = new THREE.Shape();
        
        // Adjusted to match proper building height
        // 0.375 is the midpoint of the overall structure (0.75/2)
        const bottomY = -heightUnits * 0.375; // Lower to match the base of the structure
        const midHeight = heightUnits * 0.375; // Adjusted midpoint
        const topY = midHeight + roofHeight; // Peak height 
        
        // Start at bottom left - fully aligned with building outline
        shape.moveTo(-widthUnits/2, bottomY);
        
        // Draw clockwise: bottom edge
        shape.lineTo(widthUnits/2, bottomY);
        
        // Right edge up to where the slope starts
        shape.lineTo(widthUnits/2, midHeight);
        
        // Diagonal line to peak (cutting off top right corner)
        shape.lineTo(0, topY);
        
        // Diagonal line down (cutting off top left corner)
        shape.lineTo(-widthUnits/2, midHeight);
        
        // Back to start
        shape.lineTo(-widthUnits/2, bottomY);
        
        // Create geometry from the shape
        return <shapeGeometry args={[shape]} />
      })()}
      <meshPhysicalMaterial color="#d7e6f5" transparent={true} opacity={0.3} side={THREE.DoubleSide} />
    </mesh>,
    
    // Back gable - same approach as front
    <mesh key="gable-back" position={[0, heightUnits * 0.375, lengthUnits/2 + 0.002]} rotation={[0, Math.PI, 0]}>
      {(() => {
        // Create a shape for the gable
        const shape = new THREE.Shape();
        
        // Adjusted to match proper building height
        // 0.375 is the midpoint of the overall structure (0.75/2)
        const bottomY = -heightUnits * 0.375; // Lower to match the base of the structure
        const midHeight = heightUnits * 0.375; // Adjusted midpoint
        const topY = midHeight + roofHeight; // Peak height 
        
        // Start at bottom left - fully aligned with building outline
        shape.moveTo(-widthUnits/2, bottomY);
        
        // Draw clockwise: bottom edge
        shape.lineTo(widthUnits/2, bottomY);
        
        // Right edge up to where the slope starts
        shape.lineTo(widthUnits/2, midHeight);
        
        // Diagonal line to peak (cutting off top right corner)
        shape.lineTo(0, topY);
        
        // Diagonal line down (cutting off top left corner)
        shape.lineTo(-widthUnits/2, midHeight);
        
        // Back to start
        shape.lineTo(-widthUnits/2, bottomY);
        
        // Create geometry from the shape
        return <shapeGeometry args={[shape]} />
      })()}
      <meshPhysicalMaterial color="#d7e6f5" transparent={true} opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  ]
  
  // Create clean outline segments for the building structure without diagonals across faces
  // Only create the main structural lines
  const outlineSegments = [
    // First floor outline - only top edges (not bottom edges)
    [new THREE.Vector3(-widthUnits/2, 0.01, -lengthUnits/2), new THREE.Vector3(widthUnits/2, 0.01, -lengthUnits/2)], // front edge
    [new THREE.Vector3(widthUnits/2, 0.01, -lengthUnits/2), new THREE.Vector3(widthUnits/2, 0.01, lengthUnits/2)], // right edge
    [new THREE.Vector3(widthUnits/2, 0.01, lengthUnits/2), new THREE.Vector3(-widthUnits/2, 0.01, lengthUnits/2)], // back edge
    [new THREE.Vector3(-widthUnits/2, 0.01, lengthUnits/2), new THREE.Vector3(-widthUnits/2, 0.01, -lengthUnits/2)], // left edge
    
    // Second floor outline - only top edges
    [new THREE.Vector3(-widthUnits/2, heightUnits/2 + 0.01, -lengthUnits/2), new THREE.Vector3(widthUnits/2, heightUnits/2 + 0.01, -lengthUnits/2)], // front edge
    [new THREE.Vector3(widthUnits/2, heightUnits/2 + 0.01, -lengthUnits/2), new THREE.Vector3(widthUnits/2, heightUnits/2 + 0.01, lengthUnits/2)], // right edge
    [new THREE.Vector3(widthUnits/2, heightUnits/2 + 0.01, lengthUnits/2), new THREE.Vector3(-widthUnits/2, heightUnits/2 + 0.01, lengthUnits/2)], // back edge
    [new THREE.Vector3(-widthUnits/2, heightUnits/2 + 0.01, lengthUnits/2), new THREE.Vector3(-widthUnits/2, heightUnits/2 + 0.01, -lengthUnits/2)], // left edge
    
    // Vertical connections - essential structural elements
    [new THREE.Vector3(-widthUnits/2, 0.01, -lengthUnits/2), new THREE.Vector3(-widthUnits/2, heightUnits/2, -lengthUnits/2)], // front-left corner
    [new THREE.Vector3(widthUnits/2, 0.01, -lengthUnits/2), new THREE.Vector3(widthUnits/2, heightUnits/2, -lengthUnits/2)], // front-right corner
    [new THREE.Vector3(widthUnits/2, 0.01, lengthUnits/2), new THREE.Vector3(widthUnits/2, heightUnits/2, lengthUnits/2)], // back-right corner
    [new THREE.Vector3(-widthUnits/2, 0.01, lengthUnits/2), new THREE.Vector3(-widthUnits/2, heightUnits/2, lengthUnits/2)], // back-left corner
    
    // Second floor to roof connections
    [new THREE.Vector3(-widthUnits/2, heightUnits/2, -lengthUnits/2), new THREE.Vector3(-widthUnits/2, heightUnits * 0.75, -lengthUnits/2)], // front-left
    [new THREE.Vector3(widthUnits/2, heightUnits/2, -lengthUnits/2), new THREE.Vector3(widthUnits/2, heightUnits * 0.75, -lengthUnits/2)], // front-right
    [new THREE.Vector3(widthUnits/2, heightUnits/2, lengthUnits/2), new THREE.Vector3(widthUnits/2, heightUnits * 0.75, lengthUnits/2)], // back-right
    [new THREE.Vector3(-widthUnits/2, heightUnits/2, lengthUnits/2), new THREE.Vector3(-widthUnits/2, heightUnits * 0.75, lengthUnits/2)], // back-left
    
    // Roof ridge and edges
    [new THREE.Vector3(0, heightUnits * 0.75 + roofHeight, -lengthUnits/2), new THREE.Vector3(0, heightUnits * 0.75 + roofHeight, lengthUnits/2)], // ridge line
    [new THREE.Vector3(-widthUnits/2, heightUnits * 0.75, -lengthUnits/2), new THREE.Vector3(0, heightUnits * 0.75 + roofHeight, -lengthUnits/2)], // front left roof edge
    [new THREE.Vector3(widthUnits/2, heightUnits * 0.75, -lengthUnits/2), new THREE.Vector3(0, heightUnits * 0.75 + roofHeight, -lengthUnits/2)], // front right roof edge
    [new THREE.Vector3(-widthUnits/2, heightUnits * 0.75, lengthUnits/2), new THREE.Vector3(0, heightUnits * 0.75 + roofHeight, lengthUnits/2)], // back left roof edge
    [new THREE.Vector3(widthUnits/2, heightUnits * 0.75, lengthUnits/2), new THREE.Vector3(0, heightUnits * 0.75 + roofHeight, lengthUnits/2)] // back right roof edge
  ]
  
  // Create a single geometry for all outline segments
  const outlinePoints: number[] = []
  outlineSegments.forEach(segment => {
    outlinePoints.push(segment[0].x, segment[0].y, segment[0].z)
    outlinePoints.push(segment[1].x, segment[1].y, segment[1].z)
  })
  
  const outlineGeometry = new THREE.BufferGeometry()
  outlineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(outlinePoints, 3))
  
  return (
    <group>
      {/* First floor */}
      <group>{firstFloorModules}</group>
      <group>{gridLinesFirstFloor}</group>
      <group>{longitudinalLinesFirstFloor}</group>
      
      {/* Second floor */}
      <group>{secondFloorWhiteModules}</group>
      <group>{secondFloorTranslucentModules}</group>
      <group>{gridLinesSecondFloor}</group>
      <group>{dashedGridLinesSecondFloor}</group>
      <group>{longitudinalLinesSecondFloor}</group>
      
      {/* Walls */}
      <group>{walls}</group>
      
      {/* Roof */}
      <group>{roof}</group>
      
      {/* Clean building outline */}
      <lineSegments geometry={outlineGeometry}>
        <lineBasicMaterial attach="material" color="#000000" linewidth={2} />
      </lineSegments>
      
      {/* Warm edge light positioned behind the house */}
      <pointLight 
        position={[0, heightUnits * 0.5, lengthUnits * 0.7]} 
        intensity={0.6} 
        color="#ff9e40" 
        distance={15}
        decay={2}
      />
      
      {/* Warm key light (3800K) to highlight the model */}
      <directionalLight 
        position={[widthUnits * 1.5, heightUnits * 1.5, -lengthUnits * 0.5]} 
        intensity={1.2} 
        color="#ffb66d" 
        castShadow
      />
    </group>
  )
}

// Camera controller with rotation based on mouse position when hovering
function CameraController() {
  const { camera, gl } = useThree();
  
  // Calculate the center point of the second floor plate - now centered at 0
  const centerPoint = useMemo(() => {
    return new THREE.Vector3(0, 26/10/2, 0); // Center of the second floor (height is now 26)
  }, []);

  // Ensure camera initially looks at center point
  useEffect(() => {
    if (camera) {
      camera.lookAt(centerPoint);
      camera.updateProjectionMatrix();
    }
  }, [camera, centerPoint]);

  // Reference to store mouse/touch position
  const pointer = useRef({ x: 0, y: 0, isOver: false });
  
  // Set up camera position and track movement
  useEffect(() => {
    // Use a fixed radius (camera distance) for all devices
    // This ensures consistent positioning regardless of container size changes
    const radius = 7;
    
    // Base 45-degree isometric view settings
    const baseX = 0.785; // 45 degrees in radians (45°)
    const baseY = 0.35;  // Slight elevation (20°)
    
    // Set initial camera position
    if (camera) {
      camera.position.x = Math.sin(baseX) * Math.cos(baseY) * radius;
      camera.position.z = Math.cos(baseX) * Math.cos(baseY) * radius;
      camera.position.y = Math.sin(baseY) * radius + centerPoint.y;
      
      camera.lookAt(centerPoint);
      camera.updateProjectionMatrix();
    }
    
    // Mouse movement handler
    const handleMouseMove = (e) => {
      // Track mouse position relative to canvas
      const rect = gl.domElement.getBoundingClientRect();
      
      // Check if mouse is over the canvas
      if (
        e.clientX >= rect.left && 
        e.clientX <= rect.right && 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom
      ) {
        // Calculate normalized position (-0.5 to 0.5)
        pointer.current.x = ((e.clientX - rect.left) / rect.width) - 0.5;
        pointer.current.y = ((e.clientY - rect.top) / rect.height) - 0.5;
        pointer.current.isOver = true;
      } else {
        // Mouse is outside
        pointer.current.isOver = false;
      }
    };
    
    // Touch handlers for mobile devices
    const handleTouchStart = (e) => {
      // Prevent default to avoid scrolling, but only on the canvas
      e.preventDefault();
      
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = gl.domElement.getBoundingClientRect();
        
        // Always enable rotation on touch start - mobile users expect to rotate when touching
        pointer.current.isOver = true;
        
        // Calculate normalized position (-0.5 to 0.5)
        pointer.current.x = ((touch.clientX - rect.left) / rect.width) - 0.5;
        pointer.current.y = ((touch.clientY - rect.top) / rect.height) - 0.5;
      }
    };
    
    const handleTouchMove = (e) => {
      // Always prevent default for touch move to avoid scrolling when interacting with model
      e.preventDefault();
      
      if (e.touches.length === 1 && pointer.current.isOver) {
        const touch = e.touches[0];
        const rect = gl.domElement.getBoundingClientRect();
        
        // Calculate normalized position (-0.5 to 0.5)
        pointer.current.x = ((touch.clientX - rect.left) / rect.width) - 0.5;
        pointer.current.y = ((touch.clientY - rect.top) / rect.height) - 0.5;
      }
    };
    
    const handleTouchEnd = (e) => {
      // Reset rotation to default position gradually when touch ends
      // Add a small delay before disabling rotation to make animation smoother
      setTimeout(() => {
        pointer.current.isOver = false;
      }, 50);
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    gl.domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    gl.domElement.addEventListener('touchend', handleTouchEnd);
    gl.domElement.addEventListener('touchcancel', handleTouchEnd);
    
    // Animation loop for camera movement - reduced motion for stability
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      if (pointer.current.isOver && camera) {
        // Calculate new camera position with gentle rotation
        // Reduced rotation ranges for more stability
        const horizontalRotationRange = 0.35; // Reduced horizontal range
        const verticalRotationRange = 0.18; // Reduced vertical range
        
        // Apply pointer position to adjust base angles
        // Reverse the x direction and apply stronger horizontal effect
        const x = baseX + (-pointer.current.x * horizontalRotationRange);
        const y = baseY + (pointer.current.y * verticalRotationRange);
        
        // Update camera position for a smooth orbit around centerPoint
        const newX = Math.sin(x) * Math.cos(y) * radius;
        const newZ = Math.cos(x) * Math.cos(y) * radius;
        const newY = Math.sin(y) * radius + centerPoint.y;
        
        // Use slower interpolation for more stable movement
        const horizontalSpeed = 0.06;
        const verticalSpeed = 0.05;
        
        // Apply different speeds to different axes
        camera.position.x += (newX - camera.position.x) * horizontalSpeed;
        camera.position.z += (newZ - camera.position.z) * horizontalSpeed;
        camera.position.y += (newY - camera.position.y) * verticalSpeed;
        
        // Keep camera looking at center point
        camera.lookAt(centerPoint);
        camera.updateProjectionMatrix();
      }
      
      return animationId;
    };
    
    // Start animation loop
    const animationId = animate();
    
    // Cleanup event listeners and animation on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.removeEventListener('touchstart', handleTouchStart);
      gl.domElement.removeEventListener('touchmove', handleTouchMove);
      gl.domElement.removeEventListener('touchend', handleTouchEnd);
      gl.domElement.removeEventListener('touchcancel', handleTouchEnd);
      cancelAnimationFrame(animationId);
    };
  }, [camera, centerPoint, gl]);
  
  return null;
}

// Helper function to safely get device pixel ratio
const getDevicePixelRatio = () => {
  if (typeof window !== 'undefined') {
    return window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio;
  }
  return 1;
};

// Helper to get responsive zoom level based on screen width
const getResponsiveZoom = () => {
  if (typeof window === 'undefined') return 45; // Default zoom for SSR
  
  const width = window.innerWidth;
  
  // Increase zoom values by 15% to match the 25% smaller container
  // This ensures the model appears the same relative size in the smaller container
  if (width < 480) return 35; // Extra small devices
  if (width < 768) return 40; // Small devices
  if (width < 1024) return 45; // Medium devices
  return 55; // Desktop default zoom
};

// Check WebGL support
const checkWebGLSupport = () => {
  if (typeof window === 'undefined') return { supported: false, error: 'SSR' };
  
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { 
        supported: false, 
        error: 'WebGL not supported' 
      };
    }
    
    return { 
      supported: true,
      renderer: gl.getParameter(gl.RENDERER),
      vendor: gl.getParameter(gl.VENDOR)
    };
  } catch (e) {
    return { 
      supported: false, 
      error: e.message 
    };
  }
};

export default function ThreeScene({ totalSize, secondStorySize }: ThreeSceneProps) {
  // Add error handling for the Canvas component
  const [renderError, setRenderError] = React.useState<Error | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [webGLInfo, setWebGLInfo] = React.useState({ checked: false, info: null });
  const [zoom, setZoom] = React.useState(getResponsiveZoom());
  
  // Update zoom level on window resize
  React.useEffect(() => {
    const handleResize = () => {
      setZoom(getResponsiveZoom());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Check WebGL support on client-side
  React.useEffect(() => {
    const info = checkWebGLSupport();
    setWebGLInfo({ checked: true, info });
    console.log('WebGL support:', info);
  }, []);
  
  // Device pixel ratio for responsive rendering
  const dpr = getDevicePixelRatio();
  
  // Handle errors in the 3D renderer
  const handleError = (error: Error) => {
    console.error('Canvas error:', error);
    setRenderError(error);
  };

  // Handle successful canvas creation
  const handleCreated = () => {
    setIsLoaded(true);
    console.log('Canvas successfully created');
  };
  
  // If there's an error, show a fallback UI
  if (renderError) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h3>Unable to load 3D viewer</h3>
        <p>There was an error initializing the 3D model: {renderError.message}</p>
        {webGLInfo.checked && !webGLInfo.info?.supported && (
          <div style={{ marginTop: '10px', color: '#ff0000' }}>
            <p>WebGL is not supported by your device</p>
            <p>Error: {webGLInfo.info?.error}</p>
          </div>
        )}
        <p>Try using a different browser or device with better WebGL support.</p>
      </div>
    );
  }

  // Use a loading state instead of Suspense
  const loadingFallback = (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      fontWeight: '500',
      color: '#666'
    }}>
      Loading 3D model...
    </div>
  );
  
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center', // Center vertically
    }}>
      {/* Remove Suspense and handle loading state differently */}
      <Canvas 
        shadows 
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          depth: true,
          stencil: false,
          // Disable WebXR to avoid AR button on mobile
          xrCompatible: false
        }}
        onError={handleError}
        onCreated={handleCreated}
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block',
          touchAction: 'none', // Disable browser touch actions
          position: 'absolute' // Ensure canvas stays fixed in container
        }}
        dpr={dpr}
        camera={{ 
          position: [5, 5, 5], 
          fov: 45, 
          near: 0.1, 
          far: 1000, 
          zoom: zoom,
          up: [0, 1, 0] // Ensure consistent up vector
        }}
        fallback={loadingFallback}
        raycaster={{ params: { Line: { threshold: 0.15 }, Points: { threshold: 0.15 } } }}
      >
        <CameraController />
        <OrthographicCamera 
          makeDefault
          position={[5, 5, 5]}
          zoom={zoom}
          near={0.1}
          far={1000}
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
        
        {/* Make sure position is consistent */}
        <group position={[0, 0, 0]}>
          <HouseModel totalSize={totalSize} secondStorySize={secondStorySize} />
        </group>
      </Canvas>
      
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          bottom: '50%',
          left: 0,
          right: 0,
          padding: '8px 10px',
          backgroundColor: 'rgba(0,0,0,0.6)',
          color: 'white',
          fontSize: '13px',
          textAlign: 'center',
          transform: 'translateY(50%)', // Center vertically
          zIndex: 20
        }}>
          Initializing 3D viewer...
        </div>
      )}

      {/* Legend in bottom left corner - ensuring proper positioning on mobile */}
      {isLoaded && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          padding: '12px 15px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '6px',
          fontSize: '14px', // Reverting to original size
          fontFamily: '"Suisse Intl Mono", SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          zIndex: 10, // Ensure it's above everything else
          userSelect: 'none',
          pointerEvents: 'none', // Don't interfere with touch events
          maxWidth: '90%' // Prevent overflow on small screens
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ 
              width: '16.8px', 
              height: '16.8px', 
              backgroundColor: 'rgba(0,0,0,0.75)',
              border: '0.5px solid rgba(255,255,255,0.8)',
              marginRight: '10px' 
            }}></div>
            <span style={{ opacity: 0.5 }}>FLOOR AREA</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '16.8px', 
              height: '16.8px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: '1.2px dashed #000',
              borderWidth: '1.2px',
              borderStyle: 'dashed',
              borderRadius: '0',
              borderColor: '#000',
              backgroundSize: '4.8px 4.8px', 
              marginRight: '10px',
              boxSizing: 'border-box'
            }}></div>
            <span style={{ opacity: 0.5 }}>OPEN TO BELOW</span>
          </div>
        </div>
      )}

      {/* Configuration text in top left corner */}
      {isLoaded && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '12px 15px',
          fontSize: '14px',
          fontFamily: '"Suisse Intl Mono", SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          zIndex: 10,
          userSelect: 'none',
          opacity: 0.5,
          pointerEvents: 'none' // Don't interfere with touch events
        }}>
          CONFIGURATION
        </div>
      )}
    </div>
  );
} 