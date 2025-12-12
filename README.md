# 🎯 DragNet - AI-Powered Compliance Training Platform

DragNet is an AI-powered compliance training platform designed to deliver personalized anti-corruption training to Nigerian professionals across different sectors (Police, Civil Service, Students, Private Sector).

## ✨ Key Features

### 🤖 AI-Driven Intelligence
- **Role-based course assignment** - AI analyzes your position and assigns relevant modules
- **Risk assessment** - Calculates compliance risk exposure for your role
- **Personalized training paths** - Custom learning journeys for each user

### 🎭 Interactive Learning
- **Sector-specific video training** - YouTube-embedded training videos for each sector
- **Interactive ethical dilemma scenarios** - Text-based scenarios with multiple choice options
- **Cartoon visual storytelling** - Emoji-based visual representations of ethical dilemmas
- **🔊 Audio narration** - Listen to scenarios with Web Speech API narration (NEW!)
- **Real-time feedback** - Immediate responses to scenario choices

### 📊 Assessment & Tracking
- **Comprehensive quizzes** - 5-question assessments with 80% pass mark
- **Progress tracking** - Monitor completion across all modules
- **Certificate generation** - Completion certificates for passed modules
- **Audit-ready reports** - Track compliance training completion

### 🎨 Modern User Experience
- **Beautiful UI** - Gradient designs, animations, and smooth transitions
- **Mobile-responsive** - Works perfectly on all devices
- **Accessible** - Audio narration, keyboard navigation, screen reader support
- **Step-by-step flow** - Video → Scenarios → Key Points → Laws → Assessment

## Main Pages
- LandingPage
- Dashboard
- CourseModule
- Profile
- Community
- Assessment
- Notification
- Reporting

## 🚀 Getting Started

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### 🌐 Live Demo
**Production URL**: https://drag-58tc2mh5b-tolu-akintundes-projects.vercel.app

## 📂 Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── Assessment/      # Quiz components
│   ├── Community/       # Community features
│   ├── CourseModule/    # Course display
│   ├── Dashboard/       # User dashboard
│   └── LandingPage/     # Landing page
├── App.jsx              # Main application logic
├── main.jsx             # React entry point
└── index.css            # Global styles
```

## 🎓 Course Modules

### Available Training Modules by Sector:

#### 🚔 Police Sector
1. Anti-Bribery & Corruption
2. Evidence Handling & Integrity
3. Use of Force Regulations
4. Police Conduct & Ethics

#### 🏛️ Civil Service
1. Procurement & Tender Process
2. Conflict of Interest
3. Data Protection & Privacy
4. Public Service Code of Conduct

#### 🎓 Students
1. Academic Integrity
2. NYSC Ethical Conduct
3. Plagiarism & Intellectual Property
4. Campus Leadership Ethics

#### 💼 Private Sector
1. Corporate Compliance
2. Financial Regulations
3. Anti-Money Laundering
4. Business Ethics

## 🔊 New Feature: Audio Narration

The app now includes **audio narration for ethical dilemma scenarios**:
- 🎯 Uses native Web Speech API (no external dependencies)
- 🔊 Click "Listen to Scenario" to hear the scenario read aloud
- ⏸️ Stop narration anytime with one click
- 🌍 Supports Chrome, Safari, Firefox, Edge
- ♿ Enhances accessibility for all users

See `NARRATION_FEATURE.md` for detailed documentation.

## 📖 Documentation

- **NARRATION_FEATURE.md** - Audio narration documentation
- **NARRATION_IMPLEMENTATION.md** - Implementation summary
- **VIDEO_UPDATE_INSTRUCTIONS.md** - How to update training videos
- **CARTOON_ENHANCEMENTS.md** - Visual storytelling features

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Audio**: Web Speech API (native)
- **Video**: YouTube Embedded Players

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
MIT
