import React, { useState } from 'react';
import { Copy, Check, Search, FileText, Cpu, Hash } from 'lucide-react';

export default function ExtractedTextViewer({ text, extractionMethod, wordCount, characterCount }) {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = text ? text.split('\n') : [];
  const filteredLines = lines.filter((line) =>
    searchTerm ? line.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="glass-card p-4 rounded-xl border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-black border border-zinc-700 flex items-center justify-center text-white">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Extraction Engine</h4>
            <p className="text-xs font-semibold font-mono text-white">{extractionMethod || 'Text Parser'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-black border border-zinc-800 text-[11px] font-mono font-medium text-zinc-300 flex items-center gap-1">
            <Hash className="w-3 h-3 text-zinc-500" /> {wordCount} Words
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-black border border-zinc-800 text-[11px] font-mono font-medium text-zinc-300 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-zinc-500" /> {characterCount} Characters
          </span>

          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              copied
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy All'}</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
        <input
          type="text"
          placeholder="Filter extracted text lines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-400"
        />
      </div>

      {/* Text Display Code Box */}
      <div className="bg-black rounded-2xl border border-zinc-800 p-4 max-h-[500px] overflow-y-auto font-mono text-xs text-zinc-300 leading-relaxed shadow-inner">
        {filteredLines.length > 0 ? (
          filteredLines.map((line, idx) => (
            <div key={idx} className="flex gap-4 hover:bg-zinc-900/60 px-2 py-0.5 rounded transition-colors">
              <span className="text-zinc-600 select-none text-[11px] w-8 text-right shrink-0">{idx + 1}</span>
              <span className="whitespace-pre-wrap flex-1">{line || ' '}</span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-zinc-500 italic">No matching text lines found.</div>
        )}
      </div>
    </div>
  );
}
