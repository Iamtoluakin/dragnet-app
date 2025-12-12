# 🎙️ Audio Narration Files

This directory contains pre-recorded human voice narration for the DragNet compliance training app.

## Directory Structure

```
public/audio/
├── scenarios/          # Scenario narrations
├── keypoints/         # Key learning point narrations
└── laws/              # Law & regulation narrations
```

## File Naming Convention

### Scenarios
- Format: `{sector}-{module}-{scenario-number}.mp3`
- Examples:
  - `police-bribery-1.mp3`
  - `police-bribery-2.mp3`
  - `civil-procurement-1.mp3`
  - `student-academic-1.mp3`

### Key Points
- Format: `{sector}-{module}-keypoint-{number}.mp3`
- Examples:
  - `police-bribery-keypoint-1.mp3`
  - `police-bribery-keypoint-2.mp3`

### Laws & Regulations
- Format: `{sector}-{module}-law-{number}.mp3`
- Examples:
  - `police-bribery-law-1.mp3`
  - `police-bribery-law-2.mp3`

## Recording Specifications

### Technical Requirements
- **Format**: MP3
- **Bitrate**: 128 kbps (good quality, reasonable file size)
- **Sample Rate**: 44.1 kHz
- **Channels**: Mono (sufficient for voice)
- **Target File Size**: < 500KB per file
- **Length**: Typically 30-60 seconds per scenario

### Voice Requirements
- **Accent**: Nigerian English (preferred) or neutral English
- **Tone**: Professional, clear, and engaging
- **Pace**: Moderate (not too fast, not too slow)
- **Emotion**: Appropriate to content (serious for legal, empathetic for scenarios)

## How to Record

### Option 1: Hire a Professional Voice Actor
1. Find a voice actor on:
   - **Fiverr**: Search for "Nigerian voice over" ($10-50 per recording)
   - **Voices.com**: Professional voice actors ($50-200 per project)
   - **Upwork**: Freelance voice actors
   - **Local talent**: Nigerian broadcasting professionals

2. Provide them with:
   - The script (from App.jsx - scenario.situation, keyPoints, laws)
   - Audio specifications (see above)
   - File naming convention

### Option 2: Record Yourself
1. **Equipment Needed**:
   - Good quality USB microphone ($30-100)
   - Quiet room with minimal echo
   - Pop filter (optional but helpful)
   - Headphones for monitoring

2. **Software** (Free Options):
   - **Audacity** (Windows/Mac/Linux) - Free
   - **GarageBand** (Mac) - Free
   - **Ocenaudio** (Windows/Mac) - Free

3. **Recording Process**:
   - Read the script naturally, as if explaining to a friend
   - Take breaks between sections
   - Do multiple takes if needed
   - Edit out mistakes and long pauses

4. **Editing**:
   - Remove background noise
   - Normalize audio levels
   - Add slight compression for consistency
   - Export as MP3 (128 kbps, mono, 44.1 kHz)

### Option 3: Use AI Voice Generation (High Quality)

**ElevenLabs** (Most Realistic AI Voices)
- Website: https://elevenlabs.io
- Cost: $5-$99/month
- Quality: Industry-leading, nearly indistinguishable from human
- Steps:
  1. Sign up for account
  2. Choose a voice (or clone your own)
  3. Paste script text
  4. Generate and download MP3
  5. Rename file according to convention

**Google Cloud Text-to-Speech**
- Website: https://cloud.google.com/text-to-speech
- Cost: $4 per 1 million characters (WaveNet Neural voices)
- Quality: Very good
- Has Nigerian English voice
- Steps:
  1. Enable API in Google Cloud Console
  2. Use Python script to generate audio (see example below)

**Play.ht**
- Website: https://play.ht
- Cost: $19-$99/month
- Quality: Excellent
- Can clone voices

## Example: Generate Audio with Google Cloud TTS

```python
from google.cloud import texttospeech
import os

# Initialize client
client = texttospeech.TextToSpeechClient()

# Script to convert
text = "You are manning a checkpoint on a busy highway..."

# Configure synthesis
input_text = texttospeech.SynthesisInput(text=text)

voice = texttospeech.VoiceSelectionParams(
    language_code="en-NG",  # Nigerian English
    name="en-NG-Standard-A",  # Use Neural voices for best quality
    ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL,
)

audio_config = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.MP3,
    speaking_rate=0.9,  # Slightly slower for clarity
    pitch=0.0,
)

# Generate audio
response = client.synthesize_speech(
    input=input_text, voice=voice, audio_config=audio_config
)

# Save to file
with open("police-bribery-1.mp3", "wb") as out:
    out.write(response.audio_content)
```

## Current Status

⚠️ **Audio files are not yet recorded**

The app will automatically:
1. Try to load audio files first (for best quality)
2. Fall back to Web Speech API if files don't exist
3. Continue to work without any errors

## Scripts to Record (Priority Order)

### High Priority (Record First)
1. ✅ Police - Anti-Bribery Scenarios (3 scenarios)
2. ✅ Civil Service - Procurement Scenarios (3 scenarios)
3. ✅ Student - Academic Integrity Scenarios (3 scenarios)

### Medium Priority
4. Key Learning Points for each module
5. Laws & Regulations for each module

### Low Priority
6. Private Sector scenarios
7. Additional modules

## Testing Audio Files

1. Place audio files in the appropriate directory
2. Start the dev server: `npm run dev`
3. Navigate to a scenario
4. Click the narration button
5. Verify:
   - Audio plays correctly
   - Good quality
   - Appropriate volume
   - Complete narration (doesn't cut off)

## File Size Optimization

If files are too large:
1. Reduce bitrate to 96 kbps (still acceptable quality)
2. Convert to mono if in stereo
3. Use tools like **Audacity** or **FFmpeg** to compress

```bash
# Using FFmpeg to optimize
ffmpeg -i input.mp3 -b:a 128k -ac 1 -ar 44100 output.mp3
```

## Budget Estimates

### Professional Voice Actor
- Per recording (30-60 sec): $10-20
- Full module (12 files): $120-240
- All 4 sectors: $480-960

### AI Voice Generation (ElevenLabs)
- Monthly subscription: $5-99
- Unlimited generations within character limit
- One month should be enough: ~$30

### DIY Recording
- USB Microphone: $30-100 (one-time)
- Software: Free (Audacity)
- Time: 2-4 hours for all scripts

## Need Help?

- For voice actor recommendations, contact me
- For AI voice generation setup, I can provide detailed guides
- For recording tips, see the [Recording Best Practices Guide](./RECORDING_GUIDE.md)

---

**Last Updated**: December 12, 2025
**Status**: 🚧 Audio files pending - using Web Speech API as fallback
