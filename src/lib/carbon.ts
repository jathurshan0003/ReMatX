// Embodied Carbon ($CO2e$) and Circular Economy Calculator
// Factors derived from ICE (Inventory of Carbon and Energy, University of Bath) & CIBSE Circular Economy guidelines

export interface CircularImpact {
  carbonSavedKg: number;
  carbonSavedTonnes: number;
  wasteDivertedKg: number;
  wasteDivertedTonnes: number;
  equivalentTreesPlanted: number;
  equivalentCarKmSaved: number;
  circularityScore: number;
}

export const CARBON_FACTORS: Record<string, { co2KgPerUnit: number; weightKgPerUnit: number }> = {
  bricks: { co2KgPerUnit: 0.28, weightKgPerUnit: 3.1 },
  'structural-steel': { co2KgPerUnit: 200.0, weightKgPerUnit: 180.0 }, // per 6m beam
  timber: { co2KgPerUnit: 14.2, weightKgPerUnit: 14.5 }, // per 4m piece
  'concrete-blocks': { co2KgPerUnit: 2.45, weightKgPerUnit: 28.0 },
  'doors-windows': { co2KgPerUnit: 35.0, weightKgPerUnit: 42.0 },
  'tiles-ceramics': { co2KgPerUnit: 3.2, weightKgPerUnit: 4.5 },
  roofing: { co2KgPerUnit: 0.65, weightKgPerUnit: 2.8 },
  'sanitary-fixtures': { co2KgPerUnit: 18.0, weightKgPerUnit: 22.0 },
};

export function calculateCircularImpact(
  categorySlug: string,
  quantity: number,
  conditionGrade: string = 'GRADE_A'
): CircularImpact {
  const factor = CARBON_FACTORS[categorySlug] || { co2KgPerUnit: 1.0, weightKgPerUnit: 5.0 };
  
  // Grade multipliers (Grade A provides 100% full replacement value; Grade B 90%; Grade C 75%; Grade D 40%)
  const gradeFactor: Record<string, number> = {
    GRADE_A: 1.0,
    GRADE_B: 0.9,
    GRADE_C: 0.75,
    GRADE_D: 0.45,
    REJECTED: 0.1,
  };

  const multiplier = gradeFactor[conditionGrade] ?? 0.85;

  const carbonSavedKg = Math.round(quantity * factor.co2KgPerUnit * multiplier * 10) / 10;
  const wasteDivertedKg = Math.round(quantity * factor.weightKgPerUnit * 10) / 10;

  // 1 tree absorbs ~21.77 kg CO2 per year
  const equivalentTreesPlanted = Math.max(1, Math.round(carbonSavedKg / 21.77));
  // Average car emits ~0.12 kg CO2 per km
  const equivalentCarKmSaved = Math.max(1, Math.round(carbonSavedKg / 0.12));

  // Circularity index formula based on grade and lifecycle tracking
  const circularityBase: Record<string, number> = {
    GRADE_A: 95.0,
    GRADE_B: 88.0,
    GRADE_C: 76.0,
    GRADE_D: 55.0,
    REJECTED: 25.0,
  };

  const circularityScore = circularityBase[conditionGrade] ?? 80.0;

  return {
    carbonSavedKg,
    carbonSavedTonnes: Math.round((carbonSavedKg / 1000) * 100) / 100,
    wasteDivertedKg,
    wasteDivertedTonnes: Math.round((wasteDivertedKg / 1000) * 100) / 100,
    equivalentTreesPlanted,
    equivalentCarKmSaved,
    circularityScore,
  };
}
