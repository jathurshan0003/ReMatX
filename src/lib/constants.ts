export const ROLES = {
  BUYER: 'BUYER',
  SELLER: 'SELLER',
  CONTRACTOR: 'CONTRACTOR',
  CONSTRUCTION_COMPANY: 'CONSTRUCTION_COMPANY',
  ARCHITECT: 'ARCHITECT',
  ENGINEER: 'ENGINEER',
  INSPECTOR: 'INSPECTOR',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = keyof typeof ROLES;

export const SRI_LANKA_DISTRICTS = [
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Monaragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya',
] as const;

export const ROLE_LABELS: Record<string, string> = {
  BUYER: 'Individual Buyer',
  SELLER: 'Material Salvager',
  CONTRACTOR: 'Demolition Contractor',
  CONSTRUCTION_COMPANY: 'Construction Firm',
  ARCHITECT: 'Architect / Specifier',
  ENGINEER: 'Structural Engineer',
  INSPECTOR: 'Auditor & Inspector',
  ADMIN: 'Platform Admin',
};

// Section 5: Proposed Material Grading Framework
export const MATERIAL_GRADES = {
  GRADE_A: {
    label: 'Grade A',
    color: 'emerald',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    description: 'Suitable for direct reuse subject to applicable technical requirements.',
    shortDesc: 'Direct Structural / Architectural Reuse',
  },
  GRADE_B: {
    label: 'Grade B',
    color: 'blue',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    description: 'Reusable with minor repair, cleaning, or preparation.',
    shortDesc: 'Reusable with Minor Prep',
  },
  GRADE_C: {
    label: 'Grade C',
    color: 'amber',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    description: 'Potentially suitable for non-structural or lower-demand applications.',
    shortDesc: 'Non-Structural / Secondary Reuse',
  },
  GRADE_D: {
    label: 'Grade D',
    color: 'orange',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800',
    description: 'Better suited for recycling, crushing, or reprocessing rather than direct reuse.',
    shortDesc: 'Recycling / Reprocessing',
  },
  REJECTED: {
    label: 'Grade R',
    color: 'red',
    badgeClass: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800',
    description: 'Rejected for marketplace reuse based on platform inspection criteria.',
    shortDesc: 'Rejected for Reuse',
  },
} as const;

// Section 13: Material Lifecycle
export const MATERIAL_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'VERIFIED',
  'AVAILABLE',
  'RESERVED',
  'SOLD',
  'DELIVERED',
  'REUSED',
  'REJECTED',
] as const;

// Section 6: Example Inspection Test Criteria by Category
export const CATEGORY_TEST_CRITERIA: Record<string, Array<{ name: string; unit: string; typicalThreshold: string }>> = {
  bricks: [
    { name: 'Compressive Strength Core Test', unit: 'N/mm²', typicalThreshold: '>= 15.0' },
    { name: 'Water Absorption (24h immersion)', unit: '%', typicalThreshold: '<= 12.0' },
    { name: 'Dimension Tolerance Variance', unit: 'mm', typicalThreshold: '<= 3.0' },
    { name: 'Efflorescence & Chipping Index', unit: 'Rating (1-5)', typicalThreshold: '<= 2.0' },
  ],
  'structural-steel': [
    { name: 'Flange & Web Thickness Reduction', unit: '%', typicalThreshold: '<= 5.0' },
    { name: 'Estimated Yield Strength', unit: 'MPa', typicalThreshold: '>= 275.0' },
    { name: 'Beam Camber / Sweep Deviation', unit: 'mm/m', typicalThreshold: '<= 2.0' },
    { name: 'Ultrasonic Weld & Pitting Integrity', unit: 'Grade', typicalThreshold: 'Pass / Grade A-B' },
  ],
  timber: [
    { name: 'Internal Moisture Content', unit: '%', typicalThreshold: '<= 18.0' },
    { name: 'Insect / Wood Borer Degradation', unit: '% area', typicalThreshold: '0.0' },
    { name: 'Warp, Cup & Twist Deflection', unit: 'mm/m', typicalThreshold: '<= 3.0' },
    { name: 'Acoustic Soundness / Fungal Decay', unit: 'mm depth', typicalThreshold: '0.0' },
  ],
  'concrete-blocks': [
    { name: 'Rebound Hammer Compressive Strength', unit: 'N/mm²', typicalThreshold: '>= 12.0' },
    { name: 'Aggregate Dry Density', unit: 'kg/m³', typicalThreshold: '>= 1800' },
    { name: 'Water Absorption', unit: '%', typicalThreshold: '<= 10.0' },
    { name: 'Micro-crack Network Check', unit: 'Visual (1-5)', typicalThreshold: '<= 1.0' },
  ],
  'doors-windows': [
    { name: 'Glazing Hermetic & Seal Condition', unit: 'Pass/Fail', typicalThreshold: 'Pass' },
    { name: 'Frame Diagonal Squareness', unit: 'mm variance', typicalThreshold: '<= 2.5' },
    { name: 'Hardware & Lock Mechanism Function', unit: 'Operating cycles', typicalThreshold: 'Functional' },
    { name: 'Corrosion / Rot Depth on Rebate', unit: 'mm', typicalThreshold: '0.0' },
  ],
  'tiles-ceramics': [
    { name: 'Surface Scratch & Abrasion Rating', unit: 'PEI Class', typicalThreshold: '>= Class 3' },
    { name: 'Mortar Cleansing Level', unit: '% clean back', typicalThreshold: '>= 95%' },
    { name: 'Corner Breakage & Hairline Chips', unit: '% defective', typicalThreshold: '<= 3%' },
  ],
  roofing: [
    { name: 'Water Impermeability Test', unit: 'Hours without droplet', typicalThreshold: '>= 24 hrs' },
    { name: 'Flexural Transverse Breaking Load', unit: 'kN', typicalThreshold: '>= 1.2' },
    { name: 'Interlocking Nib Condition', unit: '% intact', typicalThreshold: '100%' },
  ],
  'sanitary-fixtures': [
    { name: 'Enamel Crazing & Acid Stain Check', unit: 'Visual Rating', typicalThreshold: 'Clean / Grade A' },
    { name: 'Waste Outlet & Trap Thread Integrity', unit: 'Pass/Fail', typicalThreshold: 'Pass' },
  ],
};
