/**
 * Utility functions for Web Speech API narration
 */

/**
 * Check if speech synthesis is supported in the browser
 * @returns {boolean} True if supported, false otherwise
 */
export const isSpeechSynthesisSupported = () => {
  return 'speechSynthesis' in window;
};

/**
 * Get available voices and find the best English voice
 * @returns {SpeechSynthesisVoice|null} Best available voice or null
 */
export const getBestVoice = () => {
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => 
    voice.lang === 'en-US' && (voice.name.includes('Google') || voice.name.includes('Microsoft'))
  ) || voices.find(voice => voice.lang.startsWith('en'));
  
  return preferredVoice || null;
};

/**
 * Create and configure a speech utterance
 * @param {string} text - Text to narrate
 * @param {Function} onStart - Callback when narration starts
 * @param {Function} onEnd - Callback when narration ends
 * @param {Function} onError - Callback when error occurs
 * @returns {SpeechSynthesisUtterance} Configured utterance
 */
export const createUtterance = (text, onStart, onEnd, onError) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  utterance.lang = 'en-US';
  
  const voice = getBestVoice();
  if (voice) {
    utterance.voice = voice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  return utterance;
};

/**
 * Narrate text using Web Speech API
 * @param {string} text - Text to narrate
 * @param {Function} setIsNarrating - State setter for narration status
 */
export const narrateText = (text, setIsNarrating) => {
  if (!isSpeechSynthesisSupported()) {
    console.log('Speech synthesis not supported in this browser');
    return;
  }

  // Cancel any ongoing narration
  window.speechSynthesis.cancel();

  const utterance = createUtterance(
    text,
    () => setIsNarrating(true),
    () => setIsNarrating(false),
    (event) => {
      console.error('Speech synthesis error:', event);
      setIsNarrating(false);
    }
  );

  window.speechSynthesis.speak(utterance);
};

/**
 * Stop any ongoing narration
 * @param {Function} setIsNarrating - State setter for narration status
 */
export const stopNarration = (setIsNarrating) => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    setIsNarrating(false);
  }
};

/**
 * Toggle narration on/off
 * @param {string} text - Text to narrate
 * @param {boolean} isNarrating - Current narration status
 * @param {Function} setIsNarrating - State setter for narration status
 */
export const toggleNarration = (text, isNarrating, setIsNarrating) => {
  if (isNarrating) {
    stopNarration(setIsNarrating);
  } else {
    narrateText(text, setIsNarrating);
  }
};
