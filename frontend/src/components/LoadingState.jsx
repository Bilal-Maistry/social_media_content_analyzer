import React, { useState, useEffect } from 'react';
import { Loader2, FileText, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoadingState({ fileName, fileType, targetPlatform }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentStep(2);
      setProgress(55);
    }, 900);

    const timer2 = setTimeout(() => {
      setCurrentStep(3);
      setProgress(88);
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const steps = [
    { id: 1, label: 'Reading & Validating Document', desc: `Processing ${fileName || 'uploaded file'}`, icon: FileText },
    { id: 2, label: fileType === 'PDF' ? 'Parsing PDF (Apache PDFBox)' : 'Gemini Flash Vision OCR API', desc: 'Extracting clean text & graphic layout', icon: Cpu },
    { id: 3, label: `Evaluating AI Engagement for ${targetPlatform}`, desc: 'Generating hook score, rewrites & CTAs', icon: Sparkles },
  ];

  return (
    <div className="w-full max-w-xl mx-auto py-16 px-4">
      <div className="glass-panel p-8 rounded-2xl border border-zinc-800 shadow-2xl relative overflow-hidden">
        {/* Animated Background Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-black border border-zinc-700 flex items-center justify-center mb-6 text-white shadow-xl">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>

          <h3 className="text-xl font-extrabold text-white">Analyzing Content Performance</h3>
          <p className="text-xs text-zinc-400 mt-1">Please wait while Gemini Flash Vision API extracts text and evaluates engagement metrics.</p>

          {/* Progress Bar */}
          <div className="w-full bg-zinc-950 h-2.5 rounded-full mt-6 overflow-hidden border border-zinc-800 p-0.5">
            <div
              className="bg-white h-full rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step Indicators */}
          <div className="w-full mt-8 space-y-3 text-left">
            {steps.map((step) => {
              const Icon = step.icon;
              const isDone = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all duration-300 ${
                    isDone
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-200'
                      : isCurrent
                      ? 'bg-black border-white text-white shadow-md'
                      : 'bg-zinc-950/40 border-zinc-900 text-zinc-600'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                      isDone
                        ? 'bg-zinc-800 text-white'
                        : isCurrent
                        ? 'bg-white text-black font-bold animate-pulse'
                        : 'bg-zinc-900 text-zinc-600'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">{step.label}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
