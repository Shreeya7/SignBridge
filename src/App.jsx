import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { SignToText } from './components/SignToText';
import { TextToSign } from './components/TextToSign';
import { VoiceToSign } from './components/VoiceToSign';
import { ConversationMode } from './components/ConversationMode';
import { VideoCallMode } from './components/VideoCallMode';
import { LearnModule } from './components/LearnModule';
import { FluencyAnalytics } from './components/FluencyAnalytics';
import { EmergencyPhrases } from './components/EmergencyPhrases';
import { AvatarCustomizerModal } from './components/AvatarCustomizerModal';
import { Heart, Shield, Globe } from 'lucide-react';

export function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('sign-to-text');
  const [isMuted, setIsMuted] = useState(false);
  const [signLanguageMode, setSignLanguageMode] = useState('ASL');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [avatarConfig, setAvatarConfig] = useState({
    skinColor: '#d4c5f0',
    outfitColor: '#1a1028',
    jointColor: '#fce4a0',
    glowEffect: true
  });

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  const handleGoHome = () => {
    setShowLanding(true);
  };

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-[#0c0a14] text-slate-100 flex flex-col justify-between">
      {/* Background Glow Orbs */}
      <div className="glow-orb-lavender" style={{ width: '500px', height: '500px', top: '-5%', left: '20%' }} />
      <div className="glow-orb-gold" style={{ width: '400px', height: '400px', bottom: '10%', right: '15%' }} />
      <div className="glow-orb-lavender" style={{ width: '350px', height: '350px', top: '50%', left: '60%' }} />

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        signLanguageMode={signLanguageMode}
        setSignLanguageMode={setSignLanguageMode}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onTriggerEmergency={() => setActiveTab('emergency')}
        onGoHome={handleGoHome}
      />

      {/* Main Content */}
      <main className="flex-1 w-full pb-12 pt-4">
        {activeTab === 'sign-to-text' && <SignToText isMuted={isMuted} signLanguageMode={signLanguageMode} />}
        {activeTab === 'text-to-sign' && <TextToSign signLanguageMode={signLanguageMode} avatarConfig={avatarConfig} />}
        {activeTab === 'voice-to-sign' && <VoiceToSign signLanguageMode={signLanguageMode} avatarConfig={avatarConfig} />}
        {activeTab === 'conversation' && <ConversationMode isMuted={isMuted} signLanguageMode={signLanguageMode} avatarConfig={avatarConfig} />}
        {activeTab === 'video-call' && <VideoCallMode signLanguageMode={signLanguageMode} isMuted={isMuted} />}
        {activeTab === 'learn' && <LearnModule isMuted={isMuted} signLanguageMode={signLanguageMode} avatarConfig={avatarConfig} />}
        {activeTab === 'analytics' && <FluencyAnalytics signLanguageMode={signLanguageMode} />}
        {activeTab === 'emergency' && <EmergencyPhrases isMuted={isMuted} signLanguageMode={signLanguageMode} avatarConfig={avatarConfig} />}
      </main>

      {/* Avatar Customizer */}
      <AvatarCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        avatarConfig={avatarConfig}
        setAvatarConfig={setAvatarConfig}
      />

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-lavender-400/10 py-6 px-4 text-center z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-lavender-200/40">
          <div className="flex items-center gap-2">
            <span className="font-bold gradient-text">SignBridge v5.0</span>
            <span>— ASL 🇺🇸 & ISL 🇮🇳 AI Translation Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-lavender-300">
              <Globe className="w-3.5 h-3.5" />
              {signLanguageMode} Active
            </span>
            <span className="flex items-center gap-1 text-gold-400">
              <Shield className="w-3.5 h-3.5" />
              100% In-Browser
            </span>
          </div>

          <div className="flex items-center gap-1 text-lavender-200/30">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-lavender-400 fill-lavender-400" />
            <span>for accessibility</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
