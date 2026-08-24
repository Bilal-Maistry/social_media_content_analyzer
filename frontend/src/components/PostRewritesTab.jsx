import React, { useState } from 'react';
import { Copy, Check, Sparkles, Flame, Briefcase, Zap } from 'lucide-react';

export default function PostRewritesTab({ rewrites, platform }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getStyleIcon = (style) => {
    if (!style) return <Zap className="w-4 h-4 text-white" />;
    const lower = style.toLowerCase();
    if (lower.includes('viral')) return <Flame className="w-4 h-4 text-white" />;
    if (lower.includes('professional') || lower.includes('b2b')) return <Briefcase className="w-4 h-4 text-white" />;
    return <Zap className="w-4 h-4 text-white" />;
  };

  if (!rewrites || rewrites.length === 0) {
    return (
      <div className="glass-card p-8 text-center rounded-2xl text-zinc-400 text-sm border border-zinc-800">
        No rewrites available for this content.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" /> AI-Generated Post Variations
          </h3>
          <p className="text-xs text-zinc-400">Optimized rewrites tailored for high engagement on {platform || 'social platforms'}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {rewrites.map((rewrite, index) => {
          const isCopied = copiedIndex === index;
          return (
            <div key={index} className="glass-card p-6 rounded-2xl border border-zinc-800 hover:border-zinc-500 transition-all duration-200">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-black border border-zinc-700 flex items-center justify-center">
                    {getStyleIcon(rewrite.style)}
                  </div>
                  <h4 className="text-sm font-bold text-white">{rewrite.style}</h4>
                </div>

                <button
                  onClick={() => handleCopy(rewrite.content, index)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isCopied
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-black" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Rewrite
                    </>
                  )}
                </button>
              </div>

              {/* Formatted Post Content */}
              <div className="bg-black p-4 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-200 whitespace-pre-wrap leading-relaxed">
                {rewrite.content}
              </div>

              {/* Rationale explanation note */}
              {rewrite.explanation && (
                <div className="mt-3 text-[11px] text-zinc-400 bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 flex items-center gap-2">
                  <span className="font-semibold text-white">Why this works:</span>
                  <span>{rewrite.explanation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
