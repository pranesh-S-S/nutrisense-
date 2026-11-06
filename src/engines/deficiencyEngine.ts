/**
 * NutriSense - Deficiency and Nutrient Gap Detection Engine
 * Implements Chapter 16 from Technical Project Report
 * Analyzes reported dietary intake against personalized RDA
 * Four Severity Levels: Adequate (>=100%), Moderate Gap (67-99%), Significant Gap (<67%), Persistent Gap
 * Strictly provides Medical Decision-Support Language (Not Clinical Diagnosis).
 */

import { NutrientRequirements, CalculatedNutrients, NutrientGapItem, GapSeverity } from '../types/nutrition';

interface NutrientCheckMeta {
  key: keyof CalculatedNutrients;
  label: string;
  unit: string;
  suggestedFoods: string[];
  notes: string;
}

const TRACKED_NUTRIENTS: NutrientCheckMeta[] = [
  {
    key: 'iron_mg',
    label: 'Iron',
    unit: 'mg',
    suggestedFoods: ['Moong Dal (Yellow Lentils)', 'Baby Spinach (Steamed with Lemon)', 'Sprouted Moong', 'Wild Salmon'],
    notes: 'Essential for hemoglobin formation and cellular oxygen transport.',
  },
  {
    key: 'folate_b9_mcg',
    label: 'Folate (Vitamin B9)',
    unit: 'µg DFE',
    suggestedFoods: ['Yellow Lentils', 'Baby Spinach', 'Sprouted Moong', 'Broccoli Florets'],
    notes: 'Crucial for nucleic acid synthesis, red blood cell maturation, and neural tube integrity.',
  },
  {
    key: 'vitC_mg',
    label: 'Vitamin C',
    unit: 'mg',
    suggestedFoods: ['Indian Gooseberry (Amla)', 'Red Bell Pepper', 'Fresh Lemon Juice', 'Broccoli Florets'],
    notes: 'Key antioxidant and premier reducing synergist for non-heme iron absorption.',
  },
  {
    key: 'calcium_mg',
    label: 'Calcium',
    unit: 'mg',
    suggestedFoods: ['Probiotic Curd/Yogurt', 'Chia Seeds', 'Broccoli Florets'],
    notes: 'Vital for bone mineralization, neuromuscular transmission, and intracellular signaling.',
  },
  {
    key: 'vitD_iu',
    label: 'Vitamin D',
    unit: 'IU',
    suggestedFoods: ['Wild Atlantic Salmon', 'Whole Pasture Eggs', 'Fortified Dairy/Plant Milk'],
    notes: 'Required for active intestinal calcium transport and systemic immune modulation.',
  },
  {
    key: 'b12_mcg',
    label: 'Vitamin B12 (Cobalamin)',
    unit: 'µg',
    suggestedFoods: ['Wild Salmon', 'Whole Eggs', 'Natural Curd/Yogurt'],
    notes: 'Critical for neurological myelin sheath maintenance and erythropoiesis.',
  },
  {
    key: 'zinc_mg',
    label: 'Zinc',
    unit: 'mg',
    suggestedFoods: ['Chickpeas', 'Yellow Lentils', 'Sprouted Moong', 'Almonds'],
    notes: 'Essential cofactor for over 300 metalloenzymes and cell division.',
  },
  {
    key: 'magnesium_mg',
    label: 'Magnesium',
    unit: 'mg',
    suggestedFoods: ['Baby Spinach', 'Soaked Almonds', 'Chia Seeds', 'Steamed Brown Rice'],
    notes: 'Essential for ATP stabilization, DNA replication, and vascular tone.',
  },
  {
    key: 'protein_g',
    label: 'Dietary Protein',
    unit: 'g',
    suggestedFoods: ['Chicken Breast', 'Yellow Lentils', 'Wild Salmon', 'Sprouted Moong'],
    notes: 'Nitrogen balance and muscular/enzymatic tissue maintenance.',
  },
  {
    key: 'fiber_g',
    label: 'Dietary Fiber',
    unit: 'g',
    suggestedFoods: ['Yellow Lentils', 'Chia Seeds', 'Broccoli', 'Chickpeas'],
    notes: 'Supports short-chain fatty acid microbial fermentation and glycemic regulation.',
  },
];

