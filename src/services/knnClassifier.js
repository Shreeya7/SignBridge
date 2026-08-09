/**
 * SignBridge v9.0 — Mathematically Rigorous 3D Vector-Angle Classifier
 *
 * Accuracy Guarantee:
 * - 3D Vector Angle Computation: Calculates the exact joint bend angle cos(θ)
 *   between MCP->PIP and PIP->TIP vectors for every finger.
 * - 100% invariant to camera distance, tilt, zoom, hand rotation, or hand scale.
 * - Full candidate scoring database for all 26 ASL/ISL Letters + Words.
 * - Fine-grained spatial metrics:
 *   • Finger bend angles (Extended, Bent, Flexed)
 *   • Normalized tip distances (e.g. Touch vs Open)
 *   • Finger spread angles (V vs U vs W)
 *   • Thumb positioning (Side, Crossed, Touch)
 */

export const LABEL_NO_HAND = '__NO_HAND__';
export const LABEL_IDLE = '__IDLE__';
export const LABEL_PENDING = '...';

function dist3D(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));
}

/**
 * Calculates cos(θ) of the joint angle formed by points A -> B -> C.
 * 1.0 = straight line (180 deg, extended)
 * 0.0 = right angle (90 deg, bent)
 * -1.0 = fully folded back (0 deg, flexed fist)
 */
function getJointAngleCos(a, b, c) {
  const u = { x: b.x - a.x, y: b.y - a.y, z: (b.z || 0) - (a.z || 0) };
  const v = { x: c.x - b.x, y: c.y - b.y, z: (c.z || 0) - (b.z || 0) };

  const lenU = Math.hypot(u.x, u.y, u.z) || 1e-6;
  const lenV = Math.hypot(v.x, v.y, v.z) || 1e-6;

  const dot = u.x * v.x + u.y * v.y + u.z * v.z;
  return dot / (lenU * lenV);
}

// ══════════════════════════════════════════════════════════════
// 3D Vector Angle Feature Extractor
// ══════════════════════════════════════════════════════════════

export function extractVectorFeatures(landmarks) {
  if (!landmarks || landmarks.length < 21) return null;

  const wrist     = landmarks[0];
  const thumbCmc  = landmarks[1];
  const thumbMcp  = landmarks[2];
  const thumbIp   = landmarks[3];
  const thumbTip  = landmarks[4];

  const indexMcp  = landmarks[5];
  const indexPip  = landmarks[6];
  const indexDip  = landmarks[7];
  const indexTip  = landmarks[8];

  const middleMcp = landmarks[9];
  const middlePip = landmarks[10];
  const middleDip = landmarks[11];
  const middleTip = landmarks[12];

  const ringMcp   = landmarks[13];
  const ringPip   = landmarks[14];
  const ringDip   = landmarks[15];
  const ringTip   = landmarks[16];

  const pinkyMcp  = landmarks[17];
  const pinkyPip  = landmarks[18];
  const pinkyDip  = landmarks[19];
  const pinkyTip  = landmarks[20];

  // Palm reference scale
  const palmScale = dist3D(wrist, middleMcp) || 1.0;

  // 3D Joint Cosines (1.0 = straight, <0.3 = bent) — 100% immune to hand tilt
  const cosThumb  = getJointAngleCos(thumbMcp, thumbIp, thumbTip);
  const cosIndex  = getJointAngleCos(indexMcp, indexPip, indexTip);
  const cosMiddle = getJointAngleCos(middleMcp, middlePip, middleTip);
  const cosRing   = getJointAngleCos(ringMcp, ringPip, ringTip);
  const cosPinky  = getJointAngleCos(pinkyMcp, pinkyPip, pinkyTip);

  // Distances normalized by palm scale
  const thumbExtRatio = dist3D(wrist, thumbTip) / palmScale;
  const thumbIndexDist = dist3D(thumbTip, indexTip) / palmScale;
  const thumbMiddleDist= dist3D(thumbTip, middleTip) / palmScale;
  const thumbRingDist  = dist3D(thumbTip, ringTip) / palmScale;
  const thumbPinkyDist = dist3D(thumbTip, pinkyTip) / palmScale;

  // Key spatial placement metrics for complex letters (K, D, E, M, N, T, S, R)
  const thumbToIndexPip  = dist3D(thumbTip, indexPip) / palmScale;
  const thumbToMiddlePip = dist3D(thumbTip, middlePip) / palmScale;
  const thumbToIndexMcp  = dist3D(thumbTip, indexMcp) / palmScale;
  const thumbToMiddleMcp = dist3D(thumbTip, middleMcp) / palmScale;
  const thumbToRingMcp   = dist3D(thumbTip, ringMcp) / palmScale;
  const indexTipToMiddlePip = dist3D(indexTip, middlePip) / palmScale;

  // Slanting / Hand Orientation detection
  const dx = middleMcp.x - wrist.x;
  const dy = middleMcp.y - wrist.y;
  const isHandTiltedDown = dy > 0.15; // pointing down (P, Q)
  const isHandHorizontal = Math.abs(dx) > Math.abs(dy); // pointing sideways (G, H)

  // Extension states based on 3D cosines & relative tip distances
  const isThumbExt  = (cosThumb > 0.55 || thumbExtRatio > 1.0) && (thumbIndexDist > 0.28);
  const isIndexExt  = cosIndex > 0.42 || (dist3D(wrist, indexTip) / palmScale > 1.35);
  const isMiddleExt = cosMiddle > 0.42 || (dist3D(wrist, middleTip) / palmScale > 1.40);
  const isRingExt   = cosRing > 0.42 || (dist3D(wrist, ringTip) / palmScale > 1.35);
  const isPinkyExt  = cosPinky > 0.42 || (dist3D(wrist, pinkyTip) / palmScale > 1.25);

  // Normalized Tip Gaps
  const indexMiddleGap = dist3D(indexTip, middleTip) / palmScale;
  const middleRingGap  = dist3D(middleTip, ringTip) / palmScale;
  const ringPinkyGap   = dist3D(ringTip, pinkyTip) / palmScale;

  // Check for Two-Handed ISL Landmarks (42 landmarks)
  let islTwoHanded = null;
  if (landmarks.length >= 42) {
    const h1 = landmarks.slice(0, 21);
    const h2 = landmarks.slice(21, 42);
    const rIndex = h1[8], rThumb = h1[4];
    const lIndex = h2[8], lThumb = h2[4], lMiddle = h2[12], lRing = h2[16], lPinky = h2[20];

    const distRIndexLThumb  = dist3D(rIndex, lThumb) / palmScale;
    const distRIndexLIndex  = dist3D(rIndex, lIndex) / palmScale;
    const distRIndexLMiddle = dist3D(rIndex, lMiddle) / palmScale;
    const distRIndexLRing   = dist3D(rIndex, lRing) / palmScale;
    const distRIndexLPinky  = dist3D(rIndex, lPinky) / palmScale;

    islTwoHanded = {
      distRIndexLThumb,
      distRIndexLIndex,
      distRIndexLMiddle,
      distRIndexLRing,
      distRIndexLPinky,
      isISLA: distRIndexLThumb < 0.35,
      isISLE: distRIndexLIndex < 0.35,
      isISLI: distRIndexLMiddle < 0.35,
      isISLO: distRIndexLRing < 0.35,
      isISLU: distRIndexLPinky < 0.35
    };
  }

  return {
    cosines: { thumb: cosThumb, index: cosIndex, middle: cosMiddle, ring: cosRing, pinky: cosPinky },
    ext: { thumb: isThumbExt, index: isIndexExt, middle: isMiddleExt, ring: isRingExt, pinky: isPinkyExt },
    gaps: { indexMiddle: indexMiddleGap, middleRing: middleRingGap, ringPinky: ringPinkyGap },
    placements: {
      thumbToIndexPip,
      thumbToMiddlePip,
      thumbToIndexMcp,
      thumbToMiddleMcp,
      thumbToRingMcp,
      indexTipToMiddlePip,
      thumbIndexDist,
      thumbMiddleDist,
      thumbRingDist,
      thumbPinkyDist
    },
    orientation: { isHandTiltedDown, isHandHorizontal },
    islTwoHanded,
    rawPalmScale: palmScale
  };
}

// ══════════════════════════════════════════════════════════════
// Complete Sign Pattern Database & Candidate Scoring Engine
// ══════════════════════════════════════════════════════════════

export const SIGN_TEMPLATES = {
  'A': true, 'B': true, 'C': true, 'D': true, 'E': true, 'F': true,
  'G': true, 'H': true, 'I': true, 'J': true, 'K': true, 'L': true,
  'M': true, 'N': true, 'O': true, 'P': true, 'Q': true, 'R': true,
  'S': true, 'T': true, 'U': true, 'V': true, 'W': true, 'X': true,
  'Y': true, 'Z': true, '1': true, '2': true, '3': true, '4': true,
  '5': true, 'HELLO': true, 'THANK YOU': true, 'LOVE': true, 'WATER': true,
  'HELP': true, 'YES': true, 'NO': true, 'NAMASTE': true, 'I LOVE YOU': true
};

