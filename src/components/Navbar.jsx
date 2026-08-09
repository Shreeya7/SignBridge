import React from 'react';
import { Camera, Bot, Mic, MessageSquare, GraduationCap, AlertTriangle, Sparkles, Volume2, VolumeX, Video, BarChart2, Sliders, Home } from 'lucide-react';

export function Navbar({
  activeTab,
  setActiveTab,
  isMuted,
  setIsMuted,
  signLanguageMode,
  setSignLanguageMode,
  onOpenCustomizer,
  onTriggerEmergency,
  onGoHome
}) {
  const navItems = [
    { id: 'sign-to-text', label: 'Sign → Text', icon: Camera },
    { id: 'text-to-sign', label: 'Text → Sign', icon: Bot },
    { id: 'voice-to-sign', label: 'Voice → Sign', icon: Mic },
    { id: 'conversation', label: 'Chat', icon: MessageSquare },
    { id: 'video-call', label: 'AR Call', icon: Video },
    { id: 'learn', label: 'Learn', icon: GraduationCap },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-lavender-400/10 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome || (() => setActiveTab('sign-to-text'))}>
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-lavender-400 via-gold-300 to-lavender-300 p-0.5 shadow-lg shadow-lavender-500/15">
            <div className="w-full h-full bg-[#0c0a14] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-lavender-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight gradient-text">SignBridge</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-lavender-900/40 text-lavender-300 border border-lavender-700/30 font-bold">
                v5.0
              </span>
            </div>
            <p className="text-[10px] text-lavender-200/40 hidden sm:block">ASL & ISL AI Translation Platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden xl:flex items-center gap-0.5 bg-[#120e1e]/60 p-1.5 rounded-2xl border border-lavender-400/8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-lavender-400 via-gold-300 to-lavender-300 text-[#1a1028] shadow-md shadow-lavender-500/15'
                    : 'text-lavender-200/50 hover:text-lavender-200 hover:bg-lavender-900/30'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1a1028]' : 'text-lavender-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* ASL / ISL Toggle */}
          <div className="flex items-center bg-[#120e1e] rounded-xl p-1 border border-lavender-400/10 text-xs font-bold">
            <button
              onClick={() => setSignLanguageMode('ASL')}
              className={`px-2.5 py-1 rounded-lg transition ${
                signLanguageMode === 'ASL'
                  ? 'bg-lavender-400 text-[#1a1028] shadow-md font-bold'
                  : 'text-lavender-200/40 hover:text-lavender-200'
              }`}
            >
              🇺🇸 ASL
            </button>
            <button
              onClick={() => setSignLanguageMode('ISL')}
              className={`px-2.5 py-1 rounded-lg transition ${
                signLanguageMode === 'ISL'
                  ? 'bg-gold-400 text-[#1a1028] shadow-md font-bold'
                  : 'text-lavender-200/40 hover:text-lavender-200'
              }`}
            >
              🇮🇳 ISL
            </button>
          </div>

          <button
            onClick={onOpenCustomizer}
            className="p-2.5 rounded-xl glass-button text-lavender-300 hover:text-lavender-200"
            title="Avatar Studio"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2.5 rounded-xl glass-button ${isMuted ? 'text-lavender-200/30' : 'text-lavender-300'}`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onTriggerEmergency}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 text-xs font-bold transition"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">SOS</span>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="xl:hidden flex items-center gap-1 mt-3 pt-2 border-t border-lavender-400/8 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-medium whitespace-nowrap transition ${
                isActive ? 'bg-lavender-900/40 text-lavender-300 border border-lavender-700/30' : 'text-lavender-200/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
