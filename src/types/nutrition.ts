/**
 * NutriSense - TypeScript Type Definitions
 * Based on Technical Project Report: AI-Powered Personalized Nutrition Intelligence Platform
 */

export type Sex = 'male' | 'female';

export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | 'extra_active';

export type FitnessGoal = 'weight_loss' | 'maintenance' | 'weight_gain' | 'athletic_performance';

export type HealthGoal = FitnessGoal | 'anemia_recovery' | 'bone_health' | 'longevity' | 'muscle_gain';

export type DietaryPreference = 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'gluten_free' | 'plant_forward';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  sex: Sex;
  height_cm: number;
  weight_kg: number;
  bmi?: number;
  activity_level: ActivityLevel;
  fitness_goal?: HealthGoal;
  goal?: HealthGoal;
  dietary_preference: DietaryPreference;
  region?: string; // Geographic region for local food availability (e.g., South Asia / India, Mediterranean, etc.)
  is_pregnant: boolean;
  pregnancy_trimester?: '1st' | '2nd' | '3rd';
  is_lactating: boolean;
  allergies: string[];
  medical_conditions: string[];
  // Manual Entry target settings
  is_manual_target?: boolean;
  manual_calories?: number;
  manual_protein_g?: number;
  manual_carbs_g?: number;
  manual_fat_g?: number;
  manual_fiber_g?: number;
  manual_water_ml?: number;
}

export interface NutrientRequirements {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  // Micronutrients
  vitA_mcg: number;
  vitC_mg: number;
  vitD_iu: number;
  thiamine_b1_mg: number;
  riboflavin_b2_mg: number;
  niacin_b3_mg: number;
  folate_b9_mcg: number;
  b12_mcg: number;
  calcium_mg: number;
  iron_mg: number;
  zinc_mg: number;
  magnesium_mg: number;
  iodine_mcg: number;
  potassium_mg: number;
  bmr: number;
  tdee: number;
}

export type CookingMethod =
  | 'raw'
  | 'steaming'
  | 'boiling'
  | 'pressure_cooking'
  | 'stir_frying'
  | 'sauteing'
  | 'baking_roasting'
  | 'grilling'
  | 'microwaving'
  | 'fermentation'
  | 'sprouting'
  | 'soaking';

export interface RetentionFactorSet {
  vitC_retention: number; // 0.0 - 1.0
  b_vitamins_retention: number;
  minerals_retention: number;
  fat_soluble_retention: number;
  leaching_index: 'none' | 'low' | 'moderate' | 'high';
  notes: string;
}

export interface FoodItem {
  id: string;
  name: string;
  scientific_name?: string;
  category: 'Green Leafy Vegetable' | 'Vegetable' | 'Legume' | 'Grain' | 'Fruit' | 'Dairy' | 'Meat & Poultry' | 'Fish & Seafood' | 'Nut & Seed' | 'Spice & Superfood';
  serving_size: number; // e.g. 100
  serving_unit: string; // e.g. 'g'
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  // Micronutrients per serving
  vitA_mcg: number;
  vitC_mg: number;
  vitD_iu: number;
  thiamine_b1_mg: number;
  riboflavin_b2_mg: number;
  niacin_b3_mg: number;
  folate_b9_mcg: number;
  b12_mcg: number;
  calcium_mg: number;
  iron_mg: number;
  iron_type: 'heme' | 'non_heme' | 'none';
  zinc_mg: number;
  magnesium_mg: number;
  iodine_mcg: number;
  potassium_mg: number;
  // Bioavailability & Functional attributes
  phytate_level: 'none' | 'low' | 'moderate' | 'high';
  oxalate_level: 'none' | 'low' | 'moderate' | 'high';
  tannin_level: 'none' | 'low' | 'moderate' | 'high';
  bioactive_compounds?: string[];
  antioxidant_orac?: number; // ORAC value in µmol TE/100g
  antioxidant_notes?: string;
  regions?: string[]; // Where this food is naturally grown, widely available & staple
  cost_tier?: 'budget' | 'moderate' | 'premium';
  medical_cautions?: string[]; // E.g. 'Kidney Stones (High Oxalate)', 'Hypothyroidism (Cook thoroughly)'
  medical_benefits?: string[]; // E.g. 'Type 2 Diabetes (Insulin sensitizer)', 'Anemia recovery'
  allergens: string[];
  supported_cooking_methods: CookingMethod[];
  recommended_cooking_method: CookingMethod;
  retention_by_method: Partial<Record<CookingMethod, RetentionFactorSet>>;
  bioavailability_tips: string;
  evidence_source: string;
}

export interface MealLogEntry {
  id: string;
  food_id: string;
  date: string; // 'YYYY-MM-DD'
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quantity: number; // multiplier of serving_size
  cooking_method: CookingMethod;
  timestamp: string;
}

export interface CalculatedNutrients {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  vitA_mcg: number;
  vitC_mg: number;
  vitD_iu: number;
  thiamine_b1_mg: number;
  riboflavin_b2_mg: number;
  niacin_b3_mg: number;
  folate_b9_mcg: number;
  b12_mcg: number;
  calcium_mg: number;
  iron_mg: number;
  zinc_mg: number;
  magnesium_mg: number;
  iodine_mcg: number;
  potassium_mg: number;
}

export interface BioavailabilityAnalysis {
  overall_score: number; // 0 - 100
  iron_absorption_pct: number;
  calcium_absorption_pct: number;
  enhancers_detected: string[];
  inhibitors_detected: string[];
  preparation_boosts: string[];
  actionable_pairings: string[];
  scientific_reasoning: string;
  references: string[];
}

export type GapSeverity = 'adequate' | 'moderate_gap' | 'significant_gap' | 'persistent_gap';

export interface NutrientGapItem {
  nutrient_key: string;
  nutrient_label: string;
  intake: number;
  target: number;
  unit: string;
  intake_pct: number;
  severity: GapSeverity;
  consecutive_days: number;
  suggested_foods: string[];
  clinical_flag: boolean;
  notes: string;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  category: 'Food' | 'Nutrient' | 'CookingMethod' | 'BioavailabilityFactor' | 'HealthCondition' | 'Allergen';
  description?: string;
  details?: string;
  val?: number;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  relationship:
    | 'CONTAINS'
    | 'PREPARED_BY'
    | 'AFFECTS_RETENTION'
    | 'ENHANCES_ABSORPTION'
    | 'INHIBITS_ABSORPTION'
    | 'PAIRS_WITH'
    | 'CONTAINS_ALLERGEN'
    | 'MODIFIES_REQUIREMENT';
  strength?: 'high' | 'moderate' | 'low';
  evidence?: string;
}

export interface RecommendationPlan {
  id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  title: string;
  food_recommendations: {
    food_id: string;
    portion_text: string;
    cooking_method: CookingMethod;
    retention_highlight: string;
  }[];
  pairing_guidance: string;
  bioavailability_score: number;
  gap_addressed?: string;
  scientific_rationale: string;
  citations: string[];
}
