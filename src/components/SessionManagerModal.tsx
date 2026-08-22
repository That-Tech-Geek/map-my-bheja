import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Layers, 
  Trash2, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SessionRecord } from '../types';

interface SessionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SessionRecord[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onCreateSession: (title?: string, focusTopics?: string[]) => void;
  onDeleteSession: (id: string) => void;
}

export const SessionManagerModal: React.FC<SessionManagerModalProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [focusTopics, setFocusTopics] = useState<string[]>(['Decision Making', 'Engineering Judgment']);
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleAddTopic = () => {
    if (newTopic.trim() && !focusTopics.includes(newTopic.trim())) {
      setFocusTopics([...focusTopics, newTopic.trim()]);
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setFocusTopics(focusTopics.filter(t => t !== topic));
  };

  const handleAutonomousCreate = () => {
    onCreateSession(); // Let system autonomously plan title, topics, and initial probe
    onClose();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSession(newTitle.trim() || undefined, focusTopics.length > 0 ? focusTopics : undefined);
    setIsCreating(false);
    setNewTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Session Management & Multi-Stage Research
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isCreating ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-slate-500 font-semibold">Active & Historical Sessions ({sessions.length})</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAutonomousCreate}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                  title="System autonomously plans the session title, focus, and opening dilemma"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ New Session</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {sessions.map(session => {
                const isActive = session.session_id === activeSessionId;
                return (
                  <div
                    key={session.session_id}
                    onClick={() => {
                      onSelectSession(session.session_id);
                      onClose();
                    }}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-200 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900">
                          {session.title}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-mono bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.2 rounded-full font-semibold">
                            Active Session
                          </span>
                        )}
                      </div>

                      {session.summary && (
                        <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
                          {session.summary}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-500">
                        <span>{session.message_count} messages</span>
                        <span>•</span>
                        <span>Created {new Date(session.created_at).toLocaleDateString()}</span>
                        {session.focus_topics?.map((topic, idx) => (
                          <span key={idx} className="bg-white text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {isActive ? (
                        <span className="text-xs text-indigo-600 font-medium flex items-center gap-1 font-mono">
                          <Check className="w-3.5 h-3.5" />
                          <span>Current</span>
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectSession(session.session_id);
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-md text-xs transition font-mono"
                        >
                          Switch
                        </button>
                      )}

                      {sessions.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete "${session.title}"?`)) {
                              onDeleteSession(session.session_id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100 transition"
                          title="Delete session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                Session Focus / Title:
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder={`Session ${sessions.length + 1}: Resolving Tradeoff Policies & Decision Limits`}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                Target Topics & Cognitive Focus:
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  placeholder="e.g. Risk vs Velocity"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  Add Topic
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {focusTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md text-xs font-mono"
                  >
                    <span>{topic}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(topic)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
              >
                Back to List
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Initialize Research Session</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
