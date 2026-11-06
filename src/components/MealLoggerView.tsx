/**
 * NutriSense - Food Logging & Cooking Method Selector Component
 * Allows user to log foods, specify preparation/cooking method,
 * and witness the direct impact on nutrient retention.
 */

import React, { useState } from 'react';
import { FoodItem, CookingMethod, MealLogEntry } from '../types/nutrition';
import { FOOD_DATABASE } from '../data/foodDatabase';
import { calculateRetainedNutrients } from '../engines/gastronomyEngine';
import { formatDisplayDate, shiftDate, getTodayDateString } from '../utils/dateUtils';
import {
  Plus,
  Trash2,
  ChefHat,
  Flame,
  Search,
  CheckCircle2,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface MealLoggerViewProps {
  logs: MealLogEntry[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onAddLog: (log: Omit<MealLogEntry, 'id' | 'timestamp'>) => void;
  onRemoveLog: (id: string) => void;
  onClearLogs: () => void;
}

export const MealLoggerView: React.FC<MealLoggerViewProps> = ({
  logs,
  selectedDate,
  onSelectDate,
  onAddLog,
  onRemoveLog,
  onClearLogs,
}) => {
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoodId, setSelectedFoodId] = useState<string>(FOOD_DATABASE[0].id);
  const [quantity, setQuantity] = useState<number>(1.0);
  const [cookingMethod, setCookingMethod] = useState<CookingMethod>(FOOD_DATABASE[0].recommended_cooking_method);
  const [viewAllDays, setViewAllDays] = useState<boolean>(false);

  const selectedFood = FOOD_DATABASE.find((f) => f.id === selectedFoodId) || FOOD_DATABASE[0];

  const filteredFoods = FOOD_DATABASE.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFoodId(food.id);
    setCookingMethod(food.recommended_cooking_method);
  };

  const handleAdd = () => {
    onAddLog({
      food_id: selectedFood.id,
      date: selectedDate,
      meal_type: selectedMeal,
      quantity,
      cooking_method: cookingMethod,
    });
  };

  // Preview retained nutrients for current selection
  const retainedPreview = calculateRetainedNutrients(selectedFood, quantity, cookingMethod);
  const retentionFactors = selectedFood.retention_by_method[cookingMethod] || {
    vitC_retention: 0.75,
    b_vitamins_retention: 0.75,
    minerals_retention: 0.9,
    fat_soluble_retention: 0.9,
    leaching_index: 'low',
    notes: '',
  };

  // Filter logs for the active selected day
  const displayedLogs = viewAllDays
    ? logs
    : logs.filter((l) => (l.date || getTodayDateString()) === selectedDate);

  const isToday = selectedDate === getTodayDateString();

  return (
    <div className="space-y-6">
      {/* Page Header with Date Navigator */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-emerald-600" />
            <span>Food Intake & Cooking Method Logger</span>
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Specify foods and preparation methods for each day. NutriSense calculates true consumed nutrients using USDA Retention Factors.
          </p>
        </div>

        {/* Date Selector Navigation & Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
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

          {displayedLogs.length > 0 && (
            <button
              onClick={onClearLogs}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
            >
              Clear Day's Logs
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Food Selector & Gastronomy Method Form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            {/* Meal Type Switcher */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                1. Select Meal Slot
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((meal) => (
                  <button
                    key={meal}
                    id={`btn-meal-${meal}`}
                    onClick={() => setSelectedMeal(meal)}
                    className={`py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                      selectedMeal === meal
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {meal}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Search & Picker */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                2. Choose Food Item
              </label>
              <div className="relative mb-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search spinach, lentils, broccoli, salmon, curd, etc..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
                {filteredFoods.map((food) => (
                  <div
                    key={food.id}
                    onClick={() => handleSelectFood(food)}
                    className={`p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${
                      selectedFood.id === food.id ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : ''
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{food.name}</div>
                      <div className="text-[11px] text-slate-700">
                        {food.category} · {food.serving_size}{food.serving_unit} ({food.calories} kcal)
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Rec: {food.recommended_cooking_method.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity & Cooking Method Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Quantity */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  Portion Multiplier
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.25"
                    value={quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <span className="text-xs font-bold text-slate-900 w-12 text-right">
                    {quantity}x ({Math.round(selectedFood.serving_size * quantity)}
                    {selectedFood.serving_unit})
                  </span>
                </div>
              </div>

              {/* Cooking Method Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  Cooking / Preparation Method
                </label>
                <select
                  value={cookingMethod}
                  onChange={(e) => setCookingMethod(e.target.value as CookingMethod)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 capitalize"
                >
                  {selectedFood.supported_cooking_methods.map((m) => (
                    <option key={m} value={m}>
                      {m.replace('_', ' ')} {m === selectedFood.recommended_cooking_method ? '★ (Optimal Retention)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Retention Factor Alert Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>USDA Release 6 Retention Prediction</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-700">
                  Leaching Risk:{' '}
                  <span
                    className={
                      retentionFactors.leaching_index === 'high'
                        ? 'text-rose-600 font-bold'
                        : retentionFactors.leaching_index === 'none'
                        ? 'text-emerald-700 font-bold'
                        : 'text-amber-700 font-bold'
                    }
                  >
                    {retentionFactors.leaching_index.toUpperCase()}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="bg-white p-2 rounded border border-slate-100">
                  <div className="text-slate-700">Vitamin C</div>
                  <div className="font-bold text-slate-900">
                    {Math.round(retentionFactors.vitC_retention * 100)}% Retained
                  </div>
                </div>
                <div className="bg-white p-2 rounded border border-slate-100">
                  <div className="text-slate-700">B-Vitamins</div>
                  <div className="font-bold text-slate-900">
                    {Math.round(retentionFactors.b_vitamins_retention * 100)}% Retained
                  </div>
                </div>
                <div className="bg-white p-2 rounded border border-slate-100">
                  <div className="text-slate-700">Minerals</div>
                  <div className="font-bold text-slate-900">
                    {Math.round(retentionFactors.minerals_retention * 100)}% Retained
                  </div>
                </div>
                <div className="bg-white p-2 rounded border border-slate-100">
                  <div className="text-slate-700">Fat-Soluble</div>
                  <div className="font-bold text-slate-900">
                    {Math.round(retentionFactors.fat_soluble_retention * 100)}% Retained
                  </div>
                </div>
              </div>

              {retentionFactors.notes && (
                <p className="text-[11px] text-slate-700 italic border-t border-slate-200 pt-1.5">
                  {retentionFactors.notes}
                </p>
              )}
            </div>

            {/* Add Button */}
            <button
              id="btn-add-to-meal"
              onClick={handleAdd}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add to {selectedMeal.toUpperCase()} ({retainedPreview.calories} kcal)</span>
            </button>
          </div>
        </div>

        {/* Right Col: Active Food Logs for Selected Date */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Meal Diary</h2>
                <div className="text-[11px] text-slate-500 font-medium">
                  {viewAllDays ? 'All Dates' : formatDisplayDate(selectedDate)} · {displayedLogs.length} logged items
                </div>
              </div>
              <button
                onClick={() => setViewAllDays(!viewAllDays)}
                className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg transition-colors"
              >
                {viewAllDays ? 'Show Day Only' : 'View All Days'}
              </button>
            </div>

            {displayedLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-700 text-xs">
                <ChefHat className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="font-semibold text-slate-700">No foods logged for {formatDisplayDate(selectedDate)} yet.</p>
                <p className="text-slate-500 mt-1">Select an item from the catalog on the left to add a meal for this day.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto space-y-1">
                {displayedLogs.map((log) => {
                  const food = FOOD_DATABASE.find((f) => f.id === log.food_id) || FOOD_DATABASE[0];
                  const nutrients = calculateRetainedNutrients(food, log.quantity, log.cooking_method);

                  return (
                    <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{food.name}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded uppercase">
                            {log.meal_type}
                          </span>
                          {viewAllDays && log.date && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              ({log.date})
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-700 mt-0.5">
                          {log.quantity}x · <span className="capitalize">{log.cooking_method.replace('_', ' ')}</span> ·{' '}
                          {nutrients.calories} kcal · {nutrients.protein_g}g P · {nutrients.iron_mg}mg Fe
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveLog(log.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Remove entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-700">
            <p>
              💡 <strong>NutriSense Live Recalculation:</strong> Every logged food item immediately updates your
              Personalized RDA progress bars, the Bioavailability Absorption Index, and the Nutrient Gap Detection Engine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
