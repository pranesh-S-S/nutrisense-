/**
 * NutriSense - Bioavailability Engine
 * Core Principle: Nutrient Content ≠ Nutrient Absorption
 * Evaluates dietary synergies (Ascorbic acid + Non-heme iron, Lipids + Carotenoids/Vit D, Fermentation)
 * and antagonisms (Phytates, Oxalates, Tannins, Calcium-Iron competition).
 */

import { FoodItem, CookingMethod, BioavailabilityAnalysis } from '../types/nutrition';

interface MealComponent {
  food: FoodItem;
  quantity: number;
  cooking_method: CookingMethod;
}

export function analyzeMealBioavailability(components: MealComponent[]): BioavailabilityAnalysis {
  if (components.length === 0) {
    return {
      overall_score: 50,
      iron_absorption_pct: 5,
      calcium_absorption_pct: 20,
      enhancers_detected: [],
      inhibitors_detected: [],
      preparation_boosts: [],
      actionable_pairings: ['Add items to your meal to evaluate bioavailability.'],
      scientific_reasoning: 'No food components selected.',
      references: [],
    };
  }

  // Aggregate meal totals
  let totalNonHemeIron = 0;
  let totalHemeIron = 0;
  let totalVitC = 0;
  let totalCalcium = 0;
  let totalFat = 0;

  let hasTeaTannins = false;
  let highPhytateCount = 0;
  let highOxalateCount = 0;
  let sproutedCount = 0;
  let fermentedCount = 0;
  let soakedCount = 0;

  components.forEach(({ food, quantity, cooking_method }) => {
    const q = quantity;
    if (food.iron_type === 'heme') {
      totalHemeIron += food.iron_mg * q;
    } else if (food.iron_type === 'non_heme') {
      totalNonHemeIron += food.iron_mg * q;
    }

    // Adjust Vit C for cooking retention
    const retentionC = food.retention_by_method[cooking_method]?.vitC_retention ?? 0.75;
    totalVitC += food.vitC_mg * q * retentionC;
    totalCalcium += food.calcium_mg * q;
    totalFat += food.fat_g * q;

    if (food.tannin_level === 'high' || food.id === 'food_black_tea') {
      hasTeaTannins = true;
    }
    if (food.phytate_level === 'high') {
      if (cooking_method === 'sprouting') {
        sproutedCount++;
      } else if (cooking_method === 'soaking') {
        soakedCount++;
      } else {
        highPhytateCount++;
      }
    }
    if (food.oxalate_level === 'high') {
      highOxalateCount++;
    }
    if (cooking_method === 'fermentation' || food.category === 'Dairy' && food.id.includes('curd')) {
      fermentedCount++;
    }
  });

  const enhancers: string[] = [];
  const inhibitors: string[] = [];
  const prepBoosts: string[] = [];
  const suggestions: string[] = [];
  const references: string[] = [];

  // 1. Non-Heme Iron Absorption Modeling
  // Baseline non-heme iron absorption without enhancers: ~3% to 5%
  let nonHemeIronAbsorption = 5.0;

  if (totalVitC >= 50) {
    nonHemeIronAbsorption *= 3.5; // Hallberg et al. (1989): 50mg ascorbic acid yields 3-6x increase
    enhancers.push(`High Ascorbic Acid (${Math.round(totalVitC)}mg Vitamin C) enhances non-heme iron conversion Fe³⁺ ➔ Fe²⁺`);
    references.push('Hallberg et al. (1989) Am J Clin Nutr');
  } else if (totalVitC >= 20) {
    nonHemeIronAbsorption *= 2.0;
    enhancers.push(`Moderate Vitamin C (${Math.round(totalVitC)}mg) provides iron chelation synergy`);
  } else if (totalNonHemeIron > 2.0) {
    suggestions.push('Add an ascorbic acid source (fresh lemon squeeze or red bell pepper) to triple non-heme iron uptake.');
  }

  if (totalHemeIron > 0.5) {
    nonHemeIronAbsorption *= 1.4; // Meat Factor peptides
    enhancers.push('Meat/Poultry factor peptides present, enhancing concurrent non-heme iron absorption');
    references.push('Hurrell & Egli (2010) Am J Clin Nutr');
  }

  if (sproutedCount > 0) {
    prepBoosts.push('Sprouting has activated endogenous phytases, dephosphorylating inositol hexaphosphate.');
    references.push('Sandberg (2002) Br J Nutr');
  }

  if (soakedCount > 0) {
    prepBoosts.push('Pre-soaking has leached water-soluble anti-nutrients and reduced phytate binding by ~35%.');
  }

  if (fermentedCount > 0) {
    prepBoosts.push('Lactic acid fermentation lowered meal pH and created soluble mineral chelates.');
  }

  // Inhibitor penalties
  if (hasTeaTannins) {
    nonHemeIronAbsorption *= 0.25; // 75% reduction
    inhibitors.push('Polyphenols / Tannins from tea co-ingested: precipitates iron into insoluble complexes.');
    suggestions.push('Timing adjustment: Delay drinking tea/coffee until 60-90 minutes after your meal.');
    references.push('Hurrell et al. (1999) Am J Clin Nutr');
  }

  if (highPhytateCount > 0) {
    nonHemeIronAbsorption *= 0.65;
    inhibitors.push('Un-soaked phytic acid from whole grains/legumes chelated divalent iron & zinc.');
    suggestions.push('Soak dry beans, lentils, or grains for 6-8 hours before cooking to reduce phytic acid.');
  }

  if (totalCalcium > 300 && totalNonHemeIron > 1.5) {
    nonHemeIronAbsorption *= 0.70;
    inhibitors.push('High calcium intake (>300mg) competes with iron at the enterocyte transporter (DMT1).');
    suggestions.push('Space high-calcium dairy portions away from your main iron-fortified meal.');
  }

  // Cap non-heme iron absorption between 1% and 25%
  nonHemeIronAbsorption = Math.min(25, Math.max(1, nonHemeIronAbsorption));

  // Weighted total iron absorption
  const totalIron = totalHemeIron + totalNonHemeIron;
  let estimatedIronAbsorptionPct = 5.0;
  if (totalIron > 0) {
    estimatedIronAbsorptionPct =
      (totalHemeIron * 25.0 + totalNonHemeIron * nonHemeIronAbsorption) / totalIron;
  }

  // 2. Calcium Bioavailability Modeling
  let calciumAbsorptionPct = 25.0;
  if (highOxalateCount > 0) {
    calciumAbsorptionPct = 8.0;
    inhibitors.push('High oxalates present: forms insoluble calcium oxalate crystals (spinach calcium is only ~5% bioavailable).');
    suggestions.push('For bioavailable calcium, pair low-oxalate sources (curd, broccoli, fortified plant milk) with Vitamin D.');
    references.push('Weaver & Plawecki (1994) Am J Clin Nutr');
  } else if (fermentedCount > 0) {
    calciumAbsorptionPct = 35.0;
    enhancers.push('Fermented lactic acid improves intestinal calcium solubility.');
  }

  // 3. Fat-Soluble Vitamin & Carotenoid Solubilization
  if (totalFat >= 5) {
    enhancers.push(`Dietary fat present (${Math.round(totalFat)}g): enables mixed micelle formation for Vitamin A, D, E, K, and Lycopene.`);
  } else {
    suggestions.push('Include 5-10g of culinary healthy fat (olive oil, nuts, ghee) to absorb fat-soluble vitamins and lycopene.');
  }

  // 4. Overall Bioavailability Score (0 - 100)
  let score = 65;
  score += enhancers.length * 8;
  score += prepBoosts.length * 6;
  score -= inhibitors.length * 12;
  const overall_score = Math.min(98, Math.max(20, score));

  // Build scientific reasoning narrative
  let scientific_reasoning = `Meal absorption efficiency index is ${overall_score}/100. `;
  if (enhancers.length > 0) {
    scientific_reasoning += `Synergies active: ${enhancers[0]}. `;
  }
  if (inhibitors.length > 0) {
    scientific_reasoning += `Inhibition active: ${inhibitors[0]}. `;
  }
  if (suggestions.length === 0) {
    suggestions.push('Optimal meal pairing achieved; high absorption synergy.');
  }

  return {
    overall_score,
    iron_absorption_pct: Number(estimatedIronAbsorptionPct.toFixed(1)),
    calcium_absorption_pct: Number(calciumAbsorptionPct.toFixed(1)),
    enhancers_detected: enhancers,
    inhibitors_detected: inhibitors,
    preparation_boosts: prepBoosts,
    actionable_pairings: suggestions,
    scientific_reasoning,
    references: Array.from(new Set(references)),
  };
}
