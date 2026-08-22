import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Activity, 
  Heart, 
  Zap, 
  Layers, 
  Filter, 
  Info, 
  TrendingUp, 
  Sparkles, 
  Eye, 
  Quote, 
  ChevronRight,
  ShieldAlert,
  Compass,
  Gauge,
  SlidersHorizontal,
  Clock
} from 'lucide-react';
import { SessionSentimentProfile, SessionSentimentPoint, DominantEmotion } from '../types';
import { EMOTION_CONFIG, INITIAL_SENTIMENT_SESSIONS } from '../data/sentimentData';

interface SentimentHeatmapProps {
  sessions?: SessionSentimentProfile[];
  userName?: string;
}

type HeatmapMetricMode = 'intensity' | 'valence' | 'emotion' | 'stress';

export const SentimentHeatmap: React.FC<SentimentHeatmapProps> = ({
  sessions = INITIAL_SENTIMENT_SESSIONS,
  userName = 'Sambit'
}) => {
  const [metricMode, setMetricMode] = useState<HeatmapMetricMode>('intensity');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('all');
  const [hoveredPoint, setHoveredPoint] = useState<{
    point: SessionSentimentPoint;
    sessionTitle: string;
    sessionNumber: number;
  } | null>(null);
  const [pinnedPoint, setPinnedPoint] = useState<{
    point: SessionSentimentPoint;
    sessionTitle: string;
    sessionNumber: number;
    sessionDate: string;
  } | null>(null);
  const [intensityFilter, setIntensityFilter] = useState<number>(0);

  // Active sessions after filtering
  const activeSessions = useMemo(() => {
    if (selectedSessionId === 'all') return sessions;
    return sessions.filter(s => s.session_id === selectedSessionId);
  }, [sessions, selectedSessionId]);

  // Max timeline length in minutes (find maximum across all sessions)
  const timeBuckets = useMemo(() => [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60], []);

  // Compute aggregate statistics
  const stats = useMemo(() => {
    let totalPoints = 0;
    let sumIntensity = 0;
    let peakIntensity = 0;
    let peakPoint: { point: SessionSentimentPoint; session: SessionSentimentProfile } | null = null;
    let sumComposure = 0;
    const emotionCounts: Record<DominantEmotion, number> = {
      conviction: 0,
      pragmatic_calm: 0,
      constructive_frustration: 0,
      deep_curiosity: 0,
      hype_skepticism: 0,
      crisis_focus: 0,
      epistemic_doubt: 0,
      craft_pride: 0
    };

    sessions.forEach(sess => {
      sumComposure += sess.composure_score;
      sess.time_points.forEach(pt => {
        totalPoints++;
        sumIntensity += pt.intensity;
        if (pt.intensity > peakIntensity) {
          peakIntensity = pt.intensity;
          peakPoint = { point: pt, session: sess };
        }
        if (emotionCounts[pt.dominant_emotion] !== undefined) {
          emotionCounts[pt.dominant_emotion]++;
        }
      });
    });

    const avgIntensity = totalPoints > 0 ? Math.round(sumIntensity / totalPoints) : 0;
    const avgComposure = sessions.length > 0 ? Math.round(sumComposure / sessions.length) : 0;

    return {
      totalPoints,
      avgIntensity,
      peakIntensity,
      peakPoint,
      avgComposure,
      emotionCounts,
      sessionCount: sessions.length
    };
  }, [sessions]);

  // Helper to get color style based on intensity (0 - 100)
  const getIntensityColor = (intensity: number) => {
    if (intensity >= 85) return 'bg-rose-600 text-white shadow-xs';
    if (intensity >= 70) return 'bg-amber-500 text-white';
    if (intensity >= 55) return 'bg-indigo-600 text-white';
    if (intensity >= 40) return 'bg-emerald-600 text-white';
    return 'bg-slate-200 text-slate-700';
  };

  // Helper for valence color (-1.0 to +1.0)
  const getValenceColor = (valence: number) => {
    if (valence >= 0.5) return 'bg-emerald-600 text-white';
    if (valence >= 0.1) return 'bg-teal-500 text-white';
    if (valence >= -0.1) return 'bg-slate-400 text-white';
    if (valence >= -0.5) return 'bg-amber-500 text-white';
    return 'bg-rose-600 text-white';
  };

  // Helper for stress color (0 - 100)
  const getStressColor = (stress: number) => {
    if (stress >= 70) return 'bg-rose-700 text-white';
    if (stress >= 50) return 'bg-orange-500 text-white';
    if (stress >= 30) return 'bg-amber-400 text-slate-900';
    return 'bg-slate-200 text-slate-700';
  };

  // Helper for cell rendering based on current metric mode
  const getCellVisual = (pt: SessionSentimentPoint) => {
    switch (metricMode) {
      case 'intensity':
        return {
          bgColor: getIntensityColor(pt.intensity),
          label: `${pt.intensity}%`
        };
      case 'valence':
        return {
          bgColor: getValenceColor(pt.valence),
          label: pt.valence > 0 ? `+${pt.valence.toFixed(1)}` : pt.valence.toFixed(1)
        };
      case 'emotion': {
        const conf = EMOTION_CONFIG[pt.dominant_emotion];
        return {
          bgColor: conf ? conf.bgColor + ' border-2 ' + conf.borderColor : 'bg-indigo-100',
          label: pt.dominant_emotion.substring(0, 4).toUpperCase(),
          customColor: conf?.color
        };
      }
      case 'stress':
        return {
          bgColor: getStressColor(pt.stress_index),
          label: `${pt.stress_index}`
        };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Cognitive Sentiment & Emotional Response Intensity Heatmap</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Real-time Empirical Telemetry
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Visualizing {userName}'s affective intensity, autonomic composure, and cognitive arousal over elapsed session timelines.
              </p>
            </div>
          </div>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setMetricMode('intensity')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                metricMode === 'intensity'
                  ? 'bg-white text-rose-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Intensity</span>
            </button>
            <button
              onClick={() => setMetricMode('valence')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                metricMode === 'valence'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Valence</span>
            </button>
            <button
              onClick={() => setMetricMode('emotion')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                metricMode === 'emotion'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Emotions</span>
            </button>
            <button
              onClick={() => setMetricMode('stress')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                metricMode === 'stress'
                  ? 'bg-white text-amber-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Stress Index</span>
            </button>
          </div>

          {/* Session Selector */}
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="text-xs bg-white border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
          >
            <option value="all">All Sessions ({sessions.length})</option>
            {sessions.map(s => (
              <option key={s.session_id} value={s.session_id}>
                Session {s.session_number}: {s.session_title.substring(0, 24)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Telemetry Metric Ribbons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 mb-1 font-medium">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>Mean Response Intensity</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{stats.avgIntensity}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Weighted cognitive engagement</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 mb-1 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Peak Arousal Stimulus</span>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-700">{stats.peakIntensity}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {stats.peakPoint ? `Session 0${stats.peakPoint.session.session_number} Incident Triage` : 'High friction'}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 mb-1 font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
            <span>Epistemic Composure</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">{stats.avgComposure}/100</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Adrenaline-tempered discipline</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 mb-1 font-medium">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sampled Timeline Points</span>
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-700">{stats.totalPoints}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Across {stats.sessionCount} sessions</div>
        </div>

      </div>

      {/* Main Heatmap Matrix Container */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
        
        {/* Heatmap Legend Bar */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-500 font-semibold uppercase">Color Scale:</span>
            {metricMode === 'intensity' && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700">0-39% Mild</span>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white">40-54% Moderate</span>
                <span className="px-2 py-0.5 rounded bg-indigo-600 text-white">55-69% High</span>
                <span className="px-2 py-0.5 rounded bg-amber-500 text-white">70-84% Intense</span>
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold">85%+ Peak</span>
              </div>
            )}
            {metricMode === 'valence' && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white">Critical / Friction</span>
                <span className="px-2 py-0.5 rounded bg-slate-400 text-white">Neutral / Objective</span>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white">Constructive / High Flow</span>
              </div>
            )}
            {metricMode === 'emotion' && (
              <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono">
                {Object.entries(EMOTION_CONFIG).map(([key, conf]) => (
                  <span key={key} className={`px-1.5 py-0.5 rounded border ${conf.badgeClass}`}>
                    {conf.label}
                  </span>
                ))}
              </div>
            )}
            {metricMode === 'stress' && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700">0-29 Baseline</span>
                <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-900">30-49 Elevated</span>
                <span className="px-2 py-0.5 rounded bg-orange-500 text-white">50-69 High Load</span>
                <span className="px-2 py-0.5 rounded bg-rose-700 text-white font-bold">70+ Emergency</span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>Click any cell to lock deep cognitive inspector</span>
          </div>
        </div>

        {/* Heatmap Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/80 text-[11px] font-mono text-slate-600 uppercase">
                <th className="py-2.5 px-4 font-semibold w-72 sticky left-0 bg-slate-100/95 z-10 border-r border-slate-200 shadow-2xs">
                  Session & Focus Domain
                </th>
                <th className="py-2.5 px-2 font-semibold text-center w-20 border-r border-slate-200">
                  Peak
                </th>
                {timeBuckets.map(min => (
                  <th key={min} className="py-2.5 px-1.5 font-semibold text-center w-14">
                    {min}m
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 bg-white text-xs">
              {activeSessions.map((session) => {
                // Map points by minute offset
                const pointMap = new Map<number, SessionSentimentPoint>();
                session.time_points.forEach(pt => {
                  pointMap.set(pt.time_offset_min, pt);
                });

                return (
                  <tr key={session.session_id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Session Label */}
                    <td className="py-3 px-4 sticky left-0 bg-white z-10 border-r border-slate-200 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-slate-900 truncate max-w-[190px]" title={session.session_title}>
                          <span className="font-mono text-indigo-600 mr-1.5 text-[11px]">
                            S0{session.session_number}
                          </span>
                          {session.session_title}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                        <span>{session.date}</span>
                        <span>•</span>
                        <span>{session.duration_minutes}m duration</span>
                        <span>•</span>
                        <span className="text-slate-600 font-medium">{session.dominant_sentiment}</span>
                      </div>
                    </td>

                    {/* Session Peak Metric */}
                    <td className="py-3 px-2 text-center border-r border-slate-200 font-mono text-xs">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200 text-[11px]">
                        {session.peak_intensity}%
                      </span>
                    </td>

                    {/* Timeline Heatmap Cells */}
                    {timeBuckets.map(min => {
                      const pt = pointMap.get(min);

                      if (!pt) {
                        return (
                          <td key={min} className="py-2 px-1 text-center">
                            <div className="w-10 h-9 mx-auto rounded-lg bg-slate-100/60 border border-dashed border-slate-200 flex items-center justify-center text-slate-300 text-[10px] font-mono">
                              —
                            </div>
                          </td>
                        );
                      }

                      const visual = getCellVisual(pt);
                      const isHovered = hoveredPoint?.point.point_id === pt.point_id;
                      const isPinned = pinnedPoint?.point.point_id === pt.point_id;

                      return (
                        <td key={min} className="py-2 px-1 text-center">
                          <button
                            onClick={() => setPinnedPoint({
                              point: pt,
                              sessionTitle: session.session_title,
                              sessionNumber: session.session_number,
                              sessionDate: session.date
                            })}
                            onMouseEnter={() => setHoveredPoint({
                              point: pt,
                              sessionTitle: session.session_title,
                              sessionNumber: session.session_number
                            })}
                            onMouseLeave={() => setHoveredPoint(null)}
                            className={`w-10 h-9 mx-auto rounded-lg transition-all flex flex-col items-center justify-center font-mono text-[10px] font-bold cursor-pointer relative group ${
                              visual.bgColor
                            } ${
                              isPinned ? 'ring-2 ring-indigo-500 scale-105 shadow-md z-20' : 
                              isHovered ? 'scale-105 shadow-md z-10' : 'hover:scale-102'
                            }`}
                            style={visual.customColor ? { color: visual.customColor } : undefined}
                          >
                            <span>{visual.label}</span>

                            {/* Floating Micro Tooltip */}
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-50 pointer-events-none">
                              <div className="bg-slate-900 text-white rounded-lg p-2.5 text-left text-xs shadow-xl border border-slate-700 w-56">
                                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                                  <span>{pt.timestamp} (+{pt.time_offset_min}m)</span>
                                  <span className="text-rose-400 font-bold">{pt.intensity}% Intensity</span>
                                </div>
                                <div className="font-semibold text-white text-[11px] line-clamp-2 mb-1.5">
                                  {pt.topic_stimulus}
                                </div>
                                <div className="text-[10px] text-slate-300 italic line-clamp-2 border-l-2 border-indigo-400 pl-1.5">
                                  "{pt.quote_excerpt}"
                                </div>
                              </div>
                            </div>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Detail Drawer: Focused Stimulus & Moment Inspector */}
      {(pinnedPoint || hoveredPoint) && (
        <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md space-y-3 transition-all animate-fadeIn">
          
          {(() => {
            const active = pinnedPoint || hoveredPoint!;
            const pt = active.point;
            const emo = EMOTION_CONFIG[pt.dominant_emotion] || EMOTION_CONFIG.conviction;

            return (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-semibold">
                      Session 0{active.sessionNumber} • {active.sessionTitle}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Timestamp: {pt.timestamp} (+{pt.time_offset_min}m mark)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${emo.badgeClass}`}>
                      {emo.label}
                    </span>
                    {pinnedPoint && (
                      <button
                        onClick={() => setPinnedPoint(null)}
                        className="text-xs text-slate-400 hover:text-white font-mono underline ml-2"
                      >
                        Clear Selection
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
                  
                  {/* Left Column: Verbatim Quote & Stimulus */}
                  <div className="lg:col-span-8 space-y-2.5">
                    <div>
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                        Topic Stimulus / Trigger:
                      </div>
                      <div className="text-sm font-medium text-slate-200">
                        {pt.topic_stimulus}
                      </div>
                    </div>

                    <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700/80">
                      <div className="text-[11px] font-mono text-indigo-400 mb-1 flex items-center gap-1.5 font-semibold">
                        <Quote className="w-3.5 h-3.5" />
                        <span>Verbatim Empirical Response:</span>
                      </div>
                      <blockquote className="text-xs text-slate-100 italic leading-relaxed">
                        "{pt.quote_excerpt}"
                      </blockquote>
                    </div>
                  </div>

                  {/* Right Column: Autonomic & Cognitive Metrics */}
                  <div className="lg:col-span-4 bg-slate-800/50 rounded-lg p-3.5 border border-slate-700/50 space-y-2.5 text-xs font-mono">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-700">
                      <span className="text-slate-400">Emotional Intensity:</span>
                      <span className="font-bold text-rose-400">{pt.intensity}%</span>
                    </div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-700">
                      <span className="text-slate-400">Valence Score:</span>
                      <span className={`font-bold ${pt.valence >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {pt.valence > 0 ? `+${pt.valence}` : pt.valence}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-700">
                      <span className="text-slate-400">Stress Index:</span>
                      <span className="font-bold text-amber-400">{pt.stress_index}/100</span>
                    </div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-700">
                      <span className="text-slate-400">Speech Cadence:</span>
                      <span className="text-slate-200">{pt.speech_cadence_wpm || 145} WPM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Cognitive State:</span>
                      <span className="text-indigo-300 font-sans font-medium text-[11px]">
                        {pt.cognitive_state_label}
                      </span>
                    </div>
                  </div>

                </div>
              </>
            );
          })()}

        </div>
      )}

      {/* Multi-Session Emotional Trajectory Curves */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
              Cross-Session Emotional Trajectory Comparison
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Elapsed Timeline (Minutes) vs Affective Intensity (%)
          </span>
        </div>

        {/* SVG Multi-Line Chart */}
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-inner">
          <div className="h-44 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 160" preserveAspectRatio="none">
              {/* Background Grid Lines */}
              <line x1="0" y1="20" x2="700" y2="20" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />
              <line x1="0" y1="60" x2="700" y2="60" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />
              <line x1="0" y1="100" x2="700" y2="100" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />
              <line x1="0" y1="140" x2="700" y2="140" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />

              {/* Intensity Y-Axis Labels */}
              <text x="5" y="18" fill="#64748b" fontSize="9" fontFamily="monospace">90% Peak</text>
              <text x="5" y="58" fill="#64748b" fontSize="9" fontFamily="monospace">70% Intense</text>
              <text x="5" y="98" fill="#64748b" fontSize="9" fontFamily="monospace">50% Moderate</text>
              <text x="5" y="138" fill="#64748b" fontSize="9" fontFamily="monospace">30% Mild</text>

              {/* Render Session Curves */}
              {activeSessions.map((session, sIdx) => {
                const colors = ['#f43f5e', '#6366f1', '#10b981', '#f59e0b', '#06b6d4'];
                const strokeColor = colors[sIdx % colors.length];

                // Build points: map minutes (5 to 60) to x (30 to 690) and intensity (0 to 100) to y (150 to 10)
                const sortedPoints = [...session.time_points].sort((a, b) => a.time_offset_min - b.time_offset_min);
                if (sortedPoints.length === 0) return null;

                const pathData = sortedPoints.map((pt, pIdx) => {
                  const x = 40 + ((pt.time_offset_min - 5) / 55) * 650;
                  const y = 150 - (pt.intensity / 100) * 140;
                  return `${pIdx === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ');

                return (
                  <g key={session.session_id}>
                    <path
                      d={pathData}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={selectedSessionId === session.session_id ? 3 : 2}
                      strokeOpacity={selectedSessionId === 'all' || selectedSessionId === session.session_id ? 0.9 : 0.25}
                    />
                    {sortedPoints.map(pt => {
                      const x = 40 + ((pt.time_offset_min - 5) / 55) * 650;
                      const y = 150 - (pt.intensity / 100) * 140;
                      return (
                        <circle
                          key={pt.point_id}
                          cx={x}
                          cy={y}
                          r={3.5}
                          fill={strokeColor}
                          className="hover:r-5 transition-all cursor-pointer"
                          onClick={() => setPinnedPoint({
                            point: pt,
                            sessionTitle: session.session_title,
                            sessionNumber: session.session_number,
                            sessionDate: session.date
                          })}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Timeline Bottom Axis Labels */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 px-6">
            <span>5m (Opening)</span>
            <span>15m (First Principles)</span>
            <span>30m (Trade-off Clash)</span>
            <span>45m (Resolution & Synthesis)</span>
            <span>60m (Conclusion)</span>
          </div>

          {/* Legend Chips */}
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-800 text-xs font-mono">
            {activeSessions.map((session, sIdx) => {
              const colors = ['#f43f5e', '#6366f1', '#10b981', '#f59e0b', '#06b6d4'];
              const color = colors[sIdx % colors.length];
              return (
                <button
                  key={session.session_id}
                  onClick={() => setSelectedSessionId(selectedSessionId === session.session_id ? 'all' : session.session_id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                    selectedSessionId === session.session_id 
                      ? 'bg-slate-800 text-white ring-1 ring-slate-600' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                  <span>S0{session.session_number}: {session.session_title.substring(0, 20)}...</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};
