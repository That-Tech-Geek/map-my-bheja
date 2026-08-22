import React, { useState } from 'react';
import { ParameterEngine } from './ParameterEngine';
import { FullCognitiveState, PersonalityParameterKey } from '../types';
import { Archive, AlertCircle, Info } from 'lucide-react';

interface BaselineArchiveProps {
  state: FullCognitiveState;
  onUpdateParameter: (key: PersonalityParameterKey, value: number) => void;
  onSynthesizeNarrative: () => void;
  isSynthesizing?: boolean;
}

export const BaselineArchive: React.FC<BaselineArchiveProps> = ({
  state,
  onUpdateParameter,
  onSynthesizeNarrative,
  isSynthesizing,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 text-slate-100 overflow-hidden font-sans">
      
      {/* Archive Header Banner */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
            <Archive className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-200">
              Legacy Baseline System (Archive / Reference Mode)
            </span>
            <span className="text-[11px] text-slate-400 block">
              Previous Likert trait calculations and narrative synthesis preserved for historical comparison.
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          archive/mbti_v1
        </span>
      </div>

      {/* Main Engine */}
      <div className="flex-1 overflow-hidden">
        <ParameterEngine
          state={state}
          onUpdateParameter={onUpdateParameter}
          onSynthesizeNarrative={onSynthesizeNarrative}
          onNavigateToExport={() => {}}
          isSynthesizing={isSynthesizing}
        />
      </div>

    </div>
  );
};
