/**
 * NutriSense - Top Navigation & Profile Bar Component
 */

import React from 'react';
import { UserProfile } from '../types/nutrition';
import {
  Sparkles,
  HeartPulse,
  ChefHat,
  Network,
  Scale,
  MessageSquareText,
  FlaskConical,
  CalendarCheck,
  ShieldAlert,
  Globe,
  Stethoscope,
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  profile: UserProfile;
  hasSignificantGaps: boolean;
  onOpenProfileModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  profile,
  hasSignificantGaps,
  onOpenProfileModal,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard & RDA', icon: HeartPulse },
    { id: 'logger', label: 'Log & Track', icon: CalendarCheck },
    { id: 'gastronomy', label: 'Gastronomy Lab', icon: ChefHat },
    { id: 'bioavailability', label: 'Bioavailability', icon: FlaskConical },
    { id: 'graph', label: 'Knowledge Graph', icon: Network },
    { id: 'compare', label: 'Food Compare', icon: Scale },
    { id: 'assistant', label: 'Ask NutriSense', icon: MessageSquareText },
  ];

  const primaryCondition = profile.medical_conditions && profile.medical_conditions.length > 0
    ? profile.medical_conditions[0]
    : null;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-slate-900 font-display">
                  NutriSense
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  TRL 4–5 Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-700 hidden sm:block">
                Knowledge Graphs · Gastronomy Intelligence · Bioavailability
              </p>
            </div>
          </div>

          {/* Active Profile Badge, Region & Medical Status */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Region Chip */}
            <button
              onClick={onOpenProfileModal}
              title={`Active Region: ${profile.region || 'South Asia / India'} (Click to change)`}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-medium transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span className="truncate max-w-[130px]">{profile.region || 'South Asia / India'}</span>
            </button>

            {/* Medical Condition Indicator */}
            {primaryCondition && (
              <button
                onClick={onOpenProfileModal}
                title={`Active Medical Consideration: ${profile.medical_conditions.join(', ')}`}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-medium transition-colors"
              >
                <Stethoscope className="w-3.5 h-3.5 text-amber-600" />
                <span className="truncate max-w-[140px]">{primaryCondition}</span>
                {profile.medical_conditions.length > 1 && (
                  <span className="text-[10px] bg-amber-200 text-amber-900 rounded-full px-1">
                    +{profile.medical_conditions.length - 1}
                  </span>
                )}
              </button>
            )}

            {hasSignificantGaps && (
              <div
                title="Potential nutritional gap detected in recent intake"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium cursor-pointer"
                onClick={() => onSelectTab('dashboard')}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span className="hidden md:inline">Nutrient Gap Flag</span>
              </div>
            )}

            <button
              id="header-profile-btn"
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-medium text-slate-700 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-700" />
              <span className="font-semibold text-slate-900">{profile.name}</span>
              {profile.is_manual_target && (
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded-full">
                  Manual
                </span>
              )}
              <span className="text-slate-700 hidden xl:inline">
                ({profile.sex}, {profile.age}y · {profile.activity_level.replace('_', ' ')})
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-2 no-scrollbar border-t border-slate-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
