// SignBridge Dual Engine: ASL (American Sign Language) & ISL (Indian Sign Language) Dictionary

/**
 * Finger joint state definition:
 * extension: 0.0 (closed fist) to 1.0 (fully extended)
 * spread: 0.0 (tight fingers) to 1.0 (widely spread)
 */

// ==========================================
// 1. AMERICAN SIGN LANGUAGE (ASL)
// ==========================================

export const ASL_ALPHABET = {
  'A': { label: 'A', fingers: { thumb: 1.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 }, spread: 0.0, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 } },
  'B': { label: 'B', fingers: { thumb: 0.0, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 }, spread: 0.0, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 } },
  'C': { label: 'C', fingers: { thumb: 0.6, index: 0.6, middle: 0.6, ring: 0.6, pinky: 0.6 }, spread: 0.4, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.3, wristY: 0.6 } },
  'D': { label: 'D', fingers: { thumb: 0.4, index: 1.0, middle: 0.3, ring: 0.3, pinky: 0.3 }, spread: 0.1, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 } },
  'E': { label: 'E', fingers: { thumb: 0.1, index: 0.1, middle: 0.1, ring: 0.1, pinky: 0.1 }, spread: 0.0, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 } },
  'F': { label: 'F', fingers: { thumb: 0.3, index: 0.3, middle: 1.0, ring: 1.0, pinky: 1.0 }, spread: 0.5, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 } },
  'G': { label: 'G', fingers: { thumb: 0.9, index: 0.9, middle: 0.0, ring: 0.0, pinky: 0.0 }, spread: 0.3, rightArm: { shoulderX: 0.6, shoulderY: 0.7, elbowZ: -1.2, wristY: 0.8 } },
  'H': { label: 'H', fingers: { thumb: 0.0, index: 1.0, middle: 1.0, ring: 0.0, pinky: 0.0 }, spread: 0.0, rightArm: { shoulderX: 0.6, shoulderY: 0.7, elbowZ: -1.2, wristY: 0.8 } },
  'I': { label: 'I', fingers: { thumb: 0.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 1.0 }, spread: 0.0, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 } },
  'J': { label: 'J', fingers: { thumb: 0.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 1.0 }, spread: 0.0, rightArm: { shoulderX: 0.6, shoulderY: 0.6, elbowZ: -1.3, wristY: 0.5 } },
  'K': { label: 'K', fingers: { thumb: 0.6, index: 1.0, middle: 0.7, ring: 0.0, pinky: 0.0 }, spread: 0.4, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 } },
  'L': { label: 'L', fingers: { thumb: 1.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 }, spread: 0.9, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 } },
  'M': { label: 'M', fingers: { thumb: 0.2, index: 0.2, middle: 0.2, ring: 0.2, pinky: 0.0 }, spread: 0.0, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 } },
  'N': { label: 'N', fingers: { thumb: 0.2, index: 0.2, middle: 0.2, ring: 0.0, pinky: 0.0 }, spread: 0.0, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 } },
  'O': { label: 'O', fingers: { thumb: 0.4, index: 0.4, middle: 0.4, ring: 0.4, pinky: 0.4 }, spread: 0.0, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.3, wristY: 0.6 } },
  'P': { label: 'P', fingers: { thumb: 0.6, index: 1.0, middle: 0.7, ring: 0.0, pinky: 0.0 }, spread: 0.4, rightArm: { shoulderX: 0.4, shoulderY: 0.5, elbowZ: -0.9, wristY: 0.2 } },
  'Q': { label: 'Q', fingers: { thumb: 0.9, index: 0.9, middle: 0.0, ring: 0.0, pinky: 0.0 }, spread: 0.3, rightArm: { shoulderX: 0.4, shoulderY: 0.5, elbowZ: -0.9, wristY: 0.2 } },
  'R': { label: 'R', fingers: { thumb: 0.0, index: 1.0, middle: 1.0, ring: 0.0, pinky: 0.0 }, spread: -0.3, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 } },
  'S': { label: 'S', fingers: { thumb: 0.1, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 }, spread: 0.0, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 } },
  'T': { label: 'T', fingers: { thumb: 0.3, index: 0.2, middle: 0.0, ring: 0.0, pinky: 0.0 }, spread: 0.0, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 } },
  'U': { label: 'U', fingers: { thumb: 0.0, index: 1.0, middle: 1.0, ring: 0.0, pinky: 0.0 }, spread: 0.0, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 } },
  'V': { label: 'V', fingers: { thumb: 0.0, index: 1.0, middle: 1.0, ring: 0.0, pinky: 0.0 }, spread: 0.7, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 } },
  'W': { label: 'W', fingers: { thumb: 0.0, index: 1.0, middle: 1.0, ring: 1.0, pinky: 0.0 }, spread: 0.6, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 } },
  'X': { label: 'X', fingers: { thumb: 0.0, index: 0.4, middle: 0.0, ring: 0.0, pinky: 0.0 }, spread: 0.0, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 } },
  'Y': { label: 'Y', fingers: { thumb: 1.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 1.0 }, spread: 0.9, rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 } },
  'Z': { label: 'Z', fingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 }, spread: 0.0, rightArm: { shoulderX: 0.6, shoulderY: 0.6, elbowZ: -1.3, wristY: 0.5 } }
};

