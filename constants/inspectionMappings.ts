// constants/inspectionMappings.ts

// Adjusted Category type to prioritize API names where direct mapping exists,
// and include user-specified categories that are distinct.
export type Category =
  | 'Braking System' // API: Brake Pads & Rotors
  | 'Tires & Wheels' // API & User
  | 'Engine Compartment' // API: Engine Oil Level & Condition, Belts & Hoses
  | 'Lighting & Electrical' // API: Headlights & Taillights (User: Lights)
  | 'Visibility' // API: Windshield Wipers & Fluid
  | 'Electrical System' // API: Battery & Cables (User: Battery)
  | 'Suspension Components' // User-specific
  | 'Fluids (Coolant, Brake, etc)' // User-specific
  | 'Default'; // A fallback category

export const categoryLocationOptions: Record<Category, string[]> = {
  'Braking System': ['Front', 'Rear', 'Left Front', 'Right Front', 'Left Rear', 'Right Rear'],
  'Tires & Wheels': ['Left Front', 'Right Front', 'Left Rear', 'Right Rear', 'Spare'],
  'Engine Compartment': ['Dipstick', 'Drain Plug', 'Oil Filter', 'Serpentine Belt', 'Timing Belt', 'Radiator Hose', 'Heater Hose'], // Combining Engine Oil & Belts/Hoses
  'Lighting & Electrical': ['Left Headlight', 'Right Headlight', 'Left Taillight', 'Right Taillight', 'Brake Light', 'Interior Lights'],
  'Visibility': [], // API's "Windshield Wipers & Fluid"
  'Electrical System': ['Main Battery', 'Terminal', 'Cables', 'Mount', 'Alternator', 'Starter'], // Combining Battery with general electrical
  'Suspension Components': ['Front Left', 'Front Right', 'Rear Left', 'Rear Right', 'Shocks', 'Struts', 'Control Arms'],
  'Fluids (Coolant, Brake, etc)': ['Reservoir', 'Cap', 'Hoses', 'Fittings', 'Master Cylinder'],
  'Default': [],
};

export const categoryReasonOptions: Record<Category, string[]> = {
  'Braking System': ['Worn Below Spec', 'Cracked Rotor', 'Pulsation', 'Spongy Pedal Feel', 'Noise While Braking', 'Leaking Fluid'],
  'Tires & Wheels': ['Low Tread', 'Uneven Wear', 'Bulge in Sidewall', 'Nail/Puncture', 'Incorrect Pressure', 'Damaged Rim'],
  'Engine Compartment': ['Low Oil Level', 'Dirty Oil', 'Oil Leaking', 'Overfilled Oil', 'Cracked Belt', 'Fraying Belt', 'Leaking Hose', 'Slipping Belt', 'Coolant Leak'], // Combining
  'Lighting & Electrical': ['Burned Out Bulb', 'Flickering', 'Misaligned', 'Cracked Lens', 'Wiring Issue', 'Dim Light'],
  'Visibility': ['Wiper Blade Worn', 'Low Washer Fluid', 'Streaking', 'Motor Issue'], // Added some for Visibility
  'Electrical System': ['Low Voltage', 'Corroded Terminals', 'Loose Cables', 'Not Holding Charge', 'Swollen Battery Case', 'Slow Crank'],
  'Suspension Components': ['Loose Component', 'Worn Bushing', 'Leaking Strut/Shock', 'Noise Over Bumps', 'Uneven Stance'],
  'Fluids (Coolant, Brake, etc)': ['Low Level', 'Contaminated Fluid', 'Leaking', 'Incorrect Fluid Type'], // Added some
  'Default': ['General Wear', 'Needs Inspection', 'Damaged', 'Other'], // Added some default reasons
};

// Helper function to get options, falling back to Default if category not found
export const getLocationOptions = (category?: string): string[] => {
  if (!category) return categoryLocationOptions.Default;
  // Attempt direct match, then try common variations or broader categories if applicable
  // This basic version relies on exact match or Default. More sophisticated matching could be added.
  return categoryLocationOptions[category as Category] || categoryLocationOptions.Default;
};

export const getReasonOptions = (category?: string): string[] => {
  if (!category) return categoryReasonOptions.Default;
  return categoryReasonOptions[category as Category] || categoryReasonOptions.Default;
};
