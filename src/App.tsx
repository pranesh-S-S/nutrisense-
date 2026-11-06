/**
 * NutriSense - AI-Powered Personalized Nutrition Intelligence Platform
 * Integrating Knowledge Graphs, Gastronomy Intelligence, and Bioavailability-Based Guidance
 */

import React, { useState, useMemo } from 'react';
import { UserProfile, MealLogEntry, CalculatedNutrients } from './types/nutrition';
import { calculatePersonalizedRDA } from './engines/rdaEngine';
import { calculateRetainedNutrients } from './engines/gastronomyEngine';
import { analyzeMealBioavailability } from './engines/bioavailabilityEngine';
import { detectNutrientGaps } from './engines/deficiencyEngine';
import { generateDailyRecommendations } from './engines/recommendationEngine';
import { FOOD_DATABASE } from './data/foodDatabase';
import { getTodayDateString } from './utils/dateUtils';

import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { MealLoggerView } from './components/MealLoggerView';
import { GastronomyLabView } from './components/GastronomyLabView';
import { BioavailabilityView } from './components/BioavailabilityView';
import { KnowledgeGraphView } from './components/KnowledgeGraphView';
import { FoodComparisonView } from './components/FoodComparisonView';
import { AskNutriSenseView } from './components/AskNutriSenseView';
import { ProfileModal } from './components/ProfileModal';

// Initial default user profile (Demonstrates clinical nutrition scenario)
const INITIAL_PROFILE: UserProfile = {
  id: 'usr_maya_01',
  name: 'Maya Sharma',
  age: 28,
  sex: 'female',
  weight_kg: 58,
  height_cm: 165,
  activity_level: 'moderately_active',
  dietary_preference: 'plant_forward',
  allergies: ['Peanuts'],
  medical_conditions: ['Borderline Iron Deficiency'],
  region: 'South Asia / India',
  is_pregnant: false,
  is_lactating: false,
  goal: 'anemia_recovery',
};