export const ASL_WORDS = {
  // NUMBERS 1 TO 10
  '1': { label: '1', sequence: [{ rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 }, rightFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 } }] },
  '2': { label: '2', sequence: [{ rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 }, rightFingers: { thumb: 0.0, index: 1.0, middle: 1.0, ring: 0.0, pinky: 0.0 }, spread: 0.2 }] },
  '3': { label: '3', sequence: [{ rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 }, rightFingers: { thumb: 1.0, index: 1.0, middle: 1.0, ring: 0.0, pinky: 0.0 }, spread: 0.4 }] },
  '4': { label: '4', sequence: [{ rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 }, rightFingers: { thumb: 0.0, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 }, spread: 0.2 }] },
  '5': { label: '5', sequence: [{ rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 }, rightFingers: { thumb: 1.0, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 }, spread: 0.8 }] },
  '6': { label: '6', sequence: [{ rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 }, rightFingers: { thumb: 0.3, index: 1.0, middle: 1.0, ring: 1.0, pinky: 0.3 }, spread: 0.3 }] },
  '7': { label: '7', sequence: [{ rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 }, rightFingers: { thumb: 0.3, index: 1.0, middle: 1.0, ring: 0.3, pinky: 1.0 }, spread: 0.3 }] },
  '8': { label: '8', sequence: [{ rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 }, rightFingers: { thumb: 0.3, index: 1.0, middle: 0.3, ring: 1.0, pinky: 1.0 }, spread: 0.3 }] },
  '9': { label: '9', sequence: [{ rightArm: { shoulderX: 0.6, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.4 }, rightFingers: { thumb: 0.3, index: 0.3, middle: 1.0, ring: 1.0, pinky: 1.0 }, spread: 0.3 }] },
  '10': {
    label: '10',
    sequence: [
      { rightArm: { shoulderX: 0.6, shoulderY: 0.6, elbowZ: -1.4, wristY: 0.6 }, rightFingers: { thumb: 1.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 } },
      { rightArm: { shoulderX: 0.6, shoulderY: 0.4, elbowZ: -1.2, wristY: 0.2 }, rightFingers: { thumb: 1.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 } }
    ]
  },

  // EVERYDAY WORDS & GREETINGS
  'HELLO': {
    label: 'HELLO',
    sequence: [
      { rightArm: { shoulderX: 0.6, shoulderY: 0.8, elbowZ: -1.5, wristY: 0.7 }, rightFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 } },
      { rightArm: { shoulderX: 0.4, shoulderY: 0.9, elbowZ: -0.8, wristY: 0.5 }, rightFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 } }
    ]
  },
  'THANK YOU': {
    label: 'THANK YOU',
    sequence: [
      { rightArm: { shoulderX: 0.5, shoulderY: 0.7, elbowZ: -1.6, wristY: 0.6 }, rightFingers: { thumb: 0.5, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 } },
      { rightArm: { shoulderX: 0.3, shoulderY: 0.6, elbowZ: -0.7, wristY: 0.3 }, rightFingers: { thumb: 0.5, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 } }
    ]
  },
  'YES': {
    label: 'YES',
    sequence: [
      { rightArm: { shoulderX: 0.3, shoulderY: 0.5, elbowZ: -1.2, wristY: 0.5 }, rightFingers: { thumb: 0.9, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 } },
      { rightArm: { shoulderX: 0.3, shoulderY: 0.5, elbowZ: -1.2, wristY: 0.1 }, rightFingers: { thumb: 0.9, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 } }
    ]
  },
  'NO': {
    label: 'NO',
    sequence: [
      { rightArm: { shoulderX: 0.3, shoulderY: 0.5, elbowZ: -1.3, wristY: 0.3 }, rightFingers: { thumb: 0.8, index: 1.0, middle: 1.0, ring: 0.0, pinky: 0.0 } },
      { rightArm: { shoulderX: 0.3, shoulderY: 0.5, elbowZ: -1.3, wristY: 0.3 }, rightFingers: { thumb: 0.4, index: 0.2, middle: 0.2, ring: 0.0, pinky: 0.0 } }
    ]
  },
  'SORRY': {
    label: 'SORRY',
    sequence: [
      { rightArm: { shoulderX: 0.5, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.5 }, rightFingers: { thumb: 1.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 } },
      { rightArm: { shoulderX: 0.5, shoulderY: 0.6, elbowZ: -1.3, wristY: 0.3 }, rightFingers: { thumb: 1.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 } }
    ]
  },
  'MORE': {
    label: 'MORE',
    sequence: [
      {
        leftArm: { shoulderX: 0.4, shoulderY: -0.4, elbowZ: 1.3, wristY: 0.4 },
        leftFingers: { thumb: 0.4, index: 0.4, middle: 0.4, ring: 0.4, pinky: 0.4 },
        rightArm: { shoulderX: 0.4, shoulderY: 0.4, elbowZ: -1.3, wristY: 0.4 },
        rightFingers: { thumb: 0.4, index: 0.4, middle: 0.4, ring: 0.4, pinky: 0.4 }
      }
    ]
  },
  'FINISHED': {
    label: 'FINISHED',
    sequence: [
      {
        leftArm: { shoulderX: 0.5, shoulderY: -0.5, elbowZ: 1.4, wristY: 0.6 },
        leftFingers: { thumb: 1.0, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 },
        rightArm: { shoulderX: 0.5, shoulderY: 0.5, elbowZ: -1.4, wristY: 0.6 },
        rightFingers: { thumb: 1.0, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 }
      }
    ]
  },
  'HELP': {
    label: 'HELP',
    sequence: [
      {
        leftArm: { shoulderX: 0.3, shoulderY: -0.4, elbowZ: 1.2, wristY: 0.3 },
        leftFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 },
        rightArm: { shoulderX: 0.3, shoulderY: 0.4, elbowZ: -1.2, wristY: 0.2 },
        rightFingers: { thumb: 1.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 }
      }
    ]
  },
  'EAT': {
    label: 'EAT',
    sequence: [
      { rightArm: { shoulderX: 0.6, shoulderY: 0.6, elbowZ: -1.6, wristY: 0.7 }, rightFingers: { thumb: 0.4, index: 0.4, middle: 0.4, ring: 0.4, pinky: 0.4 } }
    ]
  },
  'DRINK': {
    label: 'DRINK',
    sequence: [
      { rightArm: { shoulderX: 0.6, shoulderY: 0.7, elbowZ: -1.6, wristY: 0.8 }, rightFingers: { thumb: 0.6, index: 0.6, middle: 0.6, ring: 0.6, pinky: 0.6 } }
    ]
  },
  'GOOD': {
    label: 'GOOD',
    sequence: [
      { rightArm: { shoulderX: 0.5, shoulderY: 0.6, elbowZ: -1.5, wristY: 0.6 }, rightFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 } },
      { rightArm: { shoulderX: 0.3, shoulderY: 0.4, elbowZ: -0.8, wristY: 0.3 }, rightFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 } }
    ]
  },
  'MORNING': {
    label: 'MORNING',
    sequence: [
      {
        leftArm: { shoulderX: 0.3, shoulderY: -0.5, elbowZ: 1.2, wristY: 0.3 },
        leftFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 },
        rightArm: { shoulderX: 0.6, shoulderY: 0.4, elbowZ: -1.5, wristY: 0.5 },
        rightFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 }
      }
    ]
  },
  'LOVE': {
    label: 'LOVE',
    sequence: [
      {
        leftArm: { shoulderX: 0.5, shoulderY: 0.3, elbowZ: 1.4, wristY: 0.5 },
        leftFingers: { thumb: 1.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 },
        rightArm: { shoulderX: 0.5, shoulderY: -0.3, elbowZ: -1.4, wristY: 0.5 },
        rightFingers: { thumb: 1.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 }
      }
    ]
  },
  'EMERGENCY': {
    label: 'EMERGENCY',
    sequence: [
      { rightArm: { shoulderX: 0.4, shoulderY: 0.6, elbowZ: -1.2, wristY: 0.5 }, rightFingers: { thumb: 0.2, index: 0.2, middle: 0.2, ring: 0.2, pinky: 0.2 } },
      { rightArm: { shoulderX: 0.5, shoulderY: 0.6, elbowZ: -1.1, wristY: 0.3 }, rightFingers: { thumb: 0.2, index: 0.2, middle: 0.2, ring: 0.2, pinky: 0.2 } }
    ]
  },
  'WATER': {
    label: 'WATER',
    sequence: [
      { rightArm: { shoulderX: 0.5, shoulderY: 0.7, elbowZ: -1.6, wristY: 0.6 }, rightFingers: { thumb: 0.0, index: 1.0, middle: 1.0, ring: 1.0, pinky: 0.0 } }
    ]
  },
  'I LOVE YOU': {
    label: 'I LOVE YOU',
    sequence: [
      { rightArm: { shoulderX: 0.4, shoulderY: 0.6, elbowZ: -1.2, wristY: 0.4 }, rightFingers: { thumb: 1.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 1.0 } }
    ]
  }
};

