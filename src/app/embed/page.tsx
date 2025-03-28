'use client'

import React from 'react'
import Link from 'next/link'

export default function EmbedDocumentation() {
  // Replace with your actual deployed URL once deployed
  const baseUrl = 'https://your-calculator-url.com'
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Embedding the Take Place Price Calculator in Webflow</h1>
      
      <div className="mb-8">
        <p className="mb-4">
          This documentation explains how to embed the calculator components in your Webflow site.
          The calculator is divided into two separate components you can embed:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Sliders Component</strong> - Contains the three sliders for adjusting the home dimensions</li>
          <li><strong>3D Model Component</strong> - Shows the visualization of the house</li>
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Step 1: Add CSS to Webflow</h2>
        <p className="mb-4">
          Add the following CSS link to your Webflow site's custom code section:
        </p>
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <pre className="text-sm overflow-x-auto">
            {`<link rel="stylesheet" href="${baseUrl}/embed-styles.css">`}
          </pre>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Step 2: Add the Embed Code to Webflow</h2>
        <p className="mb-4">
          Add the following HTML structure to your Webflow site where you want the calculator to appear:
        </p>
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <pre className="text-sm overflow-x-auto">
{`<div class="calculator-container">
  <div class="sliders-model-container">
    <div class="sliders-container iframe-container">
      <iframe src="${baseUrl}/embed/sliders" class="calculator-iframe sliders-iframe"></iframe>
    </div>
    <div class="model-container iframe-container">
      <iframe src="${baseUrl}/embed/model" class="calculator-iframe model-iframe"></iframe>
    </div>
  </div>
</div>`}
          </pre>
        </div>
        
        <p className="mb-4">
          This structure will:
          <ul className="list-disc pl-6 mt-2">
            <li>Display sliders and 3D model side-by-side on desktop</li>
            <li>Stack both components vertically on mobile</li>
            <li>Maintain proper spacing and responsive behavior</li>
          </ul>
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Preview Individual Components</h2>
        <p className="mb-4">
          You can preview each component individually:
        </p>
        <ul className="list-disc pl-6">
          <li className="mb-2">
            <Link href="/embed/sliders" target="_blank" className="text-blue-600 hover:underline">
              Sliders Component
            </Link>
            <span className="ml-2 text-gray-600">- Contains all the interactive controls</span>
          </li>
          <li>
            <Link href="/embed/model" target="_blank" className="text-blue-600 hover:underline">
              3D Model Component
            </Link>
            <span className="ml-2 text-gray-600">- Shows the interactive 3D visualization</span>
          </li>
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Important Notes</h2>
        <ul className="list-disc pl-6">
          <li className="mb-2">Both components share the same state, so changes in the sliders will automatically update the 3D model</li>
          <li className="mb-2">The components use responsive design and will adapt to your Webflow container size</li>
          <li className="mb-2">For the best visual experience, make sure the container has adequate width and height</li>
          <li>All typeform integration is built-in and will work automatically for lead capture</li>
        </ul>
      </div>
    </div>
  )
} 