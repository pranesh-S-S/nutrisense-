/**
 * NutriSense - Personalized RDA Engine
 * Implements Mifflin-St Jeor BMR, PAL Factor, Goal Adjustment,
 * and Authoritative Standards from ICMR-NIN, DRI, and WHO/FAO.
 */

import { UserProfile, NutrientRequirements } from '../types/nutrition';

export function calculatePersonalizedRDA(profile: UserProfile): NutrientRequirements {
  // Step 1: BMR using Mifflin-St Jeor Equation
  let bmr: number;
  if (profile.sex === 'male') {
    bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age - 161;
  }

  // Step 2: Physical Activity Level (PAL) Multiplier
  const palMultipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9,
  };
  const pal = palMultipliers[profile.activity_level] || 1.2;
  const tdee = Math.round(bmr * pal);

  // Step 3: Goal Energy Adjustment
  let targetCalories = tdee;
  if (profile.fitness_goal === 'weight_loss') {
    targetCalories = Math.max(1200, tdee - 500);
  } else if (profile.fitness_goal === 'weight_gain') {
    targetCalories = tdee + 400;
  } else if (profile.fitness_goal === 'athletic_performance') {
    targetCalories = tdee + 250;
  }

  // Physiological State Adjustments (Pregnancy / Lactation) based on ICMR-NIN
  let addedCalories = 0;
  let addedProtein = 0;
  if (profile.is_pregnant) {
    if (profile.pregnancy_trimester === '1st') {
      addedCalories += 100;
      addedProtein += 10;
    } else {
      addedCalories += 350; // Trimester 2 & 3
      addedProtein += 23;
    }
  } else if (profile.is_lactating) {
    addedCalories += 520;
    addedProtein += 19;
  }
  targetCalories += addedCalories;

  // Manual target calorie override if user enabled manual entry mode
  if (profile.is_manual_target && profile.manual_calories && profile.manual_calories > 0) {
    targetCalories = profile.manual_calories;
  }

  // Step 4: Macronutrients
  // Baseline protein: 1.0g - 1.8g per kg depending on activity
  let proteinFactor = 1.0;
  if (profile.activity_level === 'moderately_active') proteinFactor = 1.2;
  if (profile.activity_level === 'very_active') proteinFactor = 1.6;
  if (profile.activity_level === 'extremely_active') proteinFactor = 1.8;
  if (profile.fitness_goal === 'athletic_performance') proteinFactor = Math.max(proteinFactor, 1.8);

  let calculatedProtein = Math.round(profile.weight_kg * proteinFactor + addedProtein);
  if (profile.is_manual_target && profile.manual_protein_g && profile.manual_protein_g > 0) {
    calculatedProtein = profile.manual_protein_g;
  }
  const protein_g = calculatedProtein;
  const proteinCalories = protein_g * 4;

  // Fat: 25% of calories (or manual override)
  let calculatedFat = Math.round((targetCalories * 0.25) / 9);
  if (profile.is_manual_target && profile.manual_fat_g && profile.manual_fat_g > 0) {
    calculatedFat = profile.manual_fat_g;
  }
  const fat_g = calculatedFat;
  const fatCalories = fat_g * 9;

  // Carbs: Remaining calories (or manual override)
  let calculatedCarbs = Math.round(Math.max(100, targetCalories - proteinCalories - fatCalories) / 4);
  if (profile.is_manual_target && profile.manual_carbs_g && profile.manual_carbs_g > 0) {
    calculatedCarbs = profile.manual_carbs_g;
  }
  const carbs_g = calculatedCarbs;

  // Fiber: 14g per 1000 kcal (or manual override)
  let calculatedFiber = Math.round((targetCalories / 1000) * 14);
  if (profile.is_manual_target && profile.manual_fiber_g && profile.manual_fiber_g > 0) {
    calculatedFiber = profile.manual_fiber_g;
  }
  const fiber_g = calculatedFiber;

  // Step 5: Micronutrients (ICMR-NIN & DRI Standards)
  const isFemale = profile.sex === 'female';

  let vitA = isFemale ? 840 : 1000; // mcg
  let vitC = isFemale ? 65 : 80; // mg
  let vitD = 600; // IU
  let thiamine_b1 = isFemale ? 1.1 : 1.4; // mg
  let riboflavin_b2 = isFemale ? 1.4 : 1.9; // mg
  let niacin_b3 = isFemale ? 14 : 16; // mg
  let folate_b9 = isFemale ? 220 : 300; // mcg DFE
  let b12 = 2.2; // mcg
  let calcium = 1000; // mg
  let iron = isFemale ? 21 : 17; // mg (higher in menstruating females)
  let zinc = isFemale ? 10 : 12; // mg
  let magnesium = isFemale ? 280 : 340; // mg
  let iodine = 150; // mcg
  let potassium = 3500; // mg

  // Physiological modifications
  if (profile.is_pregnant) {
    vitA += 100;
    vitC += 15;
    folate_b9 = 500; // Critical for neural tube
    iron = 27; // Substantial placental demand
    calcium = 1200;
    iodine = 250;
    zinc += 3;
    b12 = 2.6;
  } else if (profile.is_lactating) {
    vitA += 400;
    vitC += 45;
    calcium = 1200;
    iodine = 280;
    b12 = 2.8;
  }

  // Health Condition Modifiers
  const conditions = (profile.medical_conditions || []).map((c) => c.toLowerCase());
  
  if (conditions.some((c) => c.includes('anemia'))) {
    iron = Math.round(iron * 1.5);
    vitC = Math.max(vitC, 130); // Higher Vit C target to power non-heme iron reduction
    folate_b9 = Math.max(folate_b9, 400);
  }
  if (conditions.some((c) => c.includes('osteoporosis') || c.includes('osteopenia'))) {
    calcium = Math.max(calcium, 1200);
    vitD = Math.max(vitD, 1000);
    magnesium = Math.max(magnesium, 380);
  }
  if (conditions.some((c) => c.includes('hypertension') || c.includes('blood pressure'))) {
    potassium = 4000;
    magnesium = Math.max(magnesium, 420);
  }
  if (conditions.some((c) => c.includes('diabetes') || c.includes('insulin') || c.includes('prediabetes'))) {
    magnesium = Math.max(magnesium, 380);
    zinc = Math.max(zinc, 14); // Zinc is required for insulin crystal hexamer storage in beta cells
  }
  if (conditions.some((c) => c.includes('kidney stone') || c.includes('oxalate') || c.includes('hyperoxaluria'))) {
    // Crucial clinical nephrology rule: maintain dietary calcium at 1000-1200mg to bind oxalate in the gut lumen,
    // and high potassium (alkalizing citrate) while moderating megadose Vitamin C (<200mg).
    calcium = Math.max(calcium, 1100);
    potassium = Math.max(potassium, 3800);
    vitC = Math.min(vitC, 150);
  }
  if (conditions.some((c) => c.includes('thyroid') || c.includes('hypothyroid'))) {
    iodine = Math.max(iodine, 200);
    zinc = Math.max(zinc, 14);
  }

  return {
    calories: targetCalories,
    protein_g,
    carbs_g,
    fat_g,
    fiber_g,
    vitA_mcg: vitA,
    vitC_mg: vitC,
    vitD_iu: vitD,
    thiamine_b1_mg: Number(thiamine_b1.toFixed(2)),
    riboflavin_b2_mg: Number(riboflavin_b2.toFixed(2)),
    niacin_b3_mg: Number(niacin_b3.toFixed(1)),
    folate_b9_mcg: folate_b9,
    b12_mcg: Number(b12.toFixed(1)),
    calcium_mg: calcium,
    iron_mg: iron,
    zinc_mg: zinc,
    magnesium_mg: magnesium,
    iodine_mcg: iodine,
    potassium_mg: potassium,
    bmr: Math.round(bmr),
    tdee,
  };
}
