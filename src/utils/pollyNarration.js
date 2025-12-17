// Enhanced Browser Text-to-Speech Narration (100% Free)
// Uses Web Speech API with optimized settings for better quality

let currentUtterance = null;
let currentAudio = null;

/**
 * Initialize speech synthesis and get best available voice
 */
const getBestVoice = () => {
  const voices = window.speechSynthesis.getVoices();
  
  // Prefer these voices in order (they sound most natural)
  const preferredVoices = [
    'Samantha', // macOS - very natural
    'Google US English', // Chrome - good quality
    'Microsoft Zira Desktop', // Windows - decent
    'Karen', // macOS alternative
    'Alex', // macOS male
  ];

  // Try to find preferred voice
  for (const preferred of preferredVoices) {
    const voice = voices.find(v => v.name.includes(preferred));
    if (voice) return voice;
  }

  // Fallback: find any English voice
  const englishVoice = voices.find(v => v.lang.startsWith('en-'));
  return englishVoice || voices[0];
};

/**
 * Play audio from URL (kept for compatibility)
 * @param {string} audioUrl - URL of the audio file
 * @param {Function} onEnd - Callback when audio ends
 */
export const playAudio = (audioUrl, onEnd) => {
  stopAudio();

  currentAudio = new Audio(audioUrl);
  
  currentAudio.onended = () => {
    currentAudio = null;
    if (onEnd) onEnd();
  };

  currentAudio.onerror = (error) => {
    console.error('Error playing audio:', error);
    currentAudio = null;
  };

  currentAudio.play().catch((error) => {
    console.error('Error starting audio playback:', error);
  });

  return currentAudio;
};

/**
 * Stop currently playing audio or speech
 */
export const stopAudio = () => {
  // Stop speech synthesis
  if (window.speechSynthesis && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;

  // Stop audio element if any
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};

/**
 * Check if audio or speech is currently playing
 */
export const isAudioPlaying = () => {
  const isSpeaking = window.speechSynthesis && window.speechSynthesis.speaking;
  const isAudioActive = currentAudio !== null && !currentAudio.paused;
  return isSpeaking || isAudioActive;
};

/**
 * Get available voices
 */
export const getAvailableVoices = () => {
  if (!('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en-'));
};

/**
 * Main narration function using browser TTS
 * @param {string} text - Text to narrate
 * @param {Object} options - Narration options (rate, pitch, volume)
 * @returns {Promise} - Resolves when speech finishes
 */
export const narrate = (text, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      // Stop any current narration
      stopAudio();

      // Check if speech synthesis is available
      if (!('speechSynthesis' in window)) {
        reject(new Error('Text-to-speech not supported in this browser'));
        return;
      }

      // Wait for voices to load if needed
      const startSpeech = () => {
        currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Get the best available voice
        const bestVoice = getBestVoice();
        if (bestVoice) {
          currentUtterance.voice = bestVoice;
          console.log('🎙️ Using voice:', bestVoice.name);
        }

        // Optimize speech parameters for better quality
        currentUtterance.rate = options.rate || 0.95; // Slightly slower for clarity
        currentUtterance.pitch = options.pitch || 1.0; // Natural pitch
        currentUtterance.volume = options.volume || 1.0; // Full volume
        currentUtterance.lang = options.lang || 'en-US';

        // Event handlers
        currentUtterance.onend = () => {
          currentUtterance = null;
          resolve();
        };

        currentUtterance.onerror = (event) => {
          currentUtterance = null;
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };

        // Start speaking
        window.speechSynthesis.speak(currentUtterance);
      };

      // Some browsers need voices to load first
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', startSpeech, { once: true });
      } else {
        startSpeech();
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  narrate,
  playAudio,
  stopAudio,
  isAudioPlaying,
  getAvailableVoices,
};
