import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  Sparkles, 
  Terminal, 
  Database, 
  Zap, 
  Bot, 
  Sliders, 
  ChevronRight, 
  X, 
  Layers,
  Code2,
  FileArchive,
  BookOpen
} from 'lucide-react';
import JSZip from 'jszip';
import { FullCognitiveState } from '../types';
import { 
  generateFineTuningDataset, 
  CompiledFineTuningDataset 
} from '../services/datasetGenerator';

interface FineTuningExportModalProps {
  state: FullCognitiveState;
  isOpen: boolean;
  onClose: () => void;
}

export const FineTuningExportModal: React.FC<FineTuningExportModalProps> = ({
  state,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'chatml' | 'dpo' | 'alpaca' | 'unsloth_script' | 'axolotl' | 'ollama' | 'readme'>('chatml');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const dataset: CompiledFineTuningDataset = useMemo(() => {
    return generateFineTuningDataset(state);
  }, [state]);

  if (!isOpen) return null;

  const getActiveContent = (): { filename: string; content: string; language: string; badge: string; desc: string } => {
    switch (activeTab) {
      case 'chatml':
        return {
          filename: 'training_chatml.jsonl',
          content: dataset.chatml_jsonl,
          language: 'json',
          badge: 'OpenAI / LLaMA-3 SFT',
          desc: 'Multi-turn conversational dataset formatted with system, user, and assistant roles for supervised fine-tuning.'
        };
      case 'dpo':
        return {
          filename: 'preferences_dpo.jsonl',
          content: dataset.dpo_preferences_jsonl,
          language: 'json',
          badge: 'DPO / RLHF Preference Pairs',
          desc: 'Direct Preference Optimization dataset with explicit chosen vs. rejected responses derived from your exact choices.'
        };
      case 'alpaca':
        return {
          filename: 'alpaca_instructions.json',
          content: dataset.alpaca_json,
          language: 'json',
          badge: 'Stanford Alpaca Format',
          desc: 'Instruction-input-output pairs formatted for Axolotl, Stanford Alpaca, and LLaMA-Factory.'
        };
      case 'unsloth_script':
        return {
          filename: 'train_lora.py',
          content: dataset.unsloth_train_script_py,
          language: 'python',
          badge: '1-Click Unsloth LoRA Script',
          desc: 'High-speed 4-bit QLoRA training script using Unsloth & Hugging Face TRL to train LLaMA 3.1 8B or Qwen 2.5.'
        };
      case 'axolotl':
        return {
          filename: 'dataset_config.yaml',
          content: dataset.axolotl_config_yaml,
          language: 'yaml',
          badge: 'Axolotl / Cluster Config',
          desc: 'Production training configuration for multi-GPU clusters and cloud runs (RunPod, Lambda, Vast.ai).'
        };
      case 'ollama':
        return {
          filename: 'Modelfile',
          content: dataset.ollama_modelfile,
          language: 'dockerfile',
          badge: 'Ollama Modelfile',
          desc: 'Run your personalized cognitive persona locally with Ollama (ollama create my-clone -f Modelfile).'
        };
      case 'readme':
        return {
          filename: 'README.md',
          content: dataset.dataset_readme_md,
          language: 'markdown',
          badge: 'Dataset Guide & Provenance',
          desc: 'Full specification, license, and training instructions.'
        };
    }
  };

  const active = getActiveContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(active.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadActive = () => {
    const blob = new Blob([active.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = active.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      const folder = zip.folder(`lora_dataset_${dataset.subject_name.toLowerCase()}_v2`) || zip;

      folder.file('training_chatml.jsonl', dataset.chatml_jsonl);
      folder.file('preferences_dpo.jsonl', dataset.dpo_preferences_jsonl);
      folder.file('alpaca_instructions.json', dataset.alpaca_json);
      folder.file('sharegpt.jsonl', dataset.sharegpt_jsonl);
      folder.file('train_lora.py', dataset.unsloth_train_script_py);
      folder.file('dataset_config.yaml', dataset.axolotl_config_yaml);
      folder.file('Modelfile', dataset.ollama_modelfile);
      folder.file('system_prompt.txt', dataset.system_prompt);
      folder.file('README.md', dataset.dataset_readme_md);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${dataset.subject_name.toLowerCase()}_llm_finetuning_dataset.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex-shrink-0 flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  Completed LLM Fine-Tuning Dataset Hub
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready to Train
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Full multi-format dataset synthesized from {dataset.answered_questions_count} answered cognitive items for {dataset.subject_name}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
            >
              <FileArchive className="w-4 h-4" />
              <span>{isZipping ? 'Packaging ZIP...' : 'Download Full .ZIP Bundle'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dataset Key Metrics Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex-shrink-0 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">SFT Conversations</span>
            <span className="text-lg font-bold font-mono text-indigo-600">{dataset.counts.sft_conversations} pairs</span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">DPO Preference Pairs</span>
            <span className="text-lg font-bold font-mono text-emerald-600">{dataset.counts.dpo_pairs} pairs</span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">Alpaca Instructions</span>
            <span className="text-lg font-bold font-mono text-purple-600">{dataset.counts.alpaca_instructions} samples</span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">Estimated Tokens</span>
            <span className="text-lg font-bold font-mono text-amber-600">~{dataset.counts.total_tokens_estimated.toLocaleString()}</span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">Assessment Coverage</span>
            <span className="text-lg font-bold font-mono text-slate-900">{dataset.completion_rate}% ({dataset.answered_questions_count}/500)</span>
          </div>
        </div>

        {/* Modal Main Area: File Navigation + Code Viewer */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left Navigation: Format Tabs */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 flex-shrink-0 flex flex-col p-3 gap-1 overflow-y-auto">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase px-2 py-1">
              Dataset Formats (JSONL / JSON)
            </span>

            <button
              onClick={() => setActiveTab('chatml')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition flex items-center justify-between ${
                activeTab === 'chatml'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Code2 className="w-3.5 h-3.5" />
                <span className="truncate">training_chatml.jsonl</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${activeTab === 'chatml' ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'}`}>
                {dataset.counts.sft_conversations}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('dpo')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition flex items-center justify-between ${
                activeTab === 'dpo'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate">preferences_dpo.jsonl</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${activeTab === 'dpo' ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'}`}>
                {dataset.counts.dpo_pairs}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('alpaca')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition flex items-center justify-between ${
                activeTab === 'alpaca'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Database className="w-3.5 h-3.5" />
                <span className="truncate">alpaca_instructions.json</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${activeTab === 'alpaca' ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'}`}>
                {dataset.counts.alpaca_instructions}
              </span>
            </button>

            <div className="my-2 border-t border-slate-200/80" />

            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase px-2 py-1">
              Scripts & Configs
            </span>

            <button
              onClick={() => setActiveTab('unsloth_script')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition flex items-center gap-2 ${
                activeTab === 'unsloth_script'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60 font-medium'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate">train_lora.py (Unsloth)</span>
            </button>

            <button
              onClick={() => setActiveTab('axolotl')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition flex items-center gap-2 ${
                activeTab === 'axolotl'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60 font-medium'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="truncate">dataset_config.yaml</span>
            </button>

            <button
              onClick={() => setActiveTab('ollama')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition flex items-center gap-2 ${
                activeTab === 'ollama'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60 font-medium'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span className="truncate">Modelfile (Ollama)</span>
            </button>

            <button
              onClick={() => setActiveTab('readme')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition flex items-center gap-2 ${
                activeTab === 'readme'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60 font-medium'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate">README.md (Guide)</span>
            </button>
          </div>

          {/* Right Area: Code Display & Actions */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-900 text-slate-100 overflow-hidden">
            {/* Viewer Header */}
            <div className="bg-slate-800/80 px-6 py-3 flex-shrink-0 border-b border-slate-700/80 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-white bg-slate-700 px-2 py-0.5 rounded">
                    {active.filename}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono font-medium">
                    {active.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 truncate max-w-2xl">
                  {active.desc}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={handleDownloadActive}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 p-6 overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed select-text whitespace-pre bg-slate-950">
              {active.content || '// No content available'}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-slate-200 px-6 py-3 flex-shrink-0 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready for fine-tuning with Hugging Face, Unsloth, Ollama, Axolotl, and OpenAI.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
