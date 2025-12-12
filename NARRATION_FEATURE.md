# 🔊 Narration Feature Documentation

## Overview
The DragNet compliance training app now includes audio narration for ethical dilemma scenarios using the Web Speech API. This feature enhances accessibility and engagement by allowing users to listen to scenario descriptions.

## Features

### 1. **Automatic Browser Detection**
- The app automatically detects if the user's browser supports the Web Speech API
- If not supported, the narration button is hidden
- No errors are shown to users with unsupported browsers

### 2. **Smart Voice Selection**
- Automatically selects high-quality voices (Google or Microsoft voices preferred)
- Falls back to any available English voice if premium voices aren't available
- Uses US English accent by default

### 3. **Audio Controls**
- **Listen Button**: Click to start narration of the scenario situation
- **Stop Button**: Appears during narration to allow users to stop playback
- Visual feedback with animated pulse effect when narration is active
- Smooth transitions between play and stop states

### 4. **User Experience**
- Narration rate: 0.9x (slightly slower for clarity)
- Clear, professional voice output
- Button changes appearance when narrating (pulsing red/pink gradient)
- Icon changes from 🔊 (speaker) to ⏸️ (pause) during playback

### 5. **Automatic Cleanup**
- Narration automatically stops when:
  - User switches to a different scenario
  - User navigates away from the scenario view
  - User clicks the stop button
  - Component unmounts

## Browser Support

### Fully Supported Browsers:
- ✅ **Chrome/Edge** (Desktop & Mobile) - Best support
- ✅ **Safari** (Desktop & Mobile) - Native support
- ✅ **Firefox** (Desktop) - Good support
- ✅ **Opera** - Full support

### Limited/No Support:
- ❌ **Internet Explorer** - Not supported
- ⚠️ **Older Android browsers** - May have limited voice options

## Technical Implementation

### State Management
```javascript
const [isNarrating, setIsNarrating] = useState(false);
const [speechSupported, setSpeechSupported] = useState(false);
```

### Key Functions

#### `narrateText(text)`
- Cancels any ongoing narration
- Creates a new speech synthesis utterance
- Configures voice settings (rate, pitch, volume)
- Selects the best available voice
- Handles start/end/error events

#### `stopNarration()`
- Cancels the current narration
- Updates the narrating state

#### `toggleNarration(text)`
- Toggles between play and stop states
- Provides a simple user interface

### Voice Configuration
```javascript
utterance.rate = 0.9;      // 90% speed for clarity
utterance.pitch = 1.0;     // Normal pitch
utterance.volume = 1.0;    // Full volume
utterance.lang = 'en-US';  // US English
```

## Usage in the App

### Location
The narration button appears in the scenario view, directly below the scenario description text, inside the "Scenario Story" card.

### User Flow
1. User opens an ethical dilemma scenario
2. Narration button appears (if browser supports it)
3. User clicks "🔊 Listen to Scenario"
4. Audio narration begins with visual feedback
5. Button changes to "⏸️ Stop Narration" with pulsing animation
6. User can click to stop, or let it finish naturally
7. When complete, button returns to original state

## Testing the Feature

### Manual Testing Steps:
1. Start the app in development mode: `npm run dev`
2. Sign up/sign in to the platform
3. Complete onboarding (select sector, role, etc.)
4. Navigate to Dashboard
5. Click "Start Module" on any course
6. Click on any scenario simulation
7. Look for the "🔊 Listen to Scenario" button
8. Click it to hear the scenario read aloud
9. Verify it stops when you:
   - Click the stop button
   - Navigate away
   - Switch to another scenario

### Browser Testing:
- Test in Chrome (best support)
- Test in Safari (iOS/macOS)
- Test in Firefox
- Verify fallback behavior in unsupported browsers

## Accessibility Benefits

### For Users With:
- **Visual Impairments**: Can listen to scenarios without reading
- **Reading Difficulties**: Audio reinforcement helps comprehension
- **Multitasking Needs**: Can listen while doing other tasks
- **Learning Preferences**: Some users learn better through audio

### WCAG Compliance:
- ✅ Supports multiple input methods
- ✅ Provides alternative content delivery
- ✅ Clear visual and auditory feedback
- ✅ Keyboard accessible (buttons are focusable)

## Future Enhancements

### Potential Additions:
1. **Voice Selection** - Allow users to choose from available voices
2. **Speed Control** - Let users adjust narration speed (0.5x - 2x)
3. **Auto-Play Option** - Automatically start narration when scenario loads
4. **Progress Indicator** - Show narration progress bar
5. **Download Audio** - Allow users to download scenario audio files
6. **Multi-Language Support** - Add narration in other languages (Yoruba, Igbo, Hausa)
7. **Custom Voice Actors** - Record professional voice actors for key scenarios
8. **Background Music** - Add subtle background music during narration

## Troubleshooting

### Issue: Narration button doesn't appear
**Solution**: Your browser doesn't support the Web Speech API. Try using Chrome, Edge, or Safari.

### Issue: No sound when clicking narration button
**Solution**: 
- Check your device volume
- Check browser sound permissions
- Try a different browser
- Ensure speakers/headphones are connected

### Issue: Voice sounds robotic or unclear
**Solution**: 
- This depends on your device's available voices
- Desktop browsers typically have better voice quality
- iOS/macOS Safari has excellent native voices

### Issue: Narration cuts off mid-sentence
**Solution**: 
- This can happen with very long text
- The app automatically handles this, but some browsers have limits
- Try refreshing the page

## Code Maintenance

### Files Modified:
- `/src/App.jsx` - Main application file with narration logic

### Key Code Sections:
- Lines 1-3: Import `useEffect` from React
- Lines 26-28: State variables for narration
- Lines 37-103: Speech synthesis functions and effects
- Lines 2975-2997: Narration button UI

### Dependencies:
- **None!** The Web Speech API is native to modern browsers
- No external libraries or packages required
- Zero impact on bundle size

## Performance Impact

- **Bundle Size**: No increase (uses native browser API)
- **Runtime Performance**: Minimal (browser handles audio processing)
- **Memory Usage**: Negligible
- **Load Time**: No impact

## Privacy & Security

- ✅ No data sent to external servers
- ✅ Audio processing happens locally in the browser
- ✅ No recording or storage of audio
- ✅ No personally identifiable information transmitted
- ✅ Compliant with data protection regulations

## Deployment Notes

### Production Checklist:
- [x] Build succeeds without errors
- [x] Feature works in major browsers
- [x] No console errors
- [x] Graceful degradation for unsupported browsers
- [x] Mobile responsive
- [x] Accessible via keyboard

### Deployment Command:
```bash
npm run build
vercel --prod
```

## Support & Resources

### Web Speech API Documentation:
- [MDN Web Docs - Speech Synthesis API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
- [W3C Web Speech API Specification](https://w3c.github.io/speech-api/)

### Browser Compatibility:
- [Can I Use - Speech Synthesis](https://caniuse.com/speech-synthesis)

---

**Last Updated**: December 12, 2025  
**Feature Version**: 1.0  
**Status**: ✅ Production Ready
