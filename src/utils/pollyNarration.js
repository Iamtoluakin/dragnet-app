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
 * Main narration function - AWS Polly ONLY
 * @param {string} text - Text to narrate
 * @param {Object} options - Narration options (voiceId, languageCode)
 * @returns {Promise} - Resolves when audio finishes playing
 */
export const narrate = async (text, options = {}) => {
  try {
    console.log('🎙️ Using AWS Polly for narration...');
    const audioUrl = await textToSpeechPolly(text, options);
    return new Promise((resolve, reject) => {
      const audio = playAudio(audioUrl, resolve);
      if (!audio) {
        reject(new Error('Failed to play audio'));
      }
    });
  } catch (error) {
    console.error('❌ AWS Polly narration failed:', error);
    throw new Error('AWS Polly is not configured. Please check Firebase Functions deployment.');
  }
};

export default {
  narrate,
  textToSpeechPolly,
  playAudio,
  stopAudio,
  isAudioPlaying,
};
