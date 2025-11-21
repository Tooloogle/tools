export interface BMIValidationResult {
  isValid: boolean;
  error?: string;
}

// Helper function to validate height ranges
const validateHeightRange = (
  value: number,
  unit: string
): BMIValidationResult => {
  const minHeight = unit === 'metric' ? 50 : 1.5; // 50cm or 1.5ft
  const maxHeight = unit === 'metric' ? 250 : 8.5; // 250cm or 8.5ft

  if (value < minHeight || value > maxHeight) {
    return {
      isValid: false,
      error: `Height must be between ${minHeight}-${maxHeight} ${
        unit === 'metric' ? 'cm' : 'ft'
      }`,
    };
  }

  return { isValid: true };
};

// Helper function to validate weight ranges
const validateWeightRange = (
  value: number,
  unit: string
): BMIValidationResult => {
  const minWeight = unit === 'metric' ? 10 : 20; // 10kg or 20lbs
  const maxWeight = unit === 'metric' ? 500 : 1100; // 500kg or 1100lbs

  if (value < minWeight || value > maxWeight) {
    return {
      isValid: false,
      error: `Weight must be between ${minWeight}-${maxWeight} ${
        unit === 'metric' ? 'kg' : 'lbs'
      }`,
    };
  }

  return { isValid: true };
};

export const validateInput = (
  value: number,
  type: 'height' | 'weight',
  unit: string
): BMIValidationResult => {
  if (isNaN(value) || value <= 0) {
    return { isValid: false, error: `Please enter a valid ${type}` };
  }

  // Type-specific validation using helper functions
  if (type === 'height') {
    return validateHeightRange(value, unit);
  }

  if (type === 'weight') {
    return validateWeightRange(value, unit);
  }

  return { isValid: true };
};

export const calculateBMIValue = (
  height: number,
  weight: number,
  unit: string
): number => {
  let heightInMeters = height;
  let weightInKg = weight;

  if (unit === 'imperial') {
    heightInMeters = height * 0.3048;
    weightInKg = weight * 0.453592;
  } else {
    heightInMeters = height / 100;
  }

  if (heightInMeters <= 0 || weightInKg <= 0) {
    throw new Error('Invalid converted measurements');
  }

  const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);

  if (!isFinite(calculatedBMI)) {
    throw new Error('BMI calculation resulted in invalid number');
  }

  return Math.round(calculatedBMI * 10) / 10;
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) {return 'Underweight';}

  if (bmi < 25) {return 'Normal weight';}

  if (bmi < 30) {return 'Overweight';}

  return 'Obese';
};

export const getCategoryClass = (category: string): string => {
  switch (category) {
    case 'Underweight':
      return 'text-blue-500';
    case 'Normal weight':
      return 'text-green-600';
    case 'Overweight':
      return 'text-orange-500';
    case 'Obese':
      return 'text-red-600';
    default:
      return 'text-gray-500';
  }
};
