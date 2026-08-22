import React from 'react';
import { 
  Sliders, 
  Target, 
  Download,
  Flame,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export type ActiveTab = 
  | 'personality_matrix' 
  | 'parameters' 
  | 'exports';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  likertAnsweredCount?: number;
  userName: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  likertAnsweredCount = 0,
  userName = 'User',
}) => {
  const completionPercentage = Math.round((likertAnsweredCount / 500) * 100);

  const navTabs: Array<{ id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }> = [
    { 
      id: 'personality_matrix', 
      label: 'Questionnaire', 
      icon: <Target className="w-4 h-4" />,
      badge: `${likertAnsweredCount}/500`,
      badgeColor: likertAnsweredCount === 500 ? 'bg-emerald-600 text-white' : likertAnsweredCount > 0 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
    },
    { 
      id: 'parameters', 
      label: 'Your Traits & Profile', 
      icon: <Sliders className="w-4 h-4" />,
      badge: likertAnsweredCount > 0 ? `${completionPercentage}% Ready` : undefined,
      badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200'
    },
    { 
      id: 'exports', 
      label: 'Export & Training', 
      icon: <Download className="w-4 h-4" />,
    },
  ];

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-20 flex-shrink-0 shadow-2xs">
      
      {/* Left: Brand / Logo */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        <button 
          onClick={() => setActiveTab('personality_matrix')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight block leading-tight">
              Life & Personality Assessment
            </span>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Casual Questionnaire & Cognitive Profile Builder
            </span>
          </div>
        </button>
      </div>

      {/* Center: Main Navigation Tabs */}
      <nav className="flex items-center gap-1.5 overflow-x-auto scrollbar-none px-2">
        {navTabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className={isActive ? 'text-teal-400' : 'text-slate-400'}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${tab.badgeColor || 'bg-slate-200 text-slate-800'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right: User Profile / Direct Action */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => setActiveTab('exports')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-teal-600" />
          <span>Export Dataset ({completionPercentage}%)</span>
        </button>
      </div>

    </header>
  );
};