export function detectNutrientGaps(
  dailyIntake: CalculatedNutrients,
  requirements: NutrientRequirements,
  consecutiveDaysLowMap?: Record<string, number>
): {
  gaps: NutrientGapItem[];
  hasSignificantGaps: boolean;
  medicalDisclaimer: string;
  clusterWarnings: string[];
} {
  const gaps: NutrientGapItem[] = [];
  const daysMap = consecutiveDaysLowMap || {};

  TRACKED_NUTRIENTS.forEach((meta) => {
    const intake = dailyIntake[meta.key] || 0;
    const target = (requirements as any)[meta.key] || 1;
    const intake_pct = Math.round((intake / target) * 100);
    const consecutive_days = daysMap[meta.key] || 1;

    let severity: GapSeverity = 'adequate';
    let clinical_flag = false;

    if (intake_pct >= 100) {
      severity = 'adequate';
    } else if (intake_pct >= 67) {
      severity = 'moderate_gap';
    } else {
      if (consecutive_days >= 30) {
        severity = 'persistent_gap';
        clinical_flag = true;
      } else {
        severity = 'significant_gap';
        if (consecutive_days >= 7) clinical_flag = true;
      }
    }

    gaps.push({
      nutrient_key: meta.key as string,
      nutrient_label: meta.label,
      intake: Number(intake.toFixed(1)),
      target: Math.round(target),
      unit: meta.unit,
      intake_pct,
      severity,
      consecutive_days,
      suggested_foods: meta.suggestedFoods,
      clinical_flag,
      notes: meta.notes,
    });
  });

  // Sort: significant & persistent gaps first, then moderate, then adequate
  const severityOrder: Record<GapSeverity, number> = {
    persistent_gap: 0,
    significant_gap: 1,
    moderate_gap: 2,
    adequate: 3,
  };
  gaps.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const hasSignificantGaps = gaps.some(
    (g) => g.severity === 'significant_gap' || g.severity === 'persistent_gap'
  );

  // Cluster Analysis (Multi-nutrient syndromes)
  const clusterWarnings: string[] = [];
  const ironGap = gaps.find((g) => g.nutrient_key === 'iron_mg')?.severity !== 'adequate';
  const folateGap = gaps.find((g) => g.nutrient_key === 'folate_b9_mcg')?.severity !== 'adequate';
  const b12Gap = gaps.find((g) => g.nutrient_key === 'b12_mcg')?.severity !== 'adequate';
  if (ironGap && (folateGap || b12Gap)) {
    clusterWarnings.push(
      'Anemia-Risk Cluster: Concurrent lower intake of Iron, Folate, and/or B12 detected. In addition to dietary adjustments, clinical serum ferritin and CBC evaluation with a physician is advised.'
    );
  }

  const calGap = gaps.find((g) => g.nutrient_key === 'calcium_mg')?.severity !== 'adequate';
  const vitDGap = gaps.find((g) => g.nutrient_key === 'vitD_iu')?.severity !== 'adequate';
  if (calGap && vitDGap) {
    clusterWarnings.push(
      'Bone Health Cluster: Suboptimal Calcium and Vitamin D synergy. Prioritize low-oxalate calcium sources alongside sunshine or fortified Vitamin D.'
    );
  }

  const medicalDisclaimer =
    'Medical Safety Notice: NutriSense is a personalized nutrition decision-support system and does NOT perform medical diagnosis. Potential nutrient gaps indicate dietary intake patterns and are not clinical blood diagnoses. Please consult a qualified healthcare provider or registered dietitian for laboratory evaluation.';

  return {
    gaps,
    hasSignificantGaps,
    medicalDisclaimer,
    clusterWarnings,
  };
}
