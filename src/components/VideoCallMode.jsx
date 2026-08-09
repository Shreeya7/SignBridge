import React, { useState } from 'react';
import { Video, Mic, MicOff, VideoOff, Sparkles, MessageSquare, PhoneOff, UserCheck, Bot } from 'lucide-react';
import { AvatarCanvas } from './AvatarCanvas';
import { parseSentenceToSignTokens } from '../services/aslDictionary';

export function VideoCallMode({ signLanguageMode, isMuted }) {
  const [callActive, setCallActive] = useState(true);
  const [micMuted, setMicMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [arOverlayActive, setArOverlayActive] = useState(true);
  const [remoteTranscript, setRemoteTranscript] = useState('Hello! I am signing in live call.');

  const sampleCallTokens = parseSentenceToSignTokens('Hello thank you', signLanguageMode);

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 flex flex-col gap-6">
      {/* Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Live AR Video Call Translator</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-lavender-400 border border-cyan-800">
                Hackathon AR Mode
              </span>
            </h2>
            <p className="text-xs text-slate-400">Real-time AR sign captions & 3D avatar overlays directly on video calls</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setArOverlayActive(!arOverlayActive)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
              arOverlayActive ? 'bg-lavender-400/20 text-lavender-300 border-cyan-500/40' : 'glass-button text-slate-400'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-1.5" />
            <span>AR Overlay: {arOverlayActive ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Call Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Remote Video Stream with AR Overlay */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden glass-panel border border-slate-800 h-[480px] bg-slate-950 flex items-center justify-center shadow-2xl">
          {callActive ? (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 flex flex-col justify-between p-6">
              {/* Top Call Info */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-xs font-semibold text-gold-400 border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
                  <span>Call Live (HD) • Mode: {signLanguageMode}</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-xs text-slate-300 border border-slate-700">
                  <UserCheck className="w-3.5 h-3.5 text-lavender-400" />
                  <span>Remote User Connected</span>
                </div>
              </div>

              {/* Center Simulated Remote Video Person */}
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-600 p-1 flex items-center justify-center shadow-xl shadow-cyan-500/20">
                  <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center font-bold text-2xl text-lavender-300">
                    RU
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white">Remote User (Signing)</h3>
              </div>

              {/* Bottom Real-Time AR Captions Bar */}
              {arOverlayActive && (
                <div className="z-10 p-4 rounded-2xl glass-panel-glow border border-cyan-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-lavender-400 animate-pulse" />
                    <div>
                      <span className="text-[9px] uppercase font-mono text-lavender-400">Live AR Caption Stream</span>
                      <p className="text-sm font-bold text-white">{remoteTranscript}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded bg-cyan-950 text-lavender-300 text-xs font-mono border border-cyan-800">
                    97% Accuracy
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-6 flex flex-col items-center gap-3">
              <PhoneOff className="w-12 h-12 text-slate-600" />
              <h3 className="text-lg font-bold text-white">Call Ended</h3>
              <button
                onClick={() => setCallActive(true)}
                className="px-6 py-2.5 rounded-xl bg-lavender-400 text-[#1a1028] font-bold text-xs shadow-lg"
              >
                Reconnect Call
              </button>
            </div>
          )}

          {/* Picture-in-Picture Local 3D Avatar Overlay */}
          {callActive && arOverlayActive && (
            <div className="absolute top-4 right-4 w-52 h-44 rounded-2xl overflow-hidden border-2 border-cyan-500/60 shadow-2xl z-20">
              <AvatarCanvas sequence={sampleCallTokens} isPlaying={true} />
            </div>
          )}
        </div>

        {/* Right Column: Call Controls & Transcript Stream */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col gap-4">
            <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400">Call Controls</h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setMicMuted(!micMuted)}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition ${
                  micMuted ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'glass-button text-lavender-300'
                }`}
              >
                {micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span className="text-[10px] font-semibold">{micMuted ? 'Muted' : 'Mic On'}</span>
              </button>

              <button
                onClick={() => setVideoMuted(!videoMuted)}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition ${
                  videoMuted ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'glass-button text-lavender-300'
                }`}
              >
                {videoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                <span className="text-[10px] font-semibold">{videoMuted ? 'Cam Off' : 'Cam On'}</span>
              </button>

              <button
                onClick={() => setCallActive(false)}
                className="p-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold flex flex-col items-center gap-1 shadow-lg shadow-red-600/30"
              >
                <PhoneOff className="w-5 h-5" />
                <span className="text-[10px]">End Call</span>
              </button>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col gap-3">
            <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400">Simulate Call Caption Input</h4>
            <div className="flex flex-wrap gap-1.5">
              {['Hello thank you', 'I need help', 'Water please', 'Namaste friend'].map((txt, idx) => (
                <button
                  key={idx}
                  onClick={() => setRemoteTranscript(txt)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-xs text-slate-300 hover:text-lavender-300 border border-slate-800"
                >
                  "{txt}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
