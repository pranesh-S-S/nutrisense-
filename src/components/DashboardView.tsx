/**
 * NutriSense - Dashboard & Personalized RDA Overview Component
 */

import React from 'react';
import {
  UserProfile,
  NutrientRequirements,
  CalculatedNutrients,
  BioavailabilityAnalysis,
  NutrientGapItem,
  RecommendationPlan,
  MealLogEntry,
} from '../types/nutrition';
import { FOOD_DATABASE } from '../data/foodDatabase';
import { calculateRetainedNutrients } from '../engines/gastronomyEngine';
import { formatDisplayDate, shiftDate, getTodayDateString } from '../utils/dateUtils';
import {
  HeartPulse,
  Flame,
  ShieldCheck,
  ShieldAlert,
  ChefHat,
  Sparkles,
  ArrowRight,
  BookOpen,
  Info,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  Stethoscope,
  Coins,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';

interface DashboardViewProps {
  profile: UserProfile;
  requirements: NutrientRequirements;
  dailyIntake: CalculatedNutrients;
  bioavailability: BioavailabilityAnalysis;
  gaps: NutrientGapItem[];
  recommendations: RecommendationPlan[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  loggedFoodsForDay: MealLogEntry[];
  onNavigateToTab: (tab: string) => void;
  onOpenProfile: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  requirements,
  dailyIntake,
  bioavailability,
  gaps,
  recommendations,
  selectedDate,
  onSelectDate,
  loggedFoodsForDay,
  onNavigateToTab,
  onOpenProfile,
}) => {
  const calPct = Math.min(150, Math.round((dailyIntake.calories / requirements.calories) * 100));
  const proteinPct = Math.min(150, Math.round((dailyIntake.protein_g / requirements.protein_g) * 100));
  const carbsPct = Math.min(150, Math.round((dailyIntake.carbs_g / requirements.carbs_g) * 100));
  const fatPct = Math.min(150, Math.round((dailyIntake.fat_g / requirements.fat_g) * 100));

  const significantGaps = gaps.filter(
    (g) => g.severity === 'significant_gap' || g.severity === 'persistent_gap'
  );
  const moderateGaps = gaps.filter((g) => g.severity === 'moderate_gap');

  return (
    <div className="space-y-6">
      {/* Platform Core Principle Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/15 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <Zap className="w-3 h-3" />
            <span>The NutriSense Axiom</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display mb-2">
            Nutrient Content ≠ Nutrient Absorption
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Conventional apps assume 100% absorption from raw ingredient tables. NutriSense models
            how <strong className="text-emerald-300">cooking methods dictate nutrient retention</strong> (USDA
            Release 6) and how <strong className="text-emerald-300">food combinations enhance or inhibit</strong> real
            cellular bioavailability.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-slate-400">Target Calories (TDEE):</span>
              <span className="font-bold text-white">{requirements.calories} kcal</span>
              {profile.is_manual_target && (
                <span className="text-[10px] bg-emerald-400 text-emerald-950 font-bold px-1.5 py-0.5 rounded ml-1">
                  Manual Target
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-slate-400">Bioavailability Index:</span>
              <span className="font-bold text-emerald-300">{bioavailability.overall_score} / 100</span>
            </div>
            <button
              onClick={onOpenProfile}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors ml-auto"
            >
              Adjust Profile & Region
            </button>
          </div>
        </div>
      </div>

      {/* Active Clinical & Regional Intelligence Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-medium">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Region: <strong>{profile.region || 'South Asia / India'}</strong></span>
            <span className="text-[10px] bg-blue-200/70 text-blue-800 px-1.5 py-0.5 rounded-md font-semibold">
              Native Pantry Priority
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-medium">
            <Stethoscope className="w-4 h-4 text-amber-600" />
            <span>Medical Considerations:</span>
            {profile.medical_conditions && profile.medical_conditions.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {profile.medical_conditions.map((c, i) => (
                  <span key={i} className="bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px]">
                    {c}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-slate-500 italic">None logged (Tap to add)</span>
            )}
          </div>
        </div>

        <button
          onClick={onOpenProfile}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline ml-auto"
        >
          <span>Modify Region & Safeguards</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Regional Superfood & Antioxidant Intelligence Showcase */}
      <div className="bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-emerald-50/60 rounded-2xl p-5 border border-amber-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>Regional Superfood Intelligence: Antioxidant & Cost Optimization</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  {profile.region || 'South Asia / India'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-600">
                NutriSense prioritizes high-availability native foods over expensive imported items with lower antioxidant density.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          {/* Item 1: Cinnamon */}
          <div className="bg-white rounded-xl p-3.5 border border-amber-300/80 shadow-xs space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Recommended Regional Choice
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">Ceylon / Cassia Cinnamon</h4>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Budget Pantry Staple
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Antioxidant ORAC:</span>
                <strong className="text-emerald-700 font-bold">131,420 µmol TE/100g</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Antioxidant Density:</span>
                <span className="font-bold text-slate-900">28x Higher than Blueberries</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Clinical Bioactive:</span>
                <span className="text-slate-800">MHCP (Insulin Sensitizer)</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-600 pt-1 border-t border-slate-100 leading-tight">
              Hot water decoction extracts polyphenols that blunt glucose spikes and protect cells against lipid peroxidation at minimal cost.
            </p>
          </div>

          {/* Item 2: Fresh Amla */}
          <div className="bg-white rounded-xl p-3.5 border border-emerald-300/80 shadow-xs space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Regional Native Citrus
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">Fresh Amla (Gooseberry)</h4>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Ultra High Availability
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Vitamin C per 100g:</span>
                <strong className="text-emerald-700 font-bold">600 mg (60x Blueberry)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Antioxidant ORAC:</span>
                <span className="font-bold text-slate-900">26,150 µmol TE/100g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Iron Enhancement:</span>
                <span className="text-emerald-700 font-bold">+400-600% plant iron</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-600 pt-1 border-t border-slate-100 leading-tight">
              Emblicanin tannins stabilize ascorbic acid against heat breakdown, overcoming phytate inhibition when paired with lentils.
            </p>
          </div>

          {/* Item 3: Imported Blueberries (Comparison) */}
          <div className="bg-white/70 rounded-xl p-3.5 border border-slate-200 shadow-xs space-y-2 opacity-85">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  Western Imported Reference
                </span>
                <h4 className="font-bold text-slate-800 text-sm mt-1">Cultivated Blueberries</h4>
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Premium Cost ($6-8/box)
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Antioxidant ORAC:</span>
                <span className="font-medium text-slate-700">4,669 µmol TE/100g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vitamin C per 100g:</span>
                <span className="font-medium text-slate-700">9.7 mg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Regional Status:</span>
                <span className="text-rose-600 font-medium">Expensive import in Asia</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 leading-tight">
              While healthy, blueberries contain 28x lower antioxidant concentration than cinnamon and 60x less Vitamin C than amla per gram.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Row: Energy & Macronutrient Progress + Bioavailability Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1 & 2: Daily Nutrient Progress */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-emerald-600" />
                <span>Daily Intake vs. Personalized RDA</span>
              </h2>
              <p className="text-xs text-slate-700 mt-0.5">
                Calculated strictly from foods logged on <span className="font-semibold text-slate-900">{formatDisplayDate(selectedDate)}</span> ({loggedFoodsForDay.length} items) · {profile.is_manual_target ? 'Manual Targets Active' : `BMR ${requirements.bmr} kcal + PAL (${profile.activity_level.replace('_', ' ')})`}
              </p>
            </div>

            {/* Date Selector Navigation in Dashboard Card */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => onSelectDate(shiftDate(selectedDate, -1))}
                  className="p-1 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Previous Day"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-1 px-1.5 font-bold text-slate-900 text-xs">
                  <Calendar className="w-3 h-3 text-emerald-600" />
                  <span>{formatDisplayDate(selectedDate)}</span>
                </div>
                <button
                  onClick={() => onSelectDate(shiftDate(selectedDate, 1))}
                  className="p-1 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Next Day"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                {selectedDate !== getTodayDateString() && (
                  <button
                    onClick={() => onSelectDate(getTodayDateString())}
                    className="text-[10px] font-semibold text-emerald-700 px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 ml-0.5"
                  >
                    Today
                  </button>
                )}
              </div>

              <button
                onClick={() => onNavigateToTab('logger')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
              >
                <span>+ Log Food</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Calorie Progress */}
          <div>
            <div className="flex justify-between items-baseline mb-1 text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Energy Balance ({formatDisplayDate(selectedDate)})</span>
              </span>
              <span className="font-bold text-slate-900">
                {dailyIntake.calories} / {requirements.calories} kcal ({calPct}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  calPct > 105 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, calPct)}%` }}
              />
            </div>
          </div>

          {/* Macronutrients Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {/* Protein */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-[11px] font-medium text-slate-700 mb-1">Protein</div>
              <div className="text-lg font-bold text-slate-900">
                {dailyIntake.protein_g}g
              </div>
              <div className="text-[11px] text-slate-700">
                Target: {requirements.protein_g}g ({proteinPct}%)
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-700 h-full rounded-full"
                  style={{ width: `${Math.min(100, proteinPct)}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-[11px] font-medium text-slate-700 mb-1">Carbohydrates</div>
              <div className="text-lg font-bold text-slate-900">
                {dailyIntake.carbs_g}g
              </div>
              <div className="text-[11px] text-slate-700">
                Target: {requirements.carbs_g}g ({carbsPct}%)
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-blue-700 h-full rounded-full"
                  style={{ width: `${Math.min(100, carbsPct)}%` }}
                />
              </div>
            </div>

            {/* Fat */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-[11px] font-medium text-slate-700 mb-1">Healthy Fats</div>
              <div className="text-lg font-bold text-slate-900">
                {dailyIntake.fat_g}g
              </div>
              <div className="text-[11px] text-slate-700">
                Target: {requirements.fat_g}g ({fatPct}%)
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-amber-700 h-full rounded-full"
                  style={{ width: `${Math.min(100, fatPct)}%` }}
                />
              </div>
            </div>

            {/* Fiber */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-[11px] font-medium text-slate-700 mb-1">Dietary Fiber</div>
              <div className="text-lg font-bold text-slate-900">
                {dailyIntake.fiber_g}g
              </div>
              <div className="text-[11px] text-slate-700">
                Target: {requirements.fiber_g}g
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-teal-700 h-full rounded-full"
                  style={{ width: `${Math.min(100, Math.round((dailyIntake.fiber_g / requirements.fiber_g) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Key Micronutrients Progress Bar */}
          <div className="pt-2">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
              Essential Micronutrients Retained (Post-Cooking Adjustment for {formatDisplayDate(selectedDate)})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {gaps.slice(0, 6).map((g) => (
                <div key={g.nutrient_key} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-medium text-slate-900">{g.nutrient_label}</span>
                    <span className="text-[11px] text-slate-700">
                      {g.intake} / {g.target} {g.unit} ({g.intake_pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        g.intake_pct >= 100
                          ? 'bg-emerald-500'
                          : g.intake_pct >= 67
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, g.intake_pct)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Foods Logged on this Day Contributing to RDA */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5 text-emerald-600" />
                <span>Foods Logged on this Day ({loggedFoodsForDay.length} items)</span>
              </h3>
              <button
                onClick={() => onNavigateToTab('logger')}
                className="text-[11px] font-semibold text-emerald-600 hover:underline"
              >
                Manage in Log & Track &rarr;
              </button>
            </div>

            {loggedFoodsForDay.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <p className="text-xs font-semibold text-slate-800">
                  No foods logged for {formatDisplayDate(selectedDate)} yet.
                </p>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Your daily intake is currently 0 kcal. Record what you ate in the Log & Track page to measure your retained RDA nutrients!
                </p>
                <button
                  onClick={() => onNavigateToTab('logger')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Meals for this Day</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {loggedFoodsForDay.map((log) => {
                  const food = FOOD_DATABASE.find((f) => f.id === log.food_id) || FOOD_DATABASE[0];
                  const nutrients = calculateRetainedNutrients(food, log.quantity, log.cooking_method);

                  return (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex flex-col justify-between space-y-1 hover:bg-slate-100/70 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="font-bold text-slate-900 truncate">{food.name}</div>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded uppercase shrink-0">
                          {log.meal_type}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        {log.quantity}x · <span className="capitalize">{log.cooking_method.replace('_', ' ')}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium pt-1 border-t border-slate-200/60 flex justify-between">
                        <span>{nutrients.calories} kcal</span>
                        <span>{nutrients.protein_g}g P</span>
                        <span>{nutrients.iron_mg}mg Fe</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Live Bioavailability Engine Analysis */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Bioavailability Index</span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  {formatDisplayDate(selectedDate)} ({loggedFoodsForDay.length} foods)
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab('bioavailability')}
                className="text-xs text-teal-600 font-semibold hover:underline"
              >
                Lab &rarr;
              </button>
            </div>

            {/* Score Ring Gauge */}
            <div className="my-4 flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-emerald-500 border-r-emerald-500 transform -rotate-45" />
                <span className="absolute text-lg font-bold text-slate-900">
                  {bioavailability.overall_score}
                </span>
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-900">Absorption Efficiency</div>
                <p className="text-slate-700 text-[11px] leading-snug mt-0.5">
                  Estimated cellular uptake considering active enhancers (Vitamin C, fat) and inhibitors (tannins, phytates).
                </p>
              </div>
            </div>

            {/* Synergies & Inhibitors */}
            <div className="space-y-2.5 text-xs">
              {bioavailability.enhancers_detected.length > 0 && (
                <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
                  <span className="font-semibold text-emerald-900 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Active Absorption Synergies</span>
                  </span>
                  <p className="text-emerald-800 text-[11px]">{bioavailability.enhancers_detected[0]}</p>
                </div>
              )}

              {bioavailability.inhibitors_detected.length > 0 && (
                <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-100">
                  <span className="font-semibold text-rose-900 flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Active Absorption Inhibitor</span>
                  </span>
                  <p className="text-rose-800 text-[11px]">{bioavailability.inhibitors_detected[0]}</p>
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-800 block mb-1">Pairing Optimization Tip</span>
                <p className="text-slate-700 text-[11px]">{bioavailability.actionable_pairings[0]}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('bioavailability')}
            className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Explore Bioavailability Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Nutrient Gap Alerts Section */}
      {(significantGaps.length > 0 || moderateGaps.length > 0) && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Nutrient Gap & Deficiency Engine Alerts (Chapter 16)</span>
            </h2>
            <span className="text-xs text-slate-700">
              Assessed against {profile.sex === 'female' ? 'Adult Female' : 'Adult Male'} ICMR-NIN & DRI Standards
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {significantGaps.map((gap) => (
              <div
                key={gap.nutrient_key}
                className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs space-y-2"
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-rose-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>{gap.nutrient_label}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 text-[10px] font-bold uppercase">
                    {gap.severity.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-rose-700 text-[11px] leading-tight">
                  Intake is at <strong>{gap.intake_pct}%</strong> of target ({gap.intake}/{gap.target} {gap.unit})
                  over consecutive logging days.
                </p>
                <div className="text-[11px] text-slate-700 pt-1 border-t border-rose-100">
                  <span className="font-semibold text-rose-950">Recommended Food Fixes:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {gap.suggested_foods.slice(0, 3).map((f, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-white text-slate-700 border border-rose-100">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {moderateGaps.map((gap) => (
              <div
                key={gap.nutrient_key}
                className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-2"
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-amber-900">{gap.nutrient_label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 text-[10px] font-bold uppercase">
                    Moderate Gap
                  </span>
                </div>
                <p className="text-amber-800 text-[11px] leading-tight">
                  Intake at <strong>{gap.intake_pct}%</strong> ({gap.intake}/{gap.target} {gap.unit}).
                </p>
                <div className="text-[11px] text-slate-700">
                  <span className="font-semibold text-amber-950">Sources: </span>
                  {gap.suggested_foods.slice(0, 2).join(', ')}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 text-[11px] text-slate-700">
            <Info className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
            <p>
              <strong>Medical Safety Safeguard:</strong> NutriSense identifies dietary insufficiencies for decision
              support. It does not replace laboratory serum panels (e.g., Ferritin, 25-OH Vitamin D, or CBC). Consult
              a healthcare physician if a persistent gap alert occurs.
            </p>
          </div>
        </div>
      )}

      {/* AI Gastronomy Meal Plan Overview (Chapter 17) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-emerald-600" />
              <span>Today's Personalized Gastronomy Meal Plan</span>
            </h2>
            <p className="text-xs text-slate-700">
              Engineered for maximum nutrient retention and duodenal absorption synergy
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('gastronomy')}
            className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
          >
            <span>Gastronomy Lab</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.slice(0, 4).map((rec) => (
            <div
              key={rec.id}
              className="rounded-xl border border-slate-200 p-4 hover:border-emerald-300 transition-colors bg-slate-50/50 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {rec.meal_type}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{rec.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600">{rec.bioavailability_score}/100</span>
                  <span className="block text-[10px] text-slate-700">Bioavailability</span>
                </div>
              </div>

              {/* Recommended Items */}
              <div className="space-y-1.5 text-xs">
                {rec.food_recommendations.map((item, idx) => (
                  <div key={idx} className="bg-white p-2 rounded-lg border border-slate-100">
                    <div className="flex justify-between font-medium text-slate-800">
                      <span>{item.portion_text}</span>
                      <span className="text-[11px] font-semibold text-emerald-700 uppercase bg-emerald-50 px-1.5 py-0.2 rounded">
                        {item.cooking_method.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 mt-0.5">{item.retention_highlight}</p>
                  </div>
                ))}
              </div>

              {/* Pairing Tip */}
              <div className="p-2.5 rounded-lg bg-teal-50/60 border border-teal-100 text-xs">
                <span className="font-semibold text-teal-900 block text-[11px] mb-0.5">
                  Gastronomy Pairing Rule:
                </span>
                <p className="text-teal-800 text-[11px] leading-relaxed">{rec.pairing_guidance}</p>
              </div>

              {/* Scientific Citation */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-700 pt-1">
                <BookOpen className="w-3 h-3 text-slate-700 shrink-0" />
                <span className="truncate">{rec.citations[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
