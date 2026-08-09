# 🌌 SignBridge — AI-Powered Two-Way Sign Language Translation Platform

> **Bridging Silent Gestures into Words — Real-Time ASL & ISL In-Browser Translation Engine.**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe_AI-Vision_Core-FF6F00?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/mediapipe)
[![Three.js](https://img.shields.io/badge/Three.js-3D_WebGL-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## 📖 Overview

**SignBridge** is a next-generation, client-side accessibility web platform designed to bridge communication barriers between the **Deaf** and **hearing** communities. 

Powered by **MediaPipe AI computer vision**, **3D WebGL vector math**, and **Web Speech synthesis**, SignBridge translates sign language to text in real time and animates spoken or typed words using an articulated 3D avatar—all running **100% locally in your browser with zero latency and complete privacy**.

---

## ✨ Key Features

### 🖐️ 1. Real-Time Sign → Text Recognition Engine
- **3D Vector Angle Mathematics**: Invariant to hand tilt, camera distance, zoom, or lighting conditions. Calculates exact joint bend cosines $\cos(\theta)$ across all 21 hand landmarks.
- **Complete A–Z & 1–10 Vocabulary Support**: Full recognition for all 26 American Sign Language (ASL) and Indian Sign Language (ISL) letters plus numbers 1 to 10.
- **Anatomically Precise Discriminators**: Fine-grained spatial metrics to distinguish complex overlapping signs (**K, V, I, O, C, E, G, H, J, L, M, N, P, Q, S, T, 5**).
- **Dual-Handed ISL Support**: 42-landmark inter-hand distance tracking for two-handed Indian Sign Language signs.

### 🤖 2. 3D Articulated Sign Language Avatar
- **WebGL Character Renderer**: Articulated 3D avatar with smooth Joint-Angle IK motion synthesis.
- **5 Perspective Camera Views**: Toggle camera angles on-the-fly to view signs clearly:
  - 🎥 **Front View**
  - ↖️ **Left 3/4 View**
  - ↗️ **Right 3/4 View**
  - ⬅️ **Left Side View**
  - ➡️ **Right Side View**
- **Dynamic Speed & Customization**: Adjustable signing speed ($0.5x$ to $2.0x$) and customizable skin, shirt, and avatar aesthetics.

### 🎙️ 3. Voice & Audio → Sign Pipeline
- **Live Speech Recognition**: Speak naturally into your microphone to generate real-time sign language animations.
- **Pre-Recorded Audio File Processing**: Upload `.MP3` or `.WAV` voice notes. Includes a downloadable sample MP3 (`sample_voice_asl_isl.mp3`) with a 1-click test suite.

### 💬 4. Two-Way Conversation Mode
- Dual split-screen interface enabling seamless, real-time dialogues between Deaf and hearing individuals.

### 📹 5. AR Video Call Overlay
- Virtual video calling environment featuring picture-in-picture 3D signing overlay and live AI captions.

### 📚 6. A to Z Interactive Learning Hub
- Gamified curriculum for letters A–Z and numbers 1–10 with live camera landmark evaluation, accuracy scoring, and confetti rewards.

### 🌌 7. Upagraha '26 Inspired Cyberpunk Landing Page
- Interactive 3D orbital starfield canvas, Orbitron & Plus Jakarta Sans typography, mouse parallax 3D glassmorphism cards, and an embedded live signing stage.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: React 18, Vite 8, JavaScript (ES2023)
- **Computer Vision & AI**: `@mediapipe/hands` (WASM + MediaPipe CDN)
- **3D Graphics & Animation**: Three.js (WebGL Renderer)
- **Styling & UI**: TailwindCSS v4, Lucide Icons, Glassmorphism design system
- **Typography**: Orbitron, Michroma, Rajdhani, Outfit, Plus Jakarta Sans

---

## 🚀 Quick Start

### Prerequisites
Make sure you have **Node.js** (v18.0 or higher) and **npm** installed.

### 1. Clone the Repository
```bash
git clone https://github.com/Shreeya7/SignBridge.git
cd SignBridge
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://127.0.0.1:5173/`.

### 4. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
SignBridge/
├── public/
│   ├── sample_voice_asl_isl.mp3    # Sample test audio file for Voice-to-Sign
│   └── sample_voice_asl_isl.wav    # Sample WAV audio file
├── src/
│   ├── assets/                     # Static imagery and logos
│   ├── components/
│   │   ├── AvatarCanvas.jsx         # Three.js 3D Avatar WebGL renderer & camera views
│   │   ├── AvatarCustomizerModal.jsx # Avatar appearance customizer
│   │   ├── ConversationMode.jsx     # Split-screen two-way dialogue mode
│   │   ├── EmergencyPhrases.jsx     # Quick emergency sign access
│   │   ├── FluencyAnalytics.jsx     # Learning stats & progress tracking
│   │   ├── LandingPage.jsx          # Cyberpunk landing page with starfield canvas
│   │   ├── LearnModule.jsx          # Interactive A-Z camera practice arena
│   │   ├── Navbar.jsx               # Top navigation bar & mode toggles
│   │   ├── SignToText.jsx           # Real-time camera sign translation module
│   │   ├── TextToSign.jsx           # Text-to-sign avatar generator
│   │   ├── VideoCallMode.jsx        # AR video call overlay module
│   │   └── VoiceToSign.jsx          # Voice speech & audio file translation module
│   ├── services/
│   │   ├── aslDictionary.js         # ASL & ISL sign token database & sequence expansion
│   │   ├── knnClassifier.js         # 3D Vector angle landmark classifier
│   │   ├── mediapipeLoader.js       # MediaPipe Hands CDN loader & stream pipeline
│   │   └── speechService.js         # Web Speech API wrapper
│   ├── App.jsx                      # Main app controller & view router
│   ├── main.jsx                     # React entrypoint
│   └── index.css                    # Tailwind CSS & design tokens
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔒 Privacy & Safety Guarantee

SignBridge operates **100% locally in your web browser**. Camera streams and audio recordings are processed on-device using WebAssembly and WebGL—**no video or audio data is ever transmitted or uploaded to external servers**.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">Made with ❤️ for inclusive communication equality.</p>
