/**
 * TypeForm Configuration
 * 
 * This file contains configuration settings for the TypeForm integration.
 */

/**
 * How to Get Your TypeForm ID:
 * 1. Create a TypeForm account at https://www.typeform.com/
 * 2. Create a new form that will serve as your custom proposal form
 * 3. Go to your form and look at the URL, which will be in this format:
 *    https://admin.typeform.com/form/XXXXXX/create
 *    Where XXXXXX is your TypeForm ID
 * 4. Copy this ID and replace the value below
 * 
 * Setting Up URL Parameters in TypeForm:
 * 1. In your TypeForm, click "Settings" > "URL variables/parameters"
 * 2. Add all the variables listed below with EXACTLY the same names
 * 
 * Basic Information Fields:
 * - province: The selected Canadian province
 * - floor_area_type: Whether user was viewing in gross or net mode (just for reference)
 * - source: Which part of the app initiated the form
 * - early_adopter: Whether early adopter discount was selected
 * - model_screenshot_url: URL to the model screenshot (if available)
 * 
 * Size Fields (ALWAYS in gross square footage regardless of toggle):
 * - total_size: Total gross square footage of the home
 * - main_floor_size: Gross square footage of the main floor
 * - second_floor_size: Gross square footage of the second floor
 * 
 * Display Size Fields (what user sees based on gross/net toggle):
 * - display_total_size: Total size as displayed to user
 * - display_main_floor_size: Main floor size as displayed to user
 * - display_second_floor_size: Second floor size as displayed to user
 * 
 * Price Fields:
 * - base_price: The total base price
 * - price_per_sqft: Price per square foot
 * 
 * Additional Cost Fields (final calculated values):
 * - foundation_estimate: Foundation cost
 * - appliances_estimate_min: Always 0 (standard appliances included in base price)
 * - appliances_estimate_max: Cost for premium appliance upgrades (up to $12,000)
 * - delivery_estimate: Delivery cost
 * - electrical_hookup_estimate: Electrical hookup cost
 * - sewer_water_septic_min: Minimum sewer/water/septic cost
 * - sewer_water_septic_max: Maximum sewer/water/septic cost
 * - permit_fees_estimate: Permit fees cost
 * 
 * Total Estimate Fields:
 * - grand_total_min: Minimum overall cost
 * - grand_total_max: Maximum overall cost
 * - grand_total_average: Average overall cost
 * 
 * For model screenshot integration:
 * 1. Add a URL parameter field in TypeForm called 'model_screenshot_url'
 * 2. This URL will be passed to TypeForm and the agent can manually download the image
 * 3. Alternatively, you could implement a more robust solution with server-side image hosting
 */

// TypeForm ID for the custom proposal form
export const TYPEFORM_ID = 'lwti2ikW'; // Your actual TypeForm ID

// Base URL for TypeForm
export const TYPEFORM_BASE_URL = 'https://form.typeform.com/to';

// Full TypeForm URL with ID
export const getTypeformUrl = (params: string) => {
  return `${TYPEFORM_BASE_URL}/${TYPEFORM_ID}?${params}`;
};

/**
 * Determines if the environment is running in development mode.
 * This can be used to show debug information for TypeForm parameters.
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Convert a data URL to a Blob and create an object URL
 * This allows us to share the model screenshot with TypeForm.
 */
export const dataUrlToObjectUrl = (dataUrl: string | null): string | null => {
  if (!dataUrl) return null;
  
  try {
    // Parse the data URL
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    // Create a Blob and generate an object URL
    const blob = new Blob([u8arr], { type: mime });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error converting data URL to object URL:', error);
    return null;
  }
}; 