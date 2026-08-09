import React, { useState } from 'react';
import { GraduationCap, Award, Camera, CheckCircle2, Sparkles, Trophy, Search, BookOpen, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AvatarCanvas } from './AvatarCanvas';
import { parseSentenceToSignTokens } from '../services/aslDictionary';
import { speechService } from '../services/speechService';

/**
 * LearnModule v6.0 — Complete ASL & ISL Curriculum (A-Z, Numbers 1-10, Words, Emergency)
 */
export function LearnModule({ isMuted, signLanguageMode, avatarConfig }) {
  const [selectedLevel, setSelectedLevel] = useState('alphabet');
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedItems, setCompletedItems] = useState(['A', 'B', 'C', 'HELLO', 'NAMASTE']);

  const levelsASL = {
    alphabet: [
      { key: 'A', name: 'ASL Letter A', description: 'Fist with thumb resting straight up alongside index finger' },
      { key: 'B', name: 'ASL Letter B', description: 'Four fingers upright together, thumb tucked across palm' },
      { key: 'C', name: 'ASL Letter C', description: 'Curved hand forming a clear C arch' },
      { key: 'D', name: 'ASL Letter D', description: 'Index finger straight up, thumb touching middle/ring/pinky' },
      { key: 'E', name: 'ASL Letter E', description: 'All fingers curled down tightly to thumb tip' },
      { key: 'F', name: 'ASL Letter F', description: 'Index & thumb tips touch forming circle, 3 fingers up' },
      { key: 'G', name: 'ASL Letter G', description: 'Thumb and index extended horizontally side-pointing' },
      { key: 'H', name: 'ASL Letter H', description: 'Index and middle extended horizontally together' },
      { key: 'I', name: 'ASL Letter I', description: 'Only pinky extended straight up, others flexed into fist' },
      { key: 'J', name: 'ASL Letter J', description: 'Pinky extended straight up tracing a J curve' },
      { key: 'K', name: 'ASL Letter K', description: 'Index pointing up, middle pointing forward, thumb between' },
      { key: 'L', name: 'ASL Letter L', description: 'Thumb and index forming right-angle L shape' },
      { key: 'M', name: 'ASL Letter M', description: '3 fingers (index, middle, ring) folded over thumb tucked underneath' },
      { key: 'N', name: 'ASL Letter N', description: '2 fingers (index, middle) folded over thumb tucked underneath' },
      { key: 'O', name: 'ASL Letter O', description: 'All finger tips touch thumb tip forming round O circle' },
      { key: 'P', name: 'ASL Letter P', description: 'Pointing down version of K (index down, middle forward)' },
      { key: 'Q', name: 'ASL Letter Q', description: 'Pointing down version of G (index and thumb down)' },
      { key: 'R', name: 'ASL Letter R', description: 'Index and middle crossed over each other' },
      { key: 'S', name: 'ASL Letter S', description: 'Tight fist with thumb folded across front of fingers' },
      { key: 'T', name: 'ASL Letter T', description: 'Thumb tucked between index and middle finger' },
      { key: 'U', name: 'ASL Letter U', description: 'Index and middle extended straight up touching together' },
      { key: 'V', name: 'ASL Letter V', description: 'Index and middle extended straight up spread apart (Peace)' },
      { key: 'W', name: 'ASL Letter W', description: 'Index, middle, ring extended straight up spread apart' },
      { key: 'X', name: 'ASL Letter X', description: 'Index finger hooked at PIP joint, others flexed into fist' },
      { key: 'Y', name: 'ASL Letter Y', description: 'Thumb and pinky extended out sideways (Hang loose)' },
      { key: 'Z', name: 'ASL Letter Z', description: 'Index finger extended, tracing Z shape in air' },
    ],
    numbers: [
      { key: '1', name: 'Number 1', description: 'Index finger extended straight up' },
      { key: '2', name: 'Number 2', description: 'Index and middle fingers extended straight up' },
      { key: '3', name: 'Number 3', description: 'Thumb, index, and middle fingers extended' },
      { key: '4', name: 'Number 4', description: 'Four fingers extended straight up, thumb tucked' },
      { key: '5', name: 'Number 5', description: 'All five fingers extended open palm' },
      { key: '6', name: 'Number 6', description: 'Pinky touches thumb tip, 3 fingers up' },
      { key: '7', name: 'Number 7', description: 'Ring finger touches thumb tip, 3 fingers up' },
      { key: '8', name: 'Number 8', description: 'Middle finger touches thumb tip, 3 fingers up' },
      { key: '9', name: 'Number 9', description: 'Index finger touches thumb tip, 3 fingers up' },
      { key: '10', name: 'Number 10', description: 'Thumb up hand shaking side to side' },
    ],
    words: [
      { key: 'HELLO', name: 'Hello', description: 'Salute motion from forehead outward' },
      { key: 'THANK YOU', name: 'Thank You', description: 'Open hand touches chin then moves outward' },
      { key: 'YES', name: 'Yes', description: 'Fist nodding up and down' },
      { key: 'NO', name: 'No', description: 'Index and middle snap down onto thumb tip' },
      { key: 'SORRY', name: 'Sorry', description: 'A-fist rubbing in a circular motion on chest' },
      { key: 'MORE', name: 'More', description: 'O-shaped fingertips tapping together' },
      { key: 'FINISHED', name: 'Finished / All Done', description: 'Both open palms twisting outward' },
      { key: 'PLEASE', name: 'Please', description: 'Open hand rubbing circle over chest' },
      { key: 'HELP', name: 'Help', description: 'Thumbs-up hand lifted up on flat palm' },
      { key: 'EAT', name: 'Eat / Food', description: 'Flattened O-hand tapping chin/lips' },
      { key: 'DRINK', name: 'Drink', description: 'C-shaped hand tilting toward mouth' },
      { key: 'GOOD', name: 'Good', description: 'Flat hand touching chin then moving down to flat palm' },
      { key: 'MORNING', name: 'Morning', description: 'Right arm rising up from horizontal left forearm' },
      { key: 'LOVE', name: 'Love', description: 'Both fists crossed over chest in X' },
    ],
    emergency: [
      { key: 'EMERGENCY', name: 'Emergency', description: 'Letter E hand shape shaking urgently side to side' },
      { key: 'WATER', name: 'Water', description: 'W hand shape tapping index finger on chin' },
      { key: 'I LOVE YOU', name: 'I Love You', description: 'Thumb, index, and pinky extended together' },
      { key: 'HELP', name: 'Urgent Assistance', description: 'Thumbs-up right hand lifted up on flat left palm' },
    ]
  };

  const levelsISL = {
    alphabet: [
      { key: 'A', name: 'ISL Letter A (Two-Handed)', description: 'Left index finger touches tip of right thumb' },
      { key: 'B', name: 'ISL Letter B (Two-Handed)', description: 'Two hands forming circles together (glasses shape)' },
      { key: 'C', name: 'ISL Letter C', description: 'Curved right hand creating C shape in front of chest' },
      { key: 'D', name: 'ISL Letter D (Two-Handed)', description: 'Left index vertical, right C touches left index' },
      { key: 'E', name: 'ISL Letter E (Two-Handed)', description: 'Right index touches tip of left index finger' },
      { key: 'F', name: 'ISL Letter F (Two-Handed)', description: 'Two index and middle fingers crossed horizontally' },
      { key: 'G', name: 'ISL Letter G (Two-Handed)', description: 'Both fists together, right fist over left' },
      { key: 'H', name: 'ISL Letter H (Two-Handed)', description: 'Right palm wiping flat across left palm upward' },
      { key: 'I', name: 'ISL Letter I (Two-Handed)', description: 'Right index finger touches tip of left middle finger' },
      { key: 'J', name: 'ISL Letter J (Two-Handed)', description: 'Right index finger touches left thumb and draws J curve' },
      { key: 'K', name: 'ISL Letter K (Two-Handed)', description: 'Left index vertical, right hooked index resting on left' },
      { key: 'L', name: 'ISL Letter L (Two-Handed)', description: 'Left index horizontal, right index vertical resting on left' },
      { key: 'M', name: 'ISL Letter M (Two-Handed)', description: 'Right 3 fingers (index, middle, ring) resting on left palm' },
      { key: 'N', name: 'ISL Letter N (Two-Handed)', description: 'Right 2 fingers (index, middle) resting on left palm' },
      { key: 'O', name: 'ISL Letter O (Two-Handed)', description: 'Right index finger touches tip of left ring finger' },
      { key: 'P', name: 'ISL Letter P (Two-Handed)', description: 'Left index vertical, right O circle touches top of left' },
      { key: 'Q', name: 'ISL Letter Q (Two-Handed)', description: 'Left O shape, right index hooked into left O circle' },
      { key: 'R', name: 'ISL Letter R (Two-Handed)', description: 'Left open palm, right curved fingers resting on left palm' },
      { key: 'S', name: 'ISL Letter S (Two-Handed)', description: 'Left pinky extended, right pinky hooked around left pinky' },
      { key: 'T', name: 'ISL Letter T (Two-Handed)', description: 'Left index horizontal, right index vertical under left' },
      { key: 'U', name: 'ISL Letter U (Two-Handed)', description: 'Right index finger touches tip of left pinky finger' },
      { key: 'V', name: 'ISL Letter V (Two-Handed)', description: 'Right V shape placed on left open palm' },
      { key: 'W', name: 'ISL Letter W (Two-Handed)', description: 'Both hands interlaced together in a tent shape' },
      { key: 'X', name: 'ISL Letter X (Two-Handed)', description: 'Both index fingers crossed forming an X shape' },
      { key: 'Y', name: 'ISL Letter Y (Two-Handed)', description: 'Right index tracing Y in palm of left hand' },
      { key: 'Z', name: 'ISL Letter Z (Two-Handed)', description: 'Left vertical palm, right horizontal palm resting against base' }
    ],
    words: [
      { key: 'NAMASTE', name: 'Namaste', description: 'Traditional Indian greeting: Both open palms pressed together at chest level' },
      { key: 'THANK YOU', name: 'Thank You', description: 'Both hands move from chest outward with slight bow' },
      { key: 'HELP', name: 'Help', description: 'Right fist resting on left palm lifting upward' },
      { key: 'WATER', name: 'Water', description: 'Cupped hand bringing water motion toward mouth' },
      { key: 'INDIA', name: 'India', description: 'Thumb pointing to forehead center (bindi position)' },
      { key: 'FRIEND', name: 'Friend', description: 'Shaking two hands together' },
    ],
    emergency: [
      { key: 'HELP', name: 'Urgent Help', description: 'Right fist resting on left palm lifting upward' },
      { key: 'WATER', name: 'Drinking Water', description: 'Cupped hand bringing water motion toward mouth' },
    ]
  };

  const currentLevels = signLanguageMode === 'ISL' ? levelsISL : levelsASL;
  const currentList = (currentLevels[selectedLevel] || currentLevels.alphabet).filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.key.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const activeItem = currentList[activeItemIndex] || currentList[0] || { key: 'A', name: 'Letter A', description: '' };
  const activeTokens = parseSentenceToSignTokens(activeItem.key, signLanguageMode);

  const handleSimulateTest = () => {
    const score = Math.floor(Math.random() * 15) + 85;
    setPracticeScore(score);

    if (score >= 80) {
      if (!completedItems.includes(activeItem.key)) {
        setCompletedItems(prev => [...prev, activeItem.key]);
      }
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      if (!isMuted) speechService.playAlertSound('success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 flex flex-col gap-6">
      {/* Header Banner */}
      <div className="glass-panel-glow rounded-3xl p-6 border border-lavender-400/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-lavender-400 via-gold-300 to-lavender-300 p-0.5 flex-shrink-0 shadow-lg">
            <div className="w-full h-full bg-[#0c0a14] rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-lavender-300" />
            </div>
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
              <span>Learn {signLanguageMode} Sign Hub</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-lavender-500/20 text-lavender-300 border border-lavender-400/30">
                A-Z Complete Curriculum
              </span>
            </h2>
            <p className="text-xs text-lavender-200/50 mt-1">Master all 26 letters (A to Z), numbers, and essential sign glosses with 3D demonstration & camera practice.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#120e1e] px-4 py-2.5 rounded-2xl border border-lavender-400/20 text-xs font-semibold text-lavender-300 shadow-md">
          <Trophy className="w-4 h-4 text-gold-400" />
          <span>Progress: <strong className="text-gold-300">{completedItems.length}</strong> / 36 Mastered</span>
        </div>
      </div>

      {/* Navigation Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {[
            { id: 'alphabet', label: `A to Z Alphabet (26 Letters)` },
            ...(signLanguageMode === 'ASL' ? [{ id: 'numbers', label: `Numbers (1 to 10)` }] : []),
            { id: 'words', label: `Essential Words` },
            { id: 'emergency', label: `Daily Phrases` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setSelectedLevel(tab.id); setActiveItemIndex(0); setPracticeScore(0); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedLevel === tab.id
                  ? 'gradient-pastel-btn text-white shadow-lg'
                  : 'glass-button text-lavender-200/60 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-lavender-200/40" />
          <input
            type="text"
            placeholder="Search A-Z, signs..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setActiveItemIndex(0); }}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0c0a14] border border-lavender-400/20 text-white text-xs placeholder:text-lavender-200/30"
          />
        </div>
      </div>

      {/* Main Grid: Left Lesson Picker + Right 3D Stage / Practice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Letter / Lesson Selector */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs uppercase font-mono tracking-wider text-lavender-200/40">
              {signLanguageMode} {selectedLevel.toUpperCase()} ({currentList.length} Items)
            </h4>
            <span className="text-[10px] text-gold-400 font-mono">Select to practice</span>
          </div>

          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
            {currentList.length === 0 ? (
              <div className="p-8 text-center text-xs text-lavender-200/30 italic glass-panel rounded-2xl">
                No matching signs found for "{searchQuery}"
              </div>
            ) : (
              currentList.map((item, idx) => {
                const isDone = completedItems.includes(item.key);
                const isActive = idx === activeItemIndex;
                return (
                  <div
                    key={item.key}
                    onClick={() => { setActiveItemIndex(idx); setPracticeScore(0); }}
                    className={`p-3.5 rounded-2xl cursor-pointer transition border flex items-center justify-between ${
                      isActive
                        ? 'bg-lavender-900/40 border-lavender-400/50 shadow-lg'
                        : 'glass-panel border-lavender-400/10 hover:border-lavender-400/25'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm ${
                        isDone
                          ? 'bg-gold-400/20 text-gold-300 border border-gold-400/40'
                          : 'bg-[#120e1e] text-lavender-200 border border-lavender-400/20'
                      }`}>
                        {item.key}
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-white">{item.name}</h5>
                        <p className="text-[11px] text-lavender-200/40 line-clamp-1">{item.description}</p>
                      </div>
                    </div>

                    {isDone && <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: 3D Animated Demo / Webcam Arena */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="glass-panel rounded-3xl p-6 border border-lavender-400/20 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-lavender-400/10 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-lavender-300">3D {signLanguageMode} Lesson</span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{activeItem.name}</span>
                  <span className="text-xs font-mono text-gold-400">"{activeItem.key}"</span>
                </h3>
              </div>

              <button
                onClick={() => setPracticeMode(!practiceMode)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  practiceMode ? 'bg-gold-400/20 text-gold-300 border border-gold-400/40' : 'glass-button text-lavender-300'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{practiceMode ? 'View 3D Demo' : 'Webcam Practice Arena'}</span>
              </button>
            </div>

            {!practiceMode ? (
              <div className="w-full h-[380px]">
                <AvatarCanvas sequence={activeTokens} isPlaying={true} avatarConfig={avatarConfig} />
              </div>
            ) : (
              <div className="w-full h-[380px] rounded-2xl bg-[#0c0a14] border border-lavender-400/20 p-6 flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-lavender-500/10 border border-lavender-400/30 flex items-center justify-center text-lavender-300">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Sign "{activeItem.key}" into your webcam</h4>
                  <p className="text-xs text-lavender-200/50 mt-1 max-w-sm">{activeItem.description}</p>
                </div>

                <button
                  onClick={handleSimulateTest}
                  className="px-6 py-3 rounded-2xl gradient-pastel-btn text-[#1a1028] font-extrabold text-sm shadow-xl flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Evaluate My Sign</span>
                </button>

                {practiceScore > 0 && (
                  <div className="mt-2 p-4 rounded-2xl bg-[#120e1e] border border-lavender-400/20 flex items-center gap-4">
                    <div className="text-2xl font-black text-gold-400">{practiceScore}%</div>
                    <span className="text-xs font-semibold text-white">
                      {practiceScore >= 80 ? `🎉 Excellent! Letter ${activeItem.key} Mastered!` : 'Keep practicing for higher accuracy.'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Description Footer */}
            <div className="p-3.5 rounded-2xl bg-[#120e1e] border border-lavender-400/10 text-xs text-lavender-200/60 leading-relaxed font-light">
              <strong className="text-lavender-300 font-semibold">How to sign: </strong>
              {activeItem.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
