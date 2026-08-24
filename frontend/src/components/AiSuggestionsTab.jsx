import React from 'react';
import { Zap, CheckCircle, AlertTriangle, Clock, Target, ArrowUpRight, Sparkles } from 'lucide-react';

export default function AiSuggestionsTab({ data }) {
  if (!data || !data.aiAnalysis) return null;

  const { hookAnalysis, keyStrengths, improvementAreas, bestPostingTimes, sentiment, readabilityGrade } = data.aiAnalysis;

  return (
    <div className="space-y-6">
      {/* 1. Opening Hook Quality Assessment */}
      <div className="glass-card p-6 rounded-2xl border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-zinc-700 flex items-center justify-center text-white">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Opening Hook Analysis <span className="text-xs font-normal text-zinc-400">(First 1-2 Lines)</span>
              </h3>
              <p className="text-xs text-zinc-400">Evaluates scroll-stopping impact and curiosity gap.</p>
            </div>
          </div>

          <div className="px-4 py-1.5 rounded-full border border-zinc-700 bg-zinc-900 text-xs font-mono font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hook Score: {hookAnalysis?.score || 60}/100</span>
          </div>
        </div>

        {/* Hook text callout */}
        <div className="bg-black p-4 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-200 mb-4">
          <span className="text-zinc-500 font-sans block text-[10px] uppercase font-bold tracking-wider mb-1">Detected Opening Line:</span>
          "{hookAnalysis?.hookText || 'No hook line detected'}"
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="font-semibold text-zinc-300 block mb-1">Diagnostic Evaluation:</span>
            <p className="text-zinc-400 leading-relaxed">{hookAnalysis?.evaluation}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-700">
            <span className="font-semibold text-white block mb-1">Actionable Fix:</span>
            <p className="text-zinc-300 leading-relaxed">{hookAnalysis?.recommendation}</p>
          </div>
        </div>
      </div>

      {/* 2. Key Strengths & Improvement Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="glass-card p-6 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-2.5 mb-4 text-white">
            <CheckCircle className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">Key Post Strengths</h3>
          </div>
          <ul className="space-y-3">
            {keyStrengths?.map((strength, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs text-zinc-300 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                <span className="leading-relaxed">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Opportunities */}
        <div className="glass-card p-6 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-2.5 mb-4 text-zinc-300">
            <AlertTriangle className="w-5 h-5 text-white" />
            <h3 className="text-base font-bold text-white">Engagement Recommendations</h3>
          </div>
          <ul className="space-y-3">
            {improvementAreas?.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs text-zinc-300 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. Platform Timing & Readability Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-zinc-300 mb-2">
            <Clock className="w-4 h-4 text-white" />
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Best Posting Times</h4>
          </div>
          <div className="space-y-1 mt-2">
            {bestPostingTimes?.map((time, idx) => (
              <p key={idx} className="text-xs font-medium text-zinc-300 bg-black px-2.5 py-1 rounded-md border border-zinc-800">
                {time}
              </p>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-zinc-300 mb-2">
            <Target className="w-4 h-4 text-white" />
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Tone & Emotion</h4>
          </div>
          <p className="text-sm font-semibold text-white bg-black p-3 rounded-xl border border-zinc-800 mt-2">
            {sentiment || 'Informative'}
          </p>
        </div>

        <div className="glass-card p-5 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-zinc-300 mb-2">
            <ArrowUpRight className="w-4 h-4 text-white" />
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Readability Grade</h4>
          </div>
          <p className="text-xs text-zinc-300 bg-black p-3 rounded-xl border border-zinc-800 leading-relaxed mt-2">
            {readabilityGrade}
          </p>
        </div>
      </div>
    </div>
  );
}
