export const fetchInspectionItems = (woId) => {
  console.log(`Fetching inspection items for WO ID: ${woId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockItems = [
        { id: 'ITEM001', name: 'Brake Pads & Rotors', category: 'Braking System' },
        { id: 'ITEM002', name: 'Tire Tread & Pressure', category: 'Tires & Wheels' },
        { id: 'ITEM003', name: 'Engine Oil Level & Condition', category: 'Engine Compartment' },
        { id: 'ITEM004', name: 'Headlights & Taillights', category: 'Lighting & Electrical' },
        { id: 'ITEM005', name: 'Windshield Wipers & Fluid', category: 'Visibility' },
        { id: 'ITEM006', name: 'Battery & Cables', category: 'Electrical System' },
        { id: 'ITEM007', name: 'Belts & Hoses', category: 'Engine Compartment' },
      ];
      resolve(mockItems);
    }, 800); // Simulate 0.8 second delay
  });
};

export const submitInspectionResults = (inspectionData) => {
  console.log('Submitting inspection data:', JSON.stringify(inspectionData, null, 2));
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a successful submission
      if (Math.random() > 0.1) { // 90% success rate
        resolve({ success: true, message: 'Inspection submitted successfully (mocked).' });
      } else { // 10% failure rate
        reject({ success: false, message: 'Failed to submit inspection (mocked error).' });
      }
    }, 1200); // Simulate 1.2 second delay
  });
};