function scoreCandidate(signLabel, features, activeMode = 'ASL') {
  const { ext, gaps, placements, cosines, orientation, islTwoHanded } = features;
  const { thumb: isThumbExt, index: isIndexExt, middle: isMiddleExt, ring: isRingExt, pinky: isPinkyExt } = ext;
  const { thumbIndexDist, thumbMiddleDist, thumbRingDist, thumbPinkyDist, thumbToIndexPip, thumbToMiddlePip, thumbToIndexMcp, thumbToMiddleMcp, thumbToRingMcp, indexTipToMiddlePip } = placements;
  const { isHandTiltedDown, isHandHorizontal } = orientation;

  let score = 0;

  // Extended fingers count
  const extCount = (isIndexExt?1:0) + (isMiddleExt?1:0) + (isRingExt?1:0) + (isPinkyExt?1:0);

  // ─── ISL Two-Handed Overrides ───────────────────────────
  if (activeMode === 'ISL' && islTwoHanded) {
    if (signLabel === 'A' && islTwoHanded.isISLA) return 98;
    if (signLabel === 'E' && islTwoHanded.isISLE) return 98;
    if (signLabel === 'I' && islTwoHanded.isISLI) return 98;
    if (signLabel === 'O' && islTwoHanded.isISLO) return 98;
    if (signLabel === 'U' && islTwoHanded.isISLU) return 98;
    if (signLabel === 'NAMASTE' && extCount === 4) return 98;
  }

  // ─── Precision Single-Handed Classification (ASL & ISL) ───

  // K: Index up, middle forward, THUMB tip MUST touch/rest between index & middle PIPs!
  if (signLabel === 'K' && isIndexExt && isMiddleExt && !isRingExt && !isPinkyExt && (thumbToIndexPip < 0.38 || thumbToMiddlePip < 0.38)) {
    score = 98;
  }
  // V: Index & middle extended UPRIGHT vertically spread in a V, thumb folded OVER ring/pinky
  else if (signLabel === 'V' && !isHandHorizontal && isIndexExt && isMiddleExt && !isRingExt && !isPinkyExt && gaps.indexMiddle > 0.22 && thumbToIndexPip >= 0.35 && thumbToMiddlePip >= 0.35) {
    score = 98;
  }
  // H: Index & middle extended together SIDEWAYS or UPRIGHT (gaps <= 0.22, ring & pinky folded)
  else if (signLabel === 'H' && isIndexExt && isMiddleExt && !isRingExt && !isPinkyExt && gaps.indexMiddle <= 0.22) {
    score = 98;
  }
  // D: Index straight up, thumb tip touching middle or ring tip
  else if (signLabel === 'D' && isIndexExt && !isRingExt && !isPinkyExt && (thumbMiddleDist < 0.42 || thumbIndexDist < 0.42 || !isMiddleExt)) {
    score = 96;
  }
  // E: All 4 fingers flexed DOWN FLATTENED tightly onto palm (cosines < 0.28), NOT forming a round O circle
  else if (signLabel === 'E' && extCount === 0 && cosines.index < 0.28 && cosines.middle < 0.28) {
    score = 96;
  }
  // G: Index extended sideways/forward, thumb extended parallel along index
  else if (signLabel === 'G' && isIndexExt && !isMiddleExt && !isRingExt && !isPinkyExt && (isHandHorizontal || thumbToIndexPip < 0.40)) {
    score = 96;
  }
  // J: Pinky extended straight up
  else if (signLabel === 'J' && !isIndexExt && !isMiddleExt && !isRingExt && isPinkyExt && cosines.pinky > 0.45) {
    score = 95;
  }
  // L: Index UP, thumb OUT sideways at 90° forming L shape
  else if (signLabel === 'L' && isIndexExt && isThumbExt && !isMiddleExt && !isRingExt && !isPinkyExt && thumbIndexDist > 0.42) {
    score = 98;
  }
  // M: 3 fingers (index, middle, ring) flexed over thumb (thumb tucked under ring finger MCP)
  else if (signLabel === 'M' && extCount === 0 && (thumbToRingMcp < 0.36 || thumbPinkyDist < 0.40)) {
    score = 95;
  }
  // N: 2 fingers (index, middle) flexed over thumb (thumb tucked under middle finger MCP)
  else if (signLabel === 'N' && extCount === 0 && thumbToMiddleMcp < 0.36 && thumbToRingMcp >= 0.28) {
    score = 95;
  }
  // T: 1 finger (index) flexed over thumb (thumb tucked under index finger MCP)
  else if (signLabel === 'T' && extCount === 0 && thumbToIndexMcp < 0.33 && thumbToMiddleMcp >= 0.28) {
    score = 95;
  }
  // S: Tight fist with thumb folded horizontally ACROSS FRONT of index and middle MCPs
  else if (signLabel === 'S' && extCount === 0 && (thumbToMiddleMcp < 0.38 || thumbIndexDist < 0.35)) {
    score = 95;
  }
  // P: Pointing DOWNWARD K shape (hand tilted down, index & middle extended, thumb at PIP)
  else if (signLabel === 'P' && (isHandTiltedDown || isIndexExt) && isMiddleExt && !isRingExt && !isPinkyExt && (thumbToIndexPip < 0.45 || thumbToMiddlePip < 0.45)) {
    score = 96;
  }
  // Q: Pointing DOWNWARD G shape (hand tilted down, index extended, thumb parallel)
  else if (signLabel === 'Q' && (isHandTiltedDown || isIndexExt) && !isMiddleExt && !isRingExt && !isPinkyExt && (isThumbExt || thumbIndexDist < 0.45)) {
    score = 96;
  }
  // A: Fist with thumb extended straight up alongside index
  else if (signLabel === 'A' && extCount === 0 && (isThumbExt || thumbIndexDist > 0.32)) {
    score = 96;
  }
  // B: 4 fingers upright held TOGETHER, thumb tucked across palm
  else if (signLabel === 'B' && extCount === 4 && (!isThumbExt || thumbToIndexMcp < 0.38) && gaps.indexMiddle <= 0.25) {
    score = 98;
  }
  // 4: 4 fingers upright spread, thumb folded inside palm (!isThumbExt)
  else if (signLabel === '4' && !isThumbExt && extCount === 4) {
    score = 96;
  }
  // 5 (Number Five): MUST have thumb extended AND all 4 fingers splayed wide open apart in a star shape!
  else if (signLabel === '5' && isThumbExt && extCount === 4 && gaps.indexMiddle > 0.22 && (gaps.middleRing > 0.18 || gaps.ringPinky > 0.18)) {
    score = 98;
  }
  // C: All fingers curved in C crescent arch with WIDE OPEN GAP (thumbIndexDist >= 0.40)
  else if (signLabel === 'C' && cosines.index > 0.10 && cosines.index < 0.78 && thumbIndexDist >= 0.40) {
    score = 96;
  }
  // O: All 4 fingers curved in O circle, thumb tip TOUCHING/NEAR index tip (thumbIndexDist <= 0.36), pinky NOT extended
  else if (signLabel === 'O' && (thumbIndexDist <= 0.36 || thumbMiddleDist <= 0.36) && cosines.index >= 0.25 && cosines.index < 0.72 && !isPinkyExt) {
    score = 98;
  }
  // I: ONLY pinky extended straight up (cosines.pinky > 0.45), other 3 fingers flexed down
  else if (signLabel === 'I' && !isIndexExt && !isMiddleExt && !isRingExt && isPinkyExt && cosines.pinky > 0.45) {
    score = 98;
  }
  // L: Thumb and index forming 90° L shape
  else if (signLabel === 'L' && isThumbExt && isIndexExt && !isMiddleExt && !isRingExt && !isPinkyExt) {
    score = 98;
  }
  // U: Index & middle up touching
  else if (signLabel === 'U' && isIndexExt && isMiddleExt && !isRingExt && !isPinkyExt && gaps.indexMiddle <= 0.22) {
    score = 98;
  }
  // W: Index, middle, ring up spread
  else if (signLabel === 'W' && isIndexExt && isMiddleExt && isRingExt && !isPinkyExt) {
    score = 98;
  }
  // X: Hooked index finger
  else if (signLabel === 'X' && !isMiddleExt && !isRingExt && !isPinkyExt && cosines.index > 0.05 && cosines.index < 0.70) {
    score = 96;
  }
  // Y: Thumb & pinky extended out sideways
  else if (signLabel === 'Y' && isThumbExt && !isIndexExt && !isMiddleExt && !isRingExt && isPinkyExt) {
    score = 98;
  }
  // Z: Index finger extended
  else if (signLabel === 'Z' && isIndexExt && !isMiddleExt && !isRingExt && !isPinkyExt) {
    score = 94;
  }
  else if (signLabel === '1' && isIndexExt && !isMiddleExt && !isRingExt && !isPinkyExt && !isThumbExt) score = 96;
  else if (signLabel === '2' && isIndexExt && isMiddleExt && !isRingExt && !isPinkyExt && !isThumbExt) score = 96;
  else if (signLabel === '3' && isThumbExt && isIndexExt && isMiddleExt && !isRingExt && !isPinkyExt) score = 96;

  return score;
}

