import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, PhoneCall, Flame, Stethoscope, Droplets, MapPin, Volume2 } from 'lucide-react';
import { AvatarCanvas } from './AvatarCanvas';
import { parseSentenceToSignTokens } from '../services/aslDictionary';
import { speechService } from '../services/speechService';

export function EmergencyPhrases({ isMuted, signLanguageMode, avatarConfig }) {
  const [activePhrase, setActivePhrase] = useState(signLanguageMode === 'ISL' ? 'Namaste Help Emergency' : 'I need medical help');
  const [avatarSequence, setAvatarSequence] = useState(
    parseSentenceToSignTokens(signLanguageMode === 'ISL' ? 'HELP EMERGENCY' : 'HELP EMERGENCY', signLanguageMode)
  );

  const emergencyItemsASL = [
    { id: 'med', title: 'Medical Emergency', gloss: 'HELP EMERGENCY', text: 'I need immediate medical assistance!', icon: Stethoscope, color: 'from-red-500 to-rose-600' },
    { id: 'deaf', title: 'I am Deaf / Hard of Hearing', gloss: 'NO HEARING PLEASE SIGN', text: 'I am Deaf and communicate using Sign Language.', icon: ShieldAlert, color: 'from-cyan-500 to-blue-600' },
    { id: 'police', title: 'Call 911 / Police', gloss: 'HELP POLICE', text: 'Please call emergency police immediately!', icon: PhoneCall, color: 'from-amber-500 to-orange-600' },
    { id: 'fire', title: 'Fire Hazard Alert', gloss: 'EMERGENCY FIRE', text: 'Fire emergency! Please evacuate!', icon: Flame, color: 'from-orange-600 to-red-600' },
    { id: 'water', title: 'I Need Water', gloss: 'WATER PLEASE HELP', text: 'I urgently need clean drinking water.', icon: Droplets, color: 'from-sky-500 to-cyan-600' },
    { id: 'lost', title: 'Where is Exit?', gloss: 'WHERE HELP', text: 'I am lost. Where is the emergency exit?', icon: MapPin, color: 'from-violet-500 to-purple-600' }
  ];

  const emergencyItemsISL = [
    { id: 'namaste', title: 'Namaste Emergency Help', gloss: 'NAMASTE HELP EMERGENCY', text: 'Namaste! Please send urgent assistance!', icon: Stethoscope, color: 'from-red-500 to-rose-600' },
    { id: 'help', title: 'Need Urgent Help (ISL)', gloss: 'HELP EMERGENCY', text: 'I urgently require emergency assistance.', icon: ShieldAlert, color: 'from-cyan-500 to-blue-600' },
    { id: 'water', title: 'Water Needed (ISL)', gloss: 'WATER HELP', text: 'Please give me clean drinking water.', icon: Droplets, color: 'from-sky-500 to-cyan-600' },
    { id: 'india', title: 'India Location Emergency', gloss: 'INDIA HELP', text: 'Emergency at local area.', icon: MapPin, color: 'from-amber-500 to-orange-600' }
  ];

  const emergencyItems = signLanguageMode === 'ISL' ? emergencyItemsISL : emergencyItemsASL;

  const handleTriggerEmergency = (item) => {
    setActivePhrase(item.title);
    const tokens = parseSentenceToSignTokens(item.gloss, signLanguageMode);
    setAvatarSequence(tokens);

    if (!isMuted) {
      speechService.playAlertSound('emergency');
      speechService.speak(item.text);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 flex flex-col gap-6">
      <div className="rounded-3xl p-6 bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border border-red-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>One-Tap {signLanguageMode} Emergency Phrases</span>
            </h2>
            <p className="text-xs text-slate-300">Instantly sign & broadcast siren audio alerts for critical situations</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {emergencyItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePhrase === item.title;
            return (
              <div
                key={item.id}
                onClick={() => handleTriggerEmergency(item)}
                className={`p-5 rounded-3xl cursor-pointer transition border flex flex-col justify-between gap-3 shadow-lg ${
                  isActive ? 'bg-red-950 border-red-500 shadow-red-500/20' : 'glass-panel border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                    ONE TAP
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-base text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-red-400 uppercase">{signLanguageMode} Emergency Avatar</span>
                <h3 className="text-lg font-bold text-white">{activePhrase}</h3>
              </div>
              <button
                onClick={() => speechService.playAlertSound('emergency')}
                className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-semibold flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                <span>Play Sound Siren</span>
              </button>
            </div>

            <div className="w-full h-[380px]">
              <AvatarCanvas sequence={avatarSequence} isPlaying={true} avatarConfig={avatarConfig} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
