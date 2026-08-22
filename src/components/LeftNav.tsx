import React from 'react';
import { 
  Brain, 
  MessageSquare, 
  Database, 
  Download, 
  BarChart3, 
  Layers, 
  Edit3,
  Sliders,
  Zap,
  Target
} from 'lucide-react';
import { ActiveTab } from './Header';

interface LeftNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSessionModal: () => void;
  onOpenCorrectionModal: () => void;
  trainingExamplesCount: number;
  likertAnsweredCount?: number;
}

export const LeftNav: React.FC<LeftNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenSessionModal,
  onOpenCorrectionModal,
  trainingExamplesCount,
  likertAnsweredCount,
}) => {
  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }> = [
    { 
      id: 'personality_matrix', 
      label: '500-Item Personality Matrix', 
      icon: <Target className="w-5 h-5" />,
      badge: likertAnsweredCount && likertAnsweredCount > 0 ? `${likertAnsweredCount}` : undefined,
      badgeColor: 'bg-emerald-500'
    },
    { id: 'parameters', label: 'Parameters & Behavioral Narrative', icon: <Sliders className="w-5 h-5" /> },
    { id: 'finetuning', label: 'LoRA Fine-Tuning & Adaptation Studio', icon: <Zap className="w-5 h-5" /> },
    { id: 'analytics', label: 'Progress Dashboard & Sentiment Heatmap', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'cognitive_model', label: 'Cognitive Model & Policies', icon: <Brain className="w-5 h-5" /> },
    { 
      id: 'dataset_compiler', 
      label: 'Dataset Compiler', 
      icon: <Database className="w-5 h-5" />,
      badge: trainingExamplesCount > 0 ? trainingExamplesCount : undefined,
      badgeColor: 'bg-indigo-500'
    },
    { id: 'exports', label: 'JSONL Exports', icon: <Download className="w-5 h-5" /> },
  ];

  return (
    <nav className="w-16 hidden md:flex flex-col items-center py-5 bg-slate-900 text-slate-400 border-r border-slate-800 space-y-6 flex-shrink-0 z-30 select-none">
      {/* Brand Icon */}
      <button 
        onClick={() => setActiveTab('personality_matrix')}
        className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform active:scale-95"
        title="Personality Matrix Assessment"
      >
        P
      </button>

      {/* Main Nav Items */}
      <div className="flex flex-col items-center space-y-2.5 w-full px-2">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-2.5 rounded-xl transition-all relative group flex items-center justify-center ${
                isActive
                  ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title={item.label}
            >
              {item.icon}
              {item.badge !== undefined && (
                <span className={`absolute -top-1 -right-1 px-1 min-w-[16px] h-4 ${item.badgeColor || 'bg-indigo-500'} text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center shadow-xs`}>
                  {item.badge}
                </span>
              )}
              {/* Tooltip */}
              <span className="absolute left-16 ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-md shadow-lg border border-slate-800 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex-grow"></div>

      {/* Bottom utility icons */}
      <div className="flex flex-col items-center space-y-3 w-full px-2 pb-2">
        <button
          onClick={onOpenCorrectionModal}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors relative group"
          title="Add Human Nuance & Correction"
        >
          <Edit3 className="w-5 h-5" />
          <span className="absolute left-16 ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-md shadow-lg border border-slate-800 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Nuance & Correction
          </span>
        </button>

        <button
          onClick={onOpenSessionModal}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors relative group"
          title="Manage Sessions"
        >
          <Layers className="w-5 h-5" />
          <span className="absolute left-16 ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-md shadow-lg border border-slate-800 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Session Manager
          </span>
        </button>
      </div>
    </nav>
  );
};
