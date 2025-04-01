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
  MAIN_FLOOR_RATE: 336,
  SECOND_FLOOR_RATE: 166,
  
  // Early adopter discount per square foot
  EARLY_ADOPTER_DISCOUNT_PER_SQFT: 10,

  // Foundation costs
  FOUNDATION: {
    BEARING_PILE_COST: 1000,
    BRACING_PILE_COST: 800,
    MOBILIZATION_COST: 3000
  },

  // Appliance package range
  APPLIANCES: {
    MIN: 12000,
    MAX: 25000
  },

  // Delivery costs
  DELIVERY: {
    FIRST_CONTAINER_COST: 550,
    ADDITIONAL_CONTAINER_COST: 475,
    COST_PER_KM: 1.30
  },

  // Electrical hookup
  ELECTRICAL_HOOKUP: 2500,

  // Sewer/Water/Septic range
  SEWER_WATER_SEPTIC: {
    MIN: 6500,
    MAX: 25000
  }
};

// Module size in square feet
export const MODULE_SIZE = 104;

// Foundation pile quantities based on main floor size
export const FOUNDATION_PILE_DATA = [
  { modules: 5, mainFloorSize: 520, bearingPiles: 6, bracingPiles: 4, mobilization: 1 },
  { modules: 6, mainFloorSize: 624, bearingPiles: 9, bracingPiles: 4, mobilization: 1 },
  { modules: 7, mainFloorSize: 728, bearingPiles: 9, bracingPiles: 4, mobilization: 1 },
  { modules: 8, mainFloorSize: 832, bearingPiles: 9, bracingPiles: 4, mobilization: 1 },
  { modules: 9, mainFloorSize: 936, bearingPiles: 12, bracingPiles: 4, mobilization: 1 },
  { modules: 10, mainFloorSize: 1040, bearingPiles: 12, bracingPiles: 4, mobilization: 1 },
  { modules: 11, mainFloorSize: 1144, bearingPiles: 12, bracingPiles: 4, mobilization: 1 },
  { modules: 12, mainFloorSize: 1248, bearingPiles: 15, bracingPiles: 6, mobilization: 1 },
  { modules: 13, mainFloorSize: 1352, bearingPiles: 15, bracingPiles: 6, mobilization: 1 },
  { modules: 14, mainFloorSize: 1456, bearingPiles: 15, bracingPiles: 6, mobilization: 1 },
  { modules: 15, mainFloorSize: 1560, bearingPiles: 18, bracingPiles: 6, mobilization: 1 },
  { modules: 16, mainFloorSize: 1664, bearingPiles: 18, bracingPiles: 6, mobilization: 1 },
  { modules: 17, mainFloorSize: 1768, bearingPiles: 18, bracingPiles: 6, mobilization: 1 },
  { modules: 18, mainFloorSize: 1872, bearingPiles: 21, bracingPiles: 8, mobilization: 1 },
  { modules: 19, mainFloorSize: 1976, bearingPiles: 21, bracingPiles: 8, mobilization: 1 },
  { modules: 20, mainFloorSize: 2080, bearingPiles: 21, bracingPiles: 8, mobilization: 1 },
  { modules: 21, mainFloorSize: 2184, bearingPiles: 24, bracingPiles: 8, mobilization: 1 },
  { modules: 22, mainFloorSize: 2288, bearingPiles: 24, bracingPiles: 8, mobilization: 1 },
  { modules: 23, mainFloorSize: 2392, bearingPiles: 24, bracingPiles: 8, mobilization: 1 },
  { modules: 24, mainFloorSize: 2496, bearingPiles: 27, bracingPiles: 10, mobilization: 1 },
  { modules: 25, mainFloorSize: 2600, bearingPiles: 27, bracingPiles: 10, mobilization: 1 },
  { modules: 26, mainFloorSize: 2704, bearingPiles: 27, bracingPiles: 10, mobilization: 1 },
  { modules: 27, mainFloorSize: 2808, bearingPiles: 30, bracingPiles: 10, mobilization: 1 },
  { modules: 28, mainFloorSize: 2912, bearingPiles: 30, bracingPiles: 10, mobilization: 1 },
  { modules: 29, mainFloorSize: 3016, bearingPiles: 30, bracingPiles: 10, mobilization: 1 },
  { modules: 30, mainFloorSize: 3120, bearingPiles: 33, bracingPiles: 12, mobilization: 1 },
  { modules: 31, mainFloorSize: 3224, bearingPiles: 33, bracingPiles: 12, mobilization: 1 },
  { modules: 32, mainFloorSize: 3328, bearingPiles: 33, bracingPiles: 12, mobilization: 1 },
  { modules: 33, mainFloorSize: 3432, bearingPiles: 36, bracingPiles: 12, mobilization: 1 },
  { modules: 34, mainFloorSize: 3536, bearingPiles: 36, bracingPiles: 12, mobilization: 1 },
  { modules: 35, mainFloorSize: 3640, bearingPiles: 36, bracingPiles: 12, mobilization: 1 },
  { modules: 36, mainFloorSize: 3744, bearingPiles: 39, bracingPiles: 14, mobilization: 1 },
  { modules: 37, mainFloorSize: 3848, bearingPiles: 39, bracingPiles: 14, mobilization: 1 }
];

