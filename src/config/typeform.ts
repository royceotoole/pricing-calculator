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
 * 4. Copy this ID and replace 'XXXXX' below
 * 
 * Setting Up Hidden Fields in TypeForm:
 * 1. In your TypeForm, click "Create" or "Add Question"
 * 2. Choose "Hidden Fields" from the question types (often under "More")
 * 3. Add hidden fields with EXACTLY the same variable names as listed below:
 * 
 * Basic Information Fields:
 * - province: The selected Canadian province
 * - total_size: Total square footage of the home
 * - main_floor_size: Square footage of the main floor
 * - second_floor_size: Square footage of the second floor
 * - floor_area_type: Whether measurements are gross or net
 * - early_adopter: Whether early adopter discount was selected
 * - source: Which part of the app initiated the form
 * 
 * Price Fields:
 * - base_price: The total base price
 * - base_price_only: The core base price without add-ons
 * - price_per_sqft: Price per square foot
 * - main_floor_cost: Cost of the main floor
 * - second_floor_cost: Cost of the second floor
 * - provincial_multiplier: Provincial pricing multiplier
 * - early_adopter_discount: Discount amount for early adopters
 * 
 * Foundation Fields:
 * - foundation_estimate: Total foundation cost
 * - foundation_bearing_piles: Number of bearing piles
 * - foundation_bracing_piles: Number of bracing piles
 * 
 * Additional Cost Fields:
 * - appliances_estimate_min: Minimum appliance cost
 * - appliances_estimate_max: Maximum appliance cost
 * - delivery_estimate: Total delivery cost
 * - delivery_containers: Number of containers
 * - delivery_distance_km: Shipping distance
 * - electrical_hookup_estimate: Electrical hookup cost
 * - sewer_water_septic_min: Minimum sewer/water/septic cost
 * - sewer_water_septic_max: Maximum sewer/water/septic cost
 * - permit_fees_estimate: Permit fees cost
 * 
 * Total Estimate Fields:
 * - grand_total_min: Minimum overall cost
 * - grand_total_max: Maximum overall cost
 * - grand_total_average: Average overall cost
 */

// TypeForm ID for the custom proposal form
export const TYPEFORM_ID = 'XXXXX'; // Replace with your actual TypeForm ID

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