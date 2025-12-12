# 🎙️ Human Voice Narration Implementation Guide

## Overview
This guide explains how to add professional human voice narration to the DragNet compliance training app using pre-recorded audio files.

## Implementation Options

### Option 1: Pre-recorded Audio Files (RECOMMENDED) ⭐
**Best for:** Production apps, offline capability, professional quality

#### Setup Steps:

1. **Record Audio Files**
   - Hire a professional voice actor (Nigerian accent recommended)
   - Record all scenarios, key points, and laws
   - Export as MP3 files (optimized for web)
   - File naming convention: `police-bribery-1.mp3`, `key-point-1.mp3`, etc.

2. **Audio Specifications**
   - Format: MP3 (best compatibility)
   - Bitrate: 128 kbps (good quality, reasonable file size)
   - Sample Rate: 44.1 kHz
   - Mono channel (sufficient for voice)
   - File size target: < 500KB per file

3. **Store Audio Files**
   - Upload to `/public/audio/scenarios/`
   - Upload to `/public/audio/keypoints/`
   - Upload to `/public/audio/laws/`

---

### Option 2: Cloud Text-to-Speech API
**Best for:** Dynamic content, multiple languages, no upfront recording costs

#### Popular Services:

**Google Cloud Text-to-Speech**
- Cost: $4 per 1 million characters (WaveNet voices)
- Quality: Excellent neural voices
- Languages: 220+ voices in 40+ languages
- Nigerian English available: ✅

**Amazon Polly**
- Cost: $4 per 1 million characters (Neural voices)
- Quality: Very good
- Languages: 60+ voices in 29 languages
- Nigerian English available: ❌ (but has British English)

**Microsoft Azure Speech**
- Cost: $15 per 1 million characters (Neural voices)
- Quality: Excellent
- Languages: 270+ voices in 110+ languages
- Nigerian English available: ✅

**ElevenLabs** (Most Realistic)
- Cost: $5-$99/month for 30k-1M characters
- Quality: Industry-leading AI voices
- Can clone specific voices
- Nigerian accent: Can be created

---

## Implementation Code

### Implementation Status: ✅ COMPLETED

The app now supports both:
1. **Pre-recorded audio files** (MP3) - for professional human voice narration
2. **Web Speech API** - automatic fallback if audio files don't exist

### How It Works

1. When user clicks narration button, the app first tries to play the audio file from `/public/audio/`
2. If the audio file doesn't exist or fails to load, it automatically falls back to the Web Speech API
3. No errors shown to users - seamless experience

### Code Implementation

**State Variables** (Added to App.jsx):
```javascript
const audioRef = useRef(null);
const [isPlayingAudio, setIsPlayingAudio] = useState(false);
const [useAudioFiles, setUseAudioFiles] = useState(true);
```

**Audio Functions** (Added to App.jsx):
```javascript
// Play pre-recorded audio file
const playAudioFile = (audioPath) => {
  const audio = new Audio(audioPath);
  audio.onplay = () => setIsPlayingAudio(true);
  audio.onended = () => setIsPlayingAudio(false);
  audio.onerror = () => {
    // Fallback to Web Speech API
    setUseAudioFiles(false);
  };
  audio.play();
};

// Universal narration (audio file or Web Speech API)
const narrateContent = (text, audioPath = null) => {
  if (audioPath && useAudioFiles) {
    playAudioFile(audioPath);
  } else {
    toggleNarration(text); // Web Speech API
  }
};
```

### Usage Example

To add audio file to a scenario, simply place the MP3 file in:
```
/public/audio/scenarios/police-bribery-1.mp3
```

The button will automatically use it! No code changes needed.

---

## Quick Start Guide

### Step 1: Record Your Audio

Choose one of these methods:

#### Method A: Hire on Fiverr (EASIEST)
1. Go to Fiverr.com
2. Search "Nigerian voice over"
3. Select a voice actor ($10-30 per recording)
4. Send them the script (from your scenarios)
5. They'll deliver MP3 files

#### Method B: Use ElevenLabs AI (FASTEST & BEST QUALITY)
1. Go to elevenlabs.io
2. Sign up ($5/month starter plan)
3. Choose a voice (or clone your own)
4. Paste your scenario text
5. Click "Generate Speech"
6. Download MP3 file
7. Rename to match convention (e.g., `police-bribery-1.mp3`)

