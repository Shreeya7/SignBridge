import React, { useState, useEffect, useRef } from 'react';
import {
  Camera, Bot, Mic, MessageSquare, GraduationCap,
  Sparkles, ArrowRight, Shield, Globe, Heart,
  HandMetal, Video, Play, Zap, CheckCircle2, Star, Layers, Eye, Activity, Terminal
} from 'lucide-react';
import { AvatarCanvas } from './AvatarCanvas';
import { parseSentenceToSignTokens } from '../services/aslDictionary';

/**
 * Upagraha '26 Inspired Cyberpunk Landing Page v11.0
 * Features:
 *  - Orbitron / Michroma Futuristic Typography & Cyber Title Block
 *  - Preloader Energy Core Ring Animation
 *  - Orbital Starfield & Energy Matrix Canvas Backdrop (Scroll Reactive)
 *  - Futuristic HUD Metric Counters & Cyber Corner Notched Cards
 *  - Interactive 3D Avatar Demo Stage
 */
export function LandingPage({ onGetStarted }) {
  const [activeDemoText, setActiveDemoText] = useState('HELLO');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [tiltStyle, setTiltStyle] = useState({});
  const canvasRef = useRef(null);

  const demoTokens = parseSentenceToSignTokens(activeDemoText, 'ASL');

  // Preloader initialization (Upagraha 26 energy core style)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = Math.min(1, Math.max(0, currentScroll / (totalScroll || 1)));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Upagraha '26 Starfield & Orbital Energy Portal Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 120 Space Starfield Points
    const starCount = 120;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      z: Math.random() * 2 + 0.5,
      radius: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.8 + 0.2
    }));

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h * 0.4;

      // Color Hue shifts on scroll
      const curScroll = scrollProgress;
      const baseHue1 = 265 + curScroll * 60; // 265 (Lavender)
      const baseHue2 = 45 + curScroll * 45;   // 45 (Gold)

      // 1. Cyber Perspective Grid Lines at Bottom
      ctx.lineWidth = 1;
      const gridY = h * 0.7;
      const horizonY = h * 0.45;
      for (let x = -w; x < w * 2; x += 60) {
        ctx.strokeStyle = `hsla(${baseHue1}, 70%, 65%, ${0.05 + curScroll * 0.04})`;
        ctx.beginPath();
        ctx.moveTo(cx, horizonY);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = horizonY; y < h; y += 25) {
        const lineAlpha = ((y - horizonY) / (h - horizonY)) * 0.12;
        ctx.strokeStyle = `hsla(${baseHue2}, 80%, 75%, ${lineAlpha})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Rotating Upagraha Orbital Energy Rings around Hero Center
      const ringCount = 3;
      for (let r = 0; r < ringCount; r++) {
        const radius = 180 + r * 110 + Math.sin(time + r) * 20;
        const ringAngle = time * (0.4 - r * 0.1);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ringAngle);
        ctx.scale(1, 0.4); // 3D Perspective Ellipse tilt

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = (r % 2 === 0)
          ? `hsla(${baseHue1}, 85%, 75%, ${0.15 - r * 0.03})`
          : `hsla(${baseHue2}, 90%, 70%, ${0.15 - r * 0.03})`;
        ctx.lineWidth = 1.5 + r * 0.5;
        ctx.setLineDash([15 + r * 10, 10 + r * 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // 3. Render Floating Starfield Particles
      stars.forEach((s, idx) => {
        s.y -= s.z * 0.3;
        if (s.y < 0) s.y = h;

        const starHue = (idx % 3 === 0) ? baseHue2 : baseHue1;
        ctx.fillStyle = `hsla(${starHue}, 85%, 80%, ${s.alpha * (0.6 + Math.sin(time * 2 + idx) * 0.4)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [scrollProgress]);

  // Card 3D tilt hover handler
  const handleMouseMove = (e, index) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTiltStyle(prev => ({
      ...prev,
      [index]: {
        transform: `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg) scale3d(1.02, 1.02, 1.02)`
      }
    }));
  };

  const handleMouseLeave = (index) => {
    setTiltStyle(prev => ({
      ...prev,
      [index]: { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' }
    }));
  };

  const features = [
    {
      icon: Camera,
      title: 'Sign → Text AI Core',
      desc: 'Real-time 3D landmark angle vector matching converts live webcam sign gestures into text instantly.',
      badge: 'VISION AI'
    },
    {
      icon: Bot,
      title: '3D Articulated Avatar',
      desc: '5-angle perspective character stage (Left/Right 3/4 & Side) rendering authentic two-handed ASL & ISL.',
      badge: 'WEBGL 3D'
    },
    {
      icon: Mic,
      title: 'Voice → Sign Pipeline',
      desc: 'High-accuracy speech-to-text pipeline generates real-time sign language avatar movements.',
      badge: 'SPEECH AI'
    },
    {
      icon: MessageSquare,
      title: 'Split-Screen Conversation',
      desc: 'Two-way real-time conversation suite connecting Deaf and hearing individuals effortlessly.',
      badge: 'DUAL MODE'
    },
    {
      icon: Video,
      title: 'AR Video Call Overlay',
      desc: 'Virtual video calling suite with picture-in-picture 3D signing overlay and live captions.',
      badge: 'AR CALL'
    },
    {
      icon: GraduationCap,
      title: 'A-Z Learning Hub',
      desc: 'Interactive 26-letter (A-Z) curriculum with numbers (1-10) and live webcam practice evaluation.',
      badge: 'A-Z HUB'
    },
  ];

  return (
    <div className="relative min-h-screen text-slate-100 overflow-x-hidden selection:bg-lavender-400/30 font-jakarta">
      {/* Upagraha '26 Preloader Energy Core */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#08060f] flex flex-col items-center justify-center gap-6 transition-opacity duration-700">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-lavender-400/40 border-t-gold-400 animate-spin" style={{ animationDuration: '1.2s' }} />
            <div className="absolute inset-2 rounded-full border-2 border-gold-400/30 border-b-lavender-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.8s' }} />
            <Sparkles className="w-8 h-8 text-gold-400 animate-pulse" />
          </div>
          <div className="font-orbitron text-xs font-black tracking-[0.25em] text-lavender-300 animate-pulse">
            INITIALIZING SIGNBRIDGE
          </div>
        </div>
      )}

      {/* ═══ Starfield & Orbital Energy Portal Canvas ═══ */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
        style={{ opacity: 0.9 }}
      />

      {/* Background Cyber Orbs */}
      <div className="fixed rounded-full blur-[150px] pointer-events-none z-0" style={{ width: '700px', height: '700px', top: '-15%', left: '10%', background: 'radial-gradient(circle, rgba(212, 197, 240, 0.14) 0%, rgba(0,0,0,0) 70%)' }} />
      <div className="fixed rounded-full blur-[150px] pointer-events-none z-0" style={{ width: '600px', height: '600px', bottom: '5%', right: '10%', background: 'radial-gradient(circle, rgba(252, 228, 160, 0.12) 0%, rgba(0,0,0,0) 70%)' }} />

      {/* ═══ Top Cyber Navigation Bar ═══ */}
      <nav className="sticky top-0 z-50 w-full px-6 lg:px-12 py-4 bg-[#08060f]/80 backdrop-blur-xl border-b border-lavender-400/15 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onGetStarted}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-lavender-400 via-gold-300 to-lavender-300 p-0.5 shadow-lg animate-pulse-glow">
            <div className="w-full h-full bg-[#08060f] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron text-xl font-black gradient-text tracking-wider uppercase">SIGNBRIDGE</span>
            <span className="font-michroma text-[9px] text-gold-400/80 tracking-widest uppercase">ACCESSIBILITY TECH</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lavender-500/10 border border-lavender-400/20 text-xs font-mono text-lavender-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>ASL + ISL ENGINE</span>
          </div>

          <button
            onClick={onGetStarted}
            className="px-6 py-2.5 rounded-xl gradient-pastel-btn text-xs font-black font-orbitron tracking-wider text-[#1a1028] shadow-xl hover:scale-105 transition flex items-center gap-2"
          >
            <span>LAUNCH APP</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* ═══ Hero Section ═══ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Cyber Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card-light text-xs font-bold text-lavender-300 border border-lavender-400/30 mb-6 shadow-md font-mono">
            <Terminal className="w-3.5 h-3.5 text-gold-400" />
            <span>AI-POWERED TWO-WAY SIGN LANGUAGE PLATFORM</span>
          </div>

          {/* Title Block — ONLY SIGNBRIDGE */}
          <h1 className="font-orbitron font-black text-5xl sm:text-6xl lg:text-7xl tracking-wider leading-[1.08] mb-6 uppercase">
            <span className="gradient-text-hero">SIGNBRIDGE</span>
          </h1>

          <p className="font-rajdhani text-lg sm:text-xl font-medium text-lavender-200/80 max-w-xl leading-relaxed mb-8">
            Empowering communication equality between Deaf and hearing communities through real-time MediaPipe AI computer vision, two-handed ISL/ASL dictionary translation, and interactive 3D WebGL avatars.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 rounded-xl gradient-pastel-btn text-sm font-black font-orbitron tracking-wider text-[#1a1028] shadow-2xl flex items-center gap-3 hover:scale-105 transition"
            >
              <Camera className="w-5 h-5" />
              <span>START CAMERA RECOGNITION</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGetStarted}
              className="px-8 py-4 rounded-xl glass-button text-sm font-bold font-orbitron tracking-wider text-lavender-200 flex items-center gap-2 hover:bg-lavender-400/10 transition"
            >
              <GraduationCap className="w-5 h-5 text-gold-400" />
              <span>A-Z LEARNING HUB</span>
            </button>
          </div>

          {/* Upagraha Cyber HUD Metric Countdown / Spec Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl font-mono text-xs">
            {[
              { val: '300+', label: 'SIGNS' },
              { val: '2', label: 'LANGUAGES' },
              { val: '<60ms', label: 'LATENCY' },
              { val: '100%', label: 'PRIVACY' }
            ].map((hud, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#120e1e]/90 border border-lavender-400/20 text-center shadow-md">
                <span className="block font-orbitron font-extrabold text-sm text-gold-300">{hud.val}</span>
                <span className="text-[10px] text-lavender-200/50 tracking-widest">{hud.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Interactive 3D Avatar Stage Card */}
        <div className="lg:col-span-5 w-full">
          <div className="cyber-card rounded-3xl p-5 border border-lavender-400/30 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-lavender-400/15 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-ping" />
                <span className="font-orbitron text-xs font-bold text-white tracking-wider">LIVE 3D SIGNING STAGE</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lavender-500/20 text-lavender-300 border border-lavender-400/30">ONLINE</span>
            </div>

            {/* 3D Canvas Stage */}
            <div className="w-full h-[330px] rounded-2xl overflow-hidden border border-lavender-400/20 bg-[#08060f]">
              <AvatarCanvas sequence={demoTokens} isPlaying={true} speed={1.0} />
            </div>

            {/* Phrase Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-mono text-lavender-200/50 tracking-wider">Select phrase to sign live:</span>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {['HELLO', 'THANK YOU', 'LOVE', 'WATER', 'YES'].map(word => (
                  <button
                    key={word}
                    onClick={() => setActiveDemoText(word)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition whitespace-nowrap ${
                      activeDemoText === word
                        ? 'bg-lavender-300 text-[#1a1028] shadow-md font-orbitron'
                        : 'glass-button text-lavender-200/60 hover:text-white'
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Upagraha Cyber Matrix Feature Cards Section ═══ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-orbitron text-xs tracking-widest uppercase text-gold-400">STATE-OF-THE-ART MODULES</span>
          <h2 className="font-orbitron font-black text-3xl sm:text-5xl text-white mt-2 mb-4 tracking-wide uppercase">
            POWERFUL ACCESSIBILITY PLATFORM
          </h2>
          <p className="font-rajdhani text-sm sm:text-base text-lavender-200/70 font-medium">
            Architected with WebGL 3D avatar animation, MediaPipe computer vision, and speech synthesis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                onMouseMove={e => handleMouseMove(e, idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                style={tiltStyle[idx] || {}}
                className="cyber-card group p-8 rounded-3xl transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-lavender-400 via-gold-300 to-lavender-300 p-0.5 shadow-lg group-hover:scale-110 transition-transform">
                      <div className="w-full h-full bg-[#08060f] rounded-[14px] flex items-center justify-center">
                        <Icon className="w-7 h-7 text-lavender-300" />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-lavender-500/10 text-lavender-300 border border-lavender-400/20">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-orbitron text-lg font-bold text-white mb-3 tracking-wide group-hover:text-gold-300 transition">
                    {feat.title}
                  </h3>

                  <p className="font-jakarta text-xs text-lavender-200/60 leading-relaxed font-light mb-6">
                    {feat.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 font-orbitron text-xs font-bold text-lavender-300 group-hover:text-gold-300 transition">
                  <span>LAUNCH MODULE</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ Call to Action Section ═══ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="cyber-card rounded-3xl p-10 lg:p-16 border border-lavender-400/30 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-lavender-400 via-gold-300 to-lavender-300 p-0.5 mb-6 shadow-xl animate-bounce">
            <div className="w-full h-full bg-[#08060f] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gold-400" />
            </div>
          </div>

          <h2 className="font-orbitron font-black text-3xl sm:text-5xl text-white mb-4 max-w-2xl leading-tight uppercase tracking-wide">
            EXPERIENCE INSTANT SIGN LANGUAGE TRANSLATION NOW
          </h2>

          <p className="font-rajdhani text-base text-lavender-200/70 max-w-lg mb-8 font-medium">
            Zero setup required. Run real-time ASL & ISL translation directly inside your browser right now.
          </p>

          <button
            onClick={onGetStarted}
            className="px-10 py-5 rounded-xl gradient-pastel-btn font-orbitron font-black text-sm tracking-wider text-[#1a1028] shadow-2xl hover:scale-105 transition flex items-center gap-3"
          >
            <span>LAUNCH SIGNBRIDGE STUDIO</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 lg:px-12 py-8 border-t border-lavender-400/15 text-center font-mono text-xs text-lavender-200/40">
        <p>© 2026 SIGNBRIDGE — ACCESSIBILITY ENGINE EDITION. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
