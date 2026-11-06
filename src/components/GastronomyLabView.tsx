/**
 * NutriSense - Gastronomy Intelligence Lab (Chapter 14)
 * Interactive Food Science Simulator for Cooking Methods & Nutrient Retention
 */

import React, { useState } from 'react';
import { FoodItem, CookingMethod } from '../types/nutrition';
import { FOOD_DATABASE } from '../data/foodDatabase';
import { evaluateGastronomy } from '../engines/gastronomyEngine';
import {
  ChefHat,
  Flame,
  Droplets,
  Timer,
  Sparkles,
  AlertCircle,
  BookOpen,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export const GastronomyLabView: React.FC = () => {
  const [selectedFoodId, setSelectedFoodId] = useState<string>('food_spinach');
  const [activeMethod, setActiveMethod] = useState<CookingMethod>('steaming');

  const food = FOOD_DATABASE.find((f) => f.id === selectedFoodId) || FOOD_DATABASE[0];
  const analysis = evaluateGastronomy(food, activeMethod);

  return (
    <div className="space-y-6">
      {/* Title & Concept Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-1">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Chapter 14: Gastronomy Intelligence Engine (GIE)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Culinary Food Science & Nutrient Retention Lab
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Answering <em>"How should I prepare this food?"</em> — Modeled using the USDA Table of Nutrient Retention Factors (Release 6).
          </p>
        </div>

        {/* Food Quick Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">Select Food Item:</label>
          <select
            value={selectedFoodId}
            onChange={(e) => {
              const newFood = FOOD_DATABASE.find((f) => f.id === e.target.value);
              setSelectedFoodId(e.target.value);
              if (newFood) setActiveMethod(newFood.recommended_cooking_method);
            }}
            className="py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
          >
            {FOOD_DATABASE.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Analysis Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Method Deep Dive */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Selected Cooking Method
              </div>
              <h2 className="text-2xl font-bold text-slate-900 capitalize mt-0.5">
                {activeMethod.replace('_', ' ')} on {food.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {activeMethod === food.recommended_cooking_method && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>★ Optimal Retention Method</span>
                </span>
              )}
            </div>
          </div>

          {/* Retention Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-xs text-slate-700 font-medium">Vitamin C</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {analysis.vitC_retained_pct}%
              </div>
              <span className="text-[10px] text-slate-700">Heat/Leaching Sensitive</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-xs text-slate-700 font-medium">B-Vitamins & Folate</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {analysis.b_vitamins_retained_pct}%
              </div>
              <span className="text-[10px] text-slate-700">Water-Soluble</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-xs text-slate-700 font-medium">Minerals (Fe, Ca, Zn)</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {analysis.minerals_retained_pct}%
              </div>
              <span className="text-[10px] text-slate-700">Thermal Stable</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-xs text-slate-700 font-medium">Fat-Soluble / Carotenoids</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {analysis.fat_soluble_retained_pct}%
              </div>
              <span className="text-[10px] text-slate-700">Micellar Soluble</span>
            </div>
          </div>

          {/* Gastronomy Insight Callout */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Scientific Culinary Mechanism (USDA Release 6 Evidence)</span>
            </div>
            <p className="text-emerald-900 leading-relaxed text-xs">
              {analysis.culinary_notes}
            </p>
            {food.bioavailability_tips && (
              <div className="pt-2 border-t border-emerald-200 text-emerald-800 text-[11px]">
                <strong>Bioavailability Synergy:</strong> {food.bioavailability_tips}
              </div>
            )}
          </div>

          {/* Cooking Method Switcher Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
              Compare Other Preparation Techniques for this Food:
            </label>
            <div className="flex flex-wrap gap-2">
              {food.supported_cooking_methods.map((method) => {
                const isCurrent = method === activeMethod;
                const isRec = method === food.recommended_cooking_method;
                return (
                  <button
                    key={method}
                    onClick={() => setActiveMethod(method)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all flex items-center gap-1.5 ${
                      isCurrent
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{method.replace('_', ' ')}</span>
                    {isRec && <span className="text-amber-300">★</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Comparative Scoreboard across Methods */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Timer className="w-4 h-4 text-emerald-600" />
              <span>Method Comparison Matrix</span>
            </h3>
            <p className="text-xs text-slate-700">Ranked by overall micronutrient preservation</p>
          </div>

          <div className="space-y-3">
            {analysis.method_comparison.map((item) => (
              <div
                key={item.method}
                onClick={() => setActiveMethod(item.method)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  item.method === activeMethod
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-slate-900 capitalize flex items-center gap-1">
                    <span>{item.method.replace('_', ' ')}</span>
                    {item.recommended && (
                      <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded">
                        TOP
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-slate-800">{item.retention_score}% Score</span>
                </div>

                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${
                      item.retention_score >= 80
                        ? 'bg-emerald-500'
                        : item.retention_score >= 60
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${item.retention_score}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-700">
                  <span>Vit C: {item.vitC_retention}%</span>
                  <span>Minerals: {item.minerals_retention}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Reference Citation */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700 space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Scientific Reference Source:</span>
            </div>
            <p className="italic">{food.evidence_source}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
