import React, { useState, useEffect } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import { AvatarCanvas } from './AvatarCanvas';
import { parseSentenceToSignTokens } from '../services/aslDictionary';

export function TextToSign({ signLanguageMode, avatarConfig }) {
  const [inputText, setInputText] = useState(signLanguageMode === 'ISL' ? 'Namaste thank you' : 'Hello thank you');
  const [sequenceTokens, setSequenceTokens] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);

  const presetSentences = signLanguageMode === 'ISL'
    ? ['Namaste thank you', 'Help emergency', 'Water please', 'Friend India', 'Yes no']
    : ['Hello thank you', 'I need help emergency', 'Water please', 'I love you friend', 'Yes no'];

  const handleTranslate = (textToUse) => {
    const target = textToUse !== undefined ? textToUse : inputText;
    if (!target.trim()) return;

    const tokens = parseSentenceToSignTokens(target, signLanguageMode);
    setSequenceTokens(tokens);
    setIsPlaying(true);
  };

  useEffect(() => {
    const defaultText = signLanguageMode === 'ISL' ? 'Namaste thank you' : 'Hello thank you';
    setInputText(defaultText);
    handleTranslate(defaultText);
  }, [signLanguageMode]);

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: 3D Avatar Viewport */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="w-full h-[450px]">
          <AvatarCanvas
            sequence={sequenceTokens}
            isPlaying={isPlaying}
            avatarConfig={avatarConfig}
            onComplete={() => setIsPlaying(false)}
          />
        </div>
      </div>

      {/* Right Column: Input & Gloss Token Breakdown */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-lavender-400" />
              <h3 className="font-bold text-white text-base">Text-to-Sign Generator</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-lavender-300 border border-cyan-800 font-bold">
              {signLanguageMode} Engine
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono uppercase text-slate-400">Type sentence ({signLanguageMode})</label>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={`Type here to translate into 3D ${signLanguageMode} Sign...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTranslate()}
                className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-700 text-white font-medium focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => handleTranslate()}
                className="absolute right-2 p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-col gap-2 pt-2">
            <span className="text-[11px] font-mono text-slate-400">Quick Try {signLanguageMode} Presets:</span>
            <div className="flex flex-wrap gap-2">
              {presetSentences.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(preset);
                    handleTranslate(preset);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-cyan-950/60 text-xs text-slate-300 hover:text-lavender-300 border border-slate-800 transition"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Token Sequence Breakdown */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400">{signLanguageMode} Gloss Queue</h4>
            <span className="text-xs text-lavender-400 font-mono font-bold">{sequenceTokens.length} Tokens</span>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[80px] p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            {sequenceTokens.map((token, idx) => (
              <div
                key={idx}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 ${
                  token.type === 'word' ? 'bg-cyan-950/80 text-lavender-300 border-cyan-700/60' : 'bg-violet-950/80 text-violet-300 border-violet-700/60'
                }`}
              >
                <span className="font-bold">{token.label}</span>
                <span className="text-[9px] opacity-75 uppercase">({token.type})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
