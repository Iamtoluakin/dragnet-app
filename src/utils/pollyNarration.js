// AWS Polly Narration Utility
import { getFunctions, httpsCallable } from 'firebase/functions';

let currentAudio = null;

/**
 * Convert text to speech using AWS Polly via Firebase Function
 * @param {string} text - Text to convert to speech
 * @param {Object} options - Voice options
 * @returns {Promise<string>} - Audio URL
 */
export const textToSpeechPolly = async (text, options = {}) => {
  try {
    const functions = getFunctions();
    const textToSpeechUrl = httpsCallable(functions, 'textToSpeechUrl');
    
    const result = await textToSpeechUrl({
      text: text,
      voiceId: options.voiceId || 'Joanna', // US English female
      languageCode: options.languageCode || 'en-US',
    });

    if (result.data.success) {
      return result.data.url;
    } else {
      throw new Error('Failed to generate speech');
    }
  } catch (error) {
    console.error('Error generating speech with Polly:', error);
    throw error;
  }
};

/**
 * Play audio from URL
 * @param {string} audioUrl - URL of the audio file
 * @param {Function} onEnd - Callback when audio ends
 */
export const playAudio = (audioUrl, onEnd) => {
  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

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
 * Stop currently playing audio
 */
export const stopAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};

/**
 * Check if audio is currently playing
 */
export const isAudioPlaying = () => {
  return currentAudio !== null && !currentAudio.paused;
};

/**
 * Fallback to Web Speech API if Polly is unavailable
 */
export const textToSpeechBrowser = (text, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    // Try to select a specific voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en-') && voice.name.includes('Female')
    ) || voices.find(voice => voice.lang.startsWith('en-'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (error) => reject(error);

    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Main narration function with fallback
 * @param {string} text - Text to narrate
 * @param {Object} options - Narration options
 * @param {boolean} usePolly - Whether to use Polly (true) or browser TTS (false)
 */
export const narrate = async (text, options = {}, usePolly = true) => {
  try {
    if (usePolly) {
      const audioUrl = await textToSpeechPolly(text, options);
      return new Promise((resolve, reject) => {
        playAudio(audioUrl, resolve);
      });
    } else {
      return await textToSpeechBrowser(text, options);
    }
  } catch (error) {
    console.error('Polly narration failed, falling back to browser TTS:', error);
    // Fallback to browser TTS
    return await textToSpeechBrowser(text, options);
  }
};

export default {
  narrate,
  textToSpeechPolly,
  textToSpeechBrowser,
  playAudio,
  stopAudio,
  isAudioPlaying,
};
