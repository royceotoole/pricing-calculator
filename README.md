# Take Place Price Calculator

A comprehensive, interactive calculator for Take Place homes that visualizes home designs in 3D and provides detailed pricing estimates. This application can be used standalone or embedded in a Webflow site.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technical Stack](#technical-stack)
4. [Application Architecture](#application-architecture)
5. [Core Components](#core-components)
6. [Data Model](#data-model)
7. [Pricing Calculations](#pricing-calculations)
8. [3D Visualization](#3d-visualization)
9. [Integration Points](#integration-points)
10. [Deployment Guide](#deployment-guide)
11. [Development Guide](#development-guide)
12. [Troubleshooting](#troubleshooting)
13. [Feature Configuration](#feature-configuration)
14. [Maintenance](#maintenance)

## Overview

The Take Place Price Calculator is an interactive tool that allows potential customers to design their custom home by configuring dimensions, view a real-time 3D model of their design, and receive an accurate price estimate based on size, location, and additional factors. It includes integration with Typeform for lead capture and AWS S3 for screenshot functionality.

## Features

- **Interactive Home Configuration**:
  - Slider controls for total home size (832-4160 sq ft)
  - Main floor size adjustment with dynamic constraints
  - Second floor size controls with real-time visualization of open-to-above areas
  - Province selection for location-specific pricing

- **Responsive 3D Visualization**:
  - Real-time 3D model that updates as dimensions change
  - Interactive camera controls for rotating and zooming
  - Clear visual distinction between floor areas and open-to-above spaces
  - Optimized for both desktop and mobile devices

- **Advanced Pricing Calculator**:
  - Provincial multipliers for location-specific pricing
  - Detailed cost breakdown including base price and additional costs
  - Early adopter incentive option with automatic discounting
  - Gross vs. net floor area toggle with appropriate calculations

- **Integration Capabilities**:
  - Typeform integration for lead capture with parameter passing
  - AWS S3 integration for model screenshots
  - Embeddable components for Webflow integration
  - Deep linking capabilities for marketing campaigns

- **User Experience Enhancements**:
  - Informational tooltips for key concepts
  - Mobile-optimized interface that adapts to screen size
  - Accessible design with keyboard navigation support
  - Smooth animations and transitions

## Technical Stack

- **Frontend Framework**: Next.js 13+ with App Router
- **UI Library**: React 18+
- **Styling**: Tailwind CSS with custom configuration
- **3D Rendering**: Three.js with React Three Fiber
- **State Management**: React Context API
- **Form Integration**: Typeform with URL parameter passing
- **Image Storage**: AWS S3 for screenshot uploads
- **Deployment**: Vercel (recommended) or any Next.js-compatible platform
- **Build Tools**: Webpack (via Next.js)
- **TypeScript**: Used throughout for type safety
- **Testing**: Jest and React Testing Library

## Application Architecture

The application follows a modular architecture with clear separation of concerns:

```
src/
├── app/                   # Next.js 13+ App Router structure
│   ├── api/               # API routes for server-side operations
│   ├── calculator/        # Main calculator page
│   ├── components/        # React components
│   ├── context/           # Context providers for state management
│   ├── embed/             # Embeddable components for Webflow
├── config/                # Configuration files
├── data/                  # Data models and constants
├── lib/                   # Utility functions and helpers
├── public/                # Static assets
```

### Key Architectural Patterns

1. **Component-Based Design**: All UI elements are broken down into reusable React components
2. **Context-Based State Management**: Global state is managed through React Context
3. **Server-Side API Routes**: Next.js API routes for server operations like S3 uploads
4. **Progressive Enhancement**: Core functionality works without JavaScript
5. **Responsive Design**: Adapts to different screen sizes using Tailwind's responsive utilities

## Core Components

### Calculator Page (`src/app/calculator/page.tsx`)
The main calculator page that brings together all components and handles the user flow. It manages:
- Slider interactions for home dimensions
- Price calculations and display
- 3D model visualization
- TypeForm integration
- Screenshot capture and upload

### House3D Component (`src/app/components/House3D.tsx`)
Responsible for rendering the 3D visualization of the house based on user inputs:
- Manages the canvas for 3D rendering
- Handles camera controls and interactions
- Provides the screenshot capture functionality
- Implements error boundary for resilience

### ThreeScene Component (`src/app/components/ThreeScene.tsx`)
The core 3D rendering component using Three.js and React Three Fiber:
- Creates the 3D house model with proper scaling
- Manages different materials for floors and open areas
- Implements lighting and shadows
- Provides camera controls for user interaction

### CalculatorContext (`src/app/context/CalculatorContext.tsx`)
Centralizes state management for the calculator:
- Maintains all user inputs (dimensions, province, etc.)
- Calculates price based on current inputs
- Provides state and methods to all child components
- Handles gross vs. net floor area calculations

### TypeForm Integration (`src/config/typeform.ts`)
Manages the integration with TypeForm:
- Constructs parameter URLs for TypeForm
- Handles screenshot upload to AWS S3
- Provides utility functions for form opening

## Data Model

### Provincial Data
The application includes detailed provincial factors for accurate pricing:
- Base multipliers for each province
- Foundation cost multipliers
- Shipping distance by province
- Utility connection multipliers
- Permit fee variations

### Foundation and Container Data
Detailed tables for foundation requirements and shipping containers:
- Foundation piles needed based on main floor size
- Bearing pile quantities
- Bracing pile quantities
- Shipping container quantities

### Price Calculation Model
A comprehensive model for calculating all price components:
- Base price calculation
- Floor-specific costs
- Provincial adjustments
- Additional costs (foundation, delivery, hookups)
- Early adopter discounts

## Pricing Calculations

The pricing calculator uses a sophisticated model defined in `src/data/pricingData.ts`:

### Base Price Calculation
- Starts with a base price of $205,000
- Adds $336 per square foot for main floor
- Adds $166 per square foot for second floor
- Applies provincial multiplier (ranges from 0.98 to 1.22)

### Additional Costs
- **Foundation**: Calculated based on the number of bearing and bracing piles required
- **Delivery**: Based on number of containers and distance to province
- **Electrical Hookup**: Fixed cost of $2,500
- **Sewer/Water/Septic**: Range from $6,500 to $25,000
- **Permit Fees**: Varies by province

### Early Adopter Incentive
- Optional 10% discount per square foot for early adopters
- Applied to the base home price before additional costs

### Gross vs. Net Floor Area
- Toggle to switch between gross floor area (exterior walls) and net floor area (interior walls)
- Net area is approximately 8% less than gross area
- Pricing calculations are always based on gross area, regardless of display preference

## 3D Visualization

The 3D model visualizes the house based on user inputs:

### Technical Implementation
- Uses Three.js through React Three Fiber
- Implements OrthographicCamera for consistent scaling
- Uses custom materials for different surfaces
- Optimizes performance with proper memory management

### Visual Elements
- Black floor surfaces represent floor areas
- Translucent surfaces represent open-to-above areas
- Grid lines indicate module boundaries
- Dynamic sizing based on user input

### Screenshot Functionality
- Captures the 3D model for inclusion in TypeForm submissions
- Uses canvas capture with `preserveDrawingBuffer: true`
- Falls back to html2canvas when direct canvas capture fails
- Uploads to AWS S3 for permanent storage

## Integration Points

### TypeForm Integration
The calculator integrates with TypeForm for lead capture:

1. **Configuration**: Edit the TypeForm ID in `src/config/typeform.ts`
2. **Parameter Passing**: All calculator data is passed to TypeForm via URL parameters
3. **Hidden Fields**: TypeForm should have hidden fields configured to receive these parameters
4. **Screenshot Integration**: Model screenshots are uploaded to S3 and included in the form

### AWS S3 Integration
For screenshot functionality, the app integrates with AWS S3:

1. **API Route**: `src/app/api/upload-model-screenshot/route.ts` handles uploads
2. **Environment Variables**:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `AWS_BUCKET_NAME`
3. **CORS Configuration**: S3 bucket must have proper CORS settings

### Webflow Embedding
The calculator can be embedded in Webflow:

1. **Embed Components**: Use the `/embed` pages for lightweight embedding
2. **CSS Integration**: Add embed-styles.css to Webflow custom code
3. **Container Setup**: Create appropriate containers in Webflow
4. **Communication**: Components communicate using window.postMessage

## Deployment Guide

### Option 1: Vercel Deployment (Recommended)

1. **Initial Setup**:
   - Push the repository to GitHub, GitLab, or Bitbucket
   - Sign up for a Vercel account at [vercel.com](https://vercel.com)
   - Connect Vercel to your repository service

2. **Project Import**:
   - Click "Add New Project" in Vercel
   - Select your repository
   - Vercel will automatically detect Next.js settings

3. **Environment Variables**:
   - Add required environment variables in the Vercel project settings:
     ```
     AWS_ACCESS_KEY_ID=your-access-key
     AWS_SECRET_ACCESS_KEY=your-secret-key
     AWS_REGION=us-east-2  # or your preferred region
     AWS_BUCKET_NAME=take-place-model-screenshots
     ```

4. **Deployment**:
   - Click "Deploy" and wait for the build to complete
   - Vercel will provide a deployment URL (e.g., `https://your-app.vercel.app`)

5. **Custom Domain** (Optional):
   - In Vercel project settings, go to "Domains"
   - Add your custom domain and follow DNS setup instructions

### Option 2: Other Platforms

For other platforms like Netlify, AWS Amplify, or traditional hosting:

1. **Build the Application**:
   ```bash
   npm run build
   ```

2. **Environment Setup**:
   - Configure environment variables according to your platform
   - Ensure AWS credentials are properly set

3. **Deploy the Build**:
   - Deploy the contents of the `.next` folder
   - Set up any necessary redirects for Next.js

4. **Verify Functionality**:
   - Test all features after deployment
   - Check browser console for any errors

## Development Guide

### Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/pricing-calculator.git
cd pricing-calculator

# Install dependencies
npm install

# Create .env.local file with required variables
echo "AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-2
AWS_BUCKET_NAME=take-place-model-screenshots" > .env.local

# Start the development server
npm run dev
```

### Key Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linting
- `npm run test` - Run tests (if configured)

### Code Structure and Standards

- **Components**: Use functional components with hooks
- **Typing**: Always use TypeScript types/interfaces
- **Styling**: Use Tailwind CSS classes, avoid inline styles
- **State**: Use context for global state, local state for component-specific concerns
- **APIs**: Use Next.js API routes for server-side logic

### Making Changes

#### Modifying Pricing Data
To update pricing constants, edit `src/data/pricingData.ts`:
- `PRICING_CONSTANTS` for base prices and rates
- `PROVINCIAL_DETAILS` for province-specific multipliers
- `FOUNDATION_PILE_DATA` and `CONTAINER_DATA` for quantity tables

#### Updating the 3D Model
To modify the 3D visualization, work with:
- `src/app/components/ThreeScene.tsx` - Core 3D rendering
- `src/app/components/House3D.tsx` - Component wrapper

#### Adding or Changing Features
1. Identify the relevant component(s)
2. Make necessary changes while maintaining existing patterns
3. Test thoroughly on different devices
4. Update documentation if needed

## Troubleshooting

### Common Issues and Solutions

#### S3 Upload Issues
- **Error**: Screenshots not uploading to S3
- **Check**: 
  - Verify AWS credentials in environment variables
  - Ensure S3 bucket has proper CORS configuration
  - Check browser console for detailed error messages
- **Solution**:
  - Update AWS credentials if expired
  - Configure CORS to allow requests from your domain
  - Verify IAM permissions allow S3 operations

#### 3D Model Rendering Issues
- **Error**: Model not displaying or displaying incorrectly
- **Check**:
  - Browser console for WebGL errors
  - Device capability for 3D rendering
- **Solution**:
  - Ensure WebGL is supported and enabled
  - Reduce model complexity for older devices
  - Implement fallback for browsers without WebGL

#### Embedding Issues
- **Error**: Calculator not working when embedded
- **Check**:
  - CORS errors in console
  - iFrame height and width settings
- **Solution**:
  - Update CORS settings to allow embedding
  - Ensure iFrame has sufficient height and width
  - Verify postMessage communication is working

#### Pricing Calculation Issues
- **Error**: Prices seem incorrect
- **Check**:
  - Console logs of calculation details
  - Current provincial multipliers
- **Solution**:
  - Update provincial constants if needed
  - Verify all multipliers are applied correctly
  - Check floor area calculations

### Debugging Techniques

1. **Browser Console**: Check for JavaScript errors
2. **React DevTools**: Inspect component state and props
3. **Network Tab**: Verify API requests and responses
4. **Local vs. Production**: Compare behavior in different environments

## Feature Configuration

### TypeForm Integration

To set up or modify the TypeForm integration:

1. **Get Your TypeForm ID**:
   - Create a TypeForm account at https://www.typeform.com/
   - Create a new form for custom proposals
   - Find your form ID in the URL: `https://admin.typeform.com/form/XXXXXX/create`
   - Update the ID in `src/config/typeform.ts`

2. **Configure Hidden Fields**:
   TypeForm needs hidden fields to receive calculator data:
   - Go to your form's "Configure" section > "Hidden Fields"
   - Add fields for each parameter passed from the calculator
   - Important fields include: `province`, `total_size`, `main_floor_size`, `second_floor_size`, `base_price`, `grand_total_min`, `grand_total_max`, `early_adopter`, `model_screenshot_url`

### AWS S3 Setup

1. **Create an S3 Bucket**:
   - Go to AWS S3 console
   - Create a new bucket (e.g., `take-place-model-screenshots`)
   - Under "Block Public Access settings", uncheck "Block all public access"
   - Acknowledge the warning about making bucket public

2. **Configure CORS**:
   - In bucket properties, go to "Permissions" > "CORS configuration"
   - Add the following configuration:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```
   - For production, replace `"*"` in `AllowedOrigins` with your specific domains

3. **Create IAM User**:
   - Go to IAM console
   - Create a new user with programmatic access
   - Attach policies for S3 access (`AmazonS3FullAccess` or create a custom policy)
   - Save the access key and secret key

4. **Update Environment Variables**:
   - Add the IAM credentials to your environment variables

### Early Adopter Discount

The early adopter incentive is configurable:

1. **Discount Rate**: Edit `EARLY_ADOPTER_DISCOUNT_PER_SQFT` in `src/data/pricingData.ts`
2. **Enable/Disable**: The feature can be enabled by default by modifying the initial state in `CalculatorContext.tsx`
3. **Explanation Text**: Update the explanation text in `SliderControls.tsx`

## Maintenance

### Regular Update Tasks

1. **Pricing Data Updates**:
   - Periodically review and update pricing constants
   - Keep provincial multipliers current with market conditions
   - Update additional cost estimates as needed

2. **Dependency Management**:
   - Run `npm outdated` to identify outdated packages
   - Update dependencies with `npm update` or manually in package.json
   - Test thoroughly after updates

3. **Browser Compatibility**:
   - Test regularly on different browsers and devices
   - Update polyfills or fallbacks as needed

### Performance Optimization

1. **3D Model Optimization**:
   - Monitor frame rates on various devices
   - Simplify geometry for performance if needed
   - Implement level-of-detail techniques for complex models

2. **Code Splitting**:
   - Use dynamic imports for large components
   - Lazy load non-critical features

3. **Image Optimization**:
   - Use Next.js Image component for optimal loading
   - Compress and properly size all assets

### Monitoring and Analytics

1. **Error Tracking**:
   - Implement error boundaries throughout React components
   - Consider adding an error tracking service like Sentry

2. **Usage Analytics**:
   - Track key user interactions for insight
   - Monitor completion rates and drop-off points

3. **Performance Monitoring**:
   - Watch for slow API responses or rendering issues
   - Implement Web Vitals tracking for core metrics

---

## Need Help?

For detailed documentation on each component and function, refer to the comments in the source code. If you encounter issues not covered in this README, please contact the development team.

Last updated: April 2023
