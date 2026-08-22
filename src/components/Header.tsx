import React from 'react';
import { 
  Brain, 
  MessageSquare, 
  Database, 
  Download, 
  BarChart3, 
  Layers, 
  Sparkles,
  ChevronDown,
  Edit3
} from 'lucide-react';
import { SessionRecord } from '../types';

export type ActiveTab = 
  | 'personality_matrix' 
  | 'parameters' 
  | 'finetuning' 
  | 'cognitive_model' 
  | 'analytics' 
  | 'dataset_compiler' 
  | 'exports';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  sessions: SessionRecord[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onOpenSessionModal: () => void;
  onStartNewSession?: () => void;
  onOpenCorrectionModal: () => void;
  onNavigateToExport: () => void;
  isAnalyzing: boolean;
  trainingExamplesCount: number;
  userName: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  sessions,
  activeSessionId,
  onSelectSession,
  onOpenSessionModal,
  onStartNewSession,
  onOpenCorrectionModal,
  onNavigateToExport,
  isAnalyzing,
  trainingExamplesCount,
  userName,
}) => {
  const currentSession = sessions.find(s => s.session_id === activeSessionId) || sessions[0];
  const sessionNumStr = currentSession 
    ? `Session ${currentSession.session_number.toString().padStart(2, '0')}` 
    : 'Session 01';

  const mobileNavItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'personality_matrix', label: 'Matrix', icon: <Brain className="w-3.5 h-3.5" /> },
    { id: 'parameters', label: 'Params', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'analytics', label: 'Sentiment', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'cognitive_model', label: 'Model', icon: <Brain className="w-3.5 h-3.5" /> },
    { id: 'dataset_compiler', label: 'Compiler', icon: <Database className="w-3.5 h-3.5" /> },
    { id: 'exports', label: 'JSONL', icon: <Download className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-20 flex-shrink-0">
      
      {/* Left: Brand / Title + Session Badge */}
      <div className="flex items-center space-x-3">
        <h1 className="text-base sm:text-lg font-semibold text-slate-800 tracking-tight flex items-center gap-2">
          <span>Cognitive Apprenticeship</span>
        </h1>

        <button
          onClick={onOpenSessionModal}
          className="px-2.5 py-0.5 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 text-xs font-medium rounded-md border border-indigo-100 flex items-center gap-1 transition shadow-xs"
          title="Switch Session"
        >
          <span className="font-mono">{sessionNumStr}</span>
          <ChevronDown className="w-3 h-3 text-indigo-500 opacity-80" />
        </button>

        {isAnalyzing && (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium font-mono animate-pulse">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Analyzing Policies...</span>
          </div>
        )}
      </div>

      {/* Mobile Navigation Pills */}
      <div className="flex md:hidden items-center gap-1 overflow-x-auto max-w-[200px] scrollbar-none">
        {mobileNavItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-2 py-1 text-[11px] font-medium rounded-md flex items-center gap-1 ${
              activeTab === item.id 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Right: Actions in Sleek Interface style */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {onStartNewSession && (
          <button
            onClick={onStartNewSession}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 border border-indigo-200 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
            title="Start a new session with autonomously chosen focus"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>+ New Session</span>
          </button>
        )}

        <button
          onClick={onOpenCorrectionModal}
          className="hidden sm:flex text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
          title="Add human nuance to calibrated patterns"
        >
          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
          <span>Add Nuance</span>
        </button>

        <button
          onClick={onOpenSessionModal}
          className="hidden sm:inline-block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
        >
          Sessions
        </button>

        <button
          onClick={onNavigateToExport}
          className="bg-slate-900 text-white px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-800 shadow-sm transition-all flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-indigo-300" />
          <span>Export Dataset</span>
        </button>
      </div>

    </header>
  );
};