// Container quantities based on main floor size
export const CONTAINER_DATA = [
  { modules: 5, mainFloorSize: 520, containers: 3 },
  { modules: 6, mainFloorSize: 624, containers: 4 },
  { modules: 7, mainFloorSize: 728, containers: 4 },
  { modules: 8, mainFloorSize: 832, containers: 4 },
  { modules: 9, mainFloorSize: 936, containers: 5 },
  { modules: 10, mainFloorSize: 1040, containers: 5 },
  { modules: 11, mainFloorSize: 1144, containers: 5 },
  { modules: 12, mainFloorSize: 1248, containers: 6 },
  { modules: 13, mainFloorSize: 1352, containers: 6 },
  { modules: 14, mainFloorSize: 1456, containers: 6 },
  { modules: 15, mainFloorSize: 1560, containers: 7 },
  { modules: 16, mainFloorSize: 1664, containers: 7 },
  { modules: 17, mainFloorSize: 1768, containers: 7 },
  { modules: 18, mainFloorSize: 1872, containers: 8 },
  { modules: 19, mainFloorSize: 1976, containers: 8 },
  { modules: 20, mainFloorSize: 2080, containers: 8 },
  { modules: 21, mainFloorSize: 2184, containers: 9 },
  { modules: 22, mainFloorSize: 2288, containers: 9 },
  { modules: 23, mainFloorSize: 2392, containers: 9 },
  { modules: 24, mainFloorSize: 2496, containers: 10 },
  { modules: 25, mainFloorSize: 2600, containers: 10 },
  { modules: 26, mainFloorSize: 2704, containers: 10 },
  { modules: 27, mainFloorSize: 2808, containers: 11 },
  { modules: 28, mainFloorSize: 2912, containers: 11 },
  { modules: 29, mainFloorSize: 3016, containers: 11 },
  { modules: 30, mainFloorSize: 3120, containers: 12 },
  { modules: 31, mainFloorSize: 3224, containers: 12 },
  { modules: 32, mainFloorSize: 3328, containers: 12 },
  { modules: 33, mainFloorSize: 3432, containers: 13 },
  { modules: 34, mainFloorSize: 3536, containers: 13 },
  { modules: 35, mainFloorSize: 3640, containers: 13 },
  { modules: 36, mainFloorSize: 3744, containers: 14 },
  { modules: 37, mainFloorSize: 3848, containers: 14 }
];

