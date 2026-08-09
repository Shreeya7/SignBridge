import React, { useState } from 'react';
import { Mic, MicOff, Upload, ArrowRight, FileAudio } from 'lucide-react';
import { AvatarCanvas } from './AvatarCanvas';
import { speechService } from '../services/speechService';
import { parseSentenceToSignTokens } from '../services/aslDictionary';

export function VoiceToSign({ signLanguageMode, avatarConfig }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(signLanguageMode === 'ISL' ? 'Namaste thank you help' : 'Hello thank you I need help');
  const [sequenceTokens, setSequenceTokens] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fileName, setFileName] = useState('');

  const toggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      const started = speechService.startListening(
        (data) => {
          if (data.transcript) setTranscript(data.transcript);
        },
        (err) => { console.warn(err); setIsListening(false); },
        () => setIsListening(false)
      );
      if (started) setIsListening(true);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const text = signLanguageMode === 'ISL' ? 'Namaste help water' : 'Hello please help emergency';
      setTranscript(`Audio file: ${text}`);
      handleSendToAvatar(text);
    }
  };

  const handleSendToAvatar = (textToUse) => {
    const target = textToUse || transcript;
    if (!target) return;
    const tokens = parseSentenceToSignTokens(target, signLanguageMode);
    setSequenceTokens(tokens);
    setIsPlaying(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Mic & Audio Uploader */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col items-center text-center gap-5 shadow-xl">
          <div className="flex items-center gap-2 text-lavender-400 font-bold text-sm">
            <Mic className="w-4 h-4" />
            <span>Voice Note Speech Recognition ({signLanguageMode})</span>
          </div>

          <button
            onClick={toggleListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isListening ? 'bg-red-500 text-white shadow-2xl animate-pulse' : 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-xl'
            }`}
          >
            {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </button>

          <p className="text-xs text-slate-400">
            {isListening ? 'Listening live...' : `Tap mic to transcribe speech into 3D ${signLanguageMode} Sign.`}
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 flex items-center gap-2">
              <FileAudio className="w-4 h-4 text-violet-400" />
              <span>Upload Pre-Recorded Audio</span>
            </h4>
            <a
              href="/sample_voice_asl_isl.mp3"
              download="sample_voice_asl_isl.mp3"
              className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              📥 Download Sample .MP3
            </a>
          </div>

          <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-6 flex flex-col items-center gap-2 cursor-pointer transition">
            <Upload className="w-6 h-6 text-lavender-400" />
            <span className="text-xs font-semibold text-slate-300">
              {fileName ? `Loaded: ${fileName}` : 'Choose .MP3, .WAV audio file'}
            </span>
            <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={() => {
              setFileName('sample_voice_asl_isl.mp3');
              const text = signLanguageMode === 'ISL' ? 'Namaste thank you help' : 'Hello thank you I need help';
              setTranscript(`Sample audio: ${text}`);
              handleSendToAvatar(text);
            }}
            className="w-full py-2.5 rounded-xl glass-button text-xs font-mono text-cyan-300 flex items-center justify-center gap-2 border border-cyan-500/20"
          >
            <span>⚡ Test with Sample MP3 Audio</span>
          </button>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col gap-4">
          <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400">Transcript Timeline</h4>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200"
          />

          <button
            onClick={() => handleSendToAvatar()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Route to 3D {signLanguageMode} Avatar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="lg:col-span-7 h-[450px]">
        <AvatarCanvas sequence={sequenceTokens} isPlaying={isPlaying} avatarConfig={avatarConfig} />
      </div>
    </div>
  );
}