// ==========================================
// 2. INDIAN SIGN LANGUAGE (ISL)
// ==========================================

export const ISL_ALPHABET = {
  'A': {
    label: 'A',
    description: 'ISL A: Left index finger touches tip of right thumb',
    leftArm: { shoulderX: 0.3, shoulderY: -0.3, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.3, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 1.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 }
  },
  'B': {
    label: 'B',
    description: 'ISL B: Two hands forming circles together (glasses shape)',
    leftArm: { shoulderX: 0.4, shoulderY: -0.4, elbowZ: 1.3, wristY: 0.4 },
    leftFingers: { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 },
    rightArm: { shoulderX: 0.4, shoulderY: 0.4, elbowZ: -1.3, wristY: 0.4 },
    rightFingers: { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 }
  },
  'C': {
    label: 'C',
    description: 'ISL C: Curved right hand creating C shape in front of chest',
    rightArm: { shoulderX: 0.3, shoulderY: 0.4, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.6, index: 0.6, middle: 0.6, ring: 0.6, pinky: 0.6 }
  },
  'D': {
    label: 'D',
    description: 'ISL D: Left index vertical, right hand C touches left index',
    leftArm: { shoulderX: 0.3, shoulderY: -0.3, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.4, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.6, index: 0.6, middle: 0.6, ring: 0.6, pinky: 0.6 }
  },
  'E': {
    label: 'E',
    description: 'ISL E: Right index touches tip of left index finger',
    leftArm: { shoulderX: 0.3, shoulderY: -0.3, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.3, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 }
  },
  'F': {
    label: 'F',
    description: 'ISL F: Two index and middle fingers crossed horizontally',
    leftArm: { shoulderX: 0.3, shoulderY: -0.3, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.0, index: 1.0, middle: 1.0, ring: 0.0, pinky: 0.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.3, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.0, index: 1.0, middle: 1.0, ring: 0.0, pinky: 0.0 }
  },
  'G': {
    label: 'G',
    description: 'ISL G: Both fists together, right over left',
    leftArm: { shoulderX: 0.3, shoulderY: -0.3, elbowZ: 1.1, wristY: 0.2 },
    leftFingers: { thumb: 0.1, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.3, elbowZ: -1.1, wristY: 0.2 },
    rightFingers: { thumb: 0.1, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 }
  },
  'H': {
    label: 'H',
    description: 'ISL H: Right palm wiping flat across left palm upward',
    leftArm: { shoulderX: 0.3, shoulderY: -0.4, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.4, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 }
  },
  'I': {
    label: 'I',
    description: 'ISL I: Right index finger touches tip of left middle finger',
    leftArm: { shoulderX: 0.3, shoulderY: -0.3, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.0, index: 0.0, middle: 1.0, ring: 0.0, pinky: 0.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.3, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 }
  },
  'J': {
    label: 'J',
    description: 'ISL J: Right index finger touches left thumb/hand tracing curve',
    leftArm: { shoulderX: 0.3, shoulderY: -0.3, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 1.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.3, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 }
  },
  'K': {
    label: 'K',
    description: 'ISL K: Left index vertical, right hooked index resting against left index',
    leftArm: { shoulderX: 0.3, shoulderY: -0.3, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.3, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.0, index: 0.5, middle: 0.0, ring: 0.0, pinky: 0.0 }
  },
  'L': {
    label: 'L',
    description: 'ISL L: Left index horizontal, right index vertical resting on left',
    leftArm: { shoulderX: 0.3, shoulderY: -0.3, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.3, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 }
  },
  'M': {
    label: 'M',
    description: 'ISL M: Right 3 fingers resting flat on left open palm',
    leftArm: { shoulderX: 0.3, shoulderY: -0.4, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.4, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.0, index: 1.0, middle: 1.0, ring: 1.0, pinky: 0.0 }
  },
  'N': {
    label: 'N',
    description: 'ISL N: Right 2 fingers resting flat on left open palm',
    leftArm: { shoulderX: 0.3, shoulderY: -0.4, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.4, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.0, index: 1.0, middle: 1.0, ring: 0.0, pinky: 0.0 }
  },
  'O': {
    label: 'O',
    description: 'ISL O: Right index finger touches tip of left ring finger',
    leftArm: { shoulderX: 0.3, shoulderY: -0.3, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.0, index: 0.0, middle: 0.0, ring: 1.0, pinky: 0.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.3, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 }
  },
  'P': {
    label: 'P',
    description: 'ISL P: Left index vertical, right O circle touches top of left index',
    leftArm: { shoulderX: 0.3, shoulderY: -0.3, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.3, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.4, index: 0.4, middle: 0.0, ring: 0.0, pinky: 0.0 }
  },
  'Q': {
    label: 'Q',
    description: 'ISL Q: Left O shape, right index hooked into left O circle',
    leftArm: { shoulderX: 0.3, shoulderY: -0.4, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.4, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 }
  },
  'R': {
    label: 'R',
    description: 'ISL R: Left open palm, right curved fingers resting on left palm',
    leftArm: { shoulderX: 0.3, shoulderY: -0.4, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.4, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.0, pinky: 0.0 }
  },
  'S': {
    label: 'S',
    description: 'ISL S: Left pinky extended, right pinky hooked around left pinky',
    leftArm: { shoulderX: 0.3, shoulderY: -0.3, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 1.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.3, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 1.0 }
  },
  'T': {
    label: 'T',
    description: 'ISL T: Left index horizontal, right index vertical under left index',
    leftArm: { shoulderX: 0.3, shoulderY: -0.3, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.3, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 }
  },
  'U': {
    label: 'U',
    description: 'ISL U: Right index finger touches tip of left pinky finger',
    leftArm: { shoulderX: 0.3, shoulderY: -0.3, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 1.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.3, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 }
  },
  'V': {
    label: 'V',
    description: 'ISL V: Right index and middle forming V on left open palm',
    leftArm: { shoulderX: 0.3, shoulderY: -0.4, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.4, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.0, index: 1.0, middle: 1.0, ring: 0.0, pinky: 0.0 }
  },
  'W': {
    label: 'W',
    description: 'ISL W: Both hands interlaced together in a tent shape',
    leftArm: { shoulderX: 0.4, shoulderY: -0.4, elbowZ: 1.3, wristY: 0.4 },
    leftFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 },
    rightArm: { shoulderX: 0.4, shoulderY: 0.4, elbowZ: -1.3, wristY: 0.4 },
    rightFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 }
  },
  'X': {
    label: 'X',
    description: 'ISL X: Both index fingers crossed forming an X shape',
    leftArm: { shoulderX: 0.3, shoulderY: -0.3, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.3, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 }
  },
  'Y': {
    label: 'Y',
    description: 'ISL Y: Right index tracing Y in palm of left hand',
    leftArm: { shoulderX: 0.3, shoulderY: -0.4, elbowZ: 1.2, wristY: 0.3 },
    leftFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 },
    rightArm: { shoulderX: 0.3, shoulderY: 0.4, elbowZ: -1.2, wristY: 0.3 },
    rightFingers: { thumb: 0.0, index: 1.0, middle: 0.0, ring: 0.0, pinky: 0.0 }
  },
  'Z': {
    label: 'Z',
    description: 'ISL Z: Left vertical palm, right horizontal palm resting against left base',
    leftArm: { shoulderX: 0.4, shoulderY: -0.4, elbowZ: 1.3, wristY: 0.4 },
    leftFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 },
    rightArm: { shoulderX: 0.4, shoulderY: 0.4, elbowZ: -1.3, wristY: 0.4 },
    rightFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 }
  }
};

