/**
 * NutriSense - Gastronomy Intelligence Engine (GIE)
 * Analyzes food preparation & cooking methods (boiling, steaming, pressure cooking,
 * stir-frying, sauteing, baking, raw, etc.) and evaluates nutrient retention
 * based on USDA Retention Factors Release 6, thermal kinetics, and leaching.
 */

import { CookingMethod, FoodItem, RetentionFactorSet, CalculatedNutrients } from '../types/nutrition';

export interface GastronomyAnalysis {
  food_id: string;
  food_name: string;
  selected_method: CookingMethod;
  recommended_method: CookingMethod;
  retention_score: number; // 0 - 100
  vitC_retained_pct: number;
  b_vitamins_retained_pct: number;
  minerals_retained_pct: number;
  fat_soluble_retained_pct: number;
  leaching_risk: 'none' | 'low' | 'moderate' | 'high';
  culinary_notes: string;
  method_comparison: {
    method: CookingMethod;
    retention_score: number;
    vitC_retention: number;
    minerals_retention: number;
    recommended: boolean;
    reason: string;
  }[];
}

export function evaluateGastronomy(food: FoodItem, selectedMethod?: CookingMethod): GastronomyAnalysis {
  const method = selectedMethod || food.recommended_cooking_method;
  const factors: RetentionFactorSet = food.retention_by_method[method] || {
    vitC_retention: 0.7,
    b_vitamins_retention: 0.7,
    minerals_retention: 0.85,
    fat_soluble_retention: 0.85,
    leaching_index: 'low',
    notes: 'Standard culinary processing applied.',
  };

  // Compute composite retention score (weighted based on nutrient content of the food)
  let weightedScore =
    factors.vitC_retention * 0.35 +
    factors.b_vitamins_retention * 0.25 +
    factors.minerals_retention * 0.25 +
    factors.fat_soluble_retention * 0.15;

  const retention_score = Math.round(weightedScore * 100);

  // Compare across supported methods
  const method_comparison = food.supported_cooking_methods.map((m) => {
    const f = food.retention_by_method[m] || factors;
    const score = Math.round(
      (f.vitC_retention * 0.35 +
        f.b_vitamins_retention * 0.25 +
        f.minerals_retention * 0.25 +
        f.fat_soluble_retention * 0.15) *
        100
    );
    return {
      method: m,
      retention_score: score,
      vitC_retention: Math.round(f.vitC_retention * 100),
      minerals_retention: Math.round(f.minerals_retention * 100),
      recommended: m === food.recommended_cooking_method,
      reason: f.notes,
    };
  });

  return {
    food_id: food.id,
    food_name: food.name,
    selected_method: method,
    recommended_method: food.recommended_cooking_method,
    retention_score,
    vitC_retained_pct: Math.round(factors.vitC_retention * 100),
    b_vitamins_retained_pct: Math.round(factors.b_vitamins_retention * 100),
    minerals_retained_pct: Math.round(factors.minerals_retention * 100),
    fat_soluble_retained_pct: Math.round(factors.fat_soluble_retention * 100),
    leaching_risk: factors.leaching_index,
    culinary_notes: factors.notes,
    method_comparison,
  };
}

/**
 * Applies cooking method retention factors to calculate actual consumed nutrients
 */
export function calculateRetainedNutrients(
  food: FoodItem,
  quantity: number,
  method: CookingMethod
): CalculatedNutrients {
  const factors: RetentionFactorSet = food.retention_by_method[method] || {
    vitC_retention: 0.75,
    b_vitamins_retention: 0.75,
    minerals_retention: 0.9,
    fat_soluble_retention: 0.9,
    leaching_index: 'low',
    notes: '',
  };

  const q = quantity;

  return {
    calories: Math.round(food.calories * q),
    protein_g: Number((food.protein_g * q).toFixed(1)),
    carbs_g: Number((food.carbs_g * q).toFixed(1)),
    fat_g: Number((food.fat_g * q).toFixed(1)),
    fiber_g: Number((food.fiber_g * q).toFixed(1)),

    // Heat & leaching sensitive nutrients adjusted by retention factors
    vitA_mcg: Math.round(food.vitA_mcg * q * factors.fat_soluble_retention),
    vitC_mg: Number((food.vitC_mg * q * factors.vitC_retention).toFixed(1)),
    vitD_iu: Math.round(food.vitD_iu * q * factors.fat_soluble_retention),
    thiamine_b1_mg: Number((food.thiamine_b1_mg * q * factors.b_vitamins_retention).toFixed(2)),
    riboflavin_b2_mg: Number((food.riboflavin_b2_mg * q * factors.b_vitamins_retention).toFixed(2)),
    niacin_b3_mg: Number((food.niacin_b3_mg * q * factors.b_vitamins_retention).toFixed(2)),
    folate_b9_mcg: Math.round(food.folate_b9_mcg * q * factors.b_vitamins_retention),
    b12_mcg: Number((food.b12_mcg * q * factors.b_vitamins_retention).toFixed(2)),

    // Minerals (leaching loss only if boiled)
    calcium_mg: Math.round(food.calcium_mg * q * factors.minerals_retention),
    iron_mg: Number((food.iron_mg * q * factors.minerals_retention).toFixed(2)),
    zinc_mg: Number((food.zinc_mg * q * factors.minerals_retention).toFixed(2)),
    magnesium_mg: Math.round(food.magnesium_mg * q * factors.minerals_retention),
    iodine_mcg: Number((food.iodine_mcg * q * factors.minerals_retention).toFixed(1)),
    potassium_mg: Math.round(food.potassium_mg * q * factors.minerals_retention),
  };
}
