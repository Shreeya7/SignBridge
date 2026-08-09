import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, FastForward, Eye, Layers } from 'lucide-react';

export function AvatarCanvas({
  sequence = [],
  speed = 1.0,
  isPlaying = true,
  avatarConfig = { skinColor: '#bae6fd', outfitColor: '#1e293b', jointColor: '#a7f3d0' },
  onComplete
}) {
  const mountRef = useRef(null);
  const [currentSubtitles, setCurrentSubtitles] = useState('');
  const [activeTokenIndex, setActiveTokenIndex] = useState(0);
  const [playingState, setPlayingState] = useState(isPlaying);
  const [playbackSpeed, setPlaybackSpeed] = useState(speed);
  const [show2dDiagram, setShow2dDiagram] = useState(true);

  // References for Three.js objects
  const sceneRef = useRef(null);
  const avatarGroupRef = useRef(null);
  const jointsRef = useRef({});
  const animationFrameRef = useRef(null);
  const playbackSpeedRef = useRef(speed);

  // Current token pose details for 2D Hand Diagram HUD
  const [activeTokenData, setActiveTokenData] = useState(null);

  // Dual Arm Pose State
  const currentPoseRef = useRef({
    leftArm: { shoulderX: 0.1, shoulderY: -0.2, elbowZ: 0.3, wristY: 0 },
    leftFingers: { thumb: 0.8, index: 0.8, middle: 0.8, ring: 0.8, pinky: 0.8, spread: 0.1 },
    rightArm: { shoulderX: 0.1, shoulderY: 0.2, elbowZ: -0.3, wristY: 0 },
    rightFingers: { thumb: 0.8, index: 0.8, middle: 0.8, ring: 0.8, pinky: 0.8, spread: 0.1 },
    headTilt: { x: 0, y: 0 }
  });

  const targetPoseRef = useRef({
    leftArm: { shoulderX: 0.1, shoulderY: -0.2, elbowZ: 0.3, wristY: 0 },
    leftFingers: { thumb: 0.8, index: 0.8, middle: 0.8, ring: 0.8, pinky: 0.8, spread: 0.1 },
    rightArm: { shoulderX: 0.1, shoulderY: 0.2, elbowZ: -0.3, wristY: 0 },
    rightFingers: { thumb: 0.8, index: 0.8, middle: 0.8, ring: 0.8, pinky: 0.8, spread: 0.1 },
    headTilt: { x: 0, y: 0 }
  });

  useEffect(() => {
    setPlayingState(isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  const [cameraAngle, setCameraAngle] = useState('front'); // 'sideLeft' | 'threeQuarterLeft' | 'front' | 'threeQuarterRight' | 'sideRight'
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!cameraRef.current) return;
    if (cameraAngle === 'sideLeft') cameraRef.current.position.set(-1.4, 1.3, 1.5);
    else if (cameraAngle === 'threeQuarterLeft') cameraRef.current.position.set(-0.7, 1.3, 2.0);
    else if (cameraAngle === 'front') cameraRef.current.position.set(0, 1.3, 2.2);
    else if (cameraAngle === 'threeQuarterRight') cameraRef.current.position.set(0.7, 1.3, 2.0);
    else if (cameraAngle === 'sideRight') cameraRef.current.position.set(1.4, 1.3, 1.5);
    cameraRef.current.lookAt(0, 1.1, 0);
  }, [cameraAngle]);

  // Setup Three.js 3D Animated Character
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    if (cameraAngle === 'front') camera.position.set(0, 1.3, 2.3);
    else if (cameraAngle === 'threeQuarter') camera.position.set(0.65, 1.3, 2.1);
    else if (cameraAngle === 'side') camera.position.set(1.3, 1.3, 1.6);
    camera.lookAt(0, 1.1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Mellow Pastel Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xbae6fd, 1.5);
    mainLight.position.set(2, 4, 3);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xddd6fe, 1.0);
    fillLight.position.set(-2, 2, -1);
    scene.add(fillLight);

    // Grid Floor
    const grid = new THREE.GridHelper(10, 20, 0x67e8f9, 0x1e293b);
    grid.position.y = 0;
    scene.add(grid);

    // Avatar Group
    const avatarGroup = new THREE.Group();
    avatarGroupRef.current = avatarGroup;
    scene.add(avatarGroup);

    const joints = {};

    // Dynamic Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(avatarConfig.outfitColor || '#1e293b'),
      roughness: 0.3,
      metalness: 0.5
    });
    const jointMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(avatarConfig.jointColor || '#d4c5f0'),
      roughness: 0.2,
      metalness: 0.8
    });
    const skinMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(avatarConfig.skinColor || '#fce4a0'),
      roughness: 0.3,
      metalness: 0.2
    });
    // High-Contrast Fingertip Material for maximum visibility during signing
    const tipMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#fce4a0'),
      roughness: 0.1,
      metalness: 0.9,
      emissive: new THREE.Color('#f5d170'),
      emissiveIntensity: 0.4
    });

    // Torso / Chest
    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.6, 16), bodyMat);
    chest.position.set(0, 1.0, 0);
    avatarGroup.add(chest);

    // Neck & Head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.12, 12), bodyMat);
    neck.position.set(0, 1.36, 0);
    avatarGroup.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.52, 0);
    avatarGroup.add(headGroup);
    joints.head = headGroup;

    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 24), bodyMat);
    headGroup.add(headMesh);

    // Glowing Eye Visor
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.05, 0.1), jointMat);
    visor.position.set(0, 0.02, 0.12);
    headGroup.add(visor);

    // RIGHT ARM RIG
    const rightShoulder = new THREE.Group();
    rightShoulder.position.set(0.32, 1.25, 0.18);
    avatarGroup.add(rightShoulder);
    joints.rightShoulder = rightShoulder;

    rightShoulder.add(new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), jointMat));
    const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.35, 12), bodyMat);
    rightUpperArm.position.set(0.12, -0.16, 0.05);
    rightUpperArm.rotation.z = -0.3;
    rightShoulder.add(rightUpperArm);

    const rightElbow = new THREE.Group();
    rightElbow.position.set(0.22, -0.32, 0.05);
    rightShoulder.add(rightElbow);
    joints.rightElbow = rightElbow;

    rightElbow.add(new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), jointMat));
    const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.35, 12), bodyMat);
    rightForearm.position.set(0, -0.16, 0.05);
    rightElbow.add(rightForearm);

    const rightWrist = new THREE.Group();
    rightWrist.position.set(0, -0.34, 0.05);
    rightElbow.add(rightWrist);
    joints.rightWrist = rightWrist;

    const rightPalm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.05), skinMat);
    rightPalm.position.set(0, -0.07, 0.02);
    rightWrist.add(rightPalm);

    joints.rightFingers = [];
    const xOffsets = [-0.048, -0.032, 0.0, 0.032, 0.048];
    const fingerLengths = [0.05, 0.068, 0.075, 0.068, 0.055]; // Enriched finger lengths for maximum visual clarity
    for (let f = 0; f < 5; f++) {
      const segments = [];
      // Proximal phalanx (attaches to palm)
      const seg1 = new THREE.Group();
      if (f === 0) seg1.position.set(-0.07, -0.05, 0.02);
      else seg1.position.set(xOffsets[f], -0.14, 0.01);
      rightWrist.add(seg1);
      const bone1 = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.020, fingerLengths[f], 10), skinMat);
      bone1.position.set(0, -fingerLengths[f]/2, 0);
      seg1.add(bone1);
      seg1.add(new THREE.Mesh(new THREE.SphereGeometry(0.020, 10, 10), jointMat));
      segments.push(seg1);

      // Middle phalanx
      const seg2 = new THREE.Group();
      seg2.position.set(0, -fingerLengths[f], 0);
      seg1.add(seg2);
      const midLen = fingerLengths[f] * 0.75;
      const bone2 = new THREE.Mesh(new THREE.CylinderGeometry(0.020, 0.017, midLen, 10), skinMat);
      bone2.position.set(0, -midLen/2, 0);
      seg2.add(bone2);
      seg2.add(new THREE.Mesh(new THREE.SphereGeometry(0.017, 10, 10), jointMat));
      segments.push(seg2);

      // Distal phalanx (fingertip)
      const seg3 = new THREE.Group();
      seg3.position.set(0, -midLen, 0);
      seg2.add(seg3);
      const tipLen = fingerLengths[f] * 0.5;
      const bone3 = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.012, tipLen, 10), skinMat);
      bone3.position.set(0, -tipLen/2, 0);
      seg3.add(bone3);
      // High-contrast glowing fingertip cap
      const tipCap = new THREE.Mesh(new THREE.SphereGeometry(0.015, 10, 10), tipMat);
      tipCap.position.set(0, -tipLen, 0);
      seg3.add(tipCap);
      segments.push(seg3);

      joints.rightFingers.push({ segments });
    }

    // LEFT ARM RIG
    const leftShoulder = new THREE.Group();
    leftShoulder.position.set(-0.32, 1.25, 0.18);
    avatarGroup.add(leftShoulder);
    joints.leftShoulder = leftShoulder;

    leftShoulder.add(new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), jointMat));
    const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.35, 12), bodyMat);
    leftUpperArm.position.set(-0.12, -0.16, 0.05);
    leftUpperArm.rotation.z = 0.3;
    leftShoulder.add(leftUpperArm);

    const leftElbow = new THREE.Group();
    leftElbow.position.set(-0.22, -0.32, 0.05);
    leftShoulder.add(leftElbow);
    joints.leftElbow = leftElbow;

    leftElbow.add(new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), jointMat));
    const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.35, 12), bodyMat);
    leftForearm.position.set(0, -0.16, 0.05);
    leftElbow.add(leftForearm);

    const leftWrist = new THREE.Group();
    leftWrist.position.set(0, -0.34, 0.05);
    leftElbow.add(leftWrist);
    joints.leftWrist = leftWrist;

    const leftPalm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.05), skinMat);
    leftPalm.position.set(0, -0.07, 0.02);
    leftWrist.add(leftPalm);

    joints.leftFingers = [];
    for (let f = 0; f < 5; f++) {
      const segments = [];
      const seg1 = new THREE.Group();
      if (f === 0) seg1.position.set(0.07, -0.05, 0.02);
      else seg1.position.set(-xOffsets[f], -0.14, 0.01);
      leftWrist.add(seg1);
      const bone1 = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.020, fingerLengths[f], 10), skinMat);
      bone1.position.set(0, -fingerLengths[f]/2, 0);
      seg1.add(bone1);
      seg1.add(new THREE.Mesh(new THREE.SphereGeometry(0.020, 10, 10), jointMat));
      segments.push(seg1);

      const seg2 = new THREE.Group();
      seg2.position.set(0, -fingerLengths[f], 0);
      seg1.add(seg2);
      const midLen = fingerLengths[f] * 0.75;
      const bone2 = new THREE.Mesh(new THREE.CylinderGeometry(0.020, 0.017, midLen, 10), skinMat);
      bone2.position.set(0, -midLen/2, 0);
      seg2.add(bone2);
      seg2.add(new THREE.Mesh(new THREE.SphereGeometry(0.017, 10, 10), jointMat));
      segments.push(seg2);

      const seg3 = new THREE.Group();
      seg3.position.set(0, -midLen, 0);
      seg2.add(seg3);
      const tipLen = fingerLengths[f] * 0.5;
      const bone3 = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.012, tipLen, 10), skinMat);
      bone3.position.set(0, -tipLen/2, 0);
      seg3.add(bone3);
      const tipCap = new THREE.Mesh(new THREE.SphereGeometry(0.015, 10, 10), tipMat);
      tipCap.position.set(0, -tipLen, 0);
      seg3.add(tipCap);
      segments.push(seg3);

      joints.leftFingers.push({ segments });
    }

    jointsRef.current = joints;

    // Animation Render Loop with Cubic Spring Easing
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const lerpSpeed = 12.0 * playbackSpeedRef.current * delta; // Springy fast response

      const cur = currentPoseRef.current;
      const target = targetPoseRef.current;

      // Right Arm
      cur.rightArm.shoulderX += (target.rightArm.shoulderX - cur.rightArm.shoulderX) * lerpSpeed;
      cur.rightArm.shoulderY += (target.rightArm.shoulderY - cur.rightArm.shoulderY) * lerpSpeed;
      cur.rightArm.elbowZ += (target.rightArm.elbowZ - cur.rightArm.elbowZ) * lerpSpeed;
      cur.rightArm.wristY += (target.rightArm.wristY - cur.rightArm.wristY) * lerpSpeed;

      // Left Arm
      cur.leftArm.shoulderX += (target.leftArm.shoulderX - cur.leftArm.shoulderX) * lerpSpeed;
      cur.leftArm.shoulderY += (target.leftArm.shoulderY - cur.leftArm.shoulderY) * lerpSpeed;
      cur.leftArm.elbowZ += (target.leftArm.elbowZ - cur.leftArm.elbowZ) * lerpSpeed;
      cur.leftArm.wristY += (target.leftArm.wristY - cur.leftArm.wristY) * lerpSpeed;

      // Apply Rotations — -Math.abs() guarantees arms rotate FORWARD (+Z towards camera) in front of the body
      if (joints.rightShoulder) {
        joints.rightShoulder.rotation.x = -Math.abs(cur.rightArm.shoulderX);
        joints.rightShoulder.rotation.y = cur.rightArm.shoulderY;
      }
      if (joints.rightElbow) joints.rightElbow.rotation.z = cur.rightArm.elbowZ;
      if (joints.rightWrist) {
        joints.rightWrist.rotation.y = cur.rightArm.wristY;
        // NEGATIVE X tilt rotates wrist/palm FORWARD into open air towards camera (+Z), preventing any chest clipping!
        const rightFlexAvg = ((target.rightFingers?.index ?? 0.5) + (target.rightFingers?.middle ?? 0.5)) / 2;
        const wristOutwardX = -(1.0 - rightFlexAvg) * 0.65; // NEGATIVE angle projects fingers forward into air!
        const wristOutwardZ = (1.0 - rightFlexAvg) * -0.30;
        joints.rightWrist.rotation.x = wristOutwardX;
        joints.rightWrist.rotation.z = wristOutwardZ;
      }

      if (joints.leftShoulder) {
        joints.leftShoulder.rotation.x = -Math.abs(cur.leftArm.shoulderX);
        joints.leftShoulder.rotation.y = cur.leftArm.shoulderY;
      }
      if (joints.leftElbow) joints.leftElbow.rotation.z = cur.leftArm.elbowZ;
      if (joints.leftWrist) {
        joints.leftWrist.rotation.y = cur.leftArm.wristY;
        const leftFlexAvg = ((target.leftFingers?.index ?? 0.5) + (target.leftFingers?.middle ?? 0.5)) / 2;
        const wristOutwardX = -(1.0 - leftFlexAvg) * 0.65; // NEGATIVE angle projects fingers forward into air!
        const wristOutwardZ = (1.0 - leftFlexAvg) * 0.30;
        joints.leftWrist.rotation.x = wristOutwardX;
        joints.leftWrist.rotation.z = wristOutwardZ;
      }

      // Fingers — Anatomical 3-segment articulation for Thumb vs Index/Middle/Ring/Pinky
      ['right', 'left'].forEach((side) => {
        const fingerJoints = joints[`${side}Fingers`];
        const fingerData = target[`${side}Fingers`] || {};
        const keys = ['thumb', 'index', 'middle', 'ring', 'pinky'];
        const spread = fingerData.spread || 0;

        if (fingerJoints) {
          keys.forEach((k, idx) => {
            const ext = fingerData[k] !== undefined ? fingerData[k] : 0.5;
            const fObj = fingerJoints[idx];
            if (fObj && fObj.segments) {
              if (idx === 0) {
                // THUMB ARTICULATION: Thumb CMC/IP joints fold across palm
                const thumbFlex = (1.0 - ext);
                const seg0 = fObj.segments[0];
                const seg1 = fObj.segments[1];
                const seg2 = fObj.segments[2];
                if (seg0) {
                  const targetZ = (side === 'right' ? 1 : -1) * (thumbFlex * 0.75 + (spread * 0.4));
                  seg0.rotation.z += (targetZ - seg0.rotation.z) * lerpSpeed;
                  const targetX = thumbFlex * 0.55;
                  seg0.rotation.x += (targetX - seg0.rotation.x) * lerpSpeed;
                }
                if (seg1) {
                  const targetX = thumbFlex * 0.65;
                  seg1.rotation.x += (targetX - seg1.rotation.x) * lerpSpeed;
                }
                if (seg2) {
                  const targetX = thumbFlex * 0.45;
                  seg2.rotation.x += (targetX - seg2.rotation.x) * lerpSpeed;
                }
              } else {
                // FINGERS (Index, Middle, Ring, Pinky): 3-phalanx natural curl
                // MCP (seg0) -> PIP (seg1) -> DIP (seg2)
                const flex = (1.0 - ext);
                const mcpCurl = flex * 1.05; // 60 deg
                const pipCurl = flex * 1.25; // 72 deg
                const dipCurl = flex * 0.85; // 48 deg
                const curlPerSeg = [mcpCurl, pipCurl, dipCurl];

                const spreadSign = side === 'right' ? (idx - 2.5) : -(idx - 2.5);
                const spreadAngle = spreadSign * spread * 0.28;

                fObj.segments.forEach((seg, si) => {
                  const targetCurl = curlPerSeg[si] || 0;
                  seg.rotation.x += (targetCurl - seg.rotation.x) * lerpSpeed;
                  if (si === 0) {
                    seg.rotation.z += (spreadAngle - seg.rotation.z) * lerpSpeed;
                  }
                });
              }
            }
          });
        }
      });

      // Head Nod/Tilt
      if (joints.head && target.headTilt) {
        joints.head.rotation.x += (target.headTilt.x - joints.head.rotation.x) * lerpSpeed;
        joints.head.rotation.y += (target.headTilt.y - joints.head.rotation.y) * lerpSpeed;
      }

      // Idle Sway
      const time = clock.getElapsedTime();
      if (avatarGroupRef.current) {
        avatarGroupRef.current.position.y = Math.sin(time * 2.5) * 0.012;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (container) container.innerHTML = '';
    };
  }, [avatarConfig]);

  // Sequence Player Queue
  useEffect(() => {
    if (!sequence || sequence.length === 0) {
      setCurrentSubtitles('Standing Idle — Waiting for input');
      setActiveTokenData(null);
      targetPoseRef.current = {
        leftArm: { shoulderX: 0.1, shoulderY: -0.2, elbowZ: 0.3, wristY: 0 },
        leftFingers: { thumb: 0.8, index: 0.8, middle: 0.8, ring: 0.8, pinky: 0.8, spread: 0.1 },
        rightArm: { shoulderX: 0.1, shoulderY: 0.2, elbowZ: -0.3, wristY: 0 },
        rightFingers: { thumb: 0.8, index: 0.8, middle: 0.8, ring: 0.8, pinky: 0.8, spread: 0.1 },
        headTilt: { x: 0, y: 0 }
      };
      return;
    }

    if (!playingState) return;

    let index = 0;
    let timer = null;

    const playNextToken = () => {
      if (index >= sequence.length) {
        setActiveTokenIndex(sequence.length);
        setCurrentSubtitles('✔ Sentence Complete');
        if (onComplete) onComplete();
        return;
      }

      const token = sequence[index];
      setActiveTokenIndex(index);
      setActiveTokenData(token);
      const modeLabel = token.mode ? `[${token.mode}] ` : '';
      setCurrentSubtitles(`${modeLabel}Signing: "${token.label}" (${token.type})`);

      const poseData = token.data;
      if (poseData) {
        if (poseData.rightArm) targetPoseRef.current.rightArm = { ...poseData.rightArm };
        if (poseData.rightFingers) targetPoseRef.current.rightFingers = { ...poseData.rightFingers, spread: poseData.spread || 0 };

        if (poseData.leftArm) targetPoseRef.current.leftArm = { ...poseData.leftArm };
        else targetPoseRef.current.leftArm = { shoulderX: 0.1, shoulderY: -0.2, elbowZ: 0.3, wristY: 0 };

        if (poseData.leftFingers) targetPoseRef.current.leftFingers = { ...poseData.leftFingers };
        else targetPoseRef.current.leftFingers = { thumb: 0.8, index: 0.8, middle: 0.8, ring: 0.8, pinky: 0.8, spread: 0.1 };

        if (poseData.headTilt) targetPoseRef.current.headTilt = { ...poseData.headTilt };
        else targetPoseRef.current.headTilt = { x: 0, y: 0 };
      }

      const duration = token.type === 'word' ? (1200 / playbackSpeed) : (800 / playbackSpeed);

      index++;
      timer = setTimeout(playNextToken, duration);
    };

    playNextToken();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [sequence, playingState, playbackSpeed]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between rounded-3xl overflow-hidden glass-panel border border-lavender-300/30 shadow-2xl">
      {/* Top Header Badge */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs font-semibold text-lavender-300 border border-lavender-300/30">
          <span className="w-2 h-2 rounded-full bg-lavender-300 animate-ping" />
          <span>Hybrid 3D + 2D Animated Figure</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Camera View Angle Selector — 5 Angles (Left & Right Sides) */}
          <div className="flex items-center gap-1 bg-[#120e1e]/90 backdrop-blur-md px-2 py-1 rounded-xl border border-lavender-400/20 text-xs text-slate-300 overflow-x-auto no-scrollbar">
            <Eye className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
            <span className="text-[10px] text-lavender-200/50 font-bold mr-1 flex-shrink-0">View:</span>
            {[
              { id: 'sideLeft', label: 'Left Side' },
              { id: 'threeQuarterLeft', label: 'Left 3/4' },
              { id: 'front', label: 'Front' },
              { id: 'threeQuarterRight', label: 'Right 3/4' },
              { id: 'sideRight', label: 'Right Side' }
            ].map(ang => (
              <button
                key={ang.id}
                onClick={() => setCameraAngle(ang.id)}
                className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold transition whitespace-nowrap ${
                  cameraAngle === ang.id ? 'bg-lavender-300 text-[#1a1028]' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                {ang.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShow2dDiagram(!show2dDiagram)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1 transition ${
              show2dDiagram ? 'bg-purple-500/20 text-purple-200 border-purple-400/40' : 'glass-button text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D HUD: {show2dDiagram ? 'ON' : 'OFF'}</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-700 text-xs text-slate-300">
            <FastForward className="w-3.5 h-3.5 text-lavender-300" />
            {[0.5, 1.0, 1.5].map(s => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-1.5 py-0.5 rounded font-mono text-xs transition ${
                  playbackSpeed === s ? 'bg-lavender-300 text-[#1a1028] font-bold' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-[380px] cursor-grab active:cursor-grabbing" />

      {/* 2D Hand Pose Diagram Overlay HUD */}
      {show2dDiagram && activeTokenData && (
        <div className="absolute top-16 right-4 p-3 rounded-2xl glass-panel-glow border border-lavender-300/40 flex flex-col gap-1.5 z-10 w-44 shadow-xl">
          <div className="flex items-center justify-between text-[10px] font-mono text-lavender-300">
            <span className="font-bold uppercase">2D Pose HUD</span>
            <span>{activeTokenData.key}</span>
          </div>

          <div className="grid grid-cols-5 gap-1 pt-1 border-t border-slate-800 text-center text-[9px] font-mono">
            {['T', 'I', 'M', 'R', 'P'].map((f, i) => {
              const keys = ['thumb', 'index', 'middle', 'ring', 'pinky'];
              const ext = activeTokenData.data?.rightFingers?.[keys[i]] ?? 0.5;
              return (
                <div
                  key={f}
                  className={`py-1 rounded border flex flex-col items-center gap-0.5 ${
                    ext > 0.6 ? 'bg-lavender-900/40 text-lavender-300 border-teal-700' : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  <span className="font-bold">{f}</span>
                  <span>{ext > 0.6 ? 'OPEN' : 'FLEX'}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtitles & Controls */}
      <div className="w-full p-4 glass-panel border-t border-slate-800 flex flex-col gap-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-lavender-300 font-medium">
            <span className="text-slate-400">Gloss Stream:</span>
            <span className="font-mono bg-slate-950 text-lavender-300 px-2 py-0.5 rounded border border-lavender-700/30/60 font-bold">
              {currentSubtitles}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPlayingState(!playingState)}
              className="p-2 rounded-xl glass-button text-lavender-300 hover:text-white"
            >
              {playingState ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => { setActiveTokenIndex(0); setPlayingState(true); }}
              className="p-2 rounded-xl glass-button text-slate-400 hover:text-lavender-300"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
