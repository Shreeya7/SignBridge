import React from 'react';
import { Sliders, Sparkles, Check } from 'lucide-react';

export function AvatarCustomizerModal({ isOpen, onClose, avatarConfig, setAvatarConfig }) {
  if (!isOpen) return null;

  const skinOptions = [
    { name: 'Cyber Blue', value: '#38bdf8' },
    { name: 'Human Warm', value: '#fb7185' },
    { name: 'Gold Neura', value: '#f59e0b' },
    { name: 'Violet Cyber', value: '#c084fc' }
  ];

  const outfitOptions = [
    { name: 'Obsidian Stealth', value: '#0f172a' },
    { name: 'Medical Assistant', value: '#0284c7' },
    { name: 'Emerald Guardian', value: '#064e3b' },
    { name: 'Cyber Violet', value: '#4c1d95' }
  ];

  const jointGlowOptions = [
    { name: 'Neon Cyan', value: '#06b6d4' },
    { name: 'Plasma Emerald', value: '#10b981' },
    { name: 'Electric Violet', value: '#8b5cf6' },
    { name: 'Hot Crimson', value: '#f43f5e' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel-glow rounded-3xl p-6 border border-cyan-500/40 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Sliders className="w-5 h-5 text-lavender-400" />
            <span>3D Avatar Studio Customizer</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
        </div>

        {/* Skin Color */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono uppercase text-slate-400">Avatar Skin Tone</label>
          <div className="grid grid-cols-4 gap-2">
            {skinOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setAvatarConfig(prev => ({ ...prev, skinColor: opt.value }))}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                  avatarConfig.skinColor === opt.value ? 'border-cyan-400 bg-cyan-950/60' : 'border-slate-800 bg-slate-900'
                }`}
              >
                <div className="w-6 h-6 rounded-full border border-slate-700" style={{ backgroundColor: opt.value }} />
                <span className="text-[10px] text-slate-300 font-medium">{opt.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Outfit Color */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono uppercase text-slate-400">Outfit Theme</label>
          <div className="grid grid-cols-4 gap-2">
            {outfitOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setAvatarConfig(prev => ({ ...prev, outfitColor: opt.value }))}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                  avatarConfig.outfitColor === opt.value ? 'border-cyan-400 bg-cyan-950/60' : 'border-slate-800 bg-slate-900'
                }`}
              >
                <div className="w-6 h-6 rounded-full border border-slate-700" style={{ backgroundColor: opt.value }} />
                <span className="text-[10px] text-slate-300 font-medium">{opt.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Joint Glow Color */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono uppercase text-slate-400">Joint Glow Aura</label>
          <div className="grid grid-cols-4 gap-2">
            {jointGlowOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setAvatarConfig(prev => ({ ...prev, jointColor: opt.value }))}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                  avatarConfig.jointColor === opt.value ? 'border-cyan-400 bg-cyan-950/60' : 'border-slate-800 bg-slate-900'
                }`}
              >
                <div className="w-6 h-6 rounded-full border border-slate-700" style={{ backgroundColor: opt.value }} />
                <span className="text-[10px] text-slate-300 font-medium">{opt.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/25"
        >
          Apply Customization Settings
        </button>
      </div>
    </div>
  );
}
