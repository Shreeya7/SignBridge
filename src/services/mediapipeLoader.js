/**
 * MediaPipe Hands Loader — CDN-based (reliable, no bundler issues)
 *
 * The @mediapipe/hands npm package doesn't work properly with Vite because
 * its WASM and model files can't be resolved by the bundler. Loading via
 * CDN script injection is the proven, reliable approach.
 */

let handsInstance = null;
let loadPromise = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Don't load twice
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = 'anonymous';
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Loads MediaPipe Hands from CDN and returns an initialized Hands instance.
 * Subsequent calls return the cached instance.
 *
 * @param {function} onResults - Callback receiving MediaPipe hand results
 * @returns {Promise<object|null>} The Hands instance, or null on failure
 */
export async function loadMediaPipeHands(onResults) {
  if (handsInstance) {
    // Re-register callback
    handsInstance.onResults(onResults);
    return handsInstance;
  }

  if (loadPromise) {
    await loadPromise;
    if (handsInstance) {
      handsInstance.onResults(onResults);
    }
    return handsInstance;
  }

  loadPromise = (async () => {
    try {
      // Load the MediaPipe Hands solution from CDN
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.js');

      // Wait briefly for the global to become available
      await new Promise(r => setTimeout(r, 100));

      const HandsClass = window.Hands;
      if (!HandsClass) {
        throw new Error('window.Hands not found after script load');
      }

      const hands = new HandsClass({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.35,
        minTrackingConfidence: 0.35
      });

      hands.onResults(onResults);

      // Initialize the model (downloads WASM + model weights)
      await hands.initialize();

      handsInstance = hands;
      return hands;
    } catch (err) {
      console.error('MediaPipe Hands failed to load:', err);
      handsInstance = null;
      return null;
    }
  })();

  return loadPromise;
}

/**
 * Sends a video frame to the Hands instance for processing.
 * Returns false if the instance isn't ready.
 */
export async function sendFrame(videoElement) {
  if (!handsInstance || !videoElement) return false;
  try {
    await handsInstance.send({ image: videoElement });
    return true;
  } catch (e) {
    // Frame race conditions are normal, silently ignore
    return false;
  }
}
