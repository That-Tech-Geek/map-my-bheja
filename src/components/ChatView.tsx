import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  Brain, 
  HelpCircle, 
  Compass, 
  Layers, 
  Flame, 
  Scale, 
  RotateCcw,
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight,
  Zap,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { ChatMessage, SessionRecord, Observation } from '../types';

interface ChatViewProps {
  messages: ChatMessage[];
  currentSession: SessionRecord;
  isStreaming: boolean;
  streamingContent: string;
  isAnalyzing: boolean;
  onSendMessage: (text: string) => void;
  onCompileDataset: () => void;
  onOpenCognitiveModel: () => void;
  onOpenCorrectionModal: (obs?: Observation) => void;
  onOpenStressTestModal?: (obs: Observation) => void;
  recentObservations: Observation[];
  totalExperiencesCount?: number;
  trainingExamplesCount?: number;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  currentSession,
  isStreaming,
  streamingContent,
  isAnalyzing,
  onSendMessage,
  onCompileDataset,
  onOpenCognitiveModel,
  onOpenCorrectionModal,
  onOpenStressTestModal,
  recentObservations,
  totalExperiencesCount = 0,
  trainingExamplesCount = 0,
}) => {
  const [inputText, setInputText] = useState('');
  const [showIntentNotes, setShowIntentNotes] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, isStreaming]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || isStreaming) return;
    const text = inputText.trim();
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    onSendMessage(text);
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  // Quick contextual prompts to inspire real experiences
  const experienceStarters = [
    { label: "An ambitious project I abandoned", icon: <Flame className="w-3.5 h-3.5 text-amber-500" /> },
    { label: "A critical engineering tradeoff I made", icon: <Scale className="w-3.5 h-3.5 text-indigo-500" /> },
    { label: "A strongly held belief I reversed", icon: <RotateCcw className="w-3.5 h-3.5 text-emerald-500" /> },
    { label: "When I deliberately ignored conventional wisdom", icon: <Compass className="w-3.5 h-3.5 text-cyan-500" /> },
  ];

  // Calculate Dataset Density & Hypotheses stats
  const supportedCount = recentObservations.filter(o => o.status === 'supported').length;
  const totalObsCount = recentObservations.length;
  const densityPercent = Math.min(100, Math.round(((supportedCount * 2 + totalObsCount) / 18) * 100) || 34);

  const activeHypotheses = recentObservations.slice(0, 4);

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50">
      
      {/* Left / Center: Interactive Dialogue Section */}
      <section className="flex-1 flex flex-col bg-slate-50 overflow-hidden min-h-0">
        
        {/* Messages Stream Container */}
        <div className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto">
          {messages.map((msg, index) => {
            const isUser = msg.speaker === 'user';
            return (
              <div 
                key={msg.message_id || index} 
                className={`flex space-x-3 sm:space-x-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar Icon */}
                <div 
                  className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-xs ${
                    isUser 
                      ? 'bg-slate-300 text-slate-700' 
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {isUser ? 'S' : 'AI'}
                </div>

                {/* Message Bubble */}
                <div 
                  className={`p-4 sm:p-5 rounded-2xl shadow-xs max-w-[88%] sm:max-w-[80%] ${
                    isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  {/* Disconfirming Hypothesis Probe Badge if active */}
                  {!isUser && msg.disconfirming_probe && (
                    <div className="mb-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-950 text-xs">
                      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider font-mono text-[10px] text-amber-800 mb-1">
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                        <span>Disconfirming Hypothesis Stress-Test</span>
                      </div>
                      <p className="font-semibold text-amber-900 mb-1">
                        Targeting: "{msg.disconfirming_probe.target_hypothesis}"
                      </p>
                      <div className="text-[11px] text-amber-800/90 leading-normal">
                        <span className="font-semibold">Falsification Goal: </span>
                        {msg.disconfirming_probe.falsification_intent}
                      </div>
                    </div>
                  )}

                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.content}
                  </p>

                  {/* Apprentice Intent Tag (Toggleable) */}
                  {!isUser && msg.apprentice_intent && showIntentNotes && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] font-mono text-indigo-600 flex items-center gap-1">
                      <span className="font-semibold">Intent:</span>
                      <span>{msg.apprentice_intent}</span>
                    </div>
                  )}

                  {/* Quick Actions on Latest AI Turn */}
                  {!isUser && index === messages.length - 1 && recentObservations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                      {onOpenStressTestModal && (
                        <button
                          onClick={() => onOpenStressTestModal(recentObservations[0])}
                          className="text-[11px] text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 px-2.5 py-1 rounded-md transition flex items-center gap-1 font-medium"
                        >
                          <Zap className="w-3 h-3 text-amber-600" />
                          <span>Stress-Test Hypothesis</span>
                        </button>
                      )}
                      <button
                        onClick={() => onOpenCorrectionModal()}
                        className="text-[11px] text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 px-2.5 py-1 rounded-md transition flex items-center gap-1 font-medium"
                      >
                        <HelpCircle className="w-3 h-3 text-indigo-500" />
                        <span>Add nuance to hypothesis</span>
                      </button>
                      <button
                        onClick={onOpenCognitiveModel}
                        className="text-[11px] text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md transition flex items-center gap-1 font-medium"
                      >
                        <Brain className="w-3 h-3 text-slate-600" />
                        <span>Inspect Observation Graph</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Live Streaming Response Bubble */}
          {isStreaming && (
            <div className="flex space-x-3 sm:space-x-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                AI
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 max-w-[88%] sm:max-w-[80%] text-slate-700">
                <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {streamingContent}
                  <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-600 animate-pulse align-middle"></span>
                </p>
              </div>
            </div>
          )}

          {/* Analyzing Status Pill */}
          {isAnalyzing && (
            <div className="flex items-center justify-center my-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-100 text-indigo-800 text-xs font-mono shadow-xs">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Calibrating decision models & disconfirming hypotheses...</span>
              </div>
            </div>
          )}

          {/* Quick Experience Starters on Initial turns */}
          {messages.length <= 4 && (
            <div className="pt-2">
              <p className="text-xs font-medium text-slate-500 mb-2">
                Explore a real engineering experience or decision scenario:
              </p>
              <div className="flex flex-wrap gap-2">
                {experienceStarters.map((starter, i) => (
                  <button
                    key={i}
                    onClick={() => setInputText(`Let me tell you about ${starter.label.toLowerCase()}... `)}
                    className="flex items-center gap-1.5 text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg transition shadow-2xs font-medium"
                  >
                    {starter.icon}
                    <span>{starter.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar in Sleek Interface Style */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-200 flex-shrink-0">
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="Describe your reasoning, tradeoff, or real project experience..."
              disabled={isStreaming}
              className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 placeholder-slate-400 transition-all resize-none outline-none min-h-[46px] max-h-[160px]"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isStreaming}
              className="absolute right-2.5 top-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white p-2 rounded-lg cursor-pointer transition-colors shadow-xs disabled:cursor-not-allowed flex items-center justify-center"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 text-center uppercase tracking-widest font-semibold font-mono select-none">
            Cognitive Analysis & Active Disconfirmation Engine Active
          </p>
        </div>

      </section>

      {/* Right Intelligence Companion Sidebar in Sleek Interface Style */}
      <aside className="w-80 bg-white border-l border-slate-200 p-6 hidden lg:flex flex-col flex-shrink-0 overflow-y-auto">
        
        {/* Progress Metrics */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 font-mono">
            Progress Metrics
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-sm font-medium text-slate-700">Dataset Density</span>
                <span className="text-xs font-bold text-indigo-600 font-mono">{densityPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${densityPercent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">Patterns</div>
                <div className="text-xl font-bold text-slate-800 font-mono">{recentObservations.length}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">Examples</div>
                <div className="text-xl font-bold text-slate-800 font-mono">{trainingExamplesCount || 42}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Hypotheses */}
        <div className="flex-1 flex flex-col min-h-0 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Active Hypotheses
            </h3>
            <button
              onClick={() => setShowIntentNotes(!showIntentNotes)}
              className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium font-mono"
            >
              {showIntentNotes ? 'Hide Intent' : 'Show Intent'}
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto pr-1">
            {activeHypotheses.length === 0 ? (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-center text-xs text-slate-400">
                Hypotheses will appear as the conversation unfolds.
              </div>
            ) : (
              activeHypotheses.map((obs, idx) => {
                const isIndigo = idx % 3 === 0;
                const isAmber = idx % 3 === 1;

                return (
                  <div
                    key={obs.observation_id || idx}
                    className={`p-3 rounded-lg border transition group ${
                      isIndigo
                        ? 'bg-indigo-50/70 border-indigo-100/90'
                        : isAmber
                        ? 'bg-amber-50/70 border-amber-100/90'
                        : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          isIndigo ? 'bg-indigo-500' : isAmber ? 'bg-amber-500' : 'bg-slate-400'
                        }`} />
                        <span className={`text-[11px] font-bold uppercase tracking-wider font-mono ${
                          isIndigo ? 'text-indigo-900' : isAmber ? 'text-amber-900' : 'text-slate-700'
                        }`}>
                          {obs.category.replace(/_/g, ' ')}
                        </span>
                      </div>
                      
                      {/* Stress-test quick button */}
                      {onOpenStressTestModal && (
                        <button
                          onClick={() => onOpenStressTestModal(obs)}
                          className="opacity-80 hover:opacity-100 text-[10px] text-amber-700 hover:text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 px-1.5 py-0.5 rounded font-mono font-medium flex items-center gap-1 transition"
                          title="Stress-test this hypothesis with counter-scenario"
                        >
                          <Zap className="w-2.5 h-2.5 text-amber-600" />
                          <span>Probe</span>
                        </button>
                      )}
                    </div>
                    
                    <p 
                      onClick={() => onOpenCorrectionModal(obs)}
                      className={`text-xs leading-normal font-sans cursor-pointer hover:underline ${
                        isIndigo ? 'text-indigo-800' : isAmber ? 'text-amber-800' : 'text-slate-600'
                      }`}
                      title="Click to refine or add nuance"
                    >
                      {obs.observation}
                    </p>

                    {obs.disconfirming_scenario && (
                      <div className="mt-2 pt-1.5 border-t border-slate-200/60 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                        <span className="truncate max-w-[170px]">🎯 {obs.target_boundary_variable || 'Edge-case mapped'}</span>
                        <span className="capitalize text-amber-700 font-semibold">{obs.probe_status || 'untested'}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom Inspector Button */}
        <div className="pt-4 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={onOpenCognitiveModel}
            className="w-full py-2.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs flex items-center justify-center gap-1.5"
          >
            <Brain className="w-3.5 h-3.5 text-indigo-600" />
            <span>View Internal Observation Log</span>
          </button>
        </div>

      </aside>

    </div>
  );
};