export const ISL_WORDS = {
  'NAMASTE': {
    label: 'NAMASTE',
    description: 'Traditional Indian greeting: Both open palms pressed together at chest level with head bow',
    sequence: [
      {
        leftArm: { shoulderX: 0.4, shoulderY: -0.3, elbowZ: 1.4, wristY: 0.5 },
        leftFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 },
        rightArm: { shoulderX: 0.4, shoulderY: 0.3, elbowZ: -1.4, wristY: 0.5 },
        rightFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 },
        headTilt: { x: 0.2, y: 0 }
      }
    ]
  },
  'THANK YOU': {
    label: 'THANK YOU',
    description: 'ISL Thank You: Both hands from chest move outward with slight bow',
    sequence: [
      {
        leftArm: { shoulderX: 0.5, shoulderY: -0.4, elbowZ: 1.5, wristY: 0.6 },
        leftFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 },
        rightArm: { shoulderX: 0.5, shoulderY: 0.4, elbowZ: -1.5, wristY: 0.6 },
        rightFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 }
      },
      {
        leftArm: { shoulderX: 0.3, shoulderY: -0.5, elbowZ: 0.8, wristY: 0.3 },
        leftFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 },
        rightArm: { shoulderX: 0.3, shoulderY: 0.5, elbowZ: -0.8, wristY: 0.3 },
        rightFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 }
      }
    ]
  },
  'HELP': {
    label: 'HELP',
    description: 'ISL Help: Right fist resting on left palm lifting upward',
    sequence: [
      {
        leftArm: { shoulderX: 0.3, shoulderY: -0.4, elbowZ: 1.2, wristY: 0.3 },
        leftFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 },
        rightArm: { shoulderX: 0.3, shoulderY: 0.4, elbowZ: -1.2, wristY: 0.3 },
        rightFingers: { thumb: 0.9, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 }
      },
      {
        leftArm: { shoulderX: 0.5, shoulderY: -0.4, elbowZ: 1.0, wristY: 0.6 },
        leftFingers: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 },
        rightArm: { shoulderX: 0.5, shoulderY: 0.4, elbowZ: -1.0, wristY: 0.6 },
        rightFingers: { thumb: 0.9, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 }
      }
    ]
  },
  'WATER': {
    label: 'WATER',
    description: 'ISL Water: Cupped hand bringing water motion toward mouth',
    sequence: [
      {
        rightArm: { shoulderX: 0.6, shoulderY: 0.6, elbowZ: -1.5, wristY: 0.7 },
        rightFingers: { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 }
      }
    ]
  },
  'INDIA': {
    label: 'INDIA',
    description: 'ISL India: Thumb pointing to forehead center (bindi location)',
    sequence: [
      {
        rightArm: { shoulderX: 0.7, shoulderY: 0.8, elbowZ: -1.6, wristY: 0.8 },
        rightFingers: { thumb: 1.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 }
      }
    ]
  },
  'FRIEND': {
    label: 'FRIEND',
    description: 'ISL Friend: Shaking two hands together',
    sequence: [
      {
        leftArm: { shoulderX: 0.3, shoulderY: -0.4, elbowZ: 1.3, wristY: 0.4 },
        leftFingers: { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 },
        rightArm: { shoulderX: 0.3, shoulderY: 0.4, elbowZ: -1.3, wristY: 0.4 },
        rightFingers: { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 }
      }
    ]
  }
};

