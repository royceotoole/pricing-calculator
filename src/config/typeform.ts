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
 * 2. This URL will point to an AWS S3 bucket where the image is permanently stored
 * 3. The S3 bucket is configured to make these images publicly accessible
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
 * Upload an image data URL to AWS S3 via our API route
 * This returns a permanent URL that can be accessed anywhere
 */
export const uploadImageToS3 = async (dataUrl: string | null): Promise<string | null> => {
  if (!dataUrl) return null;
  
  try {
    const response = await fetch('/api/upload-model-screenshot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dataUrl }),
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    return null;
  }
}; 