import React, { useState, useRef } from 'react';
import { 
  DecisionResponse, 
  DecisionScenario 
} from '../types';
import { 
  ALL_500_DECISION_SCENARIOS, 
  DECISION_CATEGORIES 
} from '../data/decisionScenarios';
import { 
  generateQuestionsJSON, 
  generateResponsesJSON, 
  downloadFile 
} from '../services/decisionCompiler';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  Search, 
  CheckCircle2, 
  FileCode, 
  Copy, 
  Check, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface ResponseVaultProps {
  responses: Record<string, DecisionResponse>;
  onImportResponses: (imported: Record<string, DecisionResponse>) => void;
  onClearAllResponses: () => void;
}

export const ResponseVault: React.FC<ResponseVaultProps> = ({
  responses,
  onImportResponses,
  onClearAllResponses,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'table' | 'raw_responses' | 'raw_questions'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const responseList: DecisionResponse[] = Object.values(responses || {});
  const scenarioMap = new Map(ALL_500_DECISION_SCENARIOS.map(s => [s.id, s]));

  const filteredResponses: DecisionResponse[] = responseList.filter(r => {
    const s = scenarioMap.get(r.id);
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      (r.reasoning && r.reasoning.toLowerCase().includes(q)) ||
      (r.boundary_condition && r.boundary_condition.toLowerCase().includes(q)) ||
      (s && s.scenario.toLowerCase().includes(q))
    );
  });

  const handleCopyJSON = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === 'object') {
          onImportResponses(parsed);
          alert(`Successfully imported ${Object.keys(parsed).length} decision responses!`);
        }
      } catch (err) {
        alert('Invalid JSON file format. Please upload a valid responses.json file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 text-slate-100 overflow-hidden font-sans">
      
      {/* Top Header Bar */}
      <div className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-950/80 border border-teal-800 text-teal-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Raw Response & Policy Vault
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">
                {responseList.length} Recorded
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Source of truth for psychological decision distillation. Zero preprocessing transformations.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-teal-400" />
            Import responses.json
          </button>

          <button
            onClick={() => downloadFile('responses.json', generateResponsesJSON(responses))}
            className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export responses.json
          </button>

          <button
            onClick={() => downloadFile('questions.json', generateQuestionsJSON(ALL_500_DECISION_SCENARIOS))}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            Export questions.json
          </button>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('table')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeSubTab === 'table' ? 'bg-slate-800 text-teal-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Data Table ({filteredResponses.length})
          </button>
          <button
            onClick={() => setActiveSubTab('raw_responses')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeSubTab === 'raw_responses' ? 'bg-slate-800 text-teal-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            responses.json Preview
          </button>
          <button
            onClick={() => setActiveSubTab('raw_questions')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeSubTab === 'raw_questions' ? 'bg-slate-800 text-teal-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            questions.json (500 Bank)
          </button>
        </div>

        {activeSubTab === 'table' && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter responses..."
              className="bg-slate-800 border border-slate-700 text-xs text-slate-200 pl-8 pr-3 py-1 rounded-lg focus:outline-none focus:border-teal-500 w-48 placeholder-slate-500"
            />
          </div>
        )}
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeSubTab === 'table' && (
          <div className="max-w-6xl mx-auto">
            {filteredResponses.length > 0 ? (
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 shadow-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-mono uppercase text-[11px]">
                    <tr>
                      <th className="p-3 w-28">ID</th>
                      <th className="p-3 w-24">Choice</th>
                      <th className="p-3">Scenario & Raw Reasoning</th>
                      <th className="p-3 w-48">Boundary Condition</th>
                      <th className="p-3 w-24 text-center">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredResponses.map((r) => {
                      const s = scenarioMap.get(r.id);
                      return (
                        <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3 font-mono font-bold text-teal-400 align-top">
                            {r.id}
                          </td>
                          <td className="p-3 align-top">
                            <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                              r.choice === 'A' ? 'bg-teal-950 text-teal-300 border border-teal-800' : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                            }`}>
                              Option {r.choice}
                            </span>
                          </td>
                          <td className="p-3 align-top space-y-1.5">
                            <p className="text-slate-200 font-medium">
                              {s?.scenario || 'Custom scenario'}
                            </p>
                            {r.reasoning ? (
                              <p className="text-slate-400 italic bg-slate-900/60 p-2 rounded border border-slate-800">
                                "{r.reasoning}"
                              </p>
                            ) : (
                              <span className="text-[10px] text-slate-600 font-mono">
                                (No explicit reasoning written)
                              </span>
                            )}
                          </td>
                          <td className="p-3 align-top text-slate-400 text-xs">
                            {r.boundary_condition ? (
                              <span className="text-amber-300/90 bg-amber-950/40 p-1.5 rounded border border-amber-900/40 block">
                                {r.boundary_condition}
                              </span>
                            ) : (
                              <span className="text-slate-600 font-mono text-[10px]">None</span>
                            )}
                          </td>
                          <td className="p-3 align-top text-center font-mono font-bold text-teal-400">
                            {r.confidence || 4} / 5
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-950 border border-slate-800 rounded-2xl">
                <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">No decision responses recorded yet.</p>
                <p className="text-xs text-slate-500 mt-1">Head over to the Decision Arena to answer trade-off scenarios.</p>
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'raw_responses' && (
          <div className="max-w-5xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-slate-400">
                responses.json ({responseList.length} items)
              </span>
              <button
                onClick={() => handleCopyJSON(generateResponsesJSON(responses))}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-md border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy JSON'}
              </button>
            </div>
            <pre className="text-xs font-mono text-teal-300 bg-slate-900 p-4 rounded-xl overflow-x-auto max-h-[500px] border border-slate-800">
              {generateResponsesJSON(responses)}
            </pre>
          </div>
        )}

        {activeSubTab === 'raw_questions' && (
          <div className="max-w-5xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-slate-400">
                questions.json (500 Scenarios Bank)
              </span>
              <button
                onClick={() => handleCopyJSON(generateQuestionsJSON(ALL_500_DECISION_SCENARIOS))}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-md border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy JSON'}
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-300 bg-slate-900 p-4 rounded-xl overflow-x-auto max-h-[500px] border border-slate-800">
              {generateQuestionsJSON(ALL_500_DECISION_SCENARIOS)}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
};
