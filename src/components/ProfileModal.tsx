/**
 * NutriSense - User Physiological Profile, Medical Safeguards & Manual Target Settings Modal
 * Clean, compact non-scrolling credential dialog with full spacebar support & manual target entry.
 * Solves numeric 0-lock by utilizing string-state inputs with auto-select on focus and robust fallbacks.
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, ActivityLevel, DietaryPreference, HealthGoal } from '../types/nutrition';
import {
  X,
  User,
  Activity,
  Heart,
  Shield,
  Check,
  Globe,
  AlertTriangle,
  Stethoscope,
  Sparkles,
  Sliders,
  Edit3,
  Scale,
  Apple,
  Droplets,
  Zap,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
}

const REGION_OPTIONS = [
  { id: 'South Asia / India', label: 'South Asia / India (Spices, Amla, Moong Dal, Moringa, Guava)' },
  { id: 'East Asia', label: 'East Asia (Green Tea, Bok Choy, Tofu, Seaweed, Shiitake)' },
  { id: 'Mediterranean', label: 'Mediterranean (Olive Oil, Citrus, Lentils, Pomegranate, Herbs)' },
  { id: 'North America', label: 'North America (Walnuts, Beans, Broccoli, Squash, Berries)' },
  { id: 'Southeast Asia', label: 'Southeast Asia (Moringa, Turmeric, Papaya, Lemongrass, Coconut)' },
  { id: 'Middle East', label: 'Middle East (Pomegranate, Tahini, Lentils, Cloves, Sumac)' },
  { id: 'Latin America', label: 'Latin America (Beans, Chia, Guava, Cinnamon, Squash)' },
  { id: 'Europe', label: 'Europe (Apples, Beets, Walnuts, Thyme, Dairy)' },
  { id: 'Global / Universal', label: 'Global / Universal (Broad pantry staple selection)' },
];

const CLINICAL_CONDITIONS = [
  {
    id: 'Iron Deficiency Anemia',
    name: 'Iron Deficiency Anemia',
    badge: '1.5x Iron RDA & Vit-C Pairing',
    desc: 'Upregulates daily iron requirement by 50% and mandates vitamin-C co-presence.',
  },
  {
    id: 'Kidney Stones / Hyperoxaluria',
    name: 'Kidney Stones / Hyperoxaluria',
    badge: 'Restricts High Oxalates',
    desc: 'Filters out high-oxalate items (raw spinach) and promotes low-oxalate calcium.',
  },
  {
    id: 'Type 2 Diabetes / Prediabetes',
    name: 'Type 2 Diabetes / Prediabetes',
    badge: 'Low-GI + Cinnamon & Fenugreek',
    desc: 'Prioritizes insulin-sensitizing spices, soluble fiber, zinc & magnesium.',
  },
  {
    id: 'Hypertension / High BP',
    name: 'Hypertension / High BP',
    badge: 'High Potassium (4000mg)',
    desc: 'Enforces sodium caution, targets 4000mg potassium and 420mg magnesium.',
  },
  {
    id: 'Osteopenia / Osteoporosis',
    name: 'Osteopenia / Osteoporosis',
    badge: '1200mg Calcium Target',
    desc: 'Prioritizes bioavailable calcium (curd, moringa, sesame) and Vitamin D.',
  },
  {
    id: 'Hypothyroidism / Thyroid Health',
    name: 'Hypothyroidism / Thyroid Health',
    badge: '200µg Iodine & Cooked Greens',
    desc: 'Ensures adequate iodine and cautions against consuming raw goitrogenic greens.',
  },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'medical' | 'manual'>('profile');
  const [form, setForm] = useState<UserProfile>(profile);

  // String states for physical numeric inputs to avoid locking '0'
  const [ageStr, setAgeStr] = useState<string>('28');
  const [heightStr, setHeightStr] = useState<string>('165');
  const [weightStr, setWeightStr] = useState<string>('58');

  // String states for manual target inputs
  const [caloriesStr, setCaloriesStr] = useState<string>('2000');
  const [proteinStr, setProteinStr] = useState<string>('75');
  const [carbsStr, setCarbsStr] = useState<string>('250');
  const [fatStr, setFatStr] = useState<string>('55');
  const [fiberStr, setFiberStr] = useState<string>('30');
  const [waterStr, setWaterStr] = useState<string>('2500');

  // Dedicated string states to enable normal spacebar and comma typing without instant array stripping
  const [customConditionsText, setCustomConditionsText] = useState<string>('');
  const [allergiesText, setAllergiesText] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setForm({
        ...profile,
        region: profile.region || 'South Asia / India',
        is_manual_target: profile.is_manual_target || false,
      });

      // Sanitize: If age or height is 0 or unassigned, provide sensible default so 0 is never shown
      const cleanAge = profile.age && profile.age > 0 ? String(profile.age) : '28';
      const cleanHeight = profile.height_cm && profile.height_cm > 0 ? String(profile.height_cm) : '165';
      const cleanWeight = profile.weight_kg && profile.weight_kg > 0 ? String(profile.weight_kg) : '58';

      setAgeStr(cleanAge);
      setHeightStr(cleanHeight);
      setWeightStr(cleanWeight);

      setCaloriesStr(profile.manual_calories && profile.manual_calories > 0 ? String(profile.manual_calories) : '2000');
      setProteinStr(profile.manual_protein_g && profile.manual_protein_g > 0 ? String(profile.manual_protein_g) : '75');
      setCarbsStr(profile.manual_carbs_g && profile.manual_carbs_g > 0 ? String(profile.manual_carbs_g) : '250');
      setFatStr(profile.manual_fat_g && profile.manual_fat_g > 0 ? String(profile.manual_fat_g) : '55');
      setFiberStr(profile.manual_fiber_g && profile.manual_fiber_g > 0 ? String(profile.manual_fiber_g) : '30');
      setWaterStr(profile.manual_water_ml && profile.manual_water_ml > 0 ? String(profile.manual_water_ml) : '2500');

      setCustomConditionsText(profile.medical_conditions ? profile.medical_conditions.join(', ') : '');
      setAllergiesText(profile.allergies ? profile.allergies.join(', ') : '');
      setActiveTab('profile');
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const toggleCondition = (conditionName: string) => {
    const currentList = customConditionsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const exists = currentList.some((c) => c.toLowerCase() === conditionName.toLowerCase());
    let updated: string[];
    if (exists) {
      updated = currentList.filter((c) => c.toLowerCase() !== conditionName.toLowerCase());
    } else {
      updated = [...currentList, conditionName];
    }
    const newText = updated.join(', ');
    setCustomConditionsText(newText);
    setForm((prev) => ({ ...prev, medical_conditions: updated }));
  };

  const handleApplyPreset = (preset: 'balanced' | 'high_protein' | 'deficit' | 'surplus') => {
    const parsedWeight = parseFloat(weightStr) || 60;
    setForm((prev) => ({ ...prev, is_manual_target: true }));

    if (preset === 'balanced') {
      setCaloriesStr('2050');
      setProteinStr(String(Math.round(parsedWeight * 1.2)));
      setCarbsStr('250');
      setFatStr('55');
      setFiberStr('32');
      setWaterStr('2500');
    } else if (preset === 'high_protein') {
      setCaloriesStr('2200');
      setProteinStr(String(Math.round(parsedWeight * 1.8)));
      setCarbsStr('220');
      setFatStr('50');
      setFiberStr('35');
      setWaterStr('3000');
    } else if (preset === 'deficit') {
      setCaloriesStr('1650');
      setProteinStr(String(Math.round(parsedWeight * 1.4)));
      setCarbsStr('170');
      setFatStr('45');
      setFiberStr('30');
      setWaterStr('2600');
    } else if (preset === 'surplus') {
      setCaloriesStr('2500');
      setProteinStr(String(Math.round(parsedWeight * 1.6)));
      setCarbsStr('320');
      setFatStr('65');
      setFiberStr('38');
      setWaterStr('3200');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse numeric inputs safely
    const parsedAge = parseInt(ageStr, 10);
    const parsedHeight = parseInt(heightStr, 10);
    const parsedWeight = parseFloat(weightStr);

    const validAge = !isNaN(parsedAge) && parsedAge > 0 ? parsedAge : (profile.age > 0 ? profile.age : 28);
    const validHeight = !isNaN(parsedHeight) && parsedHeight > 0 ? parsedHeight : (profile.height_cm > 0 ? profile.height_cm : 165);
    const validWeight = !isNaN(parsedWeight) && parsedWeight > 0 ? parsedWeight : (profile.weight_kg > 0 ? profile.weight_kg : 58);

    const validCalories = parseInt(caloriesStr, 10) || 2000;
    const validProtein = parseInt(proteinStr, 10) || 75;
    const validCarbs = parseInt(carbsStr, 10) || 250;
    const validFat = parseInt(fatStr, 10) || 55;
    const validFiber = parseInt(fiberStr, 10) || 30;
    const validWater = parseInt(waterStr, 10) || 2500;

    const finalConditions = customConditionsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const finalAllergies = allergiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedProfile: UserProfile = {
      ...form,
      age: validAge,
      height_cm: validHeight,
      weight_kg: validWeight,
      is_manual_target: form.is_manual_target || false,
      manual_calories: validCalories,
      manual_protein_g: validProtein,
      manual_carbs_g: validCarbs,
      manual_fat_g: validFat,
      manual_fiber_g: validFiber,
      manual_water_ml: validWater,
      medical_conditions: finalConditions,
      allergies: finalAllergies,
    };

    onSaveProfile(updatedProfile);
    onClose();
  };

  return (
    <div
      id="profile-credential-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      {/* Credential Prompt Box: Non-scrolling, compact, cleanly tabbed container */}
      <div
        id="profile-credential-box"
        className="bg-white rounded-2xl max-w-2xl w-full p-5 shadow-2xl border border-slate-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              <span>User Profile & Credentials</span>
            </h2>
            <p className="text-[11px] text-slate-700">
              Physiological baseline, regional food availability, and clinical safeguards.
            </p>
          </div>
          <button
            id="close-profile-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-1.5 pt-3 pb-2 border-b border-slate-100">
          <button
            id="profile-tab-btn"
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal & Physical</span>
          </button>

          <button
            id="medical-tab-btn"
            type="button"
            onClick={() => setActiveTab('medical')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'medical'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Medical Considerations</span>
            {customConditionsText.trim() && (
              <span className="w-2 h-2 rounded-full bg-amber-300" />
            )}
          </button>

          <button
            id="manual-tab-btn"
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'manual'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Manual Entry & Targets</span>
            {form.is_manual_target && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 font-bold">
                Active
              </span>
            )}
          </button>
        </div>

        {/* Main Form Content */}
        <form onSubmit={handleSubmit} className="pt-3 text-xs">
          {/* TAB 1: PERSONAL & PHYSICAL CREDENTIALS */}
          {activeTab === 'profile' && (
            <div className="space-y-3">
              {/* Row 1: Name, Age, Biological Sex */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input
                    id="profile-name-input"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Age (Years)</label>
                  <input
                    id="profile-age-input"
                    type="number"
                    min={1}
                    max={120}
                    required
                    placeholder="Enter age (e.g. 28)"
                    value={ageStr}
                    onChange={(e) => setAgeStr(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Biological Sex</label>
                  <select
                    id="profile-sex-select"
                    value={form.sex}
                    onChange={(e) => setForm({ ...form, sex: e.target.value as 'male' | 'female' })}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Weight, Height, Dietary Preference */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Weight (kg)</label>
                  <input
                    id="profile-weight-input"
                    type="number"
                    step="0.5"
                    min={20}
                    max={300}
                    required
                    placeholder="Enter weight (e.g. 58)"
                    value={weightStr}
                    onChange={(e) => setWeightStr(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Height (cm)</label>
                  <input
                    id="profile-height-input"
                    type="number"
                    min={50}
                    max={250}
                    required
                    placeholder="Enter height (e.g. 165)"
                    value={heightStr}
                    onChange={(e) => setHeightStr(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dietary Preference</label>
                  <select
                    id="profile-diet-select"
                    value={form.dietary_preference}
                    onChange={(e) =>
                      setForm({ ...form, dietary_preference: e.target.value as DietaryPreference })
                    }
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="plant_forward">Plant-Forward / Flexitarian</option>
                    <option value="vegetarian">Vegetarian (Lacto-Ovo)</option>
                    <option value="vegan">100% Vegan</option>
                    <option value="omnivore">Omnivore</option>
                    <option value="pescatarian">Pescatarian</option>
                    <option value="gluten_free">Gluten-Free</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Activity Level & Goal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Activity Level (PAL Factor)
                  </label>
                  <select
                    id="profile-activity-select"
                    value={form.activity_level}
                    onChange={(e) =>
                      setForm({ ...form, activity_level: e.target.value as ActivityLevel })
                    }
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="sedentary">Sedentary (Desk Job, PAL 1.2)</option>
                    <option value="lightly_active">Lightly Active (1–3 days/wk, PAL 1.375)</option>
                    <option value="moderately_active">Moderately Active (3–5 days/wk, PAL 1.55)</option>
                    <option value="very_active">Very Active (6–7 days vigorous, PAL 1.725)</option>
                    <option value="extremely_active">Extra Active (Labor/Athletic, PAL 1.9)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nutritional / Fitness Goal</label>
                  <select
                    id="profile-goal-select"
                    value={form.fitness_goal || 'maintenance'}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        fitness_goal: e.target.value as HealthGoal,
                        goal: e.target.value as HealthGoal,
                      })
                    }
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="maintenance">Weight Maintenance & Energy Balance</option>
                    <option value="anemia_recovery">Iron Absorption & Anemia Recovery</option>
                    <option value="weight_loss">Fat Loss (-500 kcal deficit)</option>
                    <option value="weight_gain">Healthy Mass Gain (+400 kcal surplus)</option>
                    <option value="athletic_performance">Athletic Performance & High Protein</option>
                    <option value="bone_health">Bone Mineral Density & Calcium/Vit-D</option>
                    <option value="longevity">Cellular Longevity & Antioxidants</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Regional Pantry Priority */}
              <div>
                <label className="font-semibold text-slate-700 flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Regional Pantry & Food Availability</span>
                  </span>
                  <span className="text-[10px] text-blue-700 font-medium">
                    Prioritizes accessible native superfoods
                  </span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    id="profile-region-select"
                    value={form.region || 'South Asia / India'}
                    onChange={(e) => setForm({ ...form, region: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                  >
                    {REGION_OPTIONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <input
                    id="profile-custom-region-input"
                    type="text"
                    placeholder="Or enter custom region / city..."
                    value={form.region || ''}
                    onChange={(e) => setForm({ ...form, region: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Maternal Modifiers (if female) */}
              {form.sex === 'female' && (
                <div className="flex items-center gap-4 p-2.5 rounded-xl bg-purple-50/70 border border-purple-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      id="profile-pregnant-checkbox"
                      type="checkbox"
                      checked={form.is_pregnant}
                      onChange={(e) => setForm({ ...form, is_pregnant: e.target.checked })}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="font-semibold text-purple-950">Currently Pregnant</span>
                  </label>

                  {form.is_pregnant && (
                    <select
                      id="profile-trimester-select"
                      value={form.pregnancy_trimester || '2nd'}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          pregnancy_trimester: e.target.value as '1st' | '2nd' | '3rd',
                        })
                      }
                      className="p-1.5 rounded-lg bg-white border border-purple-200 text-purple-900 font-medium"
                    >
                      <option value="1st">1st Trimester (+100 kcal, +10g protein)</option>
                      <option value="2nd">2nd Trimester (+350 kcal, +23g protein)</option>
                      <option value="3rd">3rd Trimester (+350 kcal, +23g protein)</option>
                    </select>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer ml-auto">
                    <input
                      id="profile-lactating-checkbox"
                      type="checkbox"
                      checked={form.is_lactating}
                      onChange={(e) => setForm({ ...form, is_lactating: e.target.checked })}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="font-semibold text-purple-950">Lactating (+520 kcal)</span>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CLINICAL SAFEGUARDS & MEDICAL CONSIDERATIONS */}
          {activeTab === 'medical' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <Stethoscope className="w-4 h-4 text-amber-700" />
                    <span>Clinical Safeguards & Presets</span>
                  </div>
                  <span className="text-[10px] bg-amber-200 text-amber-900 font-semibold px-2 py-0.5 rounded-full">
                    Auto-modulates food filters & RDA
                  </span>
                </div>

                {/* Compact Condition Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {CLINICAL_CONDITIONS.map((cond) => {
                    const isSelected = customConditionsText
                      .toLowerCase()
                      .includes(cond.id.toLowerCase());
                    return (
                      <button
                        key={cond.id}
                        type="button"
                        onClick={() => toggleCondition(cond.name)}
                        className={`p-2 rounded-lg text-left border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-100 border-amber-500 text-amber-950 shadow-xs'
                            : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-0.5">
                          <span className="font-bold text-[11px] truncate">{cond.name}</span>
                          {isSelected && <Check className="w-3 h-3 text-amber-700 shrink-0" />}
                        </div>
                        <span className="text-[9px] text-amber-800 font-medium truncate">
                          {cond.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dedicated Medical Consideration Prompt Box with Full Spacebar Support */}
              <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-xs space-y-1.5">
                <label
                  htmlFor="medical-considerations-input"
                  className="font-bold text-slate-800 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Medical Consideration Prompt Box</span>
                  </span>
                  <span className="text-[10px] text-slate-700 font-normal">
                    Enter any medical conditions, separated by commas
                  </span>
                </label>

                <input
                  id="medical-considerations-input"
                  type="text"
                  placeholder="e.g. Mild Anemia, GERD, Osteopenia, High Blood Pressure, Vitamin D deficiency"
                  value={customConditionsText}
                  onChange={(e) => setCustomConditionsText(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-amber-50/40 border border-amber-300 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-inner"
                />

                <p className="text-[10px] text-slate-700">
                  Tip: You can freely type spaces and multiple words (e.g. "Borderline Iron Deficiency", "High Blood Pressure").
                </p>
              </div>

              {/* Allergens Prompt Box with Full Spacebar Support */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
                <label
                  htmlFor="profile-allergens-input"
                  className="font-bold text-slate-800 flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Known Food Allergies & Intolerances</span>
                </label>
                <input
                  id="profile-allergens-input"
                  type="text"
                  placeholder="e.g. Peanuts, Tree nuts, Lactose, Shellfish, Gluten"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: MANUAL TARGET ENTRY & OVERRIDES */}
          {activeTab === 'manual' && (
            <div className="space-y-3">
              {/* Mode Toggle Switch */}
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-blue-950">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <span>Nutritional Target Calculation Mode</span>
                  </div>
                  <p className="text-[11px] text-blue-800 mt-0.5">
                    {form.is_manual_target
                      ? 'Manual Target Entry is ACTIVE: Custom calories and macronutrients override automated formulas.'
                      : 'Auto-Calculate Mode: NutriSense calculates targets from Mifflin-St Jeor & WHO standards.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, is_manual_target: false })}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-all ${
                      !form.is_manual_target
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-blue-800 border border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    Auto Formulas
                  </button>
                  <button
                    id="enable-manual-targets-btn"
                    type="button"
                    onClick={() => setForm({ ...form, is_manual_target: true })}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-all ${
                      form.is_manual_target
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    Manual Entry
                  </button>
                </div>
              </div>

              {/* Quick Presets for Manual Entry */}
              {form.is_manual_target && (
                <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>Quick Target Presets:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('balanced')}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium cursor-pointer"
                  >
                    Standard Balanced (2050 kcal)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('high_protein')}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium cursor-pointer"
                  >
                    High Protein (2200 kcal)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('deficit')}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium cursor-pointer"
                  >
                    Caloric Deficit (1650 kcal)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('surplus')}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium cursor-pointer"
                  >
                    Mass Gain (2500 kcal)
                  </button>
                </div>
              )}

              {/* Manual Numeric Inputs Grid with Safe String State */}
              <div
                className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-xl border ${
                  form.is_manual_target
                    ? 'bg-white border-blue-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60 pointer-events-none'
                }`}
              >
                {/* Calories */}
                <div>
                  <label className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                    <FlameIcon className="w-3.5 h-3.5 text-rose-500" />
                    <span>Daily Calories (kcal)</span>
                  </label>
                  <input
                    id="manual-calories-input"
                    type="number"
                    min={800}
                    max={6000}
                    placeholder="e.g. 2000"
                    value={caloriesStr}
                    onChange={(e) => setCaloriesStr(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Protein */}
                <div>
                  <label className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                    <Apple className="w-3.5 h-3.5 text-blue-500" />
                    <span>Daily Protein (g)</span>
                  </label>
                  <input
                    id="manual-protein-input"
                    type="number"
                    min={20}
                    max={400}
                    placeholder="e.g. 75"
                    value={proteinStr}
                    onChange={(e) => setProteinStr(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Carbohydrates */}
                <div>
                  <label className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                    <Scale className="w-3.5 h-3.5 text-amber-500" />
                    <span>Daily Carbs (g)</span>
                  </label>
                  <input
                    id="manual-carbs-input"
                    type="number"
                    min={20}
                    max={700}
                    placeholder="e.g. 250"
                    value={carbsStr}
                    onChange={(e) => setCarbsStr(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Fats */}
                <div>
                  <label className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                    <Heart className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Daily Fats (g)</span>
                  </label>
                  <input
                    id="manual-fat-input"
                    type="number"
                    min={10}
                    max={200}
                    placeholder="e.g. 55"
                    value={fatStr}
                    onChange={(e) => setFatStr(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Dietary Fiber */}
                <div>
                  <label className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                    <Activity className="w-3.5 h-3.5 text-teal-500" />
                    <span>Daily Fiber (g)</span>
                  </label>
                  <input
                    id="manual-fiber-input"
                    type="number"
                    min={10}
                    max={100}
                    placeholder="e.g. 30"
                    value={fiberStr}
                    onChange={(e) => setFiberStr(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Water / Hydration */}
                <div>
                  <label className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                    <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Water Target (ml)</span>
                  </label>
                  <input
                    id="manual-water-input"
                    type="number"
                    min={1000}
                    max={6000}
                    step={100}
                    placeholder="e.g. 2500"
                    value={waterStr}
                    onChange={(e) => setWaterStr(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {!form.is_manual_target && (
                <p className="text-[11px] text-slate-700 text-center">
                  To enter custom caloric and macro targets, click{' '}
                  <strong className="text-emerald-700">"Manual Entry"</strong> above.
                </p>
              )}
            </div>
          )}

          {/* Modal Action Buttons Footer */}
          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-[11px] text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {form.is_manual_target ? 'Mode: Manual Target Entry' : 'Mode: Automated Biophysical RDA'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="cancel-profile-btn"
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                id="save-profile-btn"
                type="submit"
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile & Settings</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Simple Flame icon helper component
function FlameIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
