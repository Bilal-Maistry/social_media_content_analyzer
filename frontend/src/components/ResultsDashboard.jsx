import React, { useState } from 'react';
import { Download, RotateCcw, FileText, Sparkles, CheckCircle2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export default function ResultsDashboard({ data, onReset }) {
  const [showRawText, setShowRawText] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const { fileName, fileType, fileSize, extractedText, wordCount, characterCount, extractionMethod, platform, aiAnalysis } = data;
  const summary = aiAnalysis?.summary || 'No summary available.';
  const classification = aiAnalysis?.classification || 'Informative';
  const improvements = aiAnalysis?.improvements || [];

  const handleDownloadReport = () => {
    const dateStr = new Date().toLocaleDateString();
    const reportContent = `# Social Media Content Analysis Report\n`
      + `*Generated on ${dateStr} for ${platform}*\n\n`
      + `## Document Details\n`
      + `- File Name: ${fileName}\n`
      + `- File Type: ${fileType} (${fileSize})\n`
      + `- Extraction Method: ${extractionMethod}\n`
      + `- Word Count: ${wordCount} words (${characterCount} characters)\n\n`
      + `## Content Classification\n`
      + `**${classification}**\n\n`
      + `## Executive Summary\n`
      + `${summary}\n\n`
      + `## Actionable Improvements\n`
      + improvements.map((imp, i) => `${i + 1}. ${imp}`).join('\n') + `\n\n`
      + `## Extracted Text\n\`\`\`\n${extractedText}\n\`\`\`\n`;

    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Analysis_${fileName.replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Top Header Card */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl border border-zinc-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase font-semibold bg-zinc-900 text-zinc-300 border border-zinc-700">
                {platform}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800">
                {fileType}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{fileName}</h2>
            <p className="text-xs text-zinc-500 mt-1">
              Parsed via {extractionMethod} • {wordCount} Words • {fileSize}
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleDownloadReport}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-zinc-200 flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Export (.md)
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> New Upload
            </button>
          </div>
        </div>

        {/* Classification Badge & Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Content Classification</span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white text-black border border-zinc-300 shadow-sm">
              {classification}
            </span>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-zinc-200" /> Executive Summary
            </h3>
            <p className="text-sm md:text-base text-zinc-100 leading-relaxed font-sans">
              {summary}
            </p>
          </div>
        </div>

        {/* Actionable Improvements */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">Actionable Improvements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {improvements.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-black border border-zinc-800 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-200 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-zinc-300 leading-normal">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Extracted Raw Text Accordion Toggle */}
        <div className="pt-4 border-t border-zinc-800">
          <button
            onClick={() => setShowRawText(!showRawText)}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between transition-colors font-medium"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-400" /> Extracted Raw Text ({wordCount} words)
            </span>
            {showRawText ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>

          {showRawText && (
            <div className="mt-3 p-4 rounded-xl bg-black border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500">Method: {extractionMethod}</span>
                <button
                  onClick={handleCopyText}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Text'}
                </button>
              </div>
              <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed max-h-80 overflow-y-auto pr-2">
                {extractedText}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
