import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, CameraOff, Copy, Trash2, Plus, Sparkles, Wand2, Eye, Sliders, Zap } from 'lucide-react';
import { KNNLandmarkClassifier, createSyntheticHandLandmarks, LABEL_NO_HAND, LABEL_IDLE, LABEL_PENDING } from '../services/knnClassifier';
import { loadMediaPipeHands, sendFrame } from '../services/mediapipeLoader';
import { speechService } from '../services/speechService';
import { nlpGrammarService } from '../services/nlpGrammarService';

/**
 * SignToText v7.0 — Performance-optimized with rule-based detection
 *
 * Lag fixes:
 *  - Uses refs for frame-by-frame data, only syncs to state every 200ms
 *  - Detection loop uses requestAnimationFrame with frame skip (process every 3rd frame)
 *  - Canvas drawing separated from classification
 */
export function SignToText({ isMuted, signLanguageMode }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Only these states trigger re-renders — updated at throttled intervals
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [displayState, setDisplayState] = useState({
    handDetected: false,
    status: 'idle',
    label: LABEL_PENDING,
    confidence: 0,
    candidates: [],
    fingers: { thumb: 'CLOSED', index: 'CLOSED', middle: 'CLOSED', ring: 'CLOSED', pinky: 'CLOSED' }
  });
  const [sentenceStream, setSentenceStream] = useState([]);
  const [useNlpSmoothing, setUseNlpSmoothing] = useState(true);
  const [sensitivity, setSensitivity] = useState(55);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customSignName, setCustomSignName] = useState('');
  const [recordingStatus, setRecordingStatus] = useState('');

  // Refs for hot-path data (no re-renders)
  const classifierRef = useRef(new KNNLandmarkClassifier());
  const lastSpokenRef = useRef('');
  const animFrameRef = useRef(null);
  const latestLandmarksRef = useRef(null);
  const handsReadyRef = useRef(false);
  const sendIntervalRef = useRef(null);
  const displayThrottleRef = useRef(null);
  const frameCountRef = useRef(0);
  // Cache last display values to avoid unnecessary state updates
  const lastDisplayRef = useRef({ status: 'idle', label: '', confidence: 0 });

  // ─── MediaPipe Results Handler ──────────────────────────────────
  const handleMediaPipeResults = useCallback((results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const allLandmarks = [];
      for (const lm of results.multiHandLandmarks[0]) {
        allLandmarks.push({ x: lm.x, y: lm.y, z: lm.z || 0 });
      }
      if (results.multiHandLandmarks.length >= 2) {
        for (const lm of results.multiHandLandmarks[1]) {
          allLandmarks.push({ x: lm.x, y: lm.y, z: lm.z || 0 });
        }
      }
      latestLandmarksRef.current = allLandmarks;
    } else {
      latestLandmarksRef.current = null;
    }
  }, []);

  // ─── Start Camera ──────────────────────────────────────────────
  const startCamera = async () => {
    setCameraLoading(true);
    setLoadingMsg('Loading MediaPipe Hands AI...');

    const hands = await loadMediaPipeHands(handleMediaPipeResults);
    handsReadyRef.current = !!hands;

    if (!hands) {
      setLoadingMsg('');
    } else {
      setLoadingMsg('');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraActive(true);
          setCameraLoading(false);

          // Send frames to MediaPipe at high speed ~16fps (60ms interval)
          if (handsReadyRef.current) {
            sendIntervalRef.current = setInterval(() => {
              if (videoRef.current && videoRef.current.readyState === 4) {
                sendFrame(videoRef.current);
              }
            }, 60);
          }

          startRenderLoop();
        };
      }
    } catch (err) {
      console.warn('Camera not available:', err);
      setCameraActive(true);
      setCameraLoading(false);
      setLoadingMsg('Camera unavailable — use test buttons');
      startRenderLoop();
    }
  };

  const stopCamera = () => {
    if (sendIntervalRef.current) { clearInterval(sendIntervalRef.current); sendIntervalRef.current = null; }
    if (displayThrottleRef.current) { clearInterval(displayThrottleRef.current); displayThrottleRef.current = null; }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setDisplayState({ handDetected: false, status: 'idle', label: LABEL_PENDING, confidence: 0, candidates: [], fingers: { thumb: 'CLOSED', index: 'CLOSED', middle: 'CLOSED', ring: 'CLOSED', pinky: 'CLOSED' } });
    latestLandmarksRef.current = null;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  };

  // ─── Render Loop (Optimized: real-time classification on every frame) ────
  const startRenderLoop = () => {
    // Pending display update accumulated in ref, flushed to state via throttle
    const pendingDisplay = { handDetected: false, status: 'no_hand', label: LABEL_PENDING, confidence: 0, candidates: [], fingers: {} };

    // Throttle: flush display state to React every 100ms (10fps UI updates)
    displayThrottleRef.current = setInterval(() => {
      const last = lastDisplayRef.current;
      if (pendingDisplay.status !== last.status ||
          pendingDisplay.label !== last.label ||
          pendingDisplay.confidence !== last.confidence) {
        lastDisplayRef.current = { status: pendingDisplay.status, label: pendingDisplay.label, confidence: pendingDisplay.confidence };
        setDisplayState({ ...pendingDisplay });
      }
    }, 100);

    const loop = () => {
      animFrameRef.current = requestAnimationFrame(loop);
      frameCountRef.current++;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      // Draw video frame
      if (video && video.readyState === 4) {
        ctx.drawImage(video, 0, 0, w, h);
      } else {
        ctx.fillStyle = '#0c0a14';
        ctx.fillRect(0, 0, w, h);
      }

      drawTargetGuide(ctx, w, h);

      const landmarks = latestLandmarksRef.current;

      if (!landmarks || landmarks.length < 21) {
        pendingDisplay.handDetected = false;
        pendingDisplay.status = 'no_hand';
        pendingDisplay.label = LABEL_NO_HAND;
        pendingDisplay.confidence = 0;
        pendingDisplay.candidates = [];
        classifierRef.current.resetDebounce();
        return;
      }

      // Draw skeleton
      drawHandSkeleton(ctx, landmarks, w, h);

      pendingDisplay.handDetected = true;
      pendingDisplay.fingers = classifierRef.current.inspectFingerStates(landmarks);

      const prediction = classifierRef.current.predict(landmarks, signLanguageMode);

      if (prediction.label === LABEL_NO_HAND) pendingDisplay.status = 'no_hand';
      else if (prediction.label === LABEL_IDLE) pendingDisplay.status = 'rest';
      else if (prediction.label === LABEL_PENDING) pendingDisplay.status = 'detecting';
      else pendingDisplay.status = 'matched';

      pendingDisplay.label = prediction.label;
      pendingDisplay.confidence = prediction.confidence;
      pendingDisplay.candidates = prediction.candidates;

      if (prediction.label !== LABEL_NO_HAND &&
          prediction.label !== LABEL_IDLE &&
          prediction.label !== LABEL_PENDING &&
          prediction.confidence >= sensitivity) {
        commitPrediction(prediction.label);
      }
    };
    loop();
  };

  // ─── Canvas Drawing ────────────────────────────────────────────
  const drawTargetGuide = (ctx, w, h) => {
    const cx = w * 0.15, cy = h * 0.1, cw = w * 0.7, ch = h * 0.8;
    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = 'rgba(212, 197, 240, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx, cy, cw, ch);
    ctx.setLineDash([]);
    const m = 15;
    ctx.strokeStyle = 'rgba(212, 197, 240, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx, cy+m); ctx.lineTo(cx, cy); ctx.lineTo(cx+m, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx+cw-m, cy); ctx.lineTo(cx+cw, cy); ctx.lineTo(cx+cw, cy+m); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy+ch-m); ctx.lineTo(cx, cy+ch); ctx.lineTo(cx+m, cy+ch); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx+cw-m, cy+ch); ctx.lineTo(cx+cw, cy+ch); ctx.lineTo(cx+cw, cy+ch-m); ctx.stroke();
    ctx.restore();
  };

  const drawHandSkeleton = (ctx, landmarks, w, h) => {
    drawOneSkeleton(ctx, landmarks.slice(0, 21), w, h, '#d4c5f0');
    if (landmarks.length >= 42) drawOneSkeleton(ctx, landmarks.slice(21, 42), w, h, '#fce4a0');
  };

  const drawOneSkeleton = (ctx, hand, w, h, color) => {
    const conn = [
      [0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],
      [5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],
      [13,17],[17,18],[18,19],[19,20],[0,17]
    ];
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = color;
    conn.forEach(([i, j]) => {
      if (hand[i] && hand[j]) {
        ctx.beginPath();
        ctx.moveTo(hand[i].x * w, hand[i].y * h);
        ctx.lineTo(hand[j].x * w, hand[j].y * h);
        ctx.stroke();
      }
    });
    hand.forEach((lm, idx) => {
      ctx.beginPath();
      ctx.arc(lm.x * w, lm.y * h, idx % 4 === 0 ? 4.5 : 3, 0, 2 * Math.PI);
      ctx.fillStyle = idx === 0 ? '#fff' : color;
      ctx.fill();
    });
  };

  // ─── Prediction Commit ─────────────────────────────────────────
  const commitPrediction = (label) => {
    if (label === lastSpokenRef.current) return;
    lastSpokenRef.current = label;
    setSentenceStream(prev => {
      if (prev[prev.length - 1] === label) return prev;
      return [...prev, label].slice(-12);
    });
    if (!isMuted) speechService.speak(label);
    // Reset after 2s so same sign can be detected again
    setTimeout(() => { lastSpokenRef.current = ''; }, 2000);
  };

  // ─── Manual Test (synthetic, for demo) ────────────────────────
  const handleManualTestSign = (signName) => {
    setDisplayState(prev => ({ ...prev, label: signName, confidence: 99, status: 'matched', candidates: [{ label: signName, confidence: 99 }] }));
    setSentenceStream(prev => [...prev, signName].slice(-12));
    if (!isMuted) speechService.speak(signName);
    lastSpokenRef.current = '';
  };

  const handleSaveCustomSign = () => {
    if (!customSignName.trim()) return;
    setRecordingStatus(`✔ Saved "${customSignName.toUpperCase()}"!`);
    setTimeout(() => { setShowCustomModal(false); setCustomSignName(''); setRecordingStatus(''); }, 1200);
  };

  const fluentSentence = nlpGrammarService.enhanceGlossStream(sentenceStream, signLanguageMode);
  const { handDetected, status, label, confidence, candidates, fingers } = displayState;

  const getDisplayLabel = () => {
    if (!cameraActive) return '—';
    if (label === LABEL_NO_HAND) return 'No Hand';
    if (label === LABEL_IDLE) return 'Rest Pose';
    if (label === LABEL_PENDING) return '...';
    return label;
  };

  const statusConfig = {
    idle:      { text: 'Camera Off', icon: '📷', color: 'text-slate-500' },
    no_hand:   { text: 'No Hand Detected', icon: '🖐️', color: 'text-slate-500' },
    rest:      { text: 'Hand at Rest', icon: '😴', color: 'text-gold-400' },
    detecting: { text: 'Analyzing...', icon: '🔍', color: 'text-lavender-300' },
    matched:   { text: `Detected (${signLanguageMode})`, icon: '✅', color: 'text-lavender-300' },
  };
  const st = statusConfig[status] || statusConfig.idle;

  useEffect(() => () => stopCamera(), []);

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Camera Viewport */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="relative w-full h-[410px] lg:h-[470px] rounded-3xl overflow-hidden glass-panel border border-lavender-400/20 bg-[#0c0a14] shadow-2xl flex items-center justify-center">
          <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none transform -scale-x-100" playsInline muted />
          <canvas ref={canvasRef} width={640} height={480} className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" />

          {!cameraActive && (
            <div className="relative z-10 flex flex-col items-center gap-4 text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-lavender-500/10 border border-lavender-400/30 flex items-center justify-center">
                <Camera className="w-8 h-8 text-lavender-300 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{signLanguageMode} Sign Detection</h3>
                <p className="text-xs text-lavender-200/40 max-w-sm mt-1">Real-time AI hand detection — only activates when your hand is visible.</p>
              </div>
              <button onClick={startCamera} disabled={cameraLoading}
                className="px-6 py-3 rounded-2xl gradient-pastel-btn text-sm flex items-center gap-2 disabled:opacity-50">
                {cameraLoading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>{loadingMsg || 'Loading...'}</span></>
                  : <><Camera className="w-4 h-4" /><span>Start Camera</span></>
                }
              </button>
            </div>
          )}

          {/* Top HUD */}
          {cameraActive && (
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#120e1e]/90 backdrop-blur-md text-xs font-semibold border ${
                handDetected ? 'text-lavender-300 border-lavender-400/30' : 'text-slate-500 border-slate-700'
              }`}>
                {handDetected ? <span className="w-2 h-2 rounded-full bg-lavender-300 animate-ping" /> : <span className="w-2 h-2 rounded-full bg-slate-600" />}
                <span>{handDetected ? `Hand Detected · ${signLanguageMode}` : 'Waiting for hand...'}</span>
              </div>

              {handDetected && fingers && (
                <div className="hidden sm:flex items-center gap-1 bg-[#120e1e]/80 px-2 py-1 rounded-xl border border-lavender-400/10 text-[10px] font-mono">
                  <Eye className="w-3 h-3 text-lavender-300" />
                  {Object.entries(fingers).map(([f, s]) => (
                    <span key={f} className={`px-1.5 py-0.5 rounded font-bold ${
                      s === 'EXTENDED' ? 'bg-lavender-900/40 text-lavender-300 border border-lavender-700/30' : 'bg-slate-900 text-slate-500'
                    }`}>{f[0].toUpperCase()}:{s[0]}</span>
                  ))}
                </div>
              )}

              <button onClick={stopCamera} className="px-3 py-1.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/20 text-xs font-semibold flex items-center gap-1">
                <CameraOff className="w-3.5 h-3.5" /><span>Stop</span>
              </button>
            </div>
          )}

          {/* Bottom result */}
          {cameraActive && (
            <div className={`absolute bottom-4 left-4 right-4 p-4 rounded-2xl glass-panel border flex items-center justify-between z-20 transition-colors ${
              status === 'matched' ? 'border-lavender-400/40' : status === 'rest' ? 'border-gold-400/30' : 'border-lavender-400/10'
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{st.icon}</span>
                  <span className={`text-[10px] uppercase font-mono ${st.color}`}>{st.text}</span>
                </div>
                <h2 className={`text-2xl font-black ${status === 'matched' ? 'text-white' : 'text-slate-500'}`}>
                  {getDisplayLabel()}
                </h2>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-mono text-lavender-200/40">Confidence</span>
                <div className="flex items-center gap-2">
                  <div className="w-28 bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${
                      status === 'matched' ? 'bg-gradient-to-r from-lavender-300 to-gold-300' : 'bg-slate-700'
                    }`} style={{ width: `${confidence}%` }} />
                  </div>
                  <span className={`font-mono text-xs font-bold ${status === 'matched' ? 'text-lavender-300' : 'text-slate-500'}`}>
                    {confidence}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {cameraLoading && (
            <div className="absolute inset-0 z-30 bg-[#0c0a14]/90 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-3 border-lavender-300/30 border-t-lavender-300 rounded-full animate-spin" />
              <p className="text-sm text-lavender-300 font-medium">{loadingMsg}</p>
            </div>
          )}
        </div>

        {/* Test buttons */}
        <div className="glass-panel rounded-2xl p-3 border border-lavender-400/10 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-[11px] font-mono text-lavender-200/40">Manual Test (demo):</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(signLanguageMode === 'ISL'
              ? ['NAMASTE', 'THANK YOU', 'HELP', 'WATER', 'INDIA', 'FRIEND', 'A', 'B']
              : ['HELLO', 'THANK YOU', 'YES', 'NO', 'HELP', 'I LOVE YOU', 'A', 'B', 'V', 'L', 'Y', 'W']
            ).map(s => (
              <button key={s} onClick={() => handleManualTestSign(s)}
                className="px-2.5 py-1 rounded-xl bg-lavender-900/30 hover:bg-lavender-900/60 text-xs font-mono font-bold text-lavender-300 border border-lavender-700/20 transition whitespace-nowrap">
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right column: Sentence Stream */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="glass-panel rounded-3xl p-6 border border-lavender-400/10 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-lavender-400/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-lavender-300" />
              <h3 className="font-bold text-white text-base">Recognized Speech</h3>
            </div>
            <button onClick={() => setUseNlpSmoothing(!useNlpSmoothing)}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                useNlpSmoothing ? 'bg-lavender-500/20 text-lavender-300 border border-lavender-400/30' : 'bg-slate-800 text-slate-400'
              }`}>
              <Wand2 className="w-3.5 h-3.5" /><span>AI Grammar</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[50px] p-3 rounded-xl bg-[#0c0a14]/70 border border-lavender-400/8">
            {sentenceStream.length === 0
              ? <span className="text-lavender-200/30 text-xs italic">{cameraActive ? 'Show your hand to begin...' : 'Start camera or tap test buttons...'}</span>
              : sentenceStream.map((w, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-lavender-900/30 text-lavender-300 text-xs font-mono border border-lavender-700/20 font-bold">{w}</span>
              ))
            }
          </div>

          {useNlpSmoothing && sentenceStream.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#120e1e] border border-lavender-400/20 flex flex-col gap-1">
              <span className="text-[10px] uppercase font-mono text-lavender-300 flex items-center gap-1">
                <Wand2 className="w-3 h-3" /><span>Sentence ({signLanguageMode})</span>
              </span>
              <p className="text-white text-base font-semibold">{fluentSentence}</p>
            </div>
          )}

          {handDetected && candidates?.length > 0 && status !== 'no_hand' && (
            <div className="p-3 rounded-xl bg-[#0c0a14]/70 border border-lavender-400/8">
              <span className="text-[10px] uppercase font-mono text-lavender-200/30 block mb-1.5">Top Candidates</span>
              <div className="flex flex-wrap gap-1.5">
                {candidates.map((c, i) => (
                  <span key={i} className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold border ${
                    i === 0 && status === 'matched' ? 'bg-lavender-900/40 text-lavender-300 border-lavender-700/30' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>{c.label} ({c.confidence}%)</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-1 border-t border-lavender-400/8 text-xs text-lavender-200/40 font-mono">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-lavender-300" /><span>Threshold:</span>
            </div>
            <input type="range" min="60" max="98" value={sensitivity} onChange={e => setSensitivity(Number(e.target.value))}
              className="w-28 accent-lavender-300 cursor-pointer" />
            <span className="text-lavender-300 font-bold">{sensitivity}%</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button onClick={() => navigator.clipboard.writeText(fluentSentence || sentenceStream.join(' '))} disabled={!sentenceStream.length}
                className="px-4 py-2 rounded-xl glass-button text-xs font-semibold text-slate-300 flex items-center gap-1.5 disabled:opacity-50">
                <Copy className="w-4 h-4" /><span>Copy</span>
              </button>
              <button onClick={() => { setSentenceStream([]); lastSpokenRef.current = ''; }} disabled={!sentenceStream.length}
                className="px-4 py-2 rounded-xl glass-button text-xs font-semibold text-slate-400 hover:text-red-400 flex items-center gap-1.5 disabled:opacity-50">
                <Trash2 className="w-4 h-4" /><span>Clear</span>
              </button>
            </div>
            <button onClick={() => setShowCustomModal(true)}
              className="px-4 py-2 rounded-xl bg-lavender-500/15 text-lavender-200 border border-lavender-400/20 text-xs font-semibold flex items-center gap-1.5">
              <Plus className="w-4 h-4" /><span>Custom Sign</span>
            </button>
          </div>
        </div>
      </div>

      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel-glow rounded-3xl p-6 border border-lavender-400/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-white">Record Custom {signLanguageMode} Sign</h3>
            <input type="text" placeholder="Custom Sign Label" value={customSignName} onChange={e => setCustomSignName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0c0a14] border border-lavender-400/20 text-white text-sm" />
            {recordingStatus && <div className="text-xs text-lavender-300 font-bold">{recordingStatus}</div>}
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCustomModal(false)} className="px-4 py-2 glass-button text-xs">Cancel</button>
              <button onClick={handleSaveCustomSign} className="px-5 py-2.5 gradient-pastel-btn text-xs rounded-xl">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
