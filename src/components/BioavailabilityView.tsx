/**
 * NutriSense - Bioavailability Engine Simulator (Chapter 15)
 * Core Principle: Nutrient Content ≠ Nutrient Absorption
 * Live synchronization with the foods logged in the Log and Track page.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { FoodItem, CookingMethod, MealLogEntry } from '../types/nutrition';
import { FOOD_DATABASE } from '../data/foodDatabase';
import { analyzeMealBioavailability } from '../engines/bioavailabilityEngine';
import { formatDisplayDate, shiftDate, getTodayDateString } from '../utils/dateUtils';
import {
  FlaskConical,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  BookOpen,
  ArrowRight,
  Info,
  Layers,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Utensils,
} from 'lucide-react';

interface SelectedMealItem {
  id: string;
  food: FoodItem;
  quantity: number;
  cooking_method: CookingMethod;
  isLogged: boolean;
  meal_type?: string;
}

interface BioavailabilityViewProps {
  logsForSelectedDay: MealLogEntry[];
  allLogs: MealLogEntry[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const BioavailabilityView: React.FC<BioavailabilityViewProps> = ({
  logsForSelectedDay,
  selectedDate,
  onSelectDate,
  onNavigateToTab,
}) => {
  const [mealFilter, setMealFilter] = useState<'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack'>('all');
  const [foodToAddId, setFoodToAddId] = useState<string>('food_lemon');

  // Build the list of meal items from the logged foods
  const initialItemsFromLogs: SelectedMealItem[] = useMemo(() => {
    const filteredLogs = mealFilter === 'all'
      ? logsForSelectedDay
      : logsForSelectedDay.filter((l) => l.meal_type === mealFilter);

    return filteredLogs.map((log) => {
      const food = FOOD_DATABASE.find((f) => f.id === log.food_id) || FOOD_DATABASE[0];
      return {
        id: `logged_${log.id}`,
        food,
        quantity: log.quantity,
        cooking_method: log.cooking_method,
        isLogged: true,
        meal_type: log.meal_type,
      };
    });
  }, [logsForSelectedDay, mealFilter]);

  // Active items under analysis (starts with logged foods, allows user trial tweaks)
  const [activeItems, setActiveItems] = useState<SelectedMealItem[]>(initialItemsFromLogs);

  // Keep activeItems in sync whenever the logged foods or meal filter changes
  useEffect(() => {
    setActiveItems(initialItemsFromLogs);
  }, [initialItemsFromLogs]);

  // Compute live bioavailability on the active food items
  const analysis = useMemo(() => {
    return analyzeMealBioavailability(
      activeItems.map((item) => ({
        food: item.food,
        quantity: item.quantity,
        cooking_method: item.cooking_method,
      }))
    );
  }, [activeItems]);

  const handleAddItem = (foodId: string) => {
    const food = FOOD_DATABASE.find((f) => f.id === foodId);
    if (!food) return;
    setActiveItems((prev) => [
      ...prev,
      {
        id: `test_${Date.now()}_${Math.random()}`,
        food,
        quantity: 1.0,
        cooking_method: food.recommended_cooking_method,
        isLogged: false,
        meal_type: 'test_addition',
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setActiveItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleResetToLogs = () => {
    setActiveItems(initialItemsFromLogs);
  };

  const handleLoadPresetScenario = (scenario: 'optimal_iron' | 'inhibited_iron' | 'calcium_oxalate_paradox') => {
    if (scenario === 'optimal_iron') {
      setActiveItems([
        {
          id: 'sc1',
          food: FOOD_DATABASE.find((f) => f.id === 'food_sprouted_moong')!,
          quantity: 1.0,
          cooking_method: 'steaming',
          isLogged: false,
          meal_type: 'demonstration',
        },
        {
          id: 'sc2',
          food: FOOD_DATABASE.find((f) => f.id === 'food_lemon')!,
          quantity: 1.0,
          cooking_method: 'raw',
          isLogged: false,
          meal_type: 'demonstration',
        },
      ]);
    } else if (scenario === 'inhibited_iron') {
      setActiveItems([
        {
          id: 'sc1',
          food: FOOD_DATABASE.find((f) => f.id === 'food_lentils_yellow')!,
          quantity: 1.0,
          cooking_method: 'boiling',
          isLogged: false,
          meal_type: 'demonstration',
        },
        {
          id: 'sc2',
          food: FOOD_DATABASE.find((f) => f.id === 'food_black_tea')!,
          quantity: 1.0,
          cooking_method: 'boiling',
          isLogged: false,
          meal_type: 'demonstration',
        },
      ]);
    } else if (scenario === 'calcium_oxalate_paradox') {
      setActiveItems([
        {
          id: 'sc1',
          food: FOOD_DATABASE.find((f) => f.id === 'food_spinach')!,
          quantity: 2.0,
          cooking_method: 'raw',
          isLogged: false,
          meal_type: 'demonstration',
        },
        {
          id: 'sc2',
          food: FOOD_DATABASE.find((f) => f.id === 'food_yogurt')!,
          quantity: 1.0,
          cooking_method: 'fermentation',
          isLogged: false,
          meal_type: 'demonstration',
        },
      ]);
    }
  };

  const isToday = selectedDate === getTodayDateString();
  const mealCounts = {
    all: logsForSelectedDay.length,
    breakfast: logsForSelectedDay.filter((l) => l.meal_type === 'breakfast').length,
    lunch: logsForSelectedDay.filter((l) => l.meal_type === 'lunch').length,
    dinner: logsForSelectedDay.filter((l) => l.meal_type === 'dinner').length,
    snack: logsForSelectedDay.filter((l) => l.meal_type === 'snack').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Date & Live Diary Sync Indicator */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-1.5">
            <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
            <span>Bioavailability Engine (Chapter 15)</span>
            <span className="text-teal-600 ml-1">· Live Diary Synced</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Bioavailability & Food Pairing Analysis for Logged Foods
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Nutrient Content ≠ Nutrient Absorption. See how foods logged in your diary synergize or inhibit cellular uptake at the intestinal brush border.
          </p>
        </div>

        {/* Date Selector Navigation */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 self-start lg:self-auto">
          <button
            onClick={() => onSelectDate(shiftDate(selectedDate, -1))}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900">
              {formatDisplayDate(selectedDate)}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">({selectedDate})</span>
          </div>

          <button
            onClick={() => onSelectDate(shiftDate(selectedDate, 1))}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isToday && (
            <button
              onClick={() => onSelectDate(getTodayDateString())}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 ml-1"
            >
              Today
            </button>
          )}
        </div>
      </div>

      {/* Meal Filter Tabs Bar & Sync Button */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-semibold text-slate-700 mr-1 flex items-center gap-1">
            <Utensils className="w-3.5 h-3.5 text-slate-500" />
            <span>Analyze Logged Meal:</span>
          </span>

          {(['all', 'breakfast', 'lunch', 'dinner', 'snack'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMealFilter(m)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors text-xs flex items-center gap-1.5 ${
                mealFilter === m
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span className="capitalize">{m === 'all' ? "All Today's Foods" : m}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  mealFilter === m ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {mealCounts[m]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToLogs}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
            title="Reload exact foods from Log & Track Diary"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Re-sync Diary</span>
          </button>

          <button
            onClick={() => onNavigateToTab('logger')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
          >
            <span>+ Log More Foods</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Meal Assembly from Diary */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>
                  Active Foods Under Absorption Analysis ({activeItems.length} items)
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">
                {mealFilter === 'all' ? 'All logged meals' : `${mealFilter} meal`} on {formatDisplayDate(selectedDate)}
              </p>
            </div>

            {/* Add Test Food Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={foodToAddId}
                onChange={(e) => setFoodToAddId(e.target.value)}
                className="py-1 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
              >
                {FOOD_DATABASE.map((f) => (
                  <option key={f.id} value={f.id}>
                    + Test adding: {f.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleAddItem(foodToAddId)}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Test Food</span>
              </button>
            </div>
          </div>

          {activeItems.length === 0 ? (
            <div className="text-center py-10 text-slate-700 text-xs space-y-3">
              <FlaskConical className="w-9 h-9 mx-auto text-slate-400" />
              <div>
                <p className="font-semibold text-slate-900 text-sm">
                  No foods logged for {mealFilter === 'all' ? formatDisplayDate(selectedDate) : `${mealFilter} on ${formatDisplayDate(selectedDate)}`}.
                </p>
                <p className="text-slate-500 mt-1 max-w-md mx-auto">
                  Go to the Log & Track page to record what you ate, or test a scientific benchmark preset below to explore bioavailable synergy.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => onNavigateToTab('logger')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Meals in Diary</span>
                </button>

                <button
                  onClick={() => handleLoadPresetScenario('optimal_iron')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-medium text-xs transition-colors"
                >
                  ✓ Test 300% Iron Synergy Preset
                </button>
                <button
                  onClick={() => handleLoadPresetScenario('inhibited_iron')}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-medium text-xs transition-colors"
                >
                  ⚠ Test Tea Tannin Inhibition Preset
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activeItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{item.food.name}</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        ({item.food.category})
                      </span>
                      {item.isLogged ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded uppercase">
                          {item.meal_type || 'Logged Food'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded uppercase">
                          Trial Addition
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Prep: <span className="font-semibold text-slate-800 capitalize">{item.cooking_method.replace('_', ' ')}</span> ·{' '}
                      Phytates: <span className="capitalize font-medium">{item.food.phytate_level}</span> ·{' '}
                      Oxalates: <span className="capitalize font-medium">{item.food.oxalate_level}</span> ·{' '}
                      Tannins: <span className="capitalize font-medium">{item.food.tannin_level}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={item.cooking_method}
                      onChange={(e) => {
                        const newMethod = e.target.value as CookingMethod;
                        setActiveItems((prev) =>
                          prev.map((i) => (i.id === item.id ? { ...i, cooking_method: newMethod } : i))
                        );
                      }}
                      className="py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] capitalize text-slate-900"
                      title="Simulate different preparation method"
                    >
                      {item.food.supported_cooking_methods.map((m) => (
                        <option key={m} value={m}>
                          {m.replace('_', ' ')}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove food from analysis"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Benchmark Presets Bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-700">Scientific Benchmark Scenarios:</span>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => handleLoadPresetScenario('optimal_iron')}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-medium transition-colors"
              >
                ✓ 300% Iron Synergy
              </button>
              <button
                onClick={() => handleLoadPresetScenario('inhibited_iron')}
                className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-medium transition-colors"
              >
                ⚠ Tea Tannin Inhibition
              </button>
              <button
                onClick={() => handleLoadPresetScenario('calcium_oxalate_paradox')}
                className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-medium transition-colors"
              >
                ⚠ Oxalate Paradox
              </button>
            </div>
          </div>

          {/* Biological Mechanics Guide */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 space-y-1">
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-teal-600" />
              <span>Bioavailability Mechanism Overview:</span>
            </span>
            <p>
              In plant foods, iron exists as non-heme Fe³⁺ (ferric). In the presence of Vitamin C (ascorbic acid) and
              low duodenal pH, it reduces to Fe²⁺ (ferrous) which easily crosses enterocytes via DMT1. Conversely,
              polyphenols in tea and phytic acid in un-soaked grains chelate Fe³⁺ into unabsorbable precipitate.
            </p>
          </div>
        </div>

        {/* Right: Real-Time Bioavailability Scorecard for Logged Meal */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Absorption Intelligence</span>
            </h3>
            <p className="text-xs text-slate-700">Dynamic physiological uptake for your logged foods</p>
          </div>

          {/* Meter Display */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center space-y-2">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Meal Absorption Score
            </div>
            <div className="text-4xl font-extrabold text-emerald-600 font-display">
              {analysis.overall_score}
              <span className="text-sm text-slate-700 font-normal"> / 100</span>
            </div>
            <p className="text-[11px] text-slate-700">
              {analysis.overall_score >= 85
                ? 'High Synergy Meal: Maximum enterocyte nutrient transfer'
                : analysis.overall_score >= 65
                ? 'Moderate Absorption: Slight inhibition or un-soaked anti-nutrients'
                : 'Inhibited Meal: Potent chelators (tannins/phytates) blocking uptake'}
            </p>
          </div>

          {/* Estimated Uptake Pct Gauges */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center">
              <div className="text-[11px] text-emerald-900 font-medium">Estimated Iron Uptake</div>
              <div className="text-xl font-bold text-emerald-800 mt-1">
                {analysis.iron_absorption_pct}%
              </div>
              <span className="text-[10px] text-emerald-700">(Baseline is ~3-5%)</span>
            </div>

            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-center">
              <div className="text-[11px] text-teal-900 font-medium">Estimated Calcium Uptake</div>
              <div className="text-xl font-bold text-teal-800 mt-1">
                {analysis.calcium_absorption_pct}%
              </div>
              <span className="text-[10px] text-teal-700">(Spinach: ~5%, Dairy: ~35%)</span>
            </div>
          </div>

          {/* Detected Enhancers / Inhibitors */}
          <div className="space-y-2 text-xs">
            {analysis.enhancers_detected.length === 0 && analysis.inhibitors_detected.length === 0 && (
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-center text-[11px]">
                Log meal items on this day to detect active synergy pairings or antinutrient chelators.
              </div>
            )}

            {analysis.enhancers_detected.map((enh, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-tight">{enh}</span>
              </div>
            ))}

            {analysis.inhibitors_detected.map((inh, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-tight">{inh}</span>
              </div>
            ))}
          </div>

          {/* Actionable Pairing Advice */}
          {analysis.actionable_pairings.length > 0 && (
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Gastronomy Food Pairing Rule:</span>
              </span>
              <p className="text-[11px] leading-relaxed text-amber-900">
                {analysis.actionable_pairings[0]}
              </p>
            </div>
          )}

          {/* References */}
          {analysis.references.length > 0 && (
            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-700 space-y-0.5">
              <div className="font-semibold text-slate-700 flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>Validated Literature:</span>
              </div>
              {analysis.references.map((r, i) => (
                <div key={i} className="truncate italic">
                  {r}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