// Enhanced provincial multipliers with detailed factors
export const PROVINCIAL_DETAILS: Record<ProvinceCode, {
  baseMultiplier: number;
  foundationMultiplier: number;
  shippingKm: number;
  sewerWaterSepticMultiplier: number;
  permitFeesMultiplier: number;
}> = {
  'AB': { baseMultiplier: 1.07, foundationMultiplier: 1.28, shippingKm: 1340, sewerWaterSepticMultiplier: 1.41, permitFeesMultiplier: 1.60 },
  'BC': { baseMultiplier: 1.15, foundationMultiplier: 1.60, shippingKm: 2140, sewerWaterSepticMultiplier: 1.76, permitFeesMultiplier: 3.00 },
  'MB': { baseMultiplier: 1.00, foundationMultiplier: 1.00, shippingKm: 150, sewerWaterSepticMultiplier: 1.00, permitFeesMultiplier: 1.00 },
  'NB': { baseMultiplier: 0.98, foundationMultiplier: 1.00, shippingKm: 2100, sewerWaterSepticMultiplier: 1.00, permitFeesMultiplier: 0.80 },
  'NL': { baseMultiplier: 0.98, foundationMultiplier: 1.00, shippingKm: 2900, sewerWaterSepticMultiplier: 1.00, permitFeesMultiplier: 0.90 },
  'NS': { baseMultiplier: 0.98, foundationMultiplier: 1.00, shippingKm: 2400, sewerWaterSepticMultiplier: 1.00, permitFeesMultiplier: 1.00 },
  'ON': { baseMultiplier: 1.11, foundationMultiplier: 1.44, shippingKm: 2225, sewerWaterSepticMultiplier: 1.58, permitFeesMultiplier: 2.00 },
  'PE': { baseMultiplier: 0.98, foundationMultiplier: 1.00, shippingKm: 2500, sewerWaterSepticMultiplier: 1.00, permitFeesMultiplier: 0.80 },
  'QC': { baseMultiplier: 1.00, foundationMultiplier: 1.00, shippingKm: 2300, sewerWaterSepticMultiplier: 1.00, permitFeesMultiplier: 1.40 },
  'SK': { baseMultiplier: 1.00, foundationMultiplier: 1.00, shippingKm: 780, sewerWaterSepticMultiplier: 1.00, permitFeesMultiplier: 1.00 },
  'NT': { baseMultiplier: 1.18, foundationMultiplier: 1.72, shippingKm: 2200, sewerWaterSepticMultiplier: 1.89, permitFeesMultiplier: 1.50 },
  'NU': { baseMultiplier: 1.22, foundationMultiplier: 1.88, shippingKm: 2300, sewerWaterSepticMultiplier: 2.07, permitFeesMultiplier: 1.80 },
  'YT': { baseMultiplier: 1.15, foundationMultiplier: 1.60, shippingKm: 3500, sewerWaterSepticMultiplier: 1.76, permitFeesMultiplier: 1.40 }
};

// For backwards compatibility
export const PROVINCIAL_MULTIPLIERS: Record<ProvinceCode, number> = Object.entries(PROVINCIAL_DETAILS)
  .reduce((acc, [key, value]) => {
    acc[key as ProvinceCode] = value.baseMultiplier;
    return acc;
  }, {} as Record<ProvinceCode, number>);

// Extended price calculation interface
export interface DetailedPriceBreakdown {
  basePrice: number;
  mainFloorCost: number;
  secondFloorCost: number;
  provincialMultiplier: number;
  earlyAdopterDiscount: number;
  totalPrice: number;
  additionalCosts: {
    foundation: {
      bearingPiles: {
        quantity: number;
        unitCost: number;
        subtotal: number;
      };
      bracingPiles: {
        quantity: number;
        unitCost: number;
        subtotal: number;
      };
      mobilization: {
        quantity: number;
        unitCost: number;
        subtotal: number;
      };
      provincialMultiplier: number;
      total: number;
    };
    appliances: {
      minCost: number;
      maxCost: number;
      averageCost: number;
    };
    delivery: {
      containers: {
        quantity: number;
        firstContainerCost: number;
        additionalContainersCost: number;
        subtotal: number;
      };
      distance: {
        km: number;
        costPerKm: number;
        subtotal: number;
      };
      total: number;
    };
    electricalHookup: number;
    sewerWaterSeptic: {
      minCost: number;
      maxCost: number;
      averageCost: number;
      provincialMultiplier: number;
      total: {
        min: number;
        max: number;
        average: number;
      };
    };
    permitFees: {
      baseCost: number;
      provincialMultiplier: number;
      total: number;
    };
  };
  grandTotal: {
    min: number;
    max: number;
    average: number;
  };
}