/**
 * Tokenize input text string into sign glosses based on selected mode ('ASL' or 'ISL')
 */
export function parseSentenceToSignTokens(sentence, mode = 'ASL') {
  if (!sentence) return [];

  const cleaned = sentence.toUpperCase().replace(/[^\w\s]/gi, '').trim();
  if (!cleaned) return [];

  const wordDict = mode === 'ISL' ? ISL_WORDS : ASL_WORDS;
  const alphaDict = mode === 'ISL' ? ISL_ALPHABET : ASL_ALPHABET;
  const fallbackAlphaDict = mode === 'ISL' ? ASL_ALPHABET : ISL_ALPHABET;

  const rawWords = cleaned.split(/\s+/);
  const tokens = [];

  for (const word of rawWords) {
    if (wordDict[word]) {
      const wordData = wordDict[word];
      if (wordData.sequence) {
        wordData.sequence.forEach((step, i) => {
          tokens.push({
            type: 'word',
            key: `${word}_${i}`,
            label: word,
            data: step,
            mode
          });
        });
      } else {
        tokens.push({
          type: 'word',
          key: word,
          label: word,
          data: wordData,
          mode
        });
      }
    } else {
      for (const char of word) {
        const charData = alphaDict[char] || fallbackAlphaDict[char];
        if (charData) {
          const newData = { ...charData };
          if (newData.fingers) {
            newData.rightFingers = { ...newData.fingers };
            if (newData.spread !== undefined) {
              newData.rightFingers.spread = newData.spread;
              delete newData.spread;
            }
            delete newData.fingers;
          }
          tokens.push({
            type: 'letter',
            key: char,
            label: char,
            data: newData,
            mode
          });
        }
      }
    }
  }

  return tokens;
}
