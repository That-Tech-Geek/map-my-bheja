import React from 'react';
import { 
  Target, 
  Database, 
  Cpu, 
  ShieldAlert, 
  Archive, 
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';

export type ActiveTab = 
  | 'arena' 
  | 'vault' 
  | 'compiler' 
  | 'eval' 
  | 'archive';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  decisionAnsweredCount?: number;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  decisionAnsweredCount = 0,
  userName = 'Sambit',
}) => {
  const completionPercentage = Math.round((decisionAnsweredCount / 500) * 100);

  const navTabs: Array<{ 
    id: ActiveTab; 
    label: string; 
    icon: React.ReactNode; 
    badge?: string | number; 
    badgeColor?: string 
  }> = [
    { 
      id: 'arena', 
      label: 'Decision Arena', 
      icon: <Target className="w-4 h-4" />,
      badge: `${decisionAnsweredCount}/500`,
      badgeColor: decisionAnsweredCount === 500 
        ? 'bg-emerald-500 text-slate-950 font-bold' 
        : decisionAnsweredCount > 0 
          ? 'bg-teal-500 text-slate-950 font-bold' 
          : 'bg-slate-800 text-slate-400'
    },
    { 
      id: 'vault', 
      label: 'Response Vault', 
      icon: <Database className="w-4 h-4" />,
      badge: decisionAnsweredCount > 0 ? `${decisionAnsweredCount} Saved` : undefined,
      badgeColor: 'bg-teal-950 text-teal-300 border border-teal-800'
    },
    { 
      id: 'compiler', 
      label: 'SFT & DPO Compiler', 
      icon: <Cpu className="w-4 h-4" />,
      badge: 'Zero-Bias',
      badgeColor: 'bg-indigo-950 text-indigo-300 border border-indigo-800'
    },
    { 
      id: 'eval', 
      label: 'Adversarial & Eval', 
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: 'Held-Out',
      badgeColor: 'bg-amber-950 text-amber-300 border border-amber-800'
    },
    { 
      id: 'archive', 
      label: 'Baseline Archive', 
      icon: <Archive className="w-4 h-4" />,
    },
  ];

  return (
    <header className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 z-20 flex-shrink-0">
      
      {/* Left: Brand / Logo */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        <button 
          onClick={() => setActiveTab('arena')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md">
            <Zap className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-100 tracking-tight block leading-tight">
                Policy Distillation Platform
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-teal-950 text-teal-300 border border-teal-800 hidden sm:inline-block">
                {userName}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
              500 Trade-Off Scenarios → Deterministic SFT / DPO
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
                  ? 'bg-slate-800 text-teal-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span className={isActive ? 'text-teal-400' : 'text-slate-400'}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${tab.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right: Completion Gauge */}
      <div className="hidden lg:flex items-center gap-2.5">
        <div className="text-right">
          <span className="text-[11px] font-mono font-bold text-slate-200 block leading-tight">
            {completionPercentage}% Calibrated
          </span>
          <span className="text-[9px] text-slate-500 block leading-tight">
            {decisionAnsweredCount} of 500 Dilemmas
          </span>
        </div>
        <div className="w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center relative">
          <div 
            className="w-8 h-8 rounded-full border-2 border-teal-400 absolute inset-0 transition-all"
            style={{
              clipPath: `polygon(50% 50%, 50% 0%, ${completionPercentage >= 25 ? '100% 0%' : '50% 0%'}, ${completionPercentage >= 50 ? '100% 100%' : '50% 50%'}, ${completionPercentage >= 75 ? '0% 100%' : '50% 50%'}, ${completionPercentage >= 100 ? '0% 0%' : '50% 50%'})`
            }}
          />
          <span className="text-[9px] font-mono font-bold text-teal-400">
            {completionPercentage}%
          </span>
        </div>
      </div>

    </header>
  );
};