// Helper functions for each cost calculation
function calculateFoundationCost(
  mainFloorSize: number,
  provinceCode: ProvinceCode
): DetailedPriceBreakdown['additionalCosts']['foundation'] {
  // Find the closest foundation pile data based on main floor size
  const pileData = FOUNDATION_PILE_DATA.find(data => data.mainFloorSize >= mainFloorSize) || 
                   FOUNDATION_PILE_DATA[FOUNDATION_PILE_DATA.length - 1];
  
  const bearingPilesSubtotal = pileData.bearingPiles * PRICING_CONSTANTS.FOUNDATION.BEARING_PILE_COST;
  const bracingPilesSubtotal = pileData.bracingPiles * PRICING_CONSTANTS.FOUNDATION.BRACING_PILE_COST;
  const mobilizationSubtotal = pileData.mobilization * PRICING_CONSTANTS.FOUNDATION.MOBILIZATION_COST;
  
  const provincialMultiplier = PROVINCIAL_DETAILS[provinceCode].foundationMultiplier;
  
  // Apply provincial multiplier to piles but not mobilization
  const total = (bearingPilesSubtotal + bracingPilesSubtotal) * provincialMultiplier + mobilizationSubtotal;
  
  return {
    bearingPiles: {
      quantity: pileData.bearingPiles,
      unitCost: PRICING_CONSTANTS.FOUNDATION.BEARING_PILE_COST,
      subtotal: bearingPilesSubtotal
    },
    bracingPiles: {
      quantity: pileData.bracingPiles,
      unitCost: PRICING_CONSTANTS.FOUNDATION.BRACING_PILE_COST,
      subtotal: bracingPilesSubtotal
    },
    mobilization: {
      quantity: pileData.mobilization,
      unitCost: PRICING_CONSTANTS.FOUNDATION.MOBILIZATION_COST,
      subtotal: mobilizationSubtotal
    },
    provincialMultiplier,
    total
  };
}

function calculateApplianceCost(): DetailedPriceBreakdown['additionalCosts']['appliances'] {
  const minCost = PRICING_CONSTANTS.APPLIANCES.MIN;
  const maxCost = PRICING_CONSTANTS.APPLIANCES.MAX;
  const averageCost = (minCost + maxCost) / 2;
  
  return {
    minCost,
    maxCost,
    averageCost
  };
}

function calculateDeliveryCost(
  mainFloorSize: number,
  provinceCode: ProvinceCode
): DetailedPriceBreakdown['additionalCosts']['delivery'] {
  // Find the closest container data based on main floor size
  const containerData = CONTAINER_DATA.find(data => data.mainFloorSize >= mainFloorSize) || 
                       CONTAINER_DATA[CONTAINER_DATA.length - 1];
  
  const containers = containerData.containers;
  const firstContainerCost = PRICING_CONSTANTS.DELIVERY.FIRST_CONTAINER_COST;
  const additionalContainersCost = containers > 1 
    ? (containers - 1) * PRICING_CONSTANTS.DELIVERY.ADDITIONAL_CONTAINER_COST 
    : 0;
  
  const containersSubtotal = firstContainerCost + additionalContainersCost;
  
  const distanceKm = PROVINCIAL_DETAILS[provinceCode].shippingKm;
  const costPerKm = PRICING_CONSTANTS.DELIVERY.COST_PER_KM;
  const distanceSubtotal = distanceKm * costPerKm;
  
  const total = containersSubtotal + distanceSubtotal;
  
  return {
    containers: {
      quantity: containers,
      firstContainerCost,
      additionalContainersCost,
      subtotal: containersSubtotal
    },
    distance: {
      km: distanceKm,
      costPerKm,
      subtotal: distanceSubtotal
    },
    total
  };
}

function calculateSewerWaterSepticCost(
  provinceCode: ProvinceCode
): DetailedPriceBreakdown['additionalCosts']['sewerWaterSeptic'] {
  const minCost = PRICING_CONSTANTS.SEWER_WATER_SEPTIC.MIN;
  const maxCost = PRICING_CONSTANTS.SEWER_WATER_SEPTIC.MAX;
  const averageCost = (minCost + maxCost) / 2;
  const provincialMultiplier = PROVINCIAL_DETAILS[provinceCode].sewerWaterSepticMultiplier;
  
  return {
    minCost,
    maxCost,
    averageCost,
    provincialMultiplier,
    total: {
      min: minCost * provincialMultiplier,
      max: maxCost * provincialMultiplier,
      average: averageCost * provincialMultiplier
    }
  };
}

