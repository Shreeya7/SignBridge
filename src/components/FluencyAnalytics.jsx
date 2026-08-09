import React, { useState } from 'react';
import { Trophy, Award, Gauge, Zap, Download, CheckCircle, Sparkles } from 'lucide-react';

export function FluencyAnalytics({ signLanguageMode }) {
  const [wpmSpeed, setWpmSpeed] = useState(38);
  const [accuracyRate, setAccuracyRate] = useState(94);
  const [certified, setCertified] = useState(false);

  const handleGenerateCertificate = () => {
    setCertified(true);
    const content = `========================================================\nSIGNBRIDGE ACCESSIBILITY & FLUENCY CERTIFICATE\n========================================================\nMode: ${signLanguageMode}\nSigning Speed: ${wpmSpeed} WPM\nGesture Accuracy: ${accuracyRate}%\nStatus: Certified Signer\nIssued: ${new Date().toLocaleDateString()}\n========================================================`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SignBridge_Fluency_Certificate_${signLanguageMode}.txt`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 flex flex-col gap-6">
      {/* Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-[#1a1028] font-bold shadow-lg">
            <Trophy className="w-6 h-6 text-[#1a1028]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Fluency & Accessibility Scorecard</h2>
            <p className="text-xs text-slate-400">Track signing speed, accuracy performance, and download fluency badges</p>
          </div>
        </div>

        <button
          onClick={handleGenerateCertificate}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2"
        >
          <Award className="w-4 h-4" />
          <span>Download Fluency Certificate</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-slate-400">Signing Speed</span>
            <Zap className="w-4 h-4 text-lavender-400" />
          </div>
          <div className="text-3xl font-black text-white">{wpmSpeed} <span className="text-xs text-slate-400 font-normal">WPM</span></div>
          <span className="text-[11px] text-gold-400 font-medium">↑ 12% faster than average</span>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-slate-400">Gesture Accuracy</span>
            <Gauge className="w-4 h-4 text-gold-400" />
          </div>
          <div className="text-3xl font-black text-gold-400">{accuracyRate}%</div>
          <span className="text-[11px] text-slate-400">High Precision AI Match</span>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-slate-400">Sign Engine</span>
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-black text-violet-300">{signLanguageMode} Engine</div>
          <span className="text-[11px] text-slate-400">Dual ASL/ISL Active</span>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-slate-400">Lessons Mastered</span>
            <CheckCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">18 / 24</div>
          <span className="text-[11px] text-slate-400">75% Curriculum Complete</span>
        </div>
      </div>
    </div>
  );
}
