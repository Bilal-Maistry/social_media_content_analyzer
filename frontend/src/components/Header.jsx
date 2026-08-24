import React from 'react';
import { Briefcase, Camera, Send, Music, Layers } from 'lucide-react';

const platforms = [
  { id: 'LinkedIn', label: 'LinkedIn', icon: Briefcase },
  { id: 'Instagram', label: 'Instagram', icon: Camera },
  { id: 'X/Twitter', label: 'X (Twitter)', icon: Send },
  { id: 'TikTok', label: 'TikTok', icon: Music },
  { id: 'General', label: 'Multi-Platform', icon: Layers },
];

export default function Header({ selectedPlatform, setSelectedPlatform }) {
  return (
    <header className="w-full glass-panel sticky top-0 z-50 border-b border-zinc-800 px-4 lg:px-8 py-3.5 shadow-2xl backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Clean Minimalist Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-white">
            Social Media Content Analyzer
          </h1>
        </div>

        {/* Target Platform Selector */}
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 shadow-inner overflow-x-auto max-w-full">
          <span className="text-xs font-medium text-zinc-400 px-2.5 hidden sm:inline">Platform:</span>
          {platforms.map((p) => {
            const Icon = p.icon;
            const isSelected = selectedPlatform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-white text-black font-semibold shadow-sm scale-[1.02]'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-zinc-400'}`} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
