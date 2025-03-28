# Take Place Price Calculator

A modern, interactive calculator for Take Place homes that can be embedded in a Webflow site.

## Features

- Interactive sliders for home dimensions (total size, main floor, second floor)
- Real-time 3D visualization of the home design
- Dynamic pricing calculations based on province, size, and early adopter status
- Responsive design that works on both desktop and mobile devices
- Embeddable components for easy integration with Webflow

## Deployment Instructions

### Option 1: Deploy to Vercel (Recommended)

1. **Connect to GitHub**
   - Push this repository to your GitHub account
   - Sign up for a Vercel account at [vercel.com](https://vercel.com)
   - Click "Import Project" and select your GitHub repo

2. **Configure Deployment**
   - Vercel will automatically detect Next.js settings
   - No additional configuration is needed
   - Click "Deploy"

3. **Get Your Deployment URL**
   - Once deployed, Vercel will provide you with a URL (e.g., `https://your-calculator.vercel.app`)
   - Use this URL in your Webflow embed code

### Option 2: Deploy to Other Platforms

The app can also be deployed to other platforms like Netlify, AWS Amplify, or any service that supports Next.js applications.

## Embedding in Webflow

1. **Add CSS to Webflow**
   - In Webflow, go to Site Settings > Custom Code
   - Add this line to the Head section:
   ```html
   <link rel="stylesheet" href="https://your-calculator-url.com/embed-styles.css">
   ```

2. **Create an Embed Element in Webflow**
   - Create a container element where you want the calculator to appear
   - Add the following HTML code using an Embed element:
   ```html
   <div class="calculator-container">
     <div class="sliders-model-container">
       <div class="sliders-container iframe-container">
         <iframe src="https://your-calculator-url.com/embed/sliders" class="calculator-iframe sliders-iframe"></iframe>
       </div>
       <div class="model-container iframe-container">
         <iframe src="https://your-calculator-url.com/embed/model" class="calculator-iframe model-iframe"></iframe>
       </div>
     </div>
   </div>
   ```

3. **Typeform Integration**
   - The calculator includes a "Get your custom proposal" button that will open a Typeform
   - Open `src/app/embed/sliders/page.tsx` and update the Typeform URL with your actual Typeform form ID
   - Make sure your Typeform has the necessary hidden fields to capture calculator data

## Development

### Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Important Files

- `/src/components/SliderControls.tsx` - Controls component for adjusting dimensions
- `/src/components/House3D.tsx` - 3D visualization of the house
- `/src/app/embed/*` - Embeddable components for Webflow
- `/src/data/pricingData.ts` - Pricing calculations and provincial rates
- `/public/embed-styles.css` - Styling for embedded components

## Mobile Optimization

The calculator is fully responsive and works well on mobile devices. On smaller screens:
- The sliders and 3D model stack vertically
- The 3D model adjusts its height to maintain proportions
- Touch controls work for all interactive elements

## Need Help?

- Visit `/embed` on your deployed calculator for embedding instructions
- See `/public/webflow-example.html` for a complete example