// Initial realistic food logs to give immediate richness for today
const INITIAL_LOGS: MealLogEntry[] = [
  {
    id: 'log_1',
    food_id: 'food_sprouted_moong',
    date: getTodayDateString(),
    meal_type: 'breakfast',
    quantity: 1.0,
    cooking_method: 'steaming',
    timestamp: '08:30 AM',
  },
  {
    id: 'log_2',
    food_id: 'food_lemon',
    date: getTodayDateString(),
    meal_type: 'breakfast',
    quantity: 1.0,
    cooking_method: 'raw',
    timestamp: '08:35 AM',
  },
  {
    id: 'log_3',
    food_id: 'food_lentils_yellow',
    date: getTodayDateString(),
    meal_type: 'lunch',
    quantity: 1.5,
    cooking_method: 'pressure_cooking',
    timestamp: '01:15 PM',
  },
  {
    id: 'log_4',
    food_id: 'food_spinach',
    date: getTodayDateString(),
    meal_type: 'lunch',
    quantity: 1.0,
    cooking_method: 'steaming',
    timestamp: '01:20 PM',
  },
  {
    id: 'log_5',
    food_id: 'food_yogurt',
    date: getTodayDateString(),
    meal_type: 'snack',
    quantity: 1.0,
    cooking_method: 'fermentation',
    timestamp: '04:30 PM',
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [logs, setLogs] = useState<MealLogEntry[]>(INITIAL_LOGS);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Filter logs strictly for the selected day
  const logsForSelectedDay = useMemo(() => {
    return logs.filter((log) => (log.date || getTodayDateString()) === selectedDate);
  }, [logs, selectedDate]);

  // 1. Calculate personalized requirements using Mifflin-St Jeor + PAL + physiological status
  const requirements = useMemo(() => {
    return calculatePersonalizedRDA(profile);
  }, [profile]);

  // 2. Aggregate retained daily intake across foods logged strictly on that selected day
  const dailyIntake: CalculatedNutrients = useMemo(() => {
    const total: CalculatedNutrients = {
      calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
      fiber_g: 0,
      vitA_mcg: 0,
      vitC_mg: 0,
      vitD_iu: 0,
      thiamine_b1_mg: 0,
      riboflavin_b2_mg: 0,
      niacin_b3_mg: 0,
      folate_b9_mcg: 0,
      b12_mcg: 0,
      calcium_mg: 0,
      iron_mg: 0,
      zinc_mg: 0,
      magnesium_mg: 0,
      iodine_mcg: 0,
      potassium_mg: 0,
    };

    logsForSelectedDay.forEach((log) => {
      const food = FOOD_DATABASE.find((f) => f.id === log.food_id);
      if (food) {
        const retained = calculateRetainedNutrients(food, log.quantity, log.cooking_method);
        total.calories += retained.calories;
        total.protein_g += retained.protein_g;
        total.carbs_g += retained.carbs_g;
        total.fat_g += retained.fat_g;
        total.fiber_g += retained.fiber_g;
        total.vitA_mcg += retained.vitA_mcg;
        total.vitC_mg += retained.vitC_mg;
        total.vitD_iu += retained.vitD_iu;
        total.thiamine_b1_mg += retained.thiamine_b1_mg;
        total.riboflavin_b2_mg += retained.riboflavin_b2_mg;
        total.niacin_b3_mg += retained.niacin_b3_mg;
        total.folate_b9_mcg += retained.folate_b9_mcg;
        total.b12_mcg += retained.b12_mcg;
        total.calcium_mg += retained.calcium_mg;
        total.iron_mg += retained.iron_mg;
        total.zinc_mg += retained.zinc_mg;
        total.magnesium_mg += retained.magnesium_mg;
        total.iodine_mcg += retained.iodine_mcg;
        total.potassium_mg += retained.potassium_mg;
      }
    });

    // Round for display
    return {
      calories: Math.round(total.calories),
      protein_g: Number(total.protein_g.toFixed(1)),
      carbs_g: Number(total.carbs_g.toFixed(1)),
      fat_g: Number(total.fat_g.toFixed(1)),
      fiber_g: Number(total.fiber_g.toFixed(1)),
      vitA_mcg: Math.round(total.vitA_mcg),
      vitC_mg: Number(total.vitC_mg.toFixed(1)),
      vitD_iu: Math.round(total.vitD_iu),
      thiamine_b1_mg: Number(total.thiamine_b1_mg.toFixed(2)),
      riboflavin_b2_mg: Number(total.riboflavin_b2_mg.toFixed(2)),
      niacin_b3_mg: Number(total.niacin_b3_mg.toFixed(2)),
      folate_b9_mcg: Math.round(total.folate_b9_mcg),
      b12_mcg: Number(total.b12_mcg.toFixed(2)),
      calcium_mg: Math.round(total.calcium_mg),
      iron_mg: Number(total.iron_mg.toFixed(1)),
      zinc_mg: Number(total.zinc_mg.toFixed(1)),
      magnesium_mg: Math.round(total.magnesium_mg),
      iodine_mcg: Math.round(total.iodine_mcg),
      potassium_mg: Math.round(total.potassium_mg),
    };
  }, [logsForSelectedDay]);

  // 3. Evaluate live Bioavailability on the selected day's logged meal combinations
  const bioavailability = useMemo(() => {
    const mealItems = logsForSelectedDay.map((log) => {
      const food = FOOD_DATABASE.find((f) => f.id === log.food_id) || FOOD_DATABASE[0];
      return {
        food,
        quantity: log.quantity,
        cooking_method: log.cooking_method,
      };
    });
    return analyzeMealBioavailability(mealItems);
  }, [logsForSelectedDay]);

  // 4. Run Deficiency Engine (Chapter 16) based on intake vs requirement
  const gapAnalysis = useMemo(() => {
    const daysLow = {
      iron_mg: profile.medical_conditions.some((c) => c.toLowerCase().includes('anemia')) ? 8 : 1,
      folate_b9_mcg: 3,
    };
    return detectNutrientGaps(dailyIntake, requirements, daysLow);
  }, [dailyIntake, requirements, profile]);

  // 5. Generate AI Personalized Recommendations (Chapter 17)
  const recommendations = useMemo(() => {
    const activeGaps = gapAnalysis.gaps
      .filter((g) => g.severity !== 'adequate')
      .map((g) => g.nutrient_key);
    return generateDailyRecommendations(profile, requirements, activeGaps);
  }, [profile, requirements, gapAnalysis]);

  // Handlers for logging
  const handleAddLog = (entry: Omit<MealLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: MealLogEntry = {
      ...entry,
      id: `log_${Date.now()}_${Math.random()}`,
      date: entry.date || selectedDate,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setLogs((prev) => [newEntry, ...prev]);
  };

  const handleRemoveLog = (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const handleClearLogs = () => {
    setLogs((prev) => prev.filter((l) => (l.date || getTodayDateString()) !== selectedDate));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation & Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        profile={profile}
        hasSignificantGaps={gapAnalysis.hasSignificantGaps}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            requirements={requirements}
            dailyIntake={dailyIntake}
            bioavailability={bioavailability}
            gaps={gapAnalysis.gaps}
            recommendations={recommendations}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            loggedFoodsForDay={logsForSelectedDay}
            onNavigateToTab={setCurrentTab}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}

        {currentTab === 'logger' && (
          <MealLoggerView
            logs={logs}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onAddLog={handleAddLog}
            onRemoveLog={handleRemoveLog}
            onClearLogs={handleClearLogs}
          />
        )}

        {currentTab === 'gastronomy' && <GastronomyLabView />}

        {currentTab === 'bioavailability' && (
          <BioavailabilityView
            logsForSelectedDay={logsForSelectedDay}
            allLogs={logs}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onNavigateToTab={setCurrentTab}
          />
        )}

        {currentTab === 'graph' && <KnowledgeGraphView />}

        {currentTab === 'compare' && <FoodComparisonView />}

        {currentTab === 'assistant' && <AskNutriSenseView profile={profile} />}
      </main>

      {/* Profile Modification Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={(updated) => {
          const sanitized: UserProfile = {
            ...updated,
            age: updated.age > 0 ? updated.age : 28,
            height_cm: updated.height_cm > 0 ? updated.height_cm : 165,
            weight_kg: updated.weight_kg > 0 ? updated.weight_kg : 58,
          };
          setProfile(sanitized);
        }}
      />

      {/* Bottom Safety & Scientific Citations Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="font-bold text-slate-900 text-sm font-display">NutriSense</span>
              <p className="text-slate-700 text-xs mt-0.5">
                Scientific Nutrition Decision-Support Platform · Grounded in USDA Release 6 & ICMR-NIN Data
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs">
              <span className="hover:text-slate-900 cursor-pointer" onClick={() => setCurrentTab('gastronomy')}>
                Gastronomy Engine
              </span>
              <span className="hover:text-slate-900 cursor-pointer" onClick={() => setCurrentTab('bioavailability')}>
                Bioavailability Modeling
              </span>
              <span className="hover:text-slate-900 cursor-pointer" onClick={() => setCurrentTab('graph')}>
                Neo4j Knowledge Graph
              </span>
              <span className="hover:text-slate-900 cursor-pointer" onClick={() => setCurrentTab('assistant')}>
                Gemini RAG Assistant
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700 leading-relaxed">
            <strong>Mandatory Medical Notice (Chapter 16):</strong> NutriSense is a personalized nutrition intelligence and educational decision-support tool. It provides dietary intake assessments and does NOT deliver clinical medical diagnoses, blood test interpretations, or pharmaceutical prescriptions. Individuals with medical conditions, pregnancy, or persistent deficiency alerts should consult a licensed healthcare practitioner or registered clinical dietitian.
          </div>
        </div>
      </footer>
    </div>
  );
}