function calculatePermitFees(
  totalSize: number,
  provinceCode: ProvinceCode
): DetailedPriceBreakdown['additionalCosts']['permitFees'] {
  // Permit fee formula: (Total size / 2) + 750
  const baseCost = (totalSize / 2) + 750;
  const provincialMultiplier = PROVINCIAL_DETAILS[provinceCode].permitFeesMultiplier;
  const total = baseCost * provincialMultiplier;
  
  return {
    baseCost,
    provincialMultiplier,
    total
  };
}

// Main price calculation function (backwards compatible with existing code)
export function calculatePrice(
  provinceCode: ProvinceCode,
  mainFloorSize: number,
  secondFloorSize: number,
  isEarlyAdopter: boolean = false
): number {
  const { totalPrice } = calculateDetailedPrice(provinceCode, mainFloorSize, secondFloorSize, isEarlyAdopter);
  return totalPrice;
}

// New detailed price calculation that includes all additional costs
export function calculateDetailedPrice(
  provinceCode: ProvinceCode,
  mainFloorSize: number,
  secondFloorSize: number,
  isEarlyAdopter: boolean = false
): DetailedPriceBreakdown {
  // Calculate base build cost from square footage
  const mainFloorCost = mainFloorSize * PRICING_CONSTANTS.MAIN_FLOOR_RATE;
  const secondFloorCost = secondFloorSize * PRICING_CONSTANTS.SECOND_FLOOR_RATE;
  
  // Add base price
  let baseBuildCost = PRICING_CONSTANTS.BASE_PRICE + mainFloorCost + secondFloorCost;
  
  // Provincial multiplier
  const provincialMultiplier = PROVINCIAL_DETAILS[provinceCode].baseMultiplier;
  
  // Apply early adopter discount if applicable
  const totalSqft = mainFloorSize + secondFloorSize;
  const earlyAdopterDiscount = isEarlyAdopter 
    ? totalSqft * PRICING_CONSTANTS.EARLY_ADOPTER_DISCOUNT_PER_SQFT 
    : 0;
  
  // Calculate total price with provincial adjustment and discount
  const totalPrice = Math.round((baseBuildCost * provincialMultiplier - earlyAdopterDiscount) / 1000) * 1000;
  
  // Calculate all additional costs
  const totalSize = mainFloorSize + secondFloorSize;
  const foundationCost = calculateFoundationCost(mainFloorSize, provinceCode);
  const applianceCost = calculateApplianceCost();
  const deliveryCost = calculateDeliveryCost(mainFloorSize, provinceCode);
  const electricalHookupCost = PRICING_CONSTANTS.ELECTRICAL_HOOKUP;
  const sewerWaterSepticCost = calculateSewerWaterSepticCost(provinceCode);
  const permitFeesCost = calculatePermitFees(totalSize, provinceCode);
  
  // Calculate grand totals (min, max, average)
  const minGrandTotal = totalPrice + 
    foundationCost.total + 
    applianceCost.minCost + 
    deliveryCost.total + 
    electricalHookupCost + 
    sewerWaterSepticCost.total.min + 
    permitFeesCost.total;
  
  const maxGrandTotal = totalPrice + 
    foundationCost.total + 
    applianceCost.maxCost + 
    deliveryCost.total + 
    electricalHookupCost + 
    sewerWaterSepticCost.total.max + 
    permitFeesCost.total;
  
  const averageGrandTotal = totalPrice + 
    foundationCost.total + 
    applianceCost.averageCost + 
    deliveryCost.total + 
    electricalHookupCost + 
    sewerWaterSepticCost.total.average + 
    permitFeesCost.total;
  
  return {
    basePrice: PRICING_CONSTANTS.BASE_PRICE,
    mainFloorCost,
    secondFloorCost,
    provincialMultiplier,
    earlyAdopterDiscount,
    totalPrice,
    additionalCosts: {
      foundation: foundationCost,
      appliances: applianceCost,
      delivery: deliveryCost,
      electricalHookup: electricalHookupCost,
      sewerWaterSeptic: sewerWaterSepticCost,
      permitFees: permitFeesCost
    },
    grandTotal: {
      min: Math.round(minGrandTotal / 1000) * 1000,
      max: Math.round(maxGrandTotal / 1000) * 1000,
      average: Math.round(averageGrandTotal / 1000) * 1000
    }
  };
} // Test comment for Git
