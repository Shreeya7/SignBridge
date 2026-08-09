import React, { useState } from 'react';
import { MessageSquare, Camera, Send, Download, User, Volume2, Sparkles } from 'lucide-react';
import { AvatarCanvas } from './AvatarCanvas';
import { speechService } from '../services/speechService';
import { parseSentenceToSignTokens } from '../services/aslDictionary';

export function ConversationMode({ isMuted, signLanguageMode, avatarConfig }) {
  const [hearingInput, setHearingInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'hearing', type: 'text', content: signLanguageMode === 'ISL' ? 'Namaste! Nice to meet you.' : 'Hello! Nice to meet you.', timestamp: '11:15 AM' },
    { id: 2, sender: 'deaf', type: 'sign', content: signLanguageMode === 'ISL' ? 'NAMASTE THANK YOU' : 'HELLO THANK YOU', timestamp: '11:16 AM' }
  ]);

  const [activeAvatarSequence, setActiveAvatarSequence] = useState(
    parseSentenceToSignTokens(signLanguageMode === 'ISL' ? 'Namaste thank you' : 'Hello nice to meet you', signLanguageMode)
  );

  const handleSendHearing = (textToUse) => {
    const text = textToUse || hearingInput;
    if (!text.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'hearing',
      type: 'text',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setHearingInput('');

    const tokens = parseSentenceToSignTokens(text, signLanguageMode);
    setActiveAvatarSequence(tokens);
  };

  const handleSimulateDeafSign = (signText) => {
    const newMsg = {
      id: Date.now(),
      sender: 'deaf',
      type: 'sign',
      content: signText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);

    if (!isMuted) {
      speechService.speak(signText);
    }
  };

  const exportTranscript = () => {
    const content = messages.map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}: ${m.content}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SignBridge_${signLanguageMode}_Conversation.txt`;
    a.click();
  };

  const quickDeafSigns = signLanguageMode === 'ISL'
    ? ['NAMASTE THANK YOU', 'HELP EMERGENCY', 'WATER PLEASE', 'FRIEND INDIA']
    : ['HELLO THANK YOU', 'YES I NEED HELP', 'WATER PLEASE', 'EMERGENCY'];

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 flex flex-col gap-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-lg">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Two-Way Conversation Mode</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-lavender-300 border border-cyan-800">
                {signLanguageMode} Engine
              </span>
            </h2>
            <p className="text-xs text-slate-400">Live split-screen bridge for Deaf & Hearing communication</p>
          </div>
        </div>

        <button
          onClick={exportTranscript}
          className="px-4 py-2.5 rounded-xl glass-button text-xs font-semibold text-lavender-300 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export {signLanguageMode} Transcript</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Hearing User Console */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-lavender-400" />
                <span className="font-bold text-sm text-white">Hearing Person Console</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={hearingInput}
                onChange={(e) => setHearingInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendHearing()}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => handleSendHearing()}
                className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full h-[320px] mt-2">
              <AvatarCanvas sequence={activeAvatarSequence} isPlaying={true} avatarConfig={avatarConfig} />
            </div>
          </div>
        </div>

        {/* Right Side: Deaf Person Console */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-gold-400" />
                <span className="font-bold text-sm text-white">Deaf Person Sign Feed</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-mono text-slate-400">Simulate Webcam Sign Input ({signLanguageMode}):</span>
              <div className="flex flex-wrap gap-2">
                {quickDeafSigns.map((sign, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSimulateDeafSign(sign)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-xs font-semibold text-gold-300 border border-emerald-800/60 transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-gold-400" />
                    <span>Sign "{sign}"</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Transcript Feed */}
            <div className="flex flex-col gap-3 min-h-[340px] max-h-[380px] overflow-y-auto p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              {messages.map((msg) => {
                const isHearing = msg.sender === 'hearing';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-1 max-w-[80%] ${isHearing ? 'self-start' : 'self-end items-end'}`}
                  >
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                      <span>{isHearing ? '👤 Hearing User' : '🤟 Deaf User'}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl text-sm font-medium border shadow-md flex items-center justify-between gap-3 ${
                        isHearing
                          ? 'bg-slate-900 text-cyan-200 border-cyan-800/60 rounded-tl-none'
                          : 'bg-emerald-950/90 text-emerald-100 border-emerald-800/60 rounded-tr-none'
                      }`}
                    >
                      <span>{msg.content}</span>
                      <button
                        onClick={() => speechService.speak(msg.content)}
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
