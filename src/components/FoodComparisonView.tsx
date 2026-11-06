/**
 * NutriSense - Side-by-Side Food Comparison Tool
 * Implements Objective #11 from the Technical Project Report.
 */

import React, { useState } from 'react';
import { FoodItem } from '../types/nutrition';
import { FOOD_DATABASE } from '../data/foodDatabase';
import { Scale, Sparkles, ChefHat, Check, ArrowRight, BookOpen } from 'lucide-react';

export const FoodComparisonView: React.FC = () => {
  const [foodAId, setFoodAId] = useState<string>('food_spinach');
  const [foodBId, setFoodBId] = useState<string>('food_broccoli');

  const foodA = FOOD_DATABASE.find((f) => f.id === foodAId) || FOOD_DATABASE[0];
  const foodB = FOOD_DATABASE.find((f) => f.id === foodBId) || FOOD_DATABASE[1];

  const metrics: {
    label: string;
    unit: string;
    valA: number;
    valB: number;
    higherIsBetter: boolean;
  }[] = [
    { label: 'Energy', unit: 'kcal', valA: foodA.calories, valB: foodB.calories, higherIsBetter: false },
    { label: 'Protein', unit: 'g', valA: foodA.protein_g, valB: foodB.protein_g, higherIsBetter: true },
    { label: 'Fiber', unit: 'g', valA: foodA.fiber_g, valB: foodB.fiber_g, higherIsBetter: true },
    { label: 'Vitamin C', unit: 'mg', valA: foodA.vitC_mg, valB: foodB.vitC_mg, higherIsBetter: true },
    { label: 'Folate (B9)', unit: 'µg', valA: foodA.folate_b9_mcg, valB: foodB.folate_b9_mcg, higherIsBetter: true },
    { label: 'Calcium', unit: 'mg', valA: foodA.calcium_mg, valB: foodB.calcium_mg, higherIsBetter: true },
    { label: 'Iron', unit: 'mg', valA: foodA.iron_mg, valB: foodB.iron_mg, higherIsBetter: true },
    { label: 'Zinc', unit: 'mg', valA: foodA.zinc_mg, valB: foodB.zinc_mg, higherIsBetter: true },
    { label: 'Magnesium', unit: 'mg', valA: foodA.magnesium_mg, valB: foodB.magnesium_mg, higherIsBetter: true },
    { label: 'Potassium', unit: 'mg', valA: foodA.potassium_mg, valB: foodB.potassium_mg, higherIsBetter: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-1">
            <Scale className="w-3.5 h-3.5" />
            <span>NutriSense Dual Food Comparison Matrix</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Nutritional, Gastronomic & Bioavailability Comparison
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Compare two ingredients per 100g standard serving across macro, micro, and absorption dynamics.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          <span className="font-semibold text-slate-700">Presets:</span>
          <button
            onClick={() => {
              setFoodAId('food_spinach');
              setFoodBId('food_broccoli');
            }}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
          >
            Spinach vs. Broccoli
          </button>
          <button
            onClick={() => {
              setFoodAId('food_lentils_yellow');
              setFoodBId('food_sprouted_moong');
            }}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
          >
            Lentils vs. Sprouted Moong
          </button>
          <button
            onClick={() => {
              setFoodAId('food_salmon_wild');
              setFoodBId('food_chicken_breast');
            }}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
          >
            Salmon vs. Chicken
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
          <label className="text-xs font-bold text-emerald-900 uppercase tracking-wider block mb-1">
            Item A
          </label>
          <select
            value={foodAId}
            onChange={(e) => setFoodAId(e.target.value)}
            className="w-full py-2 px-3 rounded-lg bg-white border border-emerald-300 text-sm font-bold text-slate-900"
          >
            {FOOD_DATABASE.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.category})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-200">
          <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block mb-1">
            Item B
          </label>
          <select
            value={foodBId}
            onChange={(e) => setFoodBId(e.target.value)}
            className="w-full py-2 px-3 rounded-lg bg-white border border-teal-300 text-sm font-bold text-slate-900"
          >
            {FOOD_DATABASE.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="p-3.5">Nutrient Parameter (per 100g)</th>
              <th className="p-3.5 text-emerald-900 w-1/3">{foodA.name}</th>
              <th className="p-3.5 text-teal-900 w-1/3">{foodB.name}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {metrics.map((m) => {
              const aWins = m.higherIsBetter ? m.valA > m.valB : m.valA < m.valB;
              const bWins = m.higherIsBetter ? m.valB > m.valA : m.valB < m.valA;
              const isEqual = m.valA === m.valB;

              return (
                <tr key={m.label} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-medium text-slate-800">{m.label}</td>
                  <td className="p-3.5 font-bold">
                    <span className={aWins ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded' : 'text-slate-700'}>
                      {m.valA} {m.unit}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold">
                    <span className={bWins ? 'text-teal-700 bg-teal-50 px-2 py-0.5 rounded' : 'text-slate-700'}>
                      {m.valB} {m.unit}
                    </span>
                  </td>
                </tr>
              );
            })}

            {/* Anti-Nutritional Factors Comparison */}
            <tr className="bg-slate-50/60 font-semibold text-slate-900">
              <td className="p-3.5">Phytic Acid (Phytate Level)</td>
              <td className="p-3.5 capitalize">{foodA.phytate_level}</td>
              <td className="p-3.5 capitalize">{foodB.phytate_level}</td>
            </tr>
            <tr className="bg-slate-50/60 font-semibold text-slate-900">
              <td className="p-3.5">Oxalic Acid (Oxalate Level)</td>
              <td className="p-3.5 capitalize">{foodA.oxalate_level}</td>
              <td className="p-3.5 capitalize">{foodB.oxalate_level}</td>
            </tr>

            {/* Recommended Gastronomy Method */}
            <tr className="bg-white">
              <td className="p-3.5 font-bold text-slate-800">
                <div className="flex items-center gap-1.5">
                  <ChefHat className="w-4 h-4 text-emerald-600" />
                  <span>Optimal Cooking Method</span>
                </div>
              </td>
              <td className="p-3.5 font-bold text-emerald-800 capitalize">
                {foodA.recommended_cooking_method.replace('_', ' ')}
              </td>
              <td className="p-3.5 font-bold text-teal-800 capitalize">
                {foodB.recommended_cooking_method.replace('_', ' ')}
              </td>
            </tr>

            {/* Bioavailability Commentary */}
            <tr className="bg-slate-50">
              <td className="p-3.5 font-bold text-slate-800">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Bioavailability Verdict</span>
                </div>
              </td>
              <td className="p-3.5 text-slate-700 text-[11px] leading-relaxed">
                {foodA.bioavailability_tips}
              </td>
              <td className="p-3.5 text-slate-700 text-[11px] leading-relaxed">
                {foodB.bioavailability_tips}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