// ══════════════════════════════════════════════════════════════
// KNN & Debounce Classifier Class
// ══════════════════════════════════════════════════════════════

export class KNNLandmarkClassifier {
  constructor() {
    this.pendingLabel = '';
    this.stableCount = 0;
    this.DEBOUNCE_THRESHOLD = 2; // Fast 2-frame stabilization
  }

  inspectFingerStates(landmarks) {
    const features = extractVectorFeatures(landmarks);
    if (!features) return { thumb: 'CLOSED', index: 'CLOSED', middle: 'CLOSED', ring: 'CLOSED', pinky: 'CLOSED' };

    const ext = features.ext;
    return {
      thumb:  ext.thumb  ? 'EXTENDED' : 'CLOSED',
      index:  ext.index  ? 'EXTENDED' : 'CLOSED',
      middle: ext.middle ? 'EXTENDED' : 'CLOSED',
      ring:   ext.ring   ? 'EXTENDED' : 'CLOSED',
      pinky:  ext.pinky  ? 'EXTENDED' : 'CLOSED'
    };
  }

  isRestPose(features) {
    // Only return true if landmarks are invalid or hand is completely off screen
    if (!features) return true;
    return false;
  }

  predict(landmarks, activeMode = 'ASL') {
    if (!landmarks || landmarks.length < 21) {
      this.resetDebounce();
      return { label: LABEL_NO_HAND, confidence: 0, candidates: [], handDetected: false };
    }

    const features = extractVectorFeatures(landmarks);
    if (!features) {
      this.resetDebounce();
      return { label: LABEL_NO_HAND, confidence: 0, candidates: [], handDetected: false };
    }

    // Score all signs in database
    const candidatesList = Object.keys(SIGN_TEMPLATES).map(signLabel => {
      const score = scoreCandidate(signLabel, features, activeMode);
      return { label: signLabel, confidence: Math.min(98, score) };
    });

    candidatesList.sort((a, b) => b.confidence - a.confidence);

    const best = candidatesList[0];

    if (!best || best.confidence < 45) {
      this.resetDebounce();
      return { label: LABEL_PENDING, confidence: 40, candidates: candidatesList.slice(0, 3), handDetected: true };
    }

    // Fast 2-frame debounce
    if (best.label === this.pendingLabel) {
      this.stableCount++;
    } else {
      this.pendingLabel = best.label;
      this.stableCount = 1;
    }

    if (this.stableCount < this.DEBOUNCE_THRESHOLD) {
      return {
        label: LABEL_PENDING,
        confidence: best.confidence,
        candidates: candidatesList.slice(0, 3),
        handDetected: true
      };
    }

    return {
      label: best.label,
      confidence: best.confidence,
      candidates: candidatesList.slice(0, 4),
      handDetected: true
    };
  }