#### Method C: Record Yourself (FREE)
1. Download Audacity (free)
2. Plug in a decent microphone
3. Record in a quiet room
4. Export as MP3 (128 kbps, mono)

### Step 2: Name Your Files

Follow this naming convention:
- Scenarios: `{sector}-{module}-{number}.mp3`
  - Example: `police-bribery-1.mp3`
- Key Points: `{sector}-{module}-keypoint-{number}.mp3`
  - Example: `police-bribery-keypoint-1.mp3`
- Laws: `{sector}-{module}-law-{number}.mp3`
  - Example: `police-bribery-law-1.mp3`

### Step 3: Upload Files

Place files in the correct directory:
```
drag-net/public/audio/
  ├── scenarios/
  │   ├── police-bribery-1.mp3
  │   ├── police-bribery-2.mp3
  │   └── civil-procurement-1.mp3
  ├── keypoints/
  │   ├── police-bribery-keypoint-1.mp3
  │   └── police-bribery-keypoint-2.mp3
  └── laws/
      ├── police-bribery-law-1.mp3
      └── police-bribery-law-2.mp3
```

### Step 4: Test

1. Run `npm run dev`
2. Navigate to a scenario
3. Click the narration button
4. Verify audio plays correctly

### Step 5: Deploy

```bash
npm run build
vercel --prod
```

---

## Scripts to Record

I've extracted all the text that needs to be recorded. Here are the scripts:

### Police Module - Anti-Bribery Scenarios

**File: police-bribery-1.mp3**
```
You are manning a checkpoint on a busy highway. A driver approaches whose vehicle documents are expired. The driver offers you ₦5,000 to "settle the matter" and let them pass without writing a ticket.
```

**File: police-bribery-2.mp3**
```
A suspect in a case you are investigating offers you ₦50,000 to "misplace" a key piece of evidence that would link them to a crime. They claim "everyone does it."
```

**File: police-bribery-3.mp3**
```
A wealthy businessman whose business you helped protect during an investigation sends an expensive gift hamper to your house with a thank-you card. Your family is excited about the gift.
```

### Key Learning Points

**File: police-bribery-keypoint-1.mp3**
```
Definition: Bribery is offering, giving, receiving, or soliciting something of value to influence official actions
```

**File: police-bribery-keypoint-2.mp3**
```
The Corrupt Practices Act criminalizes all forms of bribery and corruption
```

(Continue for all key points...)

---

## Recommended Voice Actors

### For Nigerian English Accent:
1. **Fiverr**:
   - Search: "Nigerian voice over"
   - Budget: $10-30 per recording
   - Turnaround: 1-3 days

2. **Voices.com**:
   - Professional Nigerian voice actors
   - Budget: $50-200 per project
   - High quality, professional grade

### For AI Voice (ElevenLabs):
**Recommended voices:**
- "Adam" - Deep, authoritative (good for laws/regulations)
- "Bella" - Clear, friendly (good for scenarios)
- "Rachel" - Professional, warm (good for key points)

You can also **clone your own voice** or a colleague's voice for authentic Nigerian accent!

---

## Budget Breakdown

### Option 1: Professional Voice Actor (Fiverr)
- 3 Police scenarios: $30-90
- 5 Key points: $25-50
- 3 Laws: $15-30
- **Total: $70-170** for one complete module

### Option 2: AI Voice (ElevenLabs)
- Monthly subscription: $5-30
- Unlimited generations (within character limit)
- **Total: $30** (one month is enough for all modules)

### Option 3: DIY Recording
- USB Microphone: $30-100 (one-time)
- Software: Free
- **Total: $30-100** (equipment only)

---

## Next Steps

1. **Immediate**: App works with Web Speech API (current fallback)
2. **Phase 1**: Record high-priority scenarios (Police, Civil Service, Student)
3. **Phase 2**: Record key learning points
4. **Phase 3**: Record laws and regulations
5. **Future**: Add multiple languages (Yoruba, Igbo, Hausa)

---

## Support

Need help with:
- Finding voice actors?
- Setting up ElevenLabs?
- Recording tips?
- Audio editing?

Just ask! I can provide detailed guides for any of these.
