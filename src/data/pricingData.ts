// Pricing data structure for the calculator

// Define province codes for type safety
export type ProvinceCode = 
  | 'AB' | 'BC' | 'MB' | 'NB' | 'NL' 
  | 'NS' | 'ON' | 'PE' | 'QC' | 'SK' 
  | 'NT' | 'NU' | 'YT';

// Core pricing constants - easy to update in one place
export const PRICING_CONSTANTS = {
  // Base price for all builds
  BASE_PRICE: 205000,
  
  // Cost per square foot for different floor types
  MAIN_FLOOR_RATE: 337,
  SECOND_FLOOR_RATE: 166,
  
  // Early adopter discount per square foot
  EARLY_ADOPTER_DISCOUNT_PER_SQFT: 10
};

// Provincial multipliers
export const PROVINCIAL_MULTIPLIERS: Record<ProvinceCode, number> = {
  'AB': 1.07,
  'BC': 1.15,
  'MB': 1.00,
  'NB': 0.98,
  'NL': 0.98,
  'NS': 0.98,
  'ON': 1.11,
  'PE': 0.98,
  'QC': 1.00,
  'SK': 1.00,
  'NT': 1.18,
  'NU': 1.22,
  'YT': 1.15
};

// Helper function to calculate price
export function calculatePrice(
  provinceCode: ProvinceCode,
  mainFloorSize: number,
  secondFloorSize: number,
  isEarlyAdopter: boolean = false
): number {
  // Calculate base cost from square footage
  const mainFloorCost = mainFloorSize * PRICING_CONSTANTS.MAIN_FLOOR_RATE;
  const secondFloorCost = secondFloorSize * PRICING_CONSTANTS.SECOND_FLOOR_RATE;
  
  // Add base price
  let totalPrice = PRICING_CONSTANTS.BASE_PRICE + mainFloorCost + secondFloorCost;
  
  // Apply provincial multiplier
  totalPrice *= PROVINCIAL_MULTIPLIERS[provinceCode];
  
  // Apply early adopter discount if applicable
  if (isEarlyAdopter) {
    const totalSqft = mainFloorSize + secondFloorSize;
    const earlyAdopterDiscount = totalSqft * PRICING_CONSTANTS.EARLY_ADOPTER_DISCOUNT_PER_SQFT;
    totalPrice -= earlyAdopterDiscount;
  }
  
  // Round to nearest thousand for cleaner display
  return Math.round(totalPrice / 1000) * 1000;
} 