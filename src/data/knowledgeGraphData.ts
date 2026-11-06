/**
 * NutriSense - Nutrition Knowledge Graph (NKG) Data & Schema
 * Implements Figure 3 & Table 3/4 from Technical Project Report
 * Nodes: Food, Nutrient, CookingMethod, BioavailabilityFactor, HealthCondition, Allergen
 * Edges: CONTAINS, ENHANCES_ABSORPTION, INHIBITS_ABSORPTION, PREPARED_BY, AFFECTS_RETENTION, PAIRS_WITH, MODIFIES_REQUIREMENT
 */

import { KnowledgeGraphNode, KnowledgeGraphEdge } from '../types/nutrition';

export const KG_NODES: KnowledgeGraphNode[] = [
  // Nutrients
  { id: 'n_iron_nonheme', label: 'Non-Heme Iron', category: 'Nutrient', description: 'Plant-derived ionic iron (Fe3+/Fe2+)', val: 18 },
  { id: 'n_iron_heme', label: 'Heme Iron', category: 'Nutrient', description: 'Meat-derived porphyrin ring iron, high baseline uptake', val: 16 },
  { id: 'n_vit_c', label: 'Vitamin C (Ascorbic Acid)', category: 'Nutrient', description: 'Water-soluble, heat-sensitive, potent reducing agent', val: 20 },
  { id: 'n_calcium', label: 'Calcium (Ca2+)', category: 'Nutrient', description: 'Essential divalent cation for bone & muscle signaling', val: 18 },
  { id: 'n_vit_d', label: 'Vitamin D3 (Cholecalciferol)', category: 'Nutrient', description: 'Fat-soluble steroid hormone regulating calcium absorption', val: 16 },
  { id: 'n_zinc', label: 'Zinc (Zn2+)', category: 'Nutrient', description: 'Trace mineral essential for 300+ enzymatic reactions', val: 15 },
  { id: 'n_folate', label: 'Folate (Vitamin B9)', category: 'Nutrient', description: 'Crucial for DNA synthesis & neural tube formation', val: 17 },
  { id: 'n_lycopene', label: 'Lycopene Carotenoid', category: 'Nutrient', description: 'Fat-soluble antioxidant abundant in red tomatoes', val: 14 },

  // Bioavailability Factors (Enhancers / Inhibitors)
  { id: 'bf_ascorbate', label: 'Ascorbic Synergy', category: 'BioavailabilityFactor', description: 'Reduces Fe3+ to soluble Fe2+ chelate in intestine', val: 22 },
  { id: 'bf_phytates', label: 'Phytic Acid (Phytate)', category: 'BioavailabilityFactor', description: 'Divalent mineral chelator in raw grains/legumes', val: 22 },
  { id: 'bf_oxalates', label: 'Oxalic Acid (Oxalate)', category: 'BioavailabilityFactor', description: 'Binds calcium into insoluble calcium oxalate crystals', val: 20 },
  { id: 'bf_tannins', label: 'Tannins & Polyphenols', category: 'BioavailabilityFactor', description: 'Forms insoluble precipitates with non-heme iron', val: 20 },
  { id: 'bf_dietary_fat', label: 'Dietary Fat (Micelles)', category: 'BioavailabilityFactor', description: 'Required for solubilization of fat-soluble vitamins', val: 18 },
  { id: 'bf_fermentation', label: 'Fermentation / Lactic Acid', category: 'BioavailabilityFactor', description: 'Microbial phytases degrade phytates; lowers pH', val: 20 },
  { id: 'bf_sprouting', label: 'Sprouting Germination', category: 'BioavailabilityFactor', description: 'Activates endogenous phytase enzymes', val: 18 },

  // Cooking Methods (Gastronomy Science)
  { id: 'cm_steaming', label: 'Steaming (100°C Indirect)', category: 'CookingMethod', description: 'Preserves 85% water-soluble vitamins, minimal leaching', val: 19 },
  { id: 'cm_boiling', label: 'Boiling (Water Immersion)', category: 'CookingMethod', description: 'Significant leaching of Vit C, Folate, and minerals into broth', val: 19 },
  { id: 'cm_pressure_cooking', label: 'Pressure Cooking (Autoclave)', category: 'CookingMethod', description: 'Short duration offsets heat; deactivates phytates', val: 18 },
  { id: 'cm_stir_frying', label: 'Stir-Frying with Oil', category: 'CookingMethod', description: 'Brief heat + fat increases carotenoid bioaccessibility', val: 18 },
  { id: 'cm_raw', label: 'Raw Preparation', category: 'CookingMethod', description: 'Zero thermal degradation; plant cell walls intact', val: 17 },

  // Foods
  { id: 'f_spinach', label: 'Spinach', category: 'Food', description: 'Rich in non-heme iron, folates, but high in oxalates', val: 16 },
  { id: 'f_lentils', label: 'Yellow Lentils (Moong)', category: 'Food', description: 'Plant protein & non-heme iron; contains phytates', val: 16 },
  { id: 'f_lemon', label: 'Lemon Juice', category: 'Food', description: 'Concentrated ascorbic acid & citric acid synergist', val: 16 },
  { id: 'f_bell_pepper', label: 'Red Bell Pepper', category: 'Food', description: '127mg Vitamin C per 100g serving', val: 16 },
  { id: 'f_broccoli', label: 'Broccoli', category: 'Food', description: 'Sulforaphane precursor, Vit C, low oxalate calcium', val: 16 },
  { id: 'f_salmon', label: 'Wild Salmon', category: 'Food', description: 'Heme iron, high Vit D3, and omega-3 EPA/DHA', val: 16 },
  { id: 'f_curd', label: 'Probiotic Curd/Yogurt', category: 'Food', description: 'Lactic acid fermented, bioavailable calcium', val: 16 },
  { id: 'f_black_tea', label: 'Black Tea', category: 'Food', description: 'High tannin beverage; potent meal-time iron inhibitor', val: 16 },
  { id: 'f_sprouted_moong', label: 'Sprouted Moong', category: 'Food', description: 'Pre-activated phytase; 2.5x iron bioavailability', val: 16 },

  // Health Conditions
  { id: 'hc_anemia', label: 'Iron Deficiency Anemia', category: 'HealthCondition', description: 'Elevated iron demand, requires absorption optimization', val: 21 },
  { id: 'hc_pregnancy', label: 'Pregnancy Trimester 2/3', category: 'HealthCondition', description: 'Higher demands for iron, folate, iodine, calcium', val: 22 },
  { id: 'hc_osteoporosis', label: 'Bone Density / Osteoporosis', category: 'HealthCondition', description: 'Requires bioavailable calcium & Vitamin D synergies', val: 19 },
];

export const KG_EDGES: KnowledgeGraphEdge[] = [
  // Food -> Nutrient
  { id: 'e1', source: 'f_spinach', target: 'n_iron_nonheme', relationship: 'CONTAINS', strength: 'high' },
  { id: 'e2', source: 'f_spinach', target: 'n_calcium', relationship: 'CONTAINS', strength: 'high' },
  { id: 'e3', source: 'f_spinach', target: 'n_folate', relationship: 'CONTAINS', strength: 'high' },
  { id: 'e4', source: 'f_lemon', target: 'n_vit_c', relationship: 'CONTAINS', strength: 'high' },
  { id: 'e5', source: 'f_bell_pepper', target: 'n_vit_c', relationship: 'CONTAINS', strength: 'high' },
  { id: 'e6', source: 'f_lentils', target: 'n_iron_nonheme', relationship: 'CONTAINS', strength: 'high' },
  { id: 'e7', source: 'f_lentils', target: 'n_zinc', relationship: 'CONTAINS', strength: 'moderate' },
  { id: 'e8', source: 'f_salmon', target: 'n_iron_heme', relationship: 'CONTAINS', strength: 'moderate' },
  { id: 'e9', source: 'f_salmon', target: 'n_vit_d', relationship: 'CONTAINS', strength: 'high' },
  { id: 'e10', source: 'f_curd', target: 'n_calcium', relationship: 'CONTAINS', strength: 'high' },

  // Food -> Bioavailability Factors
  { id: 'e11', source: 'f_spinach', target: 'bf_oxalates', relationship: 'CONTAINS', strength: 'high' },
  { id: 'e12', source: 'f_lentils', target: 'bf_phytates', relationship: 'CONTAINS', strength: 'high' },
  { id: 'e13', source: 'f_black_tea', target: 'bf_tannins', relationship: 'CONTAINS', strength: 'high' },
  { id: 'e14', source: 'f_curd', target: 'bf_fermentation', relationship: 'CONTAINS', strength: 'high' },
  { id: 'e15', source: 'f_sprouted_moong', target: 'bf_sprouting', relationship: 'CONTAINS', strength: 'high' },

  // Bioavailability Synergy & Inhibition (The Science)
  {
    id: 'e16',
    source: 'bf_ascorbate',
    target: 'n_iron_nonheme',
    relationship: 'ENHANCES_ABSORPTION',
    strength: 'high',
    evidence: 'Hallberg et al. (1989): 50mg Vit C yields 300-600% increase in non-heme iron absorption.',
  },
  {
    id: 'e17',
    source: 'bf_dietary_fat',
    target: 'n_lycopene',
    relationship: 'ENHANCES_ABSORPTION',
    strength: 'high',
    evidence: 'Fabbri & Crosby (2016): Lipid micelles required for enterocyte absorption.',
  },
  {
    id: 'e18',
    source: 'n_vit_d',
    target: 'n_calcium',
    relationship: 'ENHANCES_ABSORPTION',
    strength: 'high',
    evidence: 'Active 1,25(OH)2D upregulates calbindin-D9k intestinal transport.',
  },
  {
    id: 'e19',
    source: 'bf_phytates',
    target: 'n_iron_nonheme',
    relationship: 'INHIBITS_ABSORPTION',
    strength: 'high',
    evidence: 'Sandberg (2002): Hexaphosphate inositol forms insoluble precipitates at intestinal pH.',
  },
  {
    id: 'e20',
    source: 'bf_phytates',
    target: 'n_zinc',
    relationship: 'INHIBITS_ABSORPTION',
    strength: 'high',
    evidence: 'Molar ratio phytate:zinc > 15 impairs zinc balance.',
  },
  {
    id: 'e21',
    source: 'bf_oxalates',
    target: 'n_calcium',
    relationship: 'INHIBITS_ABSORPTION',
    strength: 'high',
    evidence: 'Weaver & Plawecki (1994): Calcium bioavailability from spinach is only ~5.1%.',
  },
  {
    id: 'e22',
    source: 'bf_tannins',
    target: 'n_iron_nonheme',
    relationship: 'INHIBITS_ABSORPTION',
    strength: 'high',
    evidence: 'Hurrell (1999): Tea concurrent with meal reduces iron absorption by 60-90%.',
  },

  // Food Prep / Gastronomy -> Bioavailability / Nutrients
  {
    id: 'e23',
    source: 'cm_steaming',
    target: 'n_vit_c',
    relationship: 'AFFECTS_RETENTION',
    strength: 'high',
    evidence: 'USDA Release 6: 85% retention, no water submersion.',
  },
  {
    id: 'e24',
    source: 'cm_boiling',
    target: 'n_vit_c',
    relationship: 'AFFECTS_RETENTION',
    strength: 'low',
    evidence: 'USDA Release 6: 42% retention, severe leaching loss into water.',
  },
  {
    id: 'e25',
    source: 'bf_sprouting',
    target: 'bf_phytates',
    relationship: 'INHIBITS_ABSORPTION',
    strength: 'high',
    evidence: 'Dephosphorylates phytate into lower inositol phosphates.',
  },
  {
    id: 'e26',
    source: 'cm_pressure_cooking',
    target: 'bf_phytates',
    relationship: 'INHIBITS_ABSORPTION',
    strength: 'moderate',
    evidence: 'Reduces phytic acid by 35-50% in legumes.',
  },

  // Food Pairing Synergy
  {
    id: 'e27',
    source: 'f_lentils',
    target: 'f_lemon',
    relationship: 'PAIRS_WITH',
    strength: 'high',
    evidence: 'Lemon juice adds ascorbic acid to non-heme iron dal, tripling uptake.',
  },
  {
    id: 'e28',
    source: 'f_spinach',
    target: 'f_bell_pepper',
    relationship: 'PAIRS_WITH',
    strength: 'high',
    evidence: 'Raw red bell pepper supplies over 120mg Vit C to overcome oxalate inhibition.',
  },

  // Health Conditions -> Requirements
  {
    id: 'e29',
    source: 'hc_anemia',
    target: 'n_iron_nonheme',
    relationship: 'MODIFIES_REQUIREMENT',
    strength: 'high',
    evidence: 'Requires 1.5x iron targets + mandatory ascorbic acid synergist pairing.',
  },
  {
    id: 'e30',
    source: 'hc_pregnancy',
    target: 'n_folate',
    relationship: 'MODIFIES_REQUIREMENT',
    strength: 'high',
    evidence: 'ICMR-NIN: Folate increases from 220µg to 500µg DFE daily.',
  },
];
