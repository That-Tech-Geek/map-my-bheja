import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  Archive, 
  Sparkles, 
  Code, 
  FileCode
} from 'lucide-react';
import { FullCognitiveState, DatasetVersion } from '../types';
import { 
  buildDatasetVersion, 
  downloadFile, 
  downloadFullDatasetZip 
} from '../services/storage';
import { FineTuningExportModal } from './FineTuningExportModal';

interface ExportViewProps {
  state: FullCognitiveState;
  onSaveDatasetVersion: (version: DatasetVersion) => void;
}

export const ExportView: React.FC<ExportViewProps> = ({
  state,
  onSaveDatasetVersion,
}) => {
  const [selectedFileKey, setSelectedFileKey] = useState<keyof DatasetVersion['export_files']>('training_all');
  const [copied, setCopied] = useState(false);
  const [isGeneratingVersion, setIsGeneratingVersion] = useState(false);
  const [isFineTuningModalOpen, setIsFineTuningModalOpen] = useState(false);

  // Compute live current version preview
  const liveVersion = buildDatasetVersion(state);
  const currentVersion = state.dataset_versions.length > 0
    ? state.dataset_versions[state.dataset_versions.length - 1]
    : liveVersion;

  const fileDefinitions: Array<{
    key: keyof DatasetVersion['export_files'];
    filename: string;
    label: string;
    desc: string;
    badge: string;
  }> = [
    {
      key: 'training_all',
      filename: `${currentVersion.dataset_version}_training_all.jsonl`,
      label: 'training_all.jsonl',
      desc: 'Master cognitive dataset: all 7 structured cognitive types in standalone JSON lines.',
      badge: 'Master Dataset',
    },
    {
      key: 'training_sft',
      filename: `${currentVersion.dataset_version}_training_sft.jsonl`,
      label: 'training_sft.jsonl',
      desc: 'Conversational SFT examples across diverse domains testing Sambit\'s underlying policies.',
      badge: 'Primary SFT Target',
    },
    {
      key: 'training_preferences',
      filename: `${currentVersion.dataset_version}_training_preferences.jsonl`,
      label: 'training_preferences.jsonl',
      desc: 'Strict Chosen vs Rejected pairs from real corrections, tradeoffs, and rejected suggestions.',
      badge: 'DPO / RLHF',
    },
    {
      key: 'policies',
      filename: `${currentVersion.dataset_version}_policies.jsonl`,
      label: 'policies.jsonl',
      desc: 'Clustered conditional cognitive policies with preconditions, exceptions, and evidence IDs.',
      badge: 'Cognitive Policies',
    },
    {
      key: 'predictions',
      filename: `${currentVersion.dataset_version}_prediction.jsonl`,
      label: 'prediction.jsonl',
      desc: 'Behavioral prediction dataset comparing internal predicted choices vs actual responses.',
      badge: 'Evaluation Benchmark',
    },
    {
      key: 'experiences',
      filename: `${currentVersion.dataset_version}_experiences.jsonl`,
      label: 'experiences.jsonl',
      desc: 'Deeply structured situation-decision-reasoning experience logs.',
      badge: 'Empirical Logs',
    },
    {
      key: 'observations',
      filename: `${currentVersion.dataset_version}_observations.jsonl`,
      label: 'observations.jsonl',
      desc: 'Empirical observations, hypotheses, and confidence scores.',
      badge: 'Cognitive Rules',
    },
    {
      key: 'raw_conversations',
      filename: `${currentVersion.dataset_version}_raw_conversations.jsonl`,
      label: 'raw_conversations.jsonl',
      desc: 'Full interview transcript with exact message IDs for provenance.',
      badge: 'Raw Provenance',
    },
    {
      key: 'dataset_manifest',
      filename: `${currentVersion.dataset_version}_dataset_manifest.json`,
      label: 'dataset_manifest.json',
      desc: 'Machine-readable dataset manifest with source coverage metrics, policy matrix, and fine-tuning specs.',
      badge: 'Manifest & Specs',
    },
  ];

  const handleCreateNewVersion = () => {
    setIsGeneratingVersion(true);
    setTimeout(() => {
      const newVersion = buildDatasetVersion(state);
      onSaveDatasetVersion(newVersion);
      setIsGeneratingVersion(false);
    }, 400);
  };

  const handleDownloadSingle = (fileKey: keyof DatasetVersion['export_files']) => {
    const fileDef = fileDefinitions.find(f => f.key === fileKey);
    if (!fileDef) return;
    const content = currentVersion.export_files[fileKey];
    downloadFile(fileDef.filename, content);
  };

  const handleDownloadZip = async () => {
    await downloadFullDatasetZip(currentVersion, state.user_name);
  };

  const handleCopyContent = () => {
    const content = currentVersion.export_files[selectedFileKey];
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentFileContent = currentVersion.export_files[selectedFileKey] || '';
  const currentLines = currentFileContent ? currentFileContent.split('\n').filter(Boolean) : [];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600" />
            <span>Dataset Versioning & JSONL Export Engine</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Export standalone line-by-line JSONL datasets suitable for LoRA, PEFT, SFT, and DPO training frameworks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsFineTuningModalOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export LLM Dataset Hub (JSONL / Unsloth)</span>
          </button>

          <button
            onClick={handleCreateNewVersion}
            disabled={isGeneratingVersion}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition flex items-center gap-2 shadow-2xs disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Generate New Dataset Snapshot</span>
          </button>

          <button
            onClick={handleDownloadZip}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition flex items-center gap-2 shadow-xs"
          >
            <Archive className="w-4 h-4 text-indigo-300" />
            <span>Export Full Training Bundle (ZIP)</span>
          </button>
        </div>
      </div>

      {/* Snapshot Version Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg font-mono font-bold text-sm">
              {currentVersion.dataset_version}
            </div>
            <div>
              <div className="text-xs text-slate-800 font-semibold">
                Target: Fine-Tuning Computational Model of {state.user_name}
              </div>
              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                <span>{currentVersion.accepted_examples} accepted training examples</span>
                <span>•</span>
                <span>Avg Quality: {currentVersion.average_quality_score}/100</span>
                <span>•</span>
                <span>Generated: {new Date(currentVersion.generation_timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Total Snapshots: {state.dataset_versions.length || 1}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Files Selector & Real-Time JSONL Line Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 6 Export Files */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
            Dataset Files (Strict JSONL Format)
          </h2>

          {fileDefinitions.map(file => {
            const isSelected = selectedFileKey === file.key;
            const content = currentVersion.export_files[file.key] || '';
            const lineCount = content ? content.split('\n').filter(Boolean).length : 0;

            return (
              <div
                key={file.key}
                onClick={() => setSelectedFileKey(file.key)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-300 shadow-xs ring-1 ring-indigo-200'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <FileCode className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                    <span className="text-xs font-bold text-slate-800 font-mono">{file.label}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                    file.key === 'training_all'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {file.badge}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 mb-2.5 leading-relaxed">
                  {file.desc}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400">
                    {lineCount} standalone {lineCount === 1 ? 'line' : 'lines'} ({Math.round(content.length / 1024)} KB)
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadSingle(file.key);
                    }}
                    className="text-xs bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white border border-slate-200 hover:border-indigo-600 px-2.5 py-1 rounded-md transition flex items-center gap-1 font-mono font-medium shadow-2xs"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: JSONL Line-by-Line Viewer */}
        <div className="lg:col-span-7 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          
          <div className="bg-slate-50 p-3.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800 font-mono">
                {fileDefinitions.find(f => f.key === selectedFileKey)?.filename}
              </span>
              <span className="text-[10px] text-emerald-700 font-mono bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold">
                Valid JSONL (No Array Wrappers)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyContent}
                className="text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md transition flex items-center gap-1 font-mono font-medium shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => handleDownloadSingle(selectedFileKey)}
                className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-md transition flex items-center gap-1 font-mono font-medium shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* JSONL Lines list */}
          <div className="flex-1 p-3 overflow-y-auto max-h-[560px] font-mono text-xs text-slate-800 bg-slate-900 space-y-2">
            {currentLines.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No lines generated for this dataset yet. Run a session and compile training examples.
              </div>
            ) : (
              currentLines.map((line, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/90 border border-slate-700 hover:border-indigo-400/60 p-2.5 rounded-lg text-[11px] text-indigo-200 break-all transition-colors"
                >
                  <div className="text-[9px] text-slate-400 font-mono mb-1">
                    Line {idx + 1}
                  </div>
                  <code>{line}</code>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>Every single line is an independent, valid JSON document</span>
            <span>Total lines: {currentLines.length}</span>
          </div>

        </div>

      </div>

      {/* LLM Fine-Tuning Multi-Format Export Modal */}
      <FineTuningExportModal
        state={state}
        isOpen={isFineTuningModalOpen}
        onClose={() => setIsFineTuningModalOpen(false)}
      />
    </div>
  );
};
