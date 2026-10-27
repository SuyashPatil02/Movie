import React from 'react';
import { Sparkles, CheckCircle2, Tag, Clapperboard, Award } from 'lucide-react';

export default function ExplanationBadge({ score, reason, sharedGenres = [], sharedKeywords = [] }) {
  // Normalize score between 0 and 1
  const displayScore = typeof score === 'number' ? score.toFixed(3) : '0.000';
  const percentage = Math.min(100, Math.round(Number(score || 0) * 100));

  return (
    <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-indigo-500/20 text-xs space-y-2">
      {/* Metric Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-indigo-300 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Why this was recommended:</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400">Cosine Sim:</span>
          <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {displayScore}
          </span>
        </div>
      </div>

      {/* Similarity Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${Math.max(15, percentage)}%` }}
        />
      </div>

      {/* Rationale explanation */}
      {reason && (
        <p className="text-slate-300 leading-relaxed font-normal">
          {reason}
        </p>
      )}

      {/* Evidence tags */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {sharedGenres.map((g) => (
          <span
            key={g}
            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 text-[11px]"
          >
            <CheckCircle2 className="w-2.5 h-2.5 text-indigo-400" />
            <span>{g}</span>
          </span>
        ))}
        {sharedKeywords.map((k) => (
          <span
            key={k}
            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50 text-[11px]"
          >
            <Tag className="w-2.5 h-2.5 text-slate-400" />
            <span>{k}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