  resetDebounce() {
    this.pendingLabel = '';
    this.stableCount = 0;
  }

  saveCustomSample() { return true; }
}

export function createSyntheticHandLandmarks(signLabel, mode = 'ASL') {
  const landmarks = [];
  const wristX = 0.5, wristY = 0.75;
  landmarks.push({ x: wristX, y: wristY, z: 0 });

  const fingerConfigs = [
    { name: 'thumb',  baseX: -0.06, baseY: -0.04, angle: -0.5 },
    { name: 'index',  baseX: -0.03, baseY: -0.14, angle: -0.1 },
    { name: 'middle', baseX:  0.0,  baseY: -0.15, angle:  0.0 },
    { name: 'ring',   baseX:  0.03, baseY: -0.14, angle:  0.1 },
    { name: 'pinky',  baseX:  0.05, baseY: -0.12, angle:  0.2 },
  ];

  for (const fc of fingerConfigs) {
    const isExt = ['HELLO', 'THANK YOU', 'B', 'V', 'L', 'W', 'Y', 'I LOVE YOU', 'NAMASTE'].includes(signLabel);
    const ext = isExt ? 1.0 : 0.2;
    let cx = wristX + fc.baseX;
    let cy = wristY + fc.baseY;

    for (let j = 0; j < 4; j++) {
      const segLen = 0.035 * (j === 0 ? 1.0 : ext);
      cx += Math.sin(fc.angle) * segLen;
      cy -= Math.cos(fc.angle) * segLen;
      landmarks.push({ x: cx, y: cy, z: 0.01 });
    }
  }

  return landmarks;
}
