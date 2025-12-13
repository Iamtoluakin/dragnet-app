import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [view, setView] = useState('landing');
  const keyLearningRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedRank, setSelectedRank] = useState('');
  const [analysisStep, setAnalysisStep] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [scenarioAnswer, setScenarioAnswer] = useState('');
  const [scenarioResult, setScenarioResult] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [clickedLearningPoints, setClickedLearningPoints] = useState([]);
  const [showKeyLearning, setShowKeyLearning] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [scenarioBranch, setScenarioBranch] = useState([]);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentStep, setCurrentStep] = useState('video'); // 'video', 'scenarios', 'keyPoints', 'laws', 'assessment'
  
  // Audio narration with real files
  const audioRef = useRef(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [useAudioFiles, setUseAudioFiles] = useState(true); // Toggle between audio files and Web Speech API
  
  // Form states for auth
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Load saved progress from localStorage on mount
  useEffect(() => {
    const loadProgress = () => {
      try {
        const savedProgress = localStorage.getItem('dragnet_progress');
        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          
          // Restore user data
          if (progress.isAuthenticated) {
            setIsAuthenticated(true);
            setUserName(progress.userName || '');
            setUserEmail(progress.userEmail || '');
            setSelectedSector(progress.selectedSector || '');
            setSelectedRole(progress.selectedRole || '');
            setSelectedDepartment(progress.selectedDepartment || '');
            setSelectedRank(progress.selectedRank || '');
            setUserProfile(progress.userProfile || null);
            setView(progress.view || 'dashboard');
          }
          
          // Restore course progress
          if (progress.completedCourses) {
            setCompletedCourses(progress.completedCourses);
          }
          
          console.log('✅ Progress loaded from localStorage');
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };
    
    loadProgress();
  }, []);

  // Save progress to localStorage whenever key state changes
  useEffect(() => {
    if (isAuthenticated) {
      try {
        const progressData = {
          isAuthenticated,
          userName,
          userEmail,
          selectedSector,
          selectedRole,
          selectedDepartment,
          selectedRank,
          userProfile,
          completedCourses,
          view,
          lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('dragnet_progress', JSON.stringify(progressData));
        console.log('💾 Progress saved to localStorage');
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  }, [isAuthenticated, userName, userEmail, selectedSector, selectedRole, 
      selectedDepartment, selectedRank, userProfile, completedCourses, view]);

  // Check for Web Speech API support on component mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Stop narration when scenario changes or component unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentScenario]);

  // Function to narrate text using Web Speech API
  const narrateText = (text) => {
    window.speechSynthesis.cancel();
    
    if (!speechSupported) {
      console.log('Speech synthesis not supported in this browser');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang === 'en-US' && (voice.name.includes('Google') || voice.name.includes('Microsoft'))
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsNarrating(true);
    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsNarrating(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Function to stop narration
  const stopNarration = () => {
    window.speechSynthesis.cancel();
    setIsNarrating(false);
  };

  // Function to toggle narration
  const toggleNarration = (text) => {
    if (isNarrating) {
      stopNarration();
    } else {
      narrateText(text);
    }
  };

  // Function to play audio file (for pre-recorded narration)
  const playAudioFile = (audioPath) => {
    // Stop any current Web Speech API narration
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Create new audio element
    const audio = new Audio(audioPath);
    audioRef.current = audio;

    audio.onplay = () => setIsPlayingAudio(true);
    audio.onended = () => setIsPlayingAudio(false);
    audio.onerror = (error) => {
      console.warn('Audio file not found, falling back to Web Speech API:', error);
      setIsPlayingAudio(false);
      // Fallback to Web Speech API if audio file doesn't exist
      setUseAudioFiles(false);
    };

    audio.play().catch(error => {
      console.warn('Could not play audio file, falling back to Web Speech API:', error);
      setIsPlayingAudio(false);
      setUseAudioFiles(false);
    });
  };

  // Function to stop audio file playback
  const stopAudioFile = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlayingAudio(false);
    }
  };

  // Universal narration function (uses audio files if available, falls back to Web Speech API)
  const narrateContent = (text, audioPath = null) => {
    // If audio path is provided and we're using audio files, try to play it
    if (audioPath && useAudioFiles) {
      playAudioFile(audioPath);
    } else {
      // Otherwise use Web Speech API
      toggleNarration(text);
    }
  };

  // Universal stop function
  const stopAllNarration = () => {
    stopAudioFile();
    stopNarration();
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAllNarration();
    };
  }, [currentScenario]);

  const sectors = [
    { value: 'police', label: 'Police', icon: '🚔', color: 'from-blue-600 to-blue-800' },
    { value: 'civil', label: 'Civil Service', icon: '🏛️', color: 'from-purple-600 to-purple-800' },
    { value: 'student', label: 'Student', icon: '🎓', color: 'from-green-600 to-green-800' },
    { value: 'private', label: 'Private Sector', icon: '💼', color: 'from-orange-600 to-orange-800' }
  ];

  const rolesBySection = {
    police: ['Traffic Officer', 'Sergeant', 'Inspector', 'Detective', 'Corporal', 'Constable'],
    civil: ['Procurement Officer', 'Finance Officer', 'Admin Officer', 'IT Officer', 'HR Officer', 'Legal Officer'],
    student: ['Student Leader', 'NYSC Intern', 'Graduate Student', 'Undergraduate', 'Class Representative'],
    private: ['Bank Teller', 'Customer Service Rep', 'Manager', 'Accountant', 'Sales Rep', 'IT Staff']
  };

  const departmentsBySection = {
    police: ['Operations', 'Traffic', 'Criminal Investigation', 'Intelligence', 'Administration'],
    civil: ['Finance', 'Procurement', 'IT', 'HR', 'Legal', 'Administration'],
    student: ['Education', 'Student Affairs', 'Administration', 'Community Service'],
    private: ['Finance', 'IT', 'Healthcare', 'Customer Service', 'Operations', 'Sales']
  };

  const ranksBySection = {
    police: ['Constable', 'Corporal', 'Sergeant', 'Inspector', 'Chief Inspector', 'Superintendent'],
    civil: ['GL06', 'GL07', 'GL08', 'GL09', 'GL10', 'GL12', 'GL14', 'GL15'],
    student: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'NYSC Intern', 'Graduate Student'],
    private: ['Intern', 'Junior Officer', 'Officer', 'Senior Officer', 'Manager', 'Senior Manager']
  };

  const analysisSteps = [
    { text: 'Analyzing your role and responsibilities...', icon: '🔍' },
    { text: 'Identifying compliance requirements...', icon: '📋' },
    { text: 'Mapping relevant regulations and policies...', icon: '⚖️' },
    { text: 'Calculating risk exposure level...', icon: '📊' },
    { text: 'Assigning personalized training modules...', icon: '🎯' },
    { text: 'Generating assessment scenarios...', icon: '✅' }
  ];

  const coursesBySector = {
    police: [
      { 
        id: 1,
        title: 'Anti-Bribery & Corruption',
        description: 'Learn about bribery laws and ethical conduct at checkpoints',
        progress: 0,
        risk: 'high',
        duration: '15 min',
        content: {
          introduction: 'As a law enforcement officer, you hold a position of public trust. Understanding and resisting corruption is essential to maintaining the integrity of the Nigerian Police Force.',
          keyPoints: [
            'Definition: Bribery is offering, giving, receiving, or soliciting something of value to influence official actions',
            'The Corrupt Practices Act criminalizes all forms of bribery and corruption',
            'Penalties include imprisonment, fines, and dismissal from service',
            'Officers must refuse all gifts, money, or favors from the public',
            'Report any attempted bribery to your supervisor immediately'
          ],
          laws: [
            'Corrupt Practices and Other Related Offences Act (2000)',
            'Nigerian Criminal Code Act - Sections on bribery',
            'Police Act and Regulations - Code of Conduct'
          ]
        },
        scenarios: [
          {
            id: 'police-bribery-1',
            title: 'Checkpoint Bribery Scenario',
            videoUrl: 'https://www.youtube.com/embed/71xKd6tTFfw',
            videoThumbnail: '🎥',
            situation: 'You are manning a checkpoint on a busy highway. A driver approaches whose vehicle documents are expired. The driver offers you ₦5,000 to "settle the matter" and let them pass without writing a ticket.',
            options: [
              {
                id: 'a',
                text: 'Accept the money and let them go',
                correct: false,
                feedback: '❌ INCORRECT: This is bribery and corruption. Accepting money to overlook a violation is a criminal offense under the Corrupt Practices Act. You could face imprisonment, dismissal, and prosecution.',
                consequence: 'Your action was witnessed by a passing patrol car. You are now under investigation for corruption.',
                points: -10,
                followUp: {
                  situation: 'Your supervisor calls you to the station. What do you do?',
                  options: [
                    { id: 'a1', text: 'Deny everything', correct: false, feedback: 'This makes things worse. Lying compounds the offense.' },
                    { id: 'a2', text: 'Admit the mistake and cooperate', correct: true, feedback: 'Cooperation may reduce penalties. However, the damage is done.' }
                  ]
                }
              },
              {
                id: 'b',
                text: 'Refuse the money and issue the proper citation',
                correct: true,
                feedback: '✅ CORRECT: This is the right action. Refuse the bribe, issue the proper citation for expired documents, and document the attempted bribery in your report. Your integrity protects the public trust.',
                consequence: 'The driver becomes angry and threatens to report you. How do you handle this?',
                points: 10,
                followUp: {
                  situation: 'The driver is now being aggressive and threatening. What is your next step?',
                  options: [
                    { id: 'b1', text: 'Stay calm, complete the citation, and call for backup if needed', correct: true, feedback: '✅ Excellent! Professional de-escalation and following protocol.' },
                    { id: 'b2', text: 'Argue back and escalate the situation', correct: false, feedback: '❌ This is unprofessional. Always maintain composure.' },
                    { id: 'b3', text: 'Let them go to avoid confrontation', correct: false, feedback: '❌ This undermines your authority and the law.' }
                  ]
                }
              },
              {
                id: 'c',
                text: 'Take the money but still write the ticket',
                correct: false,
                feedback: '❌ INCORRECT: Taking the money is still bribery, even if you perform your duty. This constitutes corruption and is punishable by law. You must refuse all forms of inducement.',
                consequence: 'The driver is confused and threatens to expose you. This creates a compromising situation.',
                points: -8
              },
              {
                id: 'd',
                text: 'Let them go without payment "as a warning"',
                correct: false,
                feedback: '⚠️ PARTIALLY INCORRECT: While not accepting a bribe, failing to enforce traffic laws without proper justification could be seen as dereliction of duty. Issue the citation and follow proper procedures.',
                consequence: 'Your supervisor reviews checkpoint logs and notices missing citations. You are questioned about your judgment.',
                points: -3
              }
            ]
          },
          {
            id: 'police-bribery-2',
            title: 'Evidence Tampering Offer',
            videoUrl: 'https://www.youtube.com/embed/HBER3utXouA',
            videoThumbnail: '🎥',
            situation: 'A suspect in a case you are investigating offers you ₦50,000 to "misplace" a key piece of evidence that would link them to a crime. They claim "everyone does it."',
            options: [
              {
                id: 'a',
                text: 'Accept the money and tamper with evidence',
                correct: false,
                feedback: '❌ INCORRECT: This is a serious criminal offense. Evidence tampering obstructs justice, violates the chain of custody, and is punishable by imprisonment. Report this immediately to your supervisor and anti-corruption unit.'
              },
              {
                id: 'b',
                text: 'Refuse, report the bribery attempt, and secure the evidence',
                correct: true,
                feedback: '✅ CORRECT: Excellent decision. Refuse the bribe, document the attempted corruption, report it to your superior and the anti-corruption unit, and ensure the evidence is properly secured. This protects the integrity of the investigation.'
              },
              {
                id: 'c',
                text: 'Ignore the offer and continue the investigation',
                correct: false,
                feedback: '⚠️ PARTIALLY CORRECT: While refusing the bribe is good, you must also report the attempted corruption. Failing to report bribery attempts can be seen as complicity. Always document and report.'
              },
              {
                id: 'd',
                text: 'Negotiate for a higher amount',
                correct: false,
                feedback: '❌ INCORRECT: This is active participation in corruption. Negotiating a bribe is as criminal as accepting one. You would face prosecution, imprisonment, and dismissal from the force.'
              }
            ]
          },
          {
            id: 'police-bribery-3',
            title: 'Gift from Businessman',
            videoUrl: 'https://www.youtube.com/embed/Eda1jgNMOlo',
            videoThumbnail: '🎥',
            situation: 'A wealthy businessman whose business you helped protect during an investigation sends an expensive gift hamper to your house with a thank-you card. Your family is excited about the gift.',
            options: [
              {
                id: 'a',
                text: 'Keep the gift as it was freely given',
                correct: false,
                feedback: '❌ INCORRECT: Accepting gifts from persons connected to your official duties violates the code of conduct. This creates a conflict of interest and could be seen as a form of corruption. Return the gift and politely explain policy.'
              },
              {
                id: 'b',
                text: 'Return the gift and report the incident to your supervisor',
                correct: true,
                feedback: '✅ CORRECT: This demonstrates integrity. Officers must avoid even the appearance of impropriety. Return the gift with a polite note explaining that you cannot accept gifts related to your official duties, and document the incident.'
              },
              {
                id: 'c',
                text: 'Keep it but do not declare it',
                correct: false,
                feedback: '❌ INCORRECT: Hiding the gift is dishonest and violates transparency requirements. This could be used to compromise your future decisions and creates vulnerability to corruption charges.'
              },
              {
                id: 'd',
                text: 'Share the gift with colleagues',
                correct: false,
                feedback: '❌ INCORRECT: Distributing the gift does not change the fact that it was improperly accepted. It also implicates your colleagues in the violation. The gift must be returned or surrendered to the proper authorities.'
              }
            ]
          }
        ],
        quiz: [
          {
            id: 'q1',
            question: 'What is the definition of bribery under the Corrupt Practices Act?',
            options: [
              { id: 'a', text: 'Offering money to anyone', correct: false },
              { id: 'b', text: 'Offering, giving, receiving, or soliciting something of value to influence official actions', correct: true },
              { id: 'c', text: 'Accepting gifts from friends', correct: false },
              { id: 'd', text: 'Taking money from suspects only', correct: false }
            ]
          },
          {
            id: 'q2',
            question: 'What should you do if someone offers you a bribe at a checkpoint?',
            options: [
              { id: 'a', text: 'Accept it and let them go', correct: false },
              { id: 'b', text: 'Negotiate for more money', correct: false },
              { id: 'c', text: 'Refuse the bribe, issue proper citation, and report the attempted bribery', correct: true },
              { id: 'd', text: 'Ignore it and let them leave', correct: false }
            ]
          },
          {
            id: 'q3',
            question: 'What are the penalties for accepting bribes as a police officer?',
            options: [
              { id: 'a', text: 'Just a warning', correct: false },
              { id: 'b', text: 'Imprisonment, fines, and dismissal from service', correct: true },
              { id: 'c', text: 'Suspension only', correct: false },
              { id: 'd', text: 'No penalties', correct: false }
            ]
          },
          {
            id: 'q4',
            question: 'If a suspect offers you money to tamper with evidence, what is the correct action?',
            options: [
              { id: 'a', text: 'Accept and tamper with evidence', correct: false },
              { id: 'b', text: 'Ignore the offer and continue', correct: false },
              { id: 'c', text: 'Refuse, report the bribery attempt, and secure the evidence properly', correct: true },
              { id: 'd', text: 'Negotiate the amount', correct: false }
            ]
          },
          {
            id: 'q5',
            question: 'Which law criminalizes bribery and corruption in Nigeria?',
            options: [
              { id: 'a', text: 'Traffic Act', correct: false },
              { id: 'b', text: 'Corrupt Practices and Other Related Offences Act (2000)', correct: true },
              { id: 'c', text: 'Police Welfare Act', correct: false },
              { id: 'd', text: 'Constitution only', correct: false }
            ]
          }
        ]
      },
      { 
        id: 2,
        title: 'Use of Force Policy',
        description: 'Understanding lawful use of force and de-escalation techniques',
        progress: 0,
        risk: 'high',
        duration: '20 min',
        content: {
          introduction: 'The use of force is a last resort. Officers must use only the minimum force necessary to accomplish lawful objectives while respecting human rights and dignity.',
          keyPoints: [
            'Use of force must be proportionate to the threat',
            'De-escalation should always be attempted first',
            'Lethal force only when life is in immediate danger',
            'Document all use of force incidents immediately',
            'Unlawful use of force can result in criminal charges'
          ],
          laws: [
            'Nigerian Constitution - Right to Life and Dignity',
            'Police Act - Use of Force Guidelines',
            'UN Basic Principles on Use of Force and Firearms'
          ]
        },
        scenarios: [
          {
            id: 'police-force-1',
            title: 'Traffic Stop Escalation',
            videoUrl: 'https://www.youtube.com/embed/3ZhRjgY47MU',
            videoThumbnail: '🎥',
            situation: 'You stop a vehicle for a traffic violation. The driver becomes verbally aggressive, shouting and refusing to provide documents. They step out of the car and approach you quickly.',
            options: [
              {
                id: 'a',
                text: 'Immediately draw your weapon and point it at them',
                correct: false,
                feedback: '❌ INCORRECT: The threat level does not justify drawing a weapon. Verbal aggression alone is not grounds for lethal force readiness. Use verbal de-escalation first.'
              },
              {
                id: 'b',
                text: 'Maintain distance, use calm verbal commands, and call for backup',
                correct: true,
                feedback: '✅ CORRECT: Excellent approach. Maintain a safe distance, use calm and clear verbal commands to de-escalate, and call for backup. This follows proper escalation of force protocol.'
              },
              {
                id: 'c',
                text: 'Physically restrain them immediately',
                correct: false,
                feedback: '⚠️ INCORRECT: Physical force should not be the first response to verbal aggression. Attempt verbal de-escalation first. Physical restraint should only be used if they become physically aggressive.'
              },
              {
                id: 'd',
                text: 'Ignore their behavior and let them leave',
                correct: false,
                feedback: '❌ INCORRECT: You cannot ignore a traffic violation or threatening behavior. You must maintain control of the situation while using appropriate de-escalation techniques.'
              }
            ]
          },
          {
            id: 'police-force-2',
            title: 'Armed Robbery Response',
            videoUrl: 'https://www.youtube.com/embed/QXZzR7dYpWU',
            videoThumbnail: '🎥',
            situation: 'You respond to an armed robbery in progress. As you arrive, you see a suspect running from the scene holding what appears to be a weapon. They turn toward you but do not point the weapon.',
            options: [
              {
                id: 'a',
                text: 'Immediately open fire on the suspect',
                correct: false,
                feedback: '❌ INCORRECT: Simply holding a weapon and turning toward you does not constitute an immediate threat to life. Use verbal commands first and assess the situation. Premature use of lethal force violates protocol and law.'
              },
              {
                id: 'b',
                text: 'Give loud verbal warnings, take cover, and order them to drop the weapon',
                correct: true,
                feedback: '✅ CORRECT: Perfect response. Issue clear verbal commands, take tactical cover, and assess the threat level. Only use lethal force if they point the weapon and pose an immediate deadly threat. Always attempt to de-escalate first.'
              },
              {
                id: 'c',
                text: 'Chase them down and physically tackle them',
                correct: false,
                feedback: '⚠️ INCORRECT: Chasing an armed suspect without backup puts you at unnecessary risk and could escalate to deadly force. Contain the area, call for backup, and use tactical positioning.'
              },
              {
                id: 'd',
                text: 'Let them escape to avoid confrontation',
                correct: false,
                feedback: '❌ INCORRECT: Allowing an armed robbery suspect to escape endangers the public. You must respond appropriately while following use of force protocols. Set up a perimeter and call for backup.'
              }
            ]
          },
          {
            id: 'police-force-3',
            title: 'Domestic Disturbance De-escalation',
            videoUrl: 'https://www.youtube.com/embed/nNv0pKrWXA4',
            videoThumbnail: '🎥',
            situation: 'You respond to a domestic disturbance call. Upon arrival, you find an intoxicated man arguing loudly with his wife. He becomes aggressive when he sees you, clenching his fists and moving toward you.',
            options: [
              {
                id: 'a',
                text: 'Immediately use pepper spray on him',
                correct: false,
                feedback: '❌ INCORRECT: The situation has not escalated to require chemical agents. Use verbal de-escalation first. Reserve pepper spray for active physical resistance or assault.'
              },
              {
                id: 'b',
                text: 'Use calm verbal commands, create space, and separate the parties',
                correct: true,
                feedback: '✅ CORRECT: Excellent de-escalation approach. Speak calmly but firmly, create physical space, separate the individuals, and assess the situation. Most domestic situations can be resolved without force through proper communication.'
              },
              {
                id: 'c',
                text: 'Physically push him away from his wife',
                correct: false,
                feedback: '⚠️ INCORRECT: Initiating physical contact without attempting verbal de-escalation can escalate the situation. Use verbal commands first to separate them safely.'
              },
              {
                id: 'd',
                text: 'Leave the scene as it is a family matter',
                correct: false,
                feedback: '❌ INCORRECT: Domestic violence is a criminal matter, not just a "family issue." You have a duty to respond, protect potential victims, and de-escalate the situation. Never abandon a domestic violence call.'
              }
            ]
          }
        ],
        quiz: [
          {
            id: 'q1',
            question: 'When is lethal force justified?',
            options: [
              { id: 'a', text: 'When someone is verbally aggressive', correct: false },
              { id: 'b', text: 'Only when life is in immediate danger', correct: true },
              { id: 'c', text: 'Whenever you feel threatened', correct: false },
              { id: 'd', text: 'During any arrest', correct: false }
            ]
          },
          {
            id: 'q2',
            question: 'What should always be attempted before using physical force?',
            options: [
              { id: 'a', text: 'Drawing your weapon', correct: false },
              { id: 'b', text: 'De-escalation techniques', correct: true },
              { id: 'c', text: 'Physical restraint', correct: false },
              { id: 'd', text: 'Calling backup only', correct: false }
            ]
          },
          {
            id: 'q3',
            question: 'Use of force must be:',
            options: [
              { id: 'a', text: 'Maximum to show authority', correct: false },
              { id: 'b', text: 'Proportionate to the threat', correct: true },
              { id: 'c', text: 'Used in every situation', correct: false },
              { id: 'd', text: 'Never documented', correct: false }
            ]
          },
          {
            id: 'q4',
            question: 'What should you do during a traffic stop if the driver becomes verbally aggressive?',
            options: [
              { id: 'a', text: 'Draw your weapon immediately', correct: false },
              { id: 'b', text: 'Maintain distance, use calm verbal commands, and call for backup', correct: true },
              { id: 'c', text: 'Physically restrain them right away', correct: false },
              { id: 'd', text: 'Let them leave', correct: false }
            ]
          },
          {
            id: 'q5',
            question: 'What must be done after any use of force incident?',
            options: [
              { id: 'a', text: 'Nothing', correct: false },
              { id: 'b', text: 'Document it immediately', correct: true },
              { id: 'c', text: 'Wait a few days', correct: false },
              { id: 'd', text: 'Only report if someone complains', correct: false }
            ]
          }
        ]
      },
      { 
        id: 3,
        title: 'Human Rights & Civil Liberties',
        description: 'Respecting citizens\' rights during law enforcement',
        progress: 0,
        risk: 'medium',
        duration: '18 min',
        content: {
          introduction: 'Every Nigerian citizen has constitutional rights that must be respected during law enforcement activities. Violations can result in legal consequences for officers.',
          keyPoints: [
            'Right to dignity and freedom from torture',
            'Right to fair hearing and presumption of innocence',
            'Unlawful arrest and detention are criminal offenses',
            'Citizens have the right to legal representation',
            'Searches must be lawful and respect privacy'
          ],
          laws: [
            'Nigerian Constitution Chapter IV - Fundamental Rights',
            'Administration of Criminal Justice Act',
            'African Charter on Human and Peoples Rights'
          ]
        },
        scenarios: [
          {
            id: 'police-rights-1',
            title: 'Unlawful Search Pressure',
            videoUrl: 'https://www.youtube.com/embed/8zLx_JtcQVI',
            videoThumbnail: '🎥',
            situation: 'You receive intelligence about possible contraband in a residence. When you arrive, the occupants refuse to let you in without a search warrant. Your supervisor tells you to "just go in anyway."',
            options: [
              {
                id: 'a',
                text: 'Force entry without a warrant',
                correct: false,
                feedback: '❌ INCORRECT: Entering without a warrant (except in emergency situations) violates the constitutional right to privacy. Evidence obtained illegally may be inadmissible in court and you could face criminal charges for unlawful entry.'
              },
              {
                id: 'b',
                text: 'Refuse entry, obtain proper search warrant, and document the refusal',
                correct: true,
                feedback: '✅ CORRECT: Respect the constitutional right to privacy. Obtain a search warrant from a magistrate with probable cause. Document everything properly. This protects the integrity of your investigation and respects citizens\' rights.'
              },
              {
                id: 'c',
                text: 'Threaten the occupants to let you in',
                correct: false,
                feedback: '❌ INCORRECT: Threats and intimidation violate human rights and dignity protections. This is abuse of power and could result in criminal charges, civil lawsuits, and disciplinary action.'
              },
              {
                id: 'd',
                text: 'Search only the outside areas without entering',
                correct: false,
                feedback: '⚠️ PARTIALLY INCORRECT: While searching public areas may be acceptable, you still cannot enter the property without consent or a warrant. Always follow proper legal procedures for searches.'
              }
            ]
          },
          {
            id: 'police-rights-2',
            title: 'Detention Beyond Legal Limits',
            videoUrl: 'https://www.youtube.com/embed/zQ3D0LYNZuc',
            videoThumbnail: '🎥',
            situation: 'You arrested a suspect 48 hours ago for a minor offense. Your investigation is incomplete, but the law requires you to either charge or release the suspect within 48 hours. Your supervisor tells you to keep holding them.',
            options: [
              {
                id: 'a',
                text: 'Continue detention beyond 48 hours',
                correct: false,
                feedback: '❌ INCORRECT: This is unlawful detention and violates constitutional rights. You must charge or release within 48 hours. Unlawful detention can result in lawsuits, criminal charges against you, and case dismissal.'
              },
              {
                id: 'b',
                text: 'Either charge the suspect or release them as required by law',
                correct: true,
                feedback: '✅ CORRECT: The Constitution and Administration of Criminal Justice Act require that suspects be charged or released within 48 hours. Uphold the law and respect citizens\' rights. If evidence is insufficient, release and continue investigation lawfully.'
              },
              {
                id: 'c',
                text: 'Release but order them not to leave town',
                correct: false,
                feedback: '⚠️ PARTIALLY CORRECT: While releasing is correct, you cannot restrict movement without legal basis. If you have sufficient evidence, charge them. Otherwise, release unconditionally. Use proper bail procedures if charging.'
              },
              {
                id: 'd',
                text: 'Transfer them to another station to reset the clock',
                correct: false,
                feedback: '❌ INCORRECT: This is an attempt to circumvent constitutional protections and is illegal. The 48-hour period starts from initial arrest regardless of transfers. This is unlawful detention and manipulation of legal processes.'
              }
            ]
          },
          {
            id: 'police-rights-3',
            title: 'Torture for Confession',
            videoUrl: 'https://www.youtube.com/embed/pxQhLZ5bMyQ',
            videoThumbnail: '🎥',
            situation: 'A serious crime occurred and you have a prime suspect in custody who refuses to confess. Your colleagues suggest "softening him up" and say it is the only way to get the truth quickly.',
            options: [
              {
                id: 'a',
                text: 'Use physical force to extract confession',
                correct: false,
                feedback: '❌ INCORRECT: Torture is absolutely prohibited under Nigerian and international law. Any confession obtained through torture is inadmissible, and you would face criminal prosecution. The Constitution guarantees freedom from torture and inhuman treatment.'
              },
              {
                id: 'b',
                text: 'Continue lawful interrogation, gather evidence, and respect the suspect\'s rights',
                correct: true,
                feedback: '✅ CORRECT: Build your case through lawful evidence gathering, forensics, and proper interrogation techniques. Suspects have the right to remain silent and are presumed innocent. Torture violates fundamental human rights and undermines justice.'
              },
              {
                id: 'c',
                text: 'Threaten the suspect with torture even if you do not intend to do it',
                correct: false,
                feedback: '❌ INCORRECT: Threats of torture or violence constitute psychological torture and violate human rights. This is illegal and any resulting statements are inadmissible. Use only lawful interrogation methods.'
              },
              {
                id: 'd',
                text: 'Deny them food and water until they cooperate',
                correct: false,
                feedback: '❌ INCORRECT: Denial of basic necessities is inhuman treatment and violates constitutional rights. Detainees must be provided food, water, and humane conditions. This constitutes torture and is a criminal offense.'
              }
            ]
          }
        ],
        quiz: [
          {
            id: 'q1',
            question: 'Can police enter a private residence without a warrant?',
            options: [
              { id: 'a', text: 'Yes, if they have intelligence', correct: false },
              { id: 'b', text: 'No, except in emergency situations', correct: true },
              { id: 'c', text: 'Yes, if supervisor approves', correct: false },
              { id: 'd', text: 'Yes, during daytime only', correct: false }
            ]
          },
          {
            id: 'q2',
            question: 'How long can police detain a suspect without charge?',
            options: [
              { id: 'a', text: '24 hours', correct: false },
              { id: 'b', text: '48 hours', correct: true },
              { id: 'c', text: '72 hours', correct: false },
              { id: 'd', text: 'As long as needed', correct: false }
            ]
          },
          {
            id: 'q3',
            question: 'What should you do if occupants refuse entry without a warrant?',
            options: [
              { id: 'a', text: 'Force entry anyway', correct: false },
              { id: 'b', text: 'Refuse entry, obtain proper warrant, document refusal', correct: true },
              { id: 'c', text: 'Threaten them', correct: false },
              { id: 'd', text: 'Wait outside indefinitely', correct: false }
            ]
          },
          {
            id: 'q4',
            question: 'Is unlawful detention a criminal offense?',
            options: [
              { id: 'a', text: 'No, officers have discretion', correct: false },
              { id: 'b', text: 'Yes, it violates constitutional rights', correct: true },
              { id: 'c', text: 'Only if suspect complains', correct: false },
              { id: 'd', text: 'No, if supervisor approves', correct: false }
            ]
          },
          {
            id: 'q5',
            question: 'Which document guarantees fundamental human rights in Nigeria?',
            options: [
              { id: 'a', text: 'Police Act only', correct: false },
              { id: 'b', text: 'Nigerian Constitution Chapter IV', correct: true },
              { id: 'c', text: 'Traffic Act', correct: false },
              { id: 'd', text: 'Criminal Code only', correct: false }
            ]
          }
        ]
      },
      { 
        id: 4,
        title: 'Evidence Handling & Chain of Custody',
        description: 'Proper procedures for collecting and preserving evidence',
        progress: 0,
        risk: 'high',
        duration: '25 min',
        content: {
          introduction: 'Proper evidence handling ensures the integrity of investigations and successful prosecution. Contaminated or improperly handled evidence can result in cases being dismissed.',
          keyPoints: [
            'Document everything: time, location, condition',
            'Use proper evidence bags and seals',
            'Maintain unbroken chain of custody',
            'Never handle evidence without gloves',
            'Store evidence in secure, designated locations'
          ],
          laws: [
            'Evidence Act 2011',
            'Administration of Criminal Justice Act',
            'Police Evidence Management Protocols'
          ]
        },
        scenarios: [
          {
            id: 'police-evidence-1',
            title: 'Contaminated Crime Scene',
            situation: 'You arrive at a crime scene where a firearm was used. Several colleagues have already walked through the area without protective gear. The weapon is visible on the ground.',
            options: [
              {
                id: 'a',
                text: 'Immediately pick up the weapon with bare hands',
                correct: false,
                feedback: '❌ INCORRECT: Never handle evidence without gloves. This contaminates the evidence with your DNA and fingerprints, potentially destroying crucial forensic evidence. The case could be dismissed due to compromised evidence.'
              },
              {
                id: 'b',
                text: 'Secure the scene, wear gloves, document everything, then properly collect and bag the evidence',
                correct: true,
                feedback: '✅ CORRECT: First secure the scene to prevent further contamination. Put on gloves, photograph the weapon in place, document its exact location and condition, then properly collect it in an evidence bag with proper seals and chain of custody documentation.'
              },
              {
                id: 'c',
                text: 'Leave the weapon where it is and wait for forensics',
                correct: false,
                feedback: '⚠️ PARTIALLY INCORRECT: While waiting for forensics can be good, you must first secure the scene to prevent tampering or removal. Cover the evidence if needed but ensure scene security. Document everything while waiting.'
              },
              {
                id: 'd',
                text: 'Ask a civilian witness to pick it up for you',
                correct: false,
                feedback: '❌ INCORRECT: Never allow civilians to handle evidence. This breaks chain of custody and contaminates evidence. Only trained officers with proper protective gear should handle evidence, following strict protocols.'
              }
            ]
          },
          {
            id: 'police-evidence-2',
            title: 'Chain of Custody Break',
            situation: 'You collected evidence yesterday and stored it in your personal locker instead of the evidence room because the evidence room was closed. Today you need to present it in court.',
            options: [
              {
                id: 'a',
                text: 'Present the evidence and don\'t mention the storage issue',
                correct: false,
                feedback: '❌ INCORRECT: This is evidence tampering and perjury. The broken chain of custody means the evidence may be inadmissible. You could face criminal charges for concealing this information and the case may be dismissed.'
              },
              {
                id: 'b',
                text: 'Report the chain of custody break to your superior and prosecutor immediately',
                correct: true,
                feedback: '✅ CORRECT: Honesty is crucial. Report the storage protocol violation immediately. Document everything that happened. The prosecutor needs this information to address admissibility issues. Your integrity protects the justice system.'
              },
              {
                id: 'c',
                text: 'Create backdated paperwork to make it look proper',
                correct: false,
                feedback: '❌ INCORRECT: Falsifying documents is a serious criminal offense. This is fraud and evidence tampering. You would face prosecution, imprisonment, and dismissal. Always maintain honest records.'
              },
              {
                id: 'd',
                text: 'Ask a colleague to say they stored it properly',
                correct: false,
                feedback: '❌ INCORRECT: This is conspiracy to commit perjury and obstruction of justice. Both you and your colleague would face criminal charges. Never ask others to lie about evidence handling.'
              }
            ]
          }
        ],
        quiz: [
          {
            id: 'q1',
            question: 'What must you do before handling any physical evidence?',
            options: [
              { id: 'a', text: 'Nothing special', correct: false },
              { id: 'b', text: 'Wear protective gloves', correct: true },
              { id: 'c', text: 'Ask permission from supervisor', correct: false },
              { id: 'd', text: 'Take a photo only', correct: false }
            ]
          },
          {
            id: 'q2',
            question: 'What is chain of custody?',
            options: [
              { id: 'a', text: 'The command structure', correct: false },
              { id: 'b', text: 'Documentation tracking evidence from collection to court presentation', correct: true },
              { id: 'c', text: 'The arrest procedure', correct: false },
              { id: 'd', text: 'Transfer between police stations', correct: false }
            ]
          },
          {
            id: 'q3',
            question: 'If you discover you broke chain of custody, what should you do?',
            options: [
              { id: 'a', text: 'Hide it and present evidence anyway', correct: false },
              { id: 'b', text: 'Report immediately to superior and prosecutor', correct: true },
              { id: 'c', text: 'Create fake paperwork', correct: false },
              { id: 'd', text: 'Ask a colleague to cover for you', correct: false }
            ]
          },
          {
            id: 'q4',
            question: 'Where should collected evidence be stored?',
            options: [
              { id: 'a', text: 'Personal locker', correct: false },
              { id: 'b', text: 'Secure, designated evidence room', correct: true },
              { id: 'c', text: 'Your vehicle', correct: false },
              { id: 'd', text: 'Your desk drawer', correct: false }
            ]
          },
          {
            id: 'q5',
            question: 'What can happen if evidence is improperly handled?',
            options: [
              { id: 'a', text: 'Nothing', correct: false },
              { id: 'b', text: 'Case dismissal and potential charges against officer', correct: true },
              { id: 'c', text: 'Just a warning', correct: false },
              { id: 'd', text: 'Evidence becomes stronger', correct: false }
            ]
          }
        ]
      }
    ],
    civil: [
      { 
        id: 5,
        title: 'Procurement Act Compliance',
        description: 'Understanding procurement regulations and transparency',
        progress: 0,
        risk: 'high',
        duration: '20 min',
        content: {
          introduction: 'The Public Procurement Act ensures transparency, accountability, and value for money in government spending. Understanding these regulations protects you and promotes public trust.',
          keyPoints: [
            'All procurements above ₦10 million must follow competitive bidding',
            'Procurement processes must be transparent and documented',
            'Vendors must be evaluated fairly based on merit',
            'Splitting contracts to avoid thresholds is illegal',
            'Penalties include imprisonment, fines, and dismissal'
          ],
          laws: [
            'Public Procurement Act (2007)',
            'Bureau of Public Procurement Guidelines',
            'Fiscal Responsibility Act'
          ]
        },
        scenarios: [
          {
            id: 'civil-procurement-1',
            title: 'Vendor Pressure Scenario',
            videoUrl: 'https://www.youtube.com/embed/pY3UCKfkAEs',
            videoThumbnail: '🎥',
            situation: 'A vendor whose company submitted a bid for a ₦50 million contract approaches you privately. They offer you a "consultancy fee" of ₦2 million to ensure their bid is scored favorably.',
            options: [
              {
                id: 'a',
                text: 'Accept the money and score their bid higher',
                correct: false,
                feedback: '❌ INCORRECT: This is bribery and procurement fraud. Accepting money to influence bid evaluation violates the Public Procurement Act and can result in imprisonment and dismissal.'
              },
              {
                id: 'b',
                text: 'Refuse the offer, report to your supervisor and anti-corruption unit',
                correct: true,
                feedback: '✅ CORRECT: Excellent decision. Refuse the bribe, document the incident, and report immediately to your supervisor and the anti-corruption unit. Ensure the procurement process remains fair and transparent.'
              },
              {
                id: 'c',
                text: 'Accept the money but score all bids fairly anyway',
                correct: false,
                feedback: '❌ INCORRECT: Accepting the money is still bribery, even if you intend to be fair. The act of receiving the payment is illegal and compromises the integrity of the process.'
              },
              {
                id: 'd',
                text: 'Ignore the offer and continue the evaluation',
                correct: false,
                feedback: '⚠️ PARTIALLY INCORRECT: While refusing is good, you must also report the attempted bribery. Failing to report can be seen as complicity or cover-up. Always document and report.'
              }
            ]
          },
          {
            id: 'civil-procurement-2',
            title: 'Contract Splitting Pressure',
            videoUrl: 'https://www.youtube.com/embed/Tk5QO3pVAAY',
            videoThumbnail: '🎥',
            situation: 'Your supervisor asks you to split a ₦15 million procurement into three separate ₦5 million contracts to avoid the competitive bidding requirement and award it directly to a preferred vendor.',
            options: [
              {
                id: 'a',
                text: 'Follow the supervisor\'s instruction to avoid conflict',
                correct: false,
                feedback: '❌ INCORRECT: Contract splitting to avoid procurement thresholds is illegal under the Public Procurement Act. Following illegal orders makes you complicit. Report this to the Bureau of Public Procurement.'
              },
              {
                id: 'b',
                text: 'Refuse and explain that this violates procurement law, then report if pressure continues',
                correct: true,
                feedback: '✅ CORRECT: You must refuse to participate in illegal procurement practices. Explain the legal violation respectfully, and if pressured, report to the Bureau of Public Procurement and anti-corruption agencies.'
              },
              {
                id: 'c',
                text: 'Split the contract as instructed',
                correct: false,
                feedback: '❌ INCORRECT: This is procurement fraud. You would be directly involved in circumventing the law, which carries criminal penalties including imprisonment and dismissal.'
              },
              {
                id: 'd',
                text: 'Request written authorization from the supervisor',
                correct: false,
                feedback: '❌ INCORRECT: Written authorization does not make an illegal act legal. Contract splitting to evade competitive bidding is always illegal, regardless of who authorizes it.'
              }
            ]
          },
          {
            id: 'civil-procurement-3',
            title: 'Biased Evaluation Committee',
            videoUrl: 'https://www.youtube.com/embed/fiwBJlrJ02w',
            videoThumbnail: '🎥',
            situation: 'You are on a bid evaluation committee. During deliberations, another committee member openly advocates for a specific vendor because "they are connected to the minister" and suggests everyone should score them highest.',
            options: [
              {
                id: 'a',
                text: 'Go along with the majority to avoid being isolated',
                correct: false,
                feedback: '❌ INCORRECT: Succumbing to pressure to bias evaluation violates procurement law. Your duty is to evaluate fairly based on merit. Participating in rigged procurement makes you complicit in fraud.'
              },
              {
                id: 'b',
                text: 'Object to the bias, insist on merit-based evaluation, and document the irregularity',
                correct: true,
                feedback: '✅ CORRECT: Maintain your integrity. Object clearly to biased evaluation, insist all bids be scored on merit and technical criteria. Document the attempt to rig the process and report to appropriate authorities if it continues.'
              },
              {
                id: 'c',
                text: 'Abstain from voting to avoid responsibility',
                correct: false,
                feedback: '⚠️ INCORRECT: Abstaining when you witness procurement fraud is insufficient. You have a duty to actively prevent the violation and report it. Silent complicity enables corruption.'
              },
              {
                id: 'd',
                text: 'Score them highest but voice your concerns privately later',
                correct: false,
                feedback: '❌ INCORRECT: Participating in the rigged evaluation while privately complaining is complicity. You must actively object during the process and refuse to participate in fraudulent scoring.'
              }
            ]
          }
        ],
        quiz: [
          {
            id: 'q1',
            question: 'What is the threshold for mandatory competitive bidding in Nigeria?',
            options: [
              { id: 'a', text: '₦5 million', correct: false },
              { id: 'b', text: '₦10 million', correct: true },
              { id: 'c', text: '₦20 million', correct: false },
              { id: 'd', text: '₦50 million', correct: false }
            ]
          },
          {
            id: 'q2',
            question: 'What should you do if a vendor offers you money to favor their bid?',
            options: [
              { id: 'a', text: 'Accept and favor their bid', correct: false },
              { id: 'b', text: 'Accept but score fairly', correct: false },
              { id: 'c', text: 'Refuse, document, and report to supervisor and anti-corruption unit', correct: true },
              { id: 'd', text: 'Ignore the offer', correct: false }
            ]
          },
          {
            id: 'q3',
            question: 'Is splitting contracts to avoid competitive bidding legal?',
            options: [
              { id: 'a', text: 'Yes, if supervisor approves', correct: false },
              { id: 'b', text: 'Yes, if in writing', correct: false },
              { id: 'c', text: 'No, it is illegal procurement fraud', correct: true },
              { id: 'd', text: 'Yes, if below ₦5 million each', correct: false }
            ]
          },
          {
            id: 'q4',
            question: 'Which law governs public procurement in Nigeria?',
            options: [
              { id: 'a', text: 'Traffic Act', correct: false },
              { id: 'b', text: 'Public Procurement Act (2007)', correct: true },
              { id: 'c', text: 'Police Act', correct: false },
              { id: 'd', text: 'Electoral Act', correct: false }
            ]
          },
          {
            id: 'q5',
            question: 'Vendors must be evaluated based on:',
            options: [
              { id: 'a', text: 'Personal relationships', correct: false },
              { id: 'b', text: 'Bribes offered', correct: false },
              { id: 'c', text: 'Merit and transparent criteria', correct: true },
              { id: 'd', text: 'Political connections', correct: false }
            ]
          }
        ]
      },
      { 
        id: 6,
        title: 'Conflict of Interest',
        description: 'Identifying and managing conflicts of interest',
        progress: 0,
        risk: 'medium',
        duration: '15 min',
        content: {
          introduction: 'A conflict of interest occurs when personal interests could improperly influence your official duties. Proper disclosure and management of conflicts protect both you and your organization.',
          keyPoints: [
            'Disclose any financial interests in matters you handle',
            'Recuse yourself from decisions involving family or friends',
            'Do not use your position for personal gain',
            'Avoid gifts or favors from people you regulate',
            'Report conflicts immediately to your supervisor'
          ],
          laws: [
            'Code of Conduct Bureau and Tribunal Act',
            'Public Service Rules',
            'Anti-Corruption Laws'
          ]
        },
        scenarios: [
          {
            id: 'civil-conflict-1',
            title: 'Family Business Contract',
            situation: 'You are evaluating contract bids for IT services. One of the bidders is a company owned by your brother. The company submitted a competitive bid and meets all requirements.',
            options: [
              {
                id: 'a',
                text: 'Evaluate all bids including your brother\'s company',
                correct: false,
                feedback: '❌ INCORRECT: This is a clear conflict of interest. Even if you intend to be fair, your personal relationship creates the appearance of impropriety. You must recuse yourself.'
              },
              {
                id: 'b',
                text: 'Disclose the relationship, recuse yourself from the evaluation, and have another officer handle it',
                correct: true,
                feedback: '✅ CORRECT: This is the proper action. Immediately disclose the conflict of interest to your supervisor, recuse yourself from the entire process, and ensure another qualified officer conducts the evaluation.'
              },
              {
                id: 'c',
                text: 'Score your brother\'s bid lower to avoid favoritism',
                correct: false,
                feedback: '❌ INCORRECT: This is still a conflict of interest. Whether you favor or disfavor your brother\'s company, your personal relationship compromises the integrity of the process. You must recuse yourself.'
              },
              {
                id: 'd',
                text: 'Don\'t mention the relationship if the bid is fair',
                correct: false,
                feedback: '❌ INCORRECT: Failure to disclose a conflict of interest is a violation of the Code of Conduct. Even if unintentional, non-disclosure can result in disciplinary action and criminal charges.'
              }
            ]
          },
          {
            id: 'civil-conflict-2',
            title: 'Gift from Regulated Company',
            situation: 'A company that you regulate sends you an expensive gift basket worth ₦100,000 during the holiday season with a note thanking you for your "fair treatment."',
            options: [
              {
                id: 'a',
                text: 'Accept the gift, it\'s just a holiday gesture',
                correct: false,
                feedback: '❌ INCORRECT: Accepting gifts from entities you regulate creates a conflict of interest and the appearance of impropriety. This could be considered bribery, especially if the gift is valuable.'
              },
              {
                id: 'b',
                text: 'Return the gift and report the incident to your supervisor',
                correct: true,
                feedback: '✅ CORRECT: Excellent decision. Return the gift immediately with a polite note, and report the incident to your supervisor. Document everything to protect yourself from any future allegations.'
              },
              {
                id: 'c',
                text: 'Keep the gift but don\'t tell anyone',
                correct: false,
                feedback: '❌ INCORRECT: Accepting and concealing the gift is a serious violation. This creates both an actual conflict of interest and the appearance of corruption. You must return it and report.'
              },
              {
                id: 'd',
                text: 'Share the gift with your colleagues',
                correct: false,
                feedback: '❌ INCORRECT: The gift should not be accepted at all, regardless of how it\'s distributed. Return it to the sender and report the incident to maintain ethical standards.'
              }
            ]
          }
        ],
        quiz: [
          {
            id: 'q1',
            question: 'What is a conflict of interest?',
            options: [
              { id: 'a', text: 'When you disagree with your boss', correct: false },
              { id: 'b', text: 'When personal interests could improperly influence your official duties', correct: true },
              { id: 'c', text: 'When you work overtime', correct: false },
              { id: 'd', text: 'When colleagues don\'t get along', correct: false }
            ]
          },
          {
            id: 'q2',
            question: 'What should you do if a contract bid is submitted by your family member\'s company?',
            options: [
              { id: 'a', text: 'Evaluate it fairly like any other bid', correct: false },
              { id: 'b', text: 'Disclose the relationship, recuse yourself, and have another officer handle it', correct: true },
              { id: 'c', text: 'Score it lower to avoid favoritism', correct: false },
              { id: 'd', text: 'Keep quiet about the relationship', correct: false }
            ]
          },
          {
            id: 'q3',
            question: 'Can you accept an expensive gift from a company you regulate?',
            options: [
              { id: 'a', text: 'Yes, if it\'s a holiday gift', correct: false },
              { id: 'b', text: 'Yes, if I share it with colleagues', correct: false },
              { id: 'c', text: 'No, you must return it and report the incident', correct: true },
              { id: 'd', text: 'Yes, as long as no one knows', correct: false }
            ]
          },
          {
            id: 'q4',
            question: 'When should you disclose a conflict of interest?',
            options: [
              { id: 'a', text: 'Only if someone asks', correct: false },
              { id: 'b', text: 'Immediately when you become aware of it', correct: true },
              { id: 'c', text: 'At the end of the year', correct: false },
              { id: 'd', text: 'Never, it\'s private', correct: false }
            ]
          },
          {
            id: 'q5',
            question: 'What law governs conflict of interest in Nigeria\'s civil service?',
            options: [
              { id: 'a', text: 'Traffic Act', correct: false },
              { id: 'b', text: 'Code of Conduct Bureau and Tribunal Act', correct: true },
              { id: 'c', text: 'Marriage Act', correct: false },
              { id: 'd', text: 'Land Use Act', correct: false }
            ]
          }
        ]
      }
    ],
    student: [
      { 
        id: 7,
        title: 'Academic Integrity',
        description: 'Understanding exam malpractice and plagiarism',
        progress: 0,
        risk: 'low',
        duration: '15 min',
        content: {
          introduction: 'Academic integrity is the foundation of quality education and personal development. Engaging in exam malpractice or plagiarism not only violates university rules but also undermines your own learning and future career.',
          keyPoints: [
            'Plagiarism is presenting someone else\'s work as your own',
            'Exam malpractice includes cheating, impersonation, and using unauthorized materials',
            'Penalties range from failing grades to expulsion',
            'Academic dishonesty can damage your reputation permanently',
            'Always cite sources properly and do your own work'
          ],
          laws: [
            'University Regulations on Academic Misconduct',
            'Examination Malpractice Act (1999)',
            'NYSC Act - Ethical Conduct Requirements'
          ]
        },
        scenarios: [
          {
            id: 'student-integrity-1',
            title: 'Group Project Plagiarism',
            situation: 'Your group is working on a major project due tomorrow. One member suggests copying entire sections from online sources and just changing a few words, saying "everyone does it and we won\'t get caught."',
            options: [
              {
                id: 'a',
                text: 'Go along with it to avoid conflict and meet the deadline',
                correct: false,
                feedback: '❌ INCORRECT: This is plagiarism and academic dishonesty. All group members can be held responsible. Plagiarism detection software is very sophisticated and will likely catch this, resulting in failing grades or expulsion.'
              },
              {
                id: 'b',
                text: 'Refuse, explain the risks, and insist the group writes original content with proper citations',
                correct: true,
                feedback: '✅ CORRECT: Excellent decision. Stand firm on academic integrity. Explain that plagiarism puts everyone at risk and undermines learning. Write original content and cite all sources properly. If needed, request a deadline extension from your professor.'
              },
              {
                id: 'c',
                text: 'Let them plagiarize but write your own section originally',
                correct: false,
                feedback: '⚠️ PARTIALLY INCORRECT: As a group member, you share responsibility for the entire project. If plagiarism is detected, all members can face consequences. You must insist on integrity for the entire submission.'
              },
              {
                id: 'd',
                text: 'Submit the plagiarized work and hope no one notices',
                correct: false,
                feedback: '❌ INCORRECT: Modern plagiarism detection tools are highly effective. This strategy will likely fail and result in serious academic penalties for all group members, including failing grades and disciplinary action.'
              }
            ]
          },
          {
            id: 'student-integrity-2',
            title: 'Exam Cheating Opportunity',
            situation: 'During a final exam, you notice that you can clearly see another student\'s answers. That student is one of the top performers in the class. You\'re struggling with several questions.',
            options: [
              {
                id: 'a',
                text: 'Copy their answers for questions you don\'t know',
                correct: false,
                feedback: '❌ INCORRECT: This is exam malpractice and academic dishonesty. If caught, you could face a failing grade, suspension, or expulsion. Moreover, you\'re cheating yourself of genuine learning and understanding.'
              },
              {
                id: 'b',
                text: 'Focus on your own paper and answer based on your own knowledge',
                correct: true,
                feedback: '✅ CORRECT: This is the right choice. Academic integrity means doing your own work, even when it\'s difficult. Your honest effort reflects your true understanding and builds character. If you need help, seek legitimate tutoring or study support.'
              },
              {
                id: 'c',
                text: 'Look at their answers "just to confirm" your own',
                correct: false,
                feedback: '❌ INCORRECT: This is still cheating. Looking at another student\'s answers during an exam, for any reason, violates exam rules and constitutes academic dishonesty. Keep your eyes on your own paper.'
              },
              {
                id: 'd',
                text: 'Take a photo of their paper for later use',
                correct: false,
                feedback: '❌ INCORRECT: This is a serious violation of exam rules and academic integrity. Using phones or cameras during exams is strictly prohibited and can result in immediate expulsion from the exam and severe disciplinary action.'
              }
            ]
          },
          {
            id: 'student-integrity-3',
            title: 'Paid Essay Service Temptation',
            situation: 'You have three major essays due the same week along with exams. A friend tells you about a website where you can buy pre-written essays that are "guaranteed original and undetectable."',
            options: [
              {
                id: 'a',
                text: 'Buy the essays to save time',
                correct: false,
                feedback: '❌ INCORRECT: This is academic fraud and plagiarism. Universities use sophisticated detection software that can identify purchased essays. If caught, you face expulsion and a permanent mark on your academic record.'
              },
              {
                id: 'b',
                text: 'Manage your time, prioritize, and complete your own work, seeking extensions if needed',
                correct: true,
                feedback: '✅ CORRECT: This is the responsible and honest approach. Talk to your professors about your workload - they may offer extensions or guidance. Doing your own work, even if imperfect, is better than cheating and maintains your integrity.'
              },
              {
                id: 'c',
                text: 'Buy one essay and write the others yourself',
                correct: false,
                feedback: '❌ INCORRECT: Buying even one essay is still academic fraud. It\'s plagiarism and can result in failing grades or expulsion. Moreover, the inconsistency in writing style may raise red flags with your professors.'
              },
              {
                id: 'd',
                text: 'Use the purchased essay as a "reference" and paraphrase it',
                correct: false,
                feedback: '❌ INCORRECT: This is still plagiarism and academic dishonesty. The work is not your own original thinking. Do your own research and writing. If you need help with structure or writing skills, visit your university\'s writing center.'
              }
            ]
          }
        ],
        quiz: [
          {
            id: 'q1',
            question: 'What is plagiarism?',
            options: [
              { id: 'a', text: 'Studying with friends', correct: false },
              { id: 'b', text: 'Presenting someone else\'s work as your own', correct: true },
              { id: 'c', text: 'Reading books for research', correct: false },
              { id: 'd', text: 'Asking questions in class', correct: false }
            ]
          },
          {
            id: 'q2',
            question: 'What should you do if your group wants to plagiarize content for a project?',
            options: [
              { id: 'a', text: 'Go along to avoid conflict', correct: false },
              { id: 'b', text: 'Refuse, explain the risks, and insist on original content with proper citations', correct: true },
              { id: 'c', text: 'Submit it and hope no one notices', correct: false },
              { id: 'd', text: 'Let them do it and write your section only', correct: false }
            ]
          },
          {
            id: 'q3',
            question: 'Is it acceptable to copy answers from another student during an exam?',
            options: [
              { id: 'a', text: 'Yes, if they are a top student', correct: false },
              { id: 'b', text: 'Yes, to confirm your own answers', correct: false },
              { id: 'c', text: 'No, this is exam malpractice and academic dishonesty', correct: true },
              { id: 'd', text: 'Yes, if you don\'t get caught', correct: false }
            ]
          },
          {
            id: 'q4',
            question: 'Can you buy essays online and submit them as your own work?',
            options: [
              { id: 'a', text: 'Yes, if they are "original"', correct: false },
              { id: 'b', text: 'Yes, if time is limited', correct: false },
              { id: 'c', text: 'No, this is academic fraud and plagiarism', correct: true },
              { id: 'd', text: 'Yes, just for one essay', correct: false }
            ]
          },
          {
            id: 'q5',
            question: 'What is the best approach when facing multiple deadlines?',
            options: [
              { id: 'a', text: 'Buy some essays to save time', correct: false },
              { id: 'b', text: 'Copy from online sources', correct: false },
              { id: 'c', text: 'Manage time, prioritize, complete own work, and request extensions if needed', correct: true },
              { id: 'd', text: 'Cheat during exams', correct: false }
            ]
          }
        ]
      },
      { 
        id: 9,
        title: 'Ethical Leadership & Conduct',
        description: 'Principles of ethical leadership for student representatives',
        progress: 0,
        risk: 'medium',
        duration: '12 min',
        content: {
          introduction: 'As a student leader, you represent your peers and hold a position of trust. Ethical leadership means serving with integrity, transparency, and accountability.',
          keyPoints: [
            'Use student funds transparently and for their intended purpose',
            'Represent all students fairly, not just your friends',
            'Disclose any conflicts of interest in decisions',
            'Do not accept bribes or kickbacks from vendors',
            'Keep accurate records and report honestly to students'
          ],
          laws: [
            'University Student Union Constitution',
            'Student Leadership Code of Conduct',
            'Anti-Corruption Laws'
          ]
        },
        scenarios: [
          {
            id: 'student-leadership-1',
            title: 'Student Fund Misuse',
            situation: 'As student union treasurer, a fellow executive member suggests "borrowing" ₦50,000 from student activity funds for a personal emergency, promising to return it next month.',
            options: [
              {
                id: 'a',
                text: 'Allow the "loan" since they promise to return it',
                correct: false,
                feedback: '❌ INCORRECT: This is misappropriation of student funds. Student money must only be used for approved student activities. Personal use, even if temporary, is a serious breach of trust and may violate criminal law.'
              },
              {
                id: 'b',
                text: 'Refuse, explain it violates student union rules, and suggest proper alternatives',
                correct: true,
                feedback: '✅ CORRECT: Student funds are held in trust and must never be used for personal purposes. Suggest legitimate alternatives like student welfare schemes or financial aid. If pressure continues, report to university administration.'
              },
              {
                id: 'c',
                text: 'Allow it but don\'t document it',
                correct: false,
                feedback: '❌ INCORRECT: This is both misappropriation and fraud. Concealing unauthorized use of funds is a criminal offense. You have a fiduciary duty to protect student money and maintain transparent records.'
              },
              {
                id: 'd',
                text: 'Take a vote among executives',
                correct: false,
                feedback: '❌ INCORRECT: Misuse of student funds cannot be legitimized by a vote. Student money is held in trust for specific purposes and cannot be diverted to personal use, regardless of who agrees.'
              }
            ]
          }
        ],
        quiz: [
          {
            id: 'q1',
            question: 'Can student union funds be used for personal emergencies by executives?',
            options: [
              { id: 'a', text: 'Yes, if they promise to return the money', correct: false },
              { id: 'b', text: 'Yes, if other executives agree', correct: false },
              { id: 'c', text: 'No, student funds must only be used for approved student activities', correct: true },
              { id: 'd', text: 'Yes, in emergencies', correct: false }
            ]
          },
          {
            id: 'q2',
            question: 'As a student leader, who should you represent?',
            options: [
              { id: 'a', text: 'Only your friends', correct: false },
              { id: 'b', text: 'All students fairly and equally', correct: true },
              { id: 'c', text: 'Only your department', correct: false },
              { id: 'd', text: 'Only those who voted for you', correct: false }
            ]
          },
          {
            id: 'q3',
            question: 'Should student leaders accept kickbacks from vendors providing services?',
            options: [
              { id: 'a', text: 'Yes, as a commission', correct: false },
              { id: 'b', text: 'Yes, if small amounts', correct: false },
              { id: 'c', text: 'No, this is bribery and corruption', correct: true },
              { id: 'd', text: 'Yes, if shared with team', correct: false }
            ]
          },
          {
            id: 'q4',
            question: 'What should you do if another executive suggests misusing student funds?',
            options: [
              { id: 'a', text: 'Allow it if they promise to return it', correct: false },
              { id: 'b', text: 'Refuse, explain the rules, and report if pressure continues', correct: true },
              { id: 'c', text: 'Take a vote', correct: false },
              { id: 'd', text: 'Allow it but don\'t document it', correct: false }
            ]
          },
          {
            id: 'q5',
            question: 'Why is transparency important in student leadership?',
            options: [
              { id: 'a', text: 'It\'s not important', correct: false },
              { id: 'b', text: 'To maintain trust and accountability to students', correct: true },
              { id: 'c', text: 'Only for legal requirements', correct: false },
              { id: 'd', text: 'To impress administration', correct: false }
            ]
          }
        ]
      }
    ],
    private: [
      { 
        id: 8,
        title: 'Financial Fraud Prevention',
        description: 'Detecting and preventing financial fraud',
        progress: 0,
        risk: 'high',
        duration: '18 min',
        content: {
          introduction: 'Financial fraud in the private sector costs businesses billions annually and can result in criminal prosecution. Understanding fraud prevention protects your organization, your customers, and your career.',
          keyPoints: [
            'Fraud includes embezzlement, false accounting, and money laundering',
            'Verify all transactions and maintain accurate records',
            'Report suspicious activities immediately',
            'Never falsify financial documents or records',
            'Penalties include imprisonment, fines, and permanent career damage'
          ],
          laws: [
            'Economic and Financial Crimes Commission (EFCC) Act',
            'Money Laundering (Prohibition) Act',
            'Companies and Allied Matters Act (CAMA)',
            'Bank and Other Financial Institutions Act (BOFIA)'
          ]
        },
        scenarios: [
          {
            id: 'private-fraud-1',
            title: 'Account Manipulation Request',
            situation: 'As a bank teller, a long-time customer who is also a friend asks you to process a large withdrawal of ₦5 million without following the standard verification procedures, saying they are in a hurry.',
            options: [
              {
                id: 'a',
                text: 'Process it quickly since they are a trusted customer',
                correct: false,
                feedback: '❌ INCORRECT: Bypassing verification procedures exposes the bank to fraud risk. The account could be compromised. Always follow standard procedures regardless of relationships. This protects both the customer and the bank.'
              },
              {
                id: 'b',
                text: 'Follow standard verification procedures regardless of the relationship',
                correct: true,
                feedback: '✅ CORRECT: Security procedures exist for a reason. Verify identity, check account status, and follow all standard protocols. Explain to your friend that these procedures protect them and the bank from fraud.'
              },
              {
                id: 'c',
                text: 'Process half now and half later after verification',
                correct: false,
                feedback: '❌ INCORRECT: Partial processing without full verification is still a violation of procedures. Process no transaction without completing all required verification steps. This could be an attempt at fraud or identity theft.'
              },
              {
                id: 'd',
                text: 'Ask your supervisor to do it instead',
                correct: false,
                feedback: '⚠️ INCORRECT: Your supervisor must also follow verification procedures. The correct action is to follow standard protocols yourself. Do not try to pass responsibility for proper procedures to others.'
              }
            ]
          },
          {
            id: 'private-fraud-2',
            title: 'Falsifying Financial Records',
            situation: 'Your manager asks you to adjust sales figures in the monthly report to meet quarterly targets, saying "it\'s just moving numbers around" and everyone will get their bonuses.',
            options: [
              {
                id: 'a',
                text: 'Make the adjustments to help the team get bonuses',
                correct: false,
                feedback: '❌ INCORRECT: This is financial fraud and false accounting. It\'s a criminal offense that can result in imprisonment. Falsified records mislead shareholders, regulators, and investors. Report this to senior management or compliance.'
              },
              {
                id: 'b',
                text: 'Refuse, explain this is illegal financial fraud, and report to compliance or senior management',
                correct: true,
                feedback: '✅ CORRECT: Excellent decision. Falsifying financial records is a serious crime under CAMA and EFCC regulations. Refuse to participate, document the request, and report to compliance, internal audit, or senior management immediately.'
              },
              {
                id: 'c',
                text: 'Make small adjustments to minimize the impact',
                correct: false,
                feedback: '❌ INCORRECT: Any falsification of financial records, regardless of magnitude, is fraud. There is no "acceptable level" of fraudulent reporting. This can result in criminal prosecution and career termination.'
              },
              {
                id: 'd',
                text: 'Ask the manager to put the request in writing',
                correct: false,
                feedback: '⚠️ PARTIALLY INCORRECT: While documentation is important, a written request doesn\'t make fraud legal. You should refuse and report the incident. Do not participate in fraudulent activities regardless of how they are documented.'
              }
            ]
          },
          {
            id: 'private-fraud-3',
            title: 'Suspicious Transaction Alert',
            situation: 'You notice a customer making multiple cash deposits just below the ₦5 million reporting threshold over several days, totaling ₦20 million. This appears to be structuring to avoid detection.',
            options: [
              {
                id: 'a',
                text: 'Process the transactions, it\'s not your concern',
                correct: false,
                feedback: '❌ INCORRECT: This is likely money laundering through structuring. Financial institutions and employees have a legal duty to report suspicious transactions. Failure to report can result in criminal prosecution for you and the institution.'
              },
              {
                id: 'b',
                text: 'File a Suspicious Transaction Report (STR) with your compliance officer immediately',
                correct: true,
                feedback: '✅ CORRECT: This pattern strongly indicates structuring to evade reporting requirements, which is illegal. File an STR with your compliance officer immediately. Do not alert the customer. This protects the financial system from money laundering.'
              },
              {
                id: 'c',
                text: 'Ask the customer about the source of the money',
                correct: false,
                feedback: '❌ INCORRECT: Alerting the customer can be "tipping off," which is illegal under money laundering laws. You must not alert anyone that you\'re filing a suspicious transaction report. Report to compliance silently.'
              },
              {
                id: 'd',
                text: 'Refuse to process the transactions',
                correct: false,
                feedback: '⚠️ PARTIALLY INCORRECT: While being cautious is good, outright refusal can tip off the customer. The correct procedure is to process the transaction normally while filing a Suspicious Transaction Report with compliance.'
              }
            ]
          }
        ],
        quiz: [
          {
            id: 'q1',
            question: 'What should you do if a customer asks you to bypass verification procedures?',
            options: [
              { id: 'a', text: 'Process it if they are a trusted friend', correct: false },
              { id: 'b', text: 'Follow standard verification procedures regardless of the relationship', correct: true },
              { id: 'c', text: 'Process half the transaction', correct: false },
              { id: 'd', text: 'Ask your supervisor to do it', correct: false }
            ]
          },
          {
            id: 'q2',
            question: 'If your manager asks you to falsify financial records, what should you do?',
            options: [
              { id: 'a', text: 'Make the adjustments to help the team', correct: false },
              { id: 'b', text: 'Refuse, explain it\'s illegal, and report to compliance or senior management', correct: true },
              { id: 'c', text: 'Make small adjustments only', correct: false },
              { id: 'd', text: 'Ask for written authorization', correct: false }
            ]
          },
          {
            id: 'q3',
            question: 'What is structuring in the context of money laundering?',
            options: [
              { id: 'a', text: 'Organizing your finances', correct: false },
              { id: 'b', text: 'Making multiple transactions below reporting thresholds to avoid detection', correct: true },
              { id: 'c', text: 'Setting up a business structure', correct: false },
              { id: 'd', text: 'Planning investments', correct: false }
            ]
          },
          {
            id: 'q4',
            question: 'What should you do if you notice suspicious transactions that may indicate money laundering?',
            options: [
              { id: 'a', text: 'Ignore it, not your concern', correct: false },
              { id: 'b', text: 'File a Suspicious Transaction Report (STR) with compliance immediately', correct: true },
              { id: 'c', text: 'Ask the customer about it', correct: false },
              { id: 'd', text: 'Refuse to process it', correct: false }
            ]
          },
          {
            id: 'q5',
            question: 'Is falsifying financial records a criminal offense?',
            options: [
              { id: 'a', text: 'No, if it\'s a small amount', correct: false },
              { id: 'b', text: 'No, if manager approves', correct: false },
              { id: 'c', text: 'Yes, it\'s financial fraud and can result in imprisonment', correct: true },
              { id: 'd', text: 'Only if you get caught', correct: false }
            ]
          }
        ]
      },
      { 
        id: 10,
        title: 'Workplace Ethics & Anti-Bribery',
        description: 'Professional conduct and anti-corruption in business',
        progress: 0,
        risk: 'high',
        duration: '16 min',
        content: {
          introduction: 'Workplace ethics and anti-bribery practices are essential for maintaining professional standards, protecting your company\'s reputation, and ensuring compliance with Nigerian and international anti-corruption laws.',
          keyPoints: [
            'Never offer or accept bribes in business dealings',
            'Gifts must be reasonable, transparent, and comply with policy',
            'Report any requests for kickbacks or corrupt payments',
            'Maintain accurate books and records',
            'Due diligence on third-party agents and consultants'
          ],
          laws: [
            'Corrupt Practices and Other Related Offences Act (2000)',
            'Economic and Financial Crimes Commission (EFCC) Act',
            'UK Bribery Act (for international companies)',
            'US Foreign Corrupt Practices Act (FCPA)'
          ]
        },
        scenarios: [
          {
            id: 'private-ethics-1',
            title: 'Procurement Bribe Request',
            situation: 'Your company is bidding for a major contract with a government agency. A procurement officer hints that a "facilitation payment" of ₦1 million would ensure your bid is favorably considered.',
            options: [
              {
                id: 'a',
                text: 'Pay the facilitation fee to secure the contract',
                correct: false,
                feedback: '❌ INCORRECT: This is bribery and corruption. "Facilitation payments" are illegal under Nigerian law and international anti-corruption laws. This exposes you and your company to criminal prosecution, heavy fines, and reputational damage.'
              },
              {
                id: 'b',
                text: 'Refuse, report the incident to your compliance officer and senior management',
                correct: true,
                feedback: '✅ CORRECT: Excellent decision. Refuse the bribery request, document the conversation, and report immediately to your compliance officer and management. Your company may also need to report to anti-corruption authorities. Win business on merit, not through corruption.'
              },
              {
                id: 'c',
                text: 'Pay through a third party to hide the transaction',
                correct: false,
                feedback: '❌ INCORRECT: Paying bribes through intermediaries is still bribery and is explicitly covered by anti-corruption laws. This adds charges of money laundering and conspiracy. Modern compliance systems can detect such schemes.'
              },
              {
                id: 'd',
                text: 'Offer a smaller amount to negotiate',
                correct: false,
                feedback: '❌ INCORRECT: Negotiating the bribe amount is still bribery. There is no acceptable level of corrupt payment. This constitutes active participation in corruption and can result in prosecution and imprisonment.'
              }
            ]
          },
          {
            id: 'private-ethics-2',
            title: 'Expensive Gift Acceptance',
            situation: 'A supplier sends you a luxury watch worth ₦500,000 as a "token of appreciation" for your business relationship. Your company policy limits gifts to ₦50,000.',
            options: [
              {
                id: 'a',
                text: 'Accept the gift, they are a valued supplier',
                correct: false,
                feedback: '❌ INCORRECT: This gift exceeds company policy and could be considered a bribe intended to influence future purchasing decisions. Accepting creates both an actual and perceived conflict of interest.'
              },
              {
                id: 'b',
                text: 'Return the gift, explain company policy, and report to your compliance officer',
                correct: true,
                feedback: '✅ CORRECT: Return the gift with a polite explanation of company policy. Report the incident to your compliance officer. This protects both your integrity and the business relationship, which should be based on quality and value, not gifts.'
              },
              {
                id: 'c',
                text: 'Accept it but don\'t tell anyone',
                correct: false,
                feedback: '❌ INCORRECT: Accepting and concealing a gift that violates policy is a serious ethics violation. This creates a conflict of interest and can be discovered through audits, resulting in termination and possible legal action.'
              },
              {
                id: 'd',
                text: 'Accept and share it with your team',
                correct: false,
                feedback: '❌ INCORRECT: The gift still violates company policy regardless of how it\'s distributed. Sharing it doesn\'t eliminate the conflict of interest or the policy violation. Return it and report the incident.'
              }
            ]
          },
          {
            id: 'private-ethics-3',
            title: 'False Expense Claim',
            situation: 'A colleague shows you how to submit inflated expense claims by adjusting receipt amounts, saying "everyone does it and it makes up for our low salaries."',
            options: [
              {
                id: 'a',
                text: 'Follow their advice to supplement your income',
                correct: false,
                feedback: '❌ INCORRECT: This is fraud and theft. Falsifying expense claims is a criminal offense that can result in termination, prosecution, and imprisonment. The fact that others may do it doesn\'t make it legal or acceptable.'
              },
              {
                id: 'b',
                text: 'Refuse to participate and report the fraud if you become aware of specific incidents',
                correct: true,
                feedback: '✅ CORRECT: Submit only accurate expense claims with legitimate receipts. If you become aware of ongoing fraud by others, report to your manager, compliance, or internal audit. Protect your own integrity and your company\'s interests.'
              },
              {
                id: 'c',
                text: 'Submit small inflated amounts only',
                correct: false,
                feedback: '❌ INCORRECT: Any level of expense fraud is still theft and can result in termination and prosecution. There is no "acceptable amount" of fraud. Always submit accurate and honest expense claims.'
              },
              {
                id: 'd',
                text: 'Wait to see if others get caught first',
                correct: false,
                feedback: '❌ INCORRECT: Do not wait to see what happens to others. Maintain your own ethical standards from the start. If you participate even once, you become complicit in fraud and subject to the same consequences.'
              }
            ]
          }
        ],
        quiz: [
          {
            id: 'q1',
            question: 'Is it acceptable to pay a "facilitation payment" to secure a government contract?',
            options: [
              { id: 'a', text: 'Yes, it\'s standard business practice', correct: false },
              { id: 'b', text: 'Yes, if paid through a third party', correct: false },
              { id: 'c', text: 'No, this is bribery and is illegal', correct: true },
              { id: 'd', text: 'Yes, if the amount is small', correct: false }
            ]
          },
          {
            id: 'q2',
            question: 'What should you do if a supplier sends you an expensive gift that exceeds company policy?',
            options: [
              { id: 'a', text: 'Accept it, they are valued', correct: false },
              { id: 'b', text: 'Return the gift, explain policy, and report to compliance', correct: true },
              { id: 'c', text: 'Accept but keep it secret', correct: false },
              { id: 'd', text: 'Share it with your team', correct: false }
            ]
          },
          {
            id: 'q3',
            question: 'If a procurement officer requests a bribe, what should you do?',
            options: [
              { id: 'a', text: 'Pay to secure the contract', correct: false },
              { id: 'b', text: 'Refuse, document, and report to compliance and management', correct: true },
              { id: 'c', text: 'Pay through a third party', correct: false },
              { id: 'd', text: 'Negotiate a smaller amount', correct: false }
            ]
          },
          {
            id: 'q4',
            question: 'Is falsifying expense claims acceptable if "everyone does it"?',
            options: [
              { id: 'a', text: 'Yes, if amounts are small', correct: false },
              { id: 'b', text: 'Yes, to supplement low salary', correct: false },
              { id: 'c', text: 'No, this is fraud and theft regardless of what others do', correct: true },
              { id: 'd', text: 'Yes, if you need the money', correct: false }
            ]
          },
          {
            id: 'q5',
            question: 'Which law criminalizes bribery in Nigeria\'s private sector?',
            options: [
              { id: 'a', text: 'Traffic Act', correct: false },
              { id: 'b', text: 'Corrupt Practices and Other Related Offences Act (2000)', correct: true },
              { id: 'c', text: 'Land Use Act', correct: false },
              { id: 'd', text: 'Marriage Act', correct: false }
            ]
          }
        ]
      },
      { 
        id: 11,
        title: 'Data Privacy & Protection',
        description: 'Protecting customer data and privacy rights',
        progress: 0,
        risk: 'medium',
        duration: '14 min',
        content: {
          introduction: 'With the Nigeria Data Protection Regulation (NDPR), protecting customer and employee data is not just best practice - it\'s a legal requirement. Data breaches can result in severe penalties and reputational damage.',
          keyPoints: [
            'Personal data must be collected lawfully and for specific purposes',
            'Data subjects have rights to access, correct, and delete their data',
            'Implement appropriate security measures to protect data',
            'Report data breaches within 72 hours',
            'Do not share customer data without proper authorization'
          ],
          laws: [
            'Nigeria Data Protection Regulation (NDPR) 2019',
            'NITDA Act',
            'Cybercrimes Act 2015'
          ]
        },
        scenarios: [
          {
            id: 'private-data-1',
            title: 'Customer Data Sharing Request',
            situation: 'A marketing company offers your company ₦5 million to share your customer database for targeted advertising. Your manager is interested in the revenue.',
            options: [
              {
                id: 'a',
                text: 'Sell the data, it\'s valuable to the company',
                correct: false,
                feedback: '❌ INCORRECT: This violates the NDPR unless customers have explicitly consented to data sharing. Selling customer data without consent is illegal and can result in fines of up to ₦10 million or 2% of annual revenue, whichever is higher.'
              },
              {
                id: 'b',
                text: 'Refuse and explain that this violates NDPR unless customers have consented to data sharing',
                correct: true,
                feedback: '✅ CORRECT: Customer data cannot be shared without explicit consent for that specific purpose. Explain the legal risks under NDPR to your manager. The company could face massive fines, legal action, and reputational damage.'
              },
              {
                id: 'c',
                text: 'Share only email addresses, not full profiles',
                correct: false,
                feedback: '❌ INCORRECT: Email addresses are personal data protected under NDPR. Sharing any personal data without proper consent violates the law. The type or amount of data shared doesn\'t change the violation.'
              },
              {
                id: 'd',
                text: 'Anonymize the data and then share it',
                correct: false,
                feedback: '⚠️ PARTIALLY INCORRECT: While anonymization can help, truly anonymizing data is difficult. If the data can still identify individuals, it remains protected. Consult your legal/compliance team before any data sharing.'
              }
            ]
          }
        ],
        quiz: [
          {
            id: 'q1',
            question: 'Can you sell customer data to a marketing company without consent?',
            options: [
              { id: 'a', text: 'Yes, if the price is good', correct: false },
              { id: 'b', text: 'No, this violates NDPR without explicit customer consent', correct: true },
              { id: 'c', text: 'Yes, if only emails are shared', correct: false },
              { id: 'd', text: 'Yes, if data is anonymized', correct: false }
            ]
          },
          {
            id: 'q2',
            question: 'How long do you have to report a data breach under NDPR?',
            options: [
              { id: 'a', text: '24 hours', correct: false },
              { id: 'b', text: '72 hours', correct: true },
              { id: 'c', text: '1 week', correct: false },
              { id: 'd', text: 'No time limit', correct: false }
            ]
          },
          {
            id: 'q3',
            question: 'What rights do data subjects have under NDPR?',
            options: [
              { id: 'a', text: 'No rights', correct: false },
              { id: 'b', text: 'Rights to access, correct, and delete their data', correct: true },
              { id: 'c', text: 'Only right to delete', correct: false },
              { id: 'd', text: 'Only right to access', correct: false }
            ]
          },
          {
            id: 'q4',
            question: 'What is the maximum fine for NDPR violation?',
            options: [
              { id: 'a', text: '₦1 million', correct: false },
              { id: 'b', text: '₦10 million or 2% of annual revenue, whichever is higher', correct: true },
              { id: 'c', text: '₦5 million', correct: false },
              { id: 'd', text: 'No fines', correct: false }
            ]
          },
          {
            id: 'q5',
            question: 'Personal data must be collected:',
            options: [
              { id: 'a', text: 'Any way possible', correct: false },
              { id: 'b', text: 'Lawfully and for specific purposes', correct: true },
              { id: 'c', text: 'Without telling anyone', correct: false },
              { id: 'd', text: 'Only from social media', correct: false }
            ]
          }
        ]
      }
    ]
  };

  const handleSectorSelect = (sector) => {
    setSelectedSector(sector);
    setSelectedRole('');
    setSelectedDepartment('');
    setSelectedRank('');
  };

  const handleAuth = (e) => {
    e.preventDefault();
    
    if (authMode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      if (!formData.name || !formData.email || !formData.password) {
        alert('Please fill in all fields!');
        return;
      }
    } else {
      if (!formData.email || !formData.password) {
        alert('Please fill in all fields!');
        return;
      }
    }
    
    // Simulate authentication (in production, this would call an API)
    setUserName(formData.name || formData.email.split('@')[0]);
    setUserEmail(formData.email);
    setIsAuthenticated(true);
    setView('onboarding');
  };

  const handleLogout = () => {
    // Clear all state
    setIsAuthenticated(false);
    setUserName('');
    setUserEmail('');
    setUserProfile(null);
    setSelectedSector('');
    setSelectedRole('');
    setSelectedDepartment('');
    setSelectedRank('');
    setCompletedCourses([]);
    setCurrentCourse(null);
    setView('landing');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    
    // Clear localStorage
    try {
      localStorage.removeItem('dragnet_progress');
      console.log('🗑️ Progress cleared from localStorage');
    } catch (error) {
      console.error('Error clearing progress:', error);
    }
  };

  // Generate AI-powered career recommendations based on compliance training
  const generateCareerRecommendations = () => {
    if (!userProfile || completedCourses.length === 0) {
      return {
        recommendations: [],
        suitability: [],
        strengths: []
      };
    }

    const { sector, role, department } = userProfile;
    const completedCount = completedCourses.length;
    const totalCourses = coursesBySector[sector]?.length || 4;
    const completionRate = (completedCount / totalCourses) * 100;

    // Analyze completed courses for strengths
    const strengths = [];
    const recommendations = [];
    const suitability = [];

    if (completedCourses.includes(1)) {
      strengths.push('Strong understanding of anti-bribery and corruption laws');
      strengths.push('Ethical decision-making in high-pressure situations');
    }
    if (completedCourses.includes(2)) {
      strengths.push('Knowledge of conflict of interest management');
      strengths.push('Professional relationship boundaries');
    }
    if (completedCourses.includes(3)) {
      strengths.push('Data protection and privacy compliance');
      strengths.push('Information security awareness');
    }
    if (completedCourses.includes(4)) {
      strengths.push('Whistleblowing procedures understanding');
      strengths.push('Commitment to transparency and accountability');
    }

    // Generate sector-specific recommendations
    if (sector === 'police') {
      if (completionRate >= 75) {
        suitability.push('Ethics and Compliance Training Facilitator');
        suitability.push('Internal Affairs Investigation Unit');
        suitability.push('Anti-Corruption Task Force Member');
        recommendations.push('Consider pursuing certification in Law Enforcement Ethics');
        recommendations.push('You could mentor junior officers on ethical conduct');
      }
      if (completedCourses.includes(1)) {
        suitability.push('Checkpoint Supervision and Management');
        recommendations.push('Your anti-corruption training makes you suitable for leadership roles');
      }
    } else if (sector === 'civil') {
      if (completionRate >= 75) {
        suitability.push('Procurement Compliance Officer');
        suitability.push('Ethics and Integrity Unit Coordinator');
        suitability.push('Policy Development and Implementation');
        recommendations.push('Consider specializing in Public Sector Compliance');
        recommendations.push('You could lead ethics training workshops for civil servants');
      }
      if (completedCourses.includes(2)) {
        suitability.push('Conflict Resolution Specialist');
        recommendations.push('Your understanding of conflicts of interest is valuable for advisory roles');
      }
    } else if (sector === 'student') {
      if (completionRate >= 75) {
        suitability.push('Student Governance and Leadership Positions');
        suitability.push('Campus Ethics Committee Member');
        suitability.push('Peer Education and Mentorship Programs');
        recommendations.push('Your compliance knowledge prepares you for student union leadership');
        recommendations.push('Consider becoming a campus integrity ambassador');
      }
      if (completedCourses.includes(4)) {
        suitability.push('Student Advocacy and Rights Protection');
        recommendations.push('Your whistleblowing knowledge makes you ideal for student welfare roles');
      }
    } else if (sector === 'private') {
      if (completionRate >= 75) {
        suitability.push('Compliance Officer or Manager');
        suitability.push('Corporate Ethics and Governance Specialist');
        suitability.push('Risk and Compliance Analyst');
        recommendations.push('Your training qualifies you for corporate compliance positions');
        recommendations.push('Consider pursuing professional certification (e.g., CCEP, CAMS)');
      }
      if (completedCourses.includes(3)) {
        suitability.push('Data Protection Officer (DPO)');
        recommendations.push('Your data privacy knowledge is valuable in the digital economy');
      }
    }

    // Universal recommendations
    if (completionRate === 100) {
      recommendations.push('🏆 You have completed all compliance modules! You are a compliance champion.');
      recommendations.push('Consider sharing your knowledge through training or mentorship');
      suitability.push('Chief Compliance Officer roles');
      suitability.push('Ethics Training and Development Specialist');
    }

    return { recommendations, suitability, strengths };
  };

  const handleCompleteOnboarding = () => {
    setView('analysis');
    setAnalysisStep(0);
    
    // Simulate AI analysis with progressive steps
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setAnalysisStep(currentStep);
      
      if (currentStep >= analysisSteps.length) {
        clearInterval(interval);
        // Create user profile
        const profile = {
          name: userName,
          email: userEmail,
          sector: selectedSector,
          role: selectedRole,
          department: selectedDepartment,
          rank: selectedRank,
          riskLevel: selectedSector === 'police' || selectedSector === 'civil' ? 'high' : 'medium',
          courses: coursesBySector[selectedSector] || []
        };
        console.log('Setting user profile:', profile);
        setUserProfile(profile);
        setTimeout(() => {
          console.log('Navigating to dashboard with profile:', profile);
          setView('dashboard');
        }, 500);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {view === 'landing' ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="text-center max-w-4xl">
            <h1 className="text-6xl font-bold text-white mb-6">
              🎯 DragNet
            </h1>
            <p className="text-2xl text-blue-300 mb-4">
              AI-Powered Compliance Training Platform
            </p>
            <div className="inline-block px-6 py-2 bg-purple-600/20 border-2 border-purple-500/50 rounded-lg mb-8">
              <p className="text-xl text-purple-200 font-semibold">
                ✅ Compliance App for Ethics & Standards
              </p>
            </div>
            <p className="text-lg text-gray-300 mb-12">
              Personalized anti-corruption training for Nigerian professionals in all facets of life
            </p>
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setView('auth')}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started →
              </button>
              {isAuthenticated && (
                <button 
                  onClick={() => setView('dashboard')}
                  className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  View Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      ) : view === 'auth' ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="max-w-md w-full">
            <button 
              onClick={() => setView('landing')}
              className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
            >
              ← Back
            </button>
            
            <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-gray-700">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {authMode === 'signin' ? '👋 Welcome Back!' : '🚀 Create Account'}
                </h2>
                <p className="text-gray-300">
                  {authMode === 'signin' 
                    ? 'Sign in to continue your compliance training' 
                    : 'Join DragNet to start your personalized training'}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border-2 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border-2 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border-2 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                    required
                  />
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border-2 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {authMode === 'signin' ? '🔓 Sign In' : '✨ Create Account'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  {authMode === 'signin' 
                    ? "Don't have an account? " 
                    : "Already have an account? "}
                  <button
                    onClick={() => {
                      setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                    }}
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : view === 'onboarding' ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="max-w-4xl w-full">
            <button 
              onClick={() => setView('landing')}
              className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
            >
              ← Back
            </button>
            
            <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-gray-700">
              <h2 className="text-3xl font-bold text-white mb-4">
                🧠 Hi {userName}! Let's Analyze Your Role
              </h2>
              <p className="text-gray-300 mb-8">
                Select your sector and role. Our AI will automatically assign the right compliance training, policies, and assessments for your position.
              </p>

              {/* Sector Selection */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">1. Select Your Sector</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sectors.map((sector) => (
                    <button
                      key={sector.value}
                      onClick={() => handleSectorSelect(sector.value)}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        selectedSector === sector.value
                          ? `bg-gradient-to-br ${sector.color} border-white shadow-xl scale-105`
                          : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-4xl mb-2">{sector.icon}</div>
                      <div className="text-lg font-semibold text-white">{sector.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Selection */}
              {selectedSector && (
                <div className="mb-8 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-white mb-4">2. Select Your Role</h3>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-gray-700 text-white border-2 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                  >
                    <option value="">Select your job title...</option>
                    {rolesBySection[selectedSector].map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Department */}
              {selectedRole && (
                <div className="mb-8 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-white mb-4">3. Department</h3>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-gray-700 text-white border-2 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                  >
                    <option value="">Select your department...</option>
                    {departmentsBySection[selectedSector]?.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Rank/Grade Level */}
              {selectedDepartment && (
                <div className="mb-8 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-white mb-4">4. Rank / Grade Level</h3>
                  <select
                    value={selectedRank}
                    onChange={(e) => setSelectedRank(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-gray-700 text-white border-2 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                  >
                    <option value="">Select your rank/grade...</option>
                    {ranksBySection[selectedSector]?.map((rank) => (
                      <option key={rank} value={rank}>{rank}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Submit Button */}
              {selectedRank && (
                <div className="animate-fadeIn">
                  <button
                    onClick={handleCompleteOnboarding}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🚀 Start AI Analysis & Get My Training Plan
                  </button>
                  <p className="text-center text-gray-400 text-sm mt-4">
                    AI will analyze your role and assign personalized compliance courses
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : view === 'analysis' ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="max-w-2xl w-full">
            <div className="bg-gray-800/80 backdrop-blur-sm p-12 rounded-2xl border-2 border-blue-500/50 shadow-2xl">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4 animate-pulse">�</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  AI Analyzing Your Profile, {userName}...
                </h2>
                <p className="text-gray-300">
                  Our AI is creating a personalized compliance training plan based on your role as {selectedRole}
                </p>
                <div className="mt-3 inline-block px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-lg">
                  <span className="text-purple-300 text-sm font-semibold">🤖 AI-Powered Analysis</span>
                </div>
              </div>

              <div className="space-y-4">
                {analysisSteps.map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                      index < analysisStep 
                        ? 'bg-green-600/20 border-2 border-green-500/50' 
                        : index === analysisStep 
                        ? 'bg-blue-600/20 border-2 border-blue-500/50 animate-pulse' 
                        : 'bg-gray-700/30 border-2 border-gray-600/30'
                    }`}
                  >
                    <div className="text-3xl">
                      {index < analysisStep ? '✅' : index === analysisStep ? step.icon : '⏳'}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${
                        index <= analysisStep ? 'text-white' : 'text-gray-500'
                      }`}>
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{width: `${(analysisStep / analysisSteps.length) * 100}%`}}
                  ></div>
                </div>
                <p className="text-center text-gray-400 text-sm mt-2">
                  {Math.round((analysisStep / analysisSteps.length) * 100)}% Complete
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : view === 'dashboard' ? (
        <div className="p-8">
          <nav className="flex justify-between items-center mb-8 bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl">
            <div>
              <h2 className="text-2xl font-bold text-white">
                📊 Welcome back, {userProfile?.name || userName}! 👋
              </h2>
              {userProfile && (
                <p className="text-sm text-gray-400 mt-1">
                  {userProfile.role} • {userProfile.department} • {userProfile.rank}
                </p>
              )}
              <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                <span>💾</span>
                <span>Progress auto-saved</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setView('landing')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                aria-label="Go to home page"
              >
                ← Home
              </button>
              <button 
                onClick={() => setView('profile')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
                aria-label="View your profile and achievements"
              >
                👤 My Profile
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                aria-label="Logout and clear progress"
                title="Logout will clear your saved progress"
              >
                🚪 Logout
              </button>
            </div>
          </nav>

          {/* Welcome Message */}
          {userProfile && (
            <div className="max-w-7xl mx-auto mb-6 bg-blue-600/20 border-2 border-blue-500/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">✨</span>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Training Plan Ready, {userProfile.name}!
                  </h3>
                  <p className="text-blue-200">
                    We've analyzed your role as {userProfile.role} and assigned {userProfile.courses.length} personalized compliance modules.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Risk Level Alert */}
          {userProfile && userProfile.riskLevel === 'high' && (
            <div className="max-w-7xl mx-auto mb-6 bg-red-600/20 border-2 border-red-500/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚠️</span>
                <div>
                  <h3 className="text-lg font-bold text-white">High-Risk Position Detected</h3>
                  <p className="text-red-200">
                    Your role requires enhanced compliance training and more frequent assessments.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-xl">
              <h3 className="text-xl font-bold text-white mb-2">Progress</h3>
              <p className="text-4xl font-bold text-white">
                {userProfile ? Math.round((completedCourses.length / userProfile.courses.length) * 100) : 0}%
              </p>
              <p className="text-blue-200 mt-2">Overall Completion</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl shadow-xl">
              <h3 className="text-xl font-bold text-white mb-2">Assigned Courses</h3>
              <p className="text-4xl font-bold text-white">{userProfile?.courses.length || 0}</p>
              <p className="text-green-200 mt-2">AI-Selected Modules</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-600 to-orange-600 p-6 rounded-xl shadow-xl">
              <h3 className="text-xl font-bold text-white mb-2">Completed</h3>
              <p className="text-4xl font-bold text-white">{completedCourses.length}</p>
              <p className="text-yellow-200 mt-2">Modules Passed</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl shadow-xl">
              <h3 className="text-xl font-bold text-white mb-2">Risk Level</h3>
              <p className="text-4xl font-bold text-white uppercase">{userProfile?.riskLevel || 'N/A'}</p>
              <p className="text-purple-200 mt-2">Assessment Frequency</p>
            </div>
          </div>
          
          {/* Completed Courses Section */}
          {completedCourses.length > 0 && (
            <div className="mt-8 max-w-7xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                🏆 Completed Courses & Certificates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedCourses.map((completed, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-2 border-green-500/50 p-6 rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">✅</span>
                        <div>
                          <h4 className="text-lg font-bold text-white">{completed.courseName}</h4>
                          <p className="text-sm text-gray-400">Completed: {completed.completedDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-900/30 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-green-300 font-semibold">Final Score:</span>
                        <span className="text-2xl font-bold text-green-400">{completed.score}%</span>
                      </div>
                      <div className="mt-2 text-center">
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-semibold rounded-full">
                          🏅 PASSED
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 max-w-7xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              📚 Your Personalized Training Modules
            </h3>
            {userProfile && userProfile.courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userProfile.courses.map((course) => (
                  <div 
                    key={course.id}
                    className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border-2 border-gray-700 hover:border-blue-500 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {course.title}
                      </h4>
                      {course.risk === 'high' && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs font-semibold rounded">
                          HIGH RISK
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 mb-4">{course.description}</p>
                    
                    {course.scenarios && course.scenarios.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                          🎭 Included Scenarios ({course.scenarios.length})
                        </p>
                        <ul className="text-sm text-gray-400 space-y-1">
                          {course.scenarios.map((scenario, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              • {scenario.title || scenario}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all" 
                        style={{width: `${course.progress}%`}}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-400">{course.progress}% Complete</p>
                      <button 
                        onClick={() => {
                          setCurrentCourse(course);
                          setView('course');
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          course.progress === 100 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {course.progress === 100 ? '✓ Completed Module' : 'Start Module →'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <p className="text-xl">No courses assigned yet. Complete your profile to get started.</p>
              </div>
            )}
          </div>
        </div>
      ) : view === 'profile' ? (
        <div className="p-8 max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="mb-6">
            <button 
              onClick={() => setView('dashboard')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all mb-4"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-8 rounded-2xl text-white mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10 flex items-start gap-6">
              <div className="flex-shrink-0 w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-5xl backdrop-blur-sm border-2 border-white/30">
                👤
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{userProfile?.name || userName}</h1>
                <p className="text-xl text-purple-100 mb-3">{userProfile?.email || userEmail}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm">
                    {sectors.find(s => s.value === userProfile?.sector)?.icon} {sectors.find(s => s.value === userProfile?.sector)?.label}
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm">
                    👔 {userProfile?.role}
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm">
                    🏢 {userProfile?.department}
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm">
                    ⭐ {userProfile?.rank}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border-2 border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📚</span>
                <h3 className="text-lg font-semibold text-gray-300">Courses Completed</h3>
              </div>
              <p className="text-4xl font-bold text-white">{completedCourses.length}</p>
              <p className="text-sm text-gray-400 mt-1">
                out of {coursesBySector[userProfile?.sector]?.length || 4} total
              </p>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border-2 border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📊</span>
                <h3 className="text-lg font-semibold text-gray-300">Completion Rate</h3>
              </div>
              <p className="text-4xl font-bold text-white">
                {Math.round((completedCourses.length / (coursesBySector[userProfile?.sector]?.length || 4)) * 100)}%
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCourses.length / (coursesBySector[userProfile?.sector]?.length || 4)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border-2 border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🏆</span>
                <h3 className="text-lg font-semibold text-gray-300">Achievement Level</h3>
              </div>
              <p className="text-2xl font-bold text-white">
                {completedCourses.length === 0 ? 'Beginner' : 
                 completedCourses.length === 1 ? 'Learner' :
                 completedCourses.length === 2 ? 'Practitioner' :
                 completedCourses.length === 3 ? 'Expert' :
                 'Compliance Champion'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {completedCourses.length === (coursesBySector[userProfile?.sector]?.length || 4) ? '🌟 All courses completed!' : 'Keep learning!'}
              </p>
            </div>
          </div>

          {/* AI-Powered Recommendations Section */}
          {completedCourses.length > 0 && (() => {
            const { recommendations, suitability, strengths } = generateCareerRecommendations();
            
            return (
              <div className="space-y-6">
                {/* Strengths */}
                {strengths.length > 0 && (
                  <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm p-6 rounded-xl border-2 border-green-700/50">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">💪</span>
                      <h2 className="text-2xl font-bold text-white">Your Compliance Strengths</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      {strengths.map((strength, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-green-800/20 p-3 rounded-lg">
                          <span className="text-green-400 mt-1">✓</span>
                          <p className="text-gray-200">{strength}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Career Suitability */}
                {suitability.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm p-6 rounded-xl border-2 border-blue-700/50">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">🎯</span>
                      <h2 className="text-2xl font-bold text-white">Career Suitability</h2>
                    </div>
                    <p className="text-gray-300 mb-4">
                      Based on your compliance training, you are well-suited for the following roles in society:
                    </p>
                    <div className="space-y-2">
                      {suitability.map((role, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-blue-800/20 p-4 rounded-lg border border-blue-600/30">
                          <span className="text-2xl">🔹</span>
                          <p className="text-white font-semibold">{role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Recommendations */}
                {recommendations.length > 0 && (
                  <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm p-6 rounded-xl border-2 border-purple-700/50">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">🤖</span>
                      <h2 className="text-2xl font-bold text-white">AI-Powered Recommendations</h2>
                    </div>
                    <p className="text-gray-300 mb-4">
                      Our AI analysis suggests the following next steps for your career development:
                    </p>
                    <div className="space-y-3">
                      {recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-purple-800/20 p-4 rounded-lg border-l-4 border-purple-500">
                          <span className="text-purple-400 text-xl mt-1">💡</span>
                          <p className="text-gray-200">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Completed Courses List */}
          <div className="mt-6 bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border-2 border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📋</span>
              <h2 className="text-2xl font-bold text-white">Completed Training Modules</h2>
            </div>
            {completedCourses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-lg">No courses completed yet</p>
                <p className="text-gray-500 mt-2">Start your compliance training journey today!</p>
                <button 
                  onClick={() => setView('dashboard')}
                  className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {completedCourses.map((courseId) => {
                  const course = coursesBySector[userProfile?.sector]?.find(c => c.id === courseId);
                  if (!course) return null;
                  
                  return (
                    <div key={courseId} className="flex items-center gap-4 bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center text-2xl">
                        ✅
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                        <p className="text-sm text-gray-400">{course.description}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-600/20 text-green-300 rounded-lg text-sm font-semibold">
                        Completed
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Call to Action */}
          {completedCourses.length < (coursesBySector[userProfile?.sector]?.length || 4) && (
            <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Continue Your Learning Journey</h3>
              <p className="text-blue-100 mb-4">
                Complete {(coursesBySector[userProfile?.sector]?.length || 4) - completedCourses.length} more module{(coursesBySector[userProfile?.sector]?.length || 4) - completedCourses.length > 1 ? 's' : ''} to become a Compliance Champion!
              </p>
              <button 
                onClick={() => setView('dashboard')}
                className="px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-semibold transition-all shadow-lg"
              >
                Continue Training
              </button>
            </div>
          )}
        </div>
      ) : view === 'course' ? (
        <div className="p-8 max-w-5xl mx-auto">
          {/* Skip to main content link for accessibility */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          {/* Progress Indicator */}
          {currentCourse && !currentScenario && (
            <div className="mb-6 bg-gray-800/50 p-4 rounded-lg border border-gray-700" role="navigation" aria-label="Learning progress">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-gray-300">Learning Progress</h2>
                <span className="text-xs text-gray-400">Step {['video', 'scenarios', 'keyPoints', 'laws', 'assessment'].indexOf(currentStep) + 1} of 5</span>
              </div>
              <div className="flex gap-2">
                {['video', 'scenarios', 'keyPoints', 'laws', 'assessment'].map((step, index) => (
                  <div 
                    key={step}
                    className={`flex-1 h-2 rounded-full transition-all duration-500 progress-step ${
                      step === currentStep ? 'bg-blue-500 active animate-glow' : 
                      ['video', 'scenarios', 'keyPoints', 'laws', 'assessment'].indexOf(currentStep) > index ? 'bg-green-500 completed' : 'bg-gray-700'
                    }`}
                    role="progressbar"
                    aria-valuenow={['video', 'scenarios', 'keyPoints', 'laws', 'assessment'].indexOf(currentStep) + 1}
                    aria-valuemin="1"
                    aria-valuemax="5"
                    aria-label={`${step.charAt(0).toUpperCase() + step.slice(1)} step`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>📹 Video</span>
                <span>🎭 Scenarios</span>
                <span>💡 Key Points</span>
                <span>⚖️ Laws</span>
                <span>✅ Assessment</span>
              </div>
            </div>
          )}

          <div className="mb-6 flex items-center justify-between">
            <button 
              onClick={() => {
                setView('dashboard');
                setCurrentCourse(null);
                setCurrentScenario(null);
                setScenarioResult(null);
                setCurrentStep('video');
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-smooth"
              aria-label="Return to dashboard"
            >
              ← Back to Dashboard
            </button>
            {currentCourse && currentCourse.risk === 'high' && (
              <span className="px-3 py-1 bg-red-500/20 text-red-300 text-sm font-semibold rounded-lg" role="status">
                🔥 HIGH RISK MODULE
              </span>
            )}
          </div>

          {currentCourse && !currentScenario && (
            <div className="space-y-6">
              {/* Course Header with Visual */}
              <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-2xl text-white overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                
                <div className="relative z-10 flex items-start gap-6">
                  {/* Course Icon/Illustration */}
                  <div className="flex-shrink-0 w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-5xl backdrop-blur-sm border-2 border-white/30">
                    {currentCourse.id === 1 ? '🚫' : currentCourse.id === 2 ? '🛡️' : currentCourse.id === 3 ? '⚖️' : '🔍'}
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold mb-3">{currentCourse.title}</h1>
                    <p className="text-xl text-blue-100 mb-4">{currentCourse.description}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm">⏱️ {currentCourse.duration}</span>
                      <span className="px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm">📊 {currentCourse.progress}% Complete</span>
                      <span className="px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm">🎯 {currentCourse.scenarios?.length || 0} Scenarios</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. VIDEO TRAINING - First Section */}
              <div className="relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 p-8 rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 text-9xl opacity-10">🎥</div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center text-2xl">
                      🎥
                    </div>
                    <h2 className="text-2xl font-bold text-white">Video Training</h2>
                  </div>
                  
                  <div className="bg-purple-900/20 p-4 rounded-lg mb-6 border-l-4 border-purple-500">
                    <p className="text-gray-300">
                      📺 Watch this comprehensive training video to understand the key concepts and real-world applications.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-4 rounded-xl border-2 border-purple-600/30">
                    <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl mb-4">
                      <iframe
                        className="w-full h-full"
                        src={
                          userProfile?.sector === 'police' ? 'https://www.youtube.com/embed/eeM1Ga76bA4' :
                          userProfile?.sector === 'civil' ? 'https://www.youtube.com/embed/3ilFN6NaHVk' :
                          userProfile?.sector === 'student' ? 'https://www.youtube.com/embed/8amOKakZJwk' :
                          userProfile?.sector === 'private' ? 'https://www.youtube.com/embed/eeM1Ga76bA4' :
                          'https://www.youtube.com/embed/eeM1Ga76bA4'
                        }
                        title={`${currentCourse.title} - Training Video`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg">📚 {currentCourse.duration} Training</span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg">💡 Essential Knowledge</span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg">🎓 Professional Development</span>
                    </div>
                  </div>
                  
                  {currentCourse.content && (
                    <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-purple-500/30">
                      <h3 className="text-lg font-semibold text-purple-300 mb-2">📖 Video Overview:</h3>
                      <p className="text-gray-300">{currentCourse.content.introduction}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. INTERACTIVE SCENARIO SIMULATIONS - Second Section */}
              {currentCourse.scenarios && currentCourse.scenarios.length > 0 && (
                <div className="relative bg-gradient-to-br from-orange-600/20 to-red-600/20 border-2 border-orange-500/50 p-8 rounded-xl overflow-hidden">
                  <div className="absolute top-0 right-0 text-9xl opacity-10">🎭</div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-orange-500/30 rounded-lg flex items-center justify-center text-2xl">
                        🎭
                      </div>
                      <h2 className="text-2xl font-bold text-white">Interactive Scenario Simulations</h2>
                    </div>
                    
                    <div className="bg-orange-900/20 p-4 rounded-lg mb-6 border-l-4 border-orange-500">
                      <p className="text-gray-300">
                        🎯 Test your understanding with realistic ethical dilemma scenarios. Choose the best course of action based on what you've learned.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {currentCourse.scenarios.map((scenario, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentScenario(scenario);
                            setScenarioAnswer('');
                            setScenarioResult(null);
                            setCurrentStep('scenarios');
                          }}
                          className="w-full p-6 bg-gray-800/80 hover:bg-gray-700 border-2 border-gray-600 hover:border-orange-500 rounded-xl text-left transition-smooth group relative overflow-hidden animate-fadeIn"
                          style={{ animationDelay: `${idx * 0.1}s` }}
                          aria-label={`Practice scenario ${idx + 1}: ${scenario.title}`}
                        >
                          {/* Animated hover effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          
                          <div className="relative flex items-center gap-4">
                            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                              {idx === 0 ? '🚦' : idx === 1 ? '🔍' : '📋'}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-white group-hover:text-orange-400 transition-colors mb-1">
                                Scenario {idx + 1}: {scenario.title}
                              </h3>
                              <p className="text-sm text-gray-400">🎮 Click to begin interactive simulation</p>
                            </div>
                            <div className="flex-shrink-0 text-3xl group-hover:translate-x-2 transition-transform">
                              ➡️
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. KEY LEARNING POINTS - Third Section (Shows after scenarios) */}
              {currentCourse.content && showKeyLearning && (
                <div ref={keyLearningRef} className="relative bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm p-8 rounded-xl border-2 border-blue-700/50 overflow-hidden animate-fadeIn" id="main-content">
                  <div className="absolute bottom-0 right-0 text-9xl opacity-10" aria-hidden="true">🎯</div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center text-2xl" aria-hidden="true">
                          🎯
                        </div>
                        <h2 className="text-2xl font-bold text-white">Key Learning Points</h2>
                      </div>
                      
                      {/* Narrate All Key Points Button */}
                      {speechSupported && (
                        <button
                          onClick={() => {
                            const allPoints = currentCourse.content.keyPoints.join('. ');
                            const fullText = `Key Learning Points for ${currentCourse.title}. ${allPoints}`;
                            toggleNarration(fullText);
                          }}
                          className={`px-4 py-2 rounded-lg font-semibold text-white transition-smooth shadow-lg hover:shadow-xl flex items-center gap-2 ${
                            isNarrating 
                              ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 animate-pulse' 
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                          }`}
                          aria-label={isNarrating ? 'Stop narrating all learning points' : 'Listen to all learning points'}
                          aria-pressed={isNarrating}
                          title={isNarrating ? 'Stop reading all learning points' : 'Have all learning points read aloud'}
                        >
                          {isNarrating ? (
                            <>
                              <span className="text-lg" aria-hidden="true">⏸️</span>
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <span className="text-lg" aria-hidden="true">🔊</span>
                              <span>Listen to All</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <div className="bg-blue-900/20 p-4 rounded-lg mb-6 border-l-4 border-blue-500" role="status" aria-live="polite">
                      <p className="text-gray-300">
                        📝 Click on each learning point to review before taking the assessment. ({clickedLearningPoints.length}/{currentCourse.content.keyPoints.length} reviewed)
                      </p>
                    </div>
                    <div className="grid gap-4" role="list" aria-label="Key learning points">
                      {currentCourse.content.keyPoints.map((point, idx) => {
                        const isClicked = clickedLearningPoints.includes(idx);
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              if (!isClicked) {
                                setClickedLearningPoints([...clickedLearningPoints, idx]);
                                if (clickedLearningPoints.length + 1 === currentCourse.content.keyPoints.length) {
                                  setCurrentStep('laws');
                                }
                              }
                            }}
                            className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-smooth animate-fadeIn cursor-pointer ${
                              isClicked
                                ? 'bg-green-600/20 border-green-500'
                                : 'bg-gray-800/60 border-gray-700/50 hover:border-blue-500 hover:bg-gray-800'
                            }`}
                            style={{ animationDelay: `${idx * 0.05}s` }}
                            role="listitem"
                            tabIndex={0}
                            onKeyPress={(e) => {
                              if ((e.key === 'Enter' || e.key === ' ') && !isClicked) {
                                setClickedLearningPoints([...clickedLearningPoints, idx]);
                                if (clickedLearningPoints.length + 1 === currentCourse.content.keyPoints.length) {
                                  setCurrentStep('laws');
                                }
                              }
                            }}
                            aria-label={`Learning point ${idx + 1}: ${point}`}
                            aria-pressed={isClicked}
                          >
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all ${
                                isClicked
                                  ? 'bg-green-500'
                                  : 'bg-gradient-to-br from-blue-500 to-purple-500'
                              }`}
                              aria-hidden="true"
                            >
                              {isClicked ? '✓' : idx + 1}
                            </div>
                            <div className="flex-1">
                              <span className={`text-lg leading-relaxed block ${
                                isClicked ? 'text-green-300' : 'text-gray-300'
                              }`}>{point}</span>
                            </div>
                            
                            {/* Individual Narration Button */}
                            {speechSupported && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const textToRead = `Learning point ${idx + 1}. ${point}`;
                                  toggleNarration(textToRead);
                                }}
                                className={`flex-shrink-0 p-2 rounded-lg transition-smooth border ${
                                  isNarrating 
                                    ? 'bg-red-600/50 hover:bg-red-600/70 text-white border-red-500 animate-pulse' 
                                    : 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 hover:text-white border-purple-500/30 hover:border-purple-500'
                                }`}
                                aria-label={isNarrating ? `Stop narration of learning point ${idx + 1}` : `Listen to learning point ${idx + 1}`}
                                title={isNarrating ? "Stop narration" : "Listen to this point"}
                              >
                                <span className="text-lg" aria-hidden="true">{isNarrating ? '⏸️' : '🔊'}</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. RELEVANT LAWS & REGULATIONS - Fourth Section (Shows after all key points clicked) */}
              {currentCourse.content && showKeyLearning && clickedLearningPoints.length === currentCourse.content.keyPoints.length && (
                <div className="relative bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-sm p-8 rounded-xl border-2 border-purple-700/50 overflow-hidden animate-fadeIn">
                  <div className="absolute top-0 left-0 text-9xl opacity-10">⚖️</div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center text-2xl">
                          ⚖️
                        </div>
                        <h2 className="text-2xl font-bold text-white">Relevant Laws & Regulations</h2>
                      </div>
                      
                      {/* Narrate All Laws Button */}
                      {speechSupported && (
                        <button
                          onClick={() => {
                            const allLaws = currentCourse.content.laws.join('. ');
                            const fullText = `Relevant Laws and Regulations for ${currentCourse.title}. ${allLaws}`;
                            toggleNarration(fullText);
                          }}
                          className={`px-4 py-2 rounded-lg font-semibold text-white transition-smooth shadow-lg hover:shadow-xl flex items-center gap-2 ${
                            isNarrating 
                              ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 animate-pulse' 
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                          }`}
                          aria-label={isNarrating ? 'Stop narrating laws and regulations' : 'Listen to all laws and regulations'}
                          aria-pressed={isNarrating}
                          title={isNarrating ? 'Stop reading laws' : 'Have all laws read aloud'}
                        >
                          {isNarrating ? (
                            <>
                              <span className="text-lg" aria-hidden="true">⏸️</span>
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <span className="text-lg" aria-hidden="true">🔊</span>
                              <span>Listen to All</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <div className="bg-purple-900/20 p-4 rounded-lg mb-6 border-l-4 border-purple-500">
                      <p className="text-gray-300">
                        ⚖️ Understand the legal framework that governs your professional conduct and responsibilities.
                      </p>
                    </div>
                    <div className="space-y-3">
                      {currentCourse.content.laws.map((law, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 bg-gray-800/60 rounded-lg border-l-4 border-purple-500 hover:bg-gray-800 transition-all">
                          <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-xl">
                            📜
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-300 leading-relaxed">{law}</span>
                          </div>
                          
                          {/* Individual Law Narration Button */}
                          {speechSupported && (
                            <button
                              onClick={() => {
                                const textToRead = `Law ${idx + 1}. ${law}`;
                                toggleNarration(textToRead);
                              }}
                              className={`flex-shrink-0 p-2 rounded-lg transition-smooth border ${
                                isNarrating 
                                  ? 'bg-red-600/50 hover:bg-red-600/70 text-white border-red-500 animate-pulse' 
                                  : 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 hover:text-white border-purple-500/30 hover:border-purple-500'
                              }`}
                              aria-label={isNarrating ? `Stop narration of law ${idx + 1}` : `Listen to law ${idx + 1}`}
                              title={isNarrating ? "Stop narration" : "Listen to this law"}
                            >
                              <span className="text-lg" aria-hidden="true">{isNarrating ? '⏸️' : '🔊'}</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. TAKE ASSESSMENT BUTTON - Fifth Section (Shows after all key points clicked) */}
              {showKeyLearning && clickedLearningPoints.length === currentCourse.content.keyPoints.length && (
                <div className="flex justify-center pt-6 animate-fadeIn">
                  <button
                    onClick={() => {
                      setShowQuiz(true);
                      setQuizAnswers({});
                      setQuizResult(null);
                      setCurrentStep('assessment');
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold text-lg transition-smooth shadow-lg hover:shadow-xl transform hover:scale-105 animate-pulse"
                    aria-label="Start final assessment with 5 questions"
                  >
                    📝 Take Final Assessment (5 Questions)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quiz Assessment */}
          {currentCourse && showQuiz && !quizResult && (
            <div className="space-y-6">
              <div className="relative bg-gradient-to-br from-green-600 to-emerald-600 p-8 rounded-2xl text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
                <div className="relative z-10 flex items-center gap-6">
                  <div className="flex-shrink-0 w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm border-2 border-white/30">
                    📝
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Final Assessment</h1>
                    <p className="text-lg text-green-100">Answer all 5 questions • Pass Mark: 80% (4/5 correct)</p>
                  </div>
                </div>
              </div>

              {currentCourse.quiz && currentCourse.quiz.map((question, qIdx) => (
                <div key={question.id} className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border-2 border-gray-700">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                      {qIdx + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{question.question}</h3>
                  </div>
                  
                  <div className="space-y-3 ml-14">
                    {question.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setQuizAnswers({...quizAnswers, [question.id]: option.id})}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          quizAnswers[question.id] === option.id
                            ? 'bg-green-600/20 border-green-500 shadow-lg'
                            : 'bg-gray-700/50 border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            quizAnswers[question.id] === option.id
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-500'
                          }`}>
                            {quizAnswers[question.id] === option.id && <span className="text-white text-sm">✓</span>}
                          </div>
                          <span className="text-white">{option.text}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowQuiz(false);
                    setQuizAnswers({});
                  }}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
                >
                  ← Back to Course
                </button>
                <button
                  onClick={() => {
                    // Calculate score
                    let correct = 0;
                    currentCourse.quiz.forEach(question => {
                      const selectedAnswer = quizAnswers[question.id];
                      const correctOption = question.options.find(opt => opt.correct);
                      if (selectedAnswer === correctOption.id) {
                        correct++;
                      }
                    });
                    const percentage = (correct / currentCourse.quiz.length) * 100;
                    const passed = percentage >= 80;
                    
                    setQuizResult({
                      correct,
                      total: currentCourse.quiz.length,
                      percentage,
                      passed
                    });

                    // If passed, update course progress and add to completed courses
                    if (passed && userProfile) {
                      const updatedCourses = userProfile.courses.map(c => 
                        c.id === currentCourse.id ? { ...c, progress: 100 } : c
                      );
                      setUserProfile({ ...userProfile, courses: updatedCourses });
                      
                      setCompletedCourses([...completedCourses, {
                        courseId: currentCourse.id,
                        courseName: currentCourse.title,
                        score: percentage,
                        passed: true,
                        completedDate: new Date().toLocaleDateString()
                      }]);
                    }
                  }}
                  disabled={Object.keys(quizAnswers).length < (currentCourse.quiz?.length || 0)}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Assessment →
                </button>
              </div>
            </div>
          )}

          {/* Quiz Result */}
          {quizResult && (
            <div className="space-y-6">
              <div className={`relative p-8 rounded-2xl overflow-hidden ${
                quizResult.passed 
                  ? 'bg-gradient-to-br from-green-600 to-emerald-600' 
                  : 'bg-gradient-to-br from-red-600 to-orange-600'
              }`}>
                <div className="absolute top-0 right-0 text-9xl opacity-20">
                  {quizResult.passed ? '🎉' : '📚'}
                </div>
                
                <div className="relative z-10 text-center text-white">
                  <div className="text-7xl mb-4">{quizResult.passed ? '🎉' : '📚'}</div>
                  <h1 className="text-4xl font-bold mb-4">
                    {quizResult.passed ? 'Congratulations! You Passed!' : 'Assessment Not Passed'}
                  </h1>
                  <div className="text-6xl font-bold mb-4">{quizResult.percentage}%</div>
                  <p className="text-2xl mb-6">
                    You got {quizResult.correct} out of {quizResult.total} questions correct
                  </p>
                  
                  {quizResult.passed ? (
                    <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                      <p className="text-lg">✅ You have successfully completed this module!</p>
                      <p className="text-sm mt-2">Certificate of completion added to your dashboard</p>
                    </div>
                  ) : (
                    <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                      <p className="text-lg">Pass mark is 80% (4/5 correct)</p>
                      <p className="text-sm mt-2">Please review the material and try again</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-4">
                {!quizResult.passed && (
                  <button
                    onClick={() => {
                      setShowQuiz(false);
                      setQuizAnswers({});
                      setQuizResult(null);
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                  >
                    📖 Review Course Material
                  </button>
                )}
                {!quizResult.passed && (
                  <button
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizResult(null);
                    }}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all"
                  >
                    🔄 Retake Assessment
                  </button>
                )}
                {quizResult.passed && (
                  <>
                    <button
                      onClick={() => {
                        // Find next incomplete module
                        const currentIndex = userProfile.courses.findIndex(c => c.id === currentCourse.id);
                        const nextModule = userProfile.courses.slice(currentIndex + 1).find(c => c.progress < 100);
                        
                        if (nextModule) {
                          setCurrentCourse(nextModule);
                          setShowQuiz(false);
                          setQuizAnswers({});
                          setQuizResult(null);
                          setView('course');
                        } else {
                          // No more modules, go to dashboard
                          setView('dashboard');
                          setCurrentCourse(null);
                          setShowQuiz(false);
                          setQuizAnswers({});
                          setQuizResult(null);
                        }
                      }}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {userProfile.courses.slice(userProfile.courses.findIndex(c => c.id === currentCourse.id) + 1).find(c => c.progress < 100) 
                        ? '→ Next Module' 
                        : '✅ All Modules Complete - Return to Dashboard'}
                    </button>
                    <button
                      onClick={() => {
                        setView('dashboard');
                        setCurrentCourse(null);
                        setShowQuiz(false);
                        setQuizAnswers({});
                        setQuizResult(null);
                      }}
                      className="px-8 py-4 bg-white text-green-600 hover:bg-gray-100 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      📊 Return to Dashboard
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Scenario Simulator with Visuals */}
          {currentScenario && (
            <div className="space-y-6">
              <div className="relative bg-gradient-to-br from-orange-600 to-red-600 p-8 rounded-2xl text-white overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
                
                <div className="relative z-10 flex items-center gap-6">
                  {/* Scenario Icon */}
                  <div className="flex-shrink-0 w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm border-2 border-white/30 animate-pulse">
                    🎭
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{currentScenario.title}</h1>
                    <p className="text-lg text-orange-100">🎮 Interactive Ethical Dilemma Simulation</p>
                  </div>
                </div>
              </div>

              {/* Cartoon Illustration Section */}
              <div className="relative bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm p-6 rounded-xl border-2 border-indigo-500/50 overflow-hidden">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  {/* Cartoon Visual Representation */}
                  <div className="flex-shrink-0">
                    <div className="relative w-48 h-48 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-2xl p-4 border-4 border-yellow-500/30">
                      {/* Cartoon characters based on scenario */}
                      <div className="text-center space-y-2">
                        {currentScenario.id.includes('checkpoint') && (
                          <>
                            <div className="text-5xl animate-bounce">🚔</div>
                            <div className="text-4xl">👮</div>
                            <div className="flex justify-center gap-2">
                              <span className="text-3xl">💰</span>
                              <span className="text-2xl">→</span>
                              <span className="text-3xl">👨</span>
                            </div>
                            <p className="text-xs text-yellow-300 font-bold">BRIBERY ATTEMPT</p>
                          </>
                        )}
                        {currentScenario.id.includes('evidence') && (
                          <>
                            <div className="text-5xl animate-pulse">📁</div>
                            <div className="flex justify-center gap-2">
                              <span className="text-3xl">💵</span>
                              <span className="text-2xl">❌</span>
                              <span className="text-3xl">🔍</span>
                            </div>
                            <div className="text-4xl">🕵️</div>
                            <p className="text-xs text-red-300 font-bold">EVIDENCE TAMPERING</p>
                          </>
                        )}
                        {currentScenario.id.includes('gift') && (
                          <>
                            <div className="text-5xl animate-bounce">🎁</div>
                            <div className="flex justify-center gap-2">
                              <span className="text-3xl">👔</span>
                              <span className="text-2xl">→</span>
                              <span className="text-3xl">�</span>
                            </div>
                            <div className="text-3xl">🏠</div>
                            <p className="text-xs text-orange-300 font-bold">CONFLICT OF INTEREST</p>
                          </>
                        )}
                        {!currentScenario.id.includes('checkpoint') && 
                         !currentScenario.id.includes('evidence') && 
                         !currentScenario.id.includes('gift') && (
                          <>
                            <div className="text-5xl">⚖️</div>
                            <div className="flex justify-center gap-2">
                              <span className="text-3xl">👤</span>
                              <span className="text-2xl">vs</span>
                              <span className="text-3xl">📋</span>
                            </div>
                            <p className="text-xs text-blue-300 font-bold">ETHICAL DILEMMA</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Scenario Description with Comic Style */}
                  <div className="flex-1">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border-2 border-white/20 relative">
                      <div className="absolute -top-3 left-4 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 rounded-full text-xs font-bold text-gray-900">
                        💭 SCENARIO STORY
                      </div>
                      <p className="text-sm text-gray-400 mb-2 italic">You are in this situation...</p>
                      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-4 rounded-lg border-l-4 border-orange-500">
                        <p className="text-white text-lg leading-relaxed">
                          {currentScenario.situation}
                        </p>
                      </div>
                      
                      {/* Narration Button */}
                      {speechSupported && (
                        <div className="mt-4 flex justify-center">
                          <button
                            onClick={() => toggleNarration(currentScenario.situation)}
                            className={`px-6 py-3 rounded-lg font-semibold text-white transition-smooth shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 ${
                              isNarrating 
                                ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 animate-pulse' 
                                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                            }`}
                            aria-label={isNarrating ? 'Stop scenario narration' : 'Listen to scenario narration'}
                            aria-pressed={isNarrating}
                            title={isNarrating ? 'Stop reading the scenario aloud' : 'Have the scenario read aloud to you'}
                          >
                            {isNarrating ? (
                              <>
                                <span className="text-xl" aria-hidden="true">⏸️</span>
                                <span>Stop Narration</span>
                              </>
                            ) : (
                              <>
                                <span className="text-xl" aria-hidden="true">🔊</span>
                                <span>Listen to Scenario</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Cartoon thought bubble */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="bg-yellow-400/20 px-4 py-2 rounded-full border-2 border-yellow-400/40">
                    <span className="text-sm text-yellow-200">💡 What's the RIGHT thing to do?</span>
                  </div>
                </div>
              </div>

              {!scenarioResult ? (
                <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl border-2 border-gray-700">
                  <h2 className="text-xl font-bold text-white mb-6">🤔 What would you do? Select your response:</h2>
                  <div className="space-y-4">
                    {currentScenario.options.map((option, index) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setScenarioAnswer(option.id);
                          setScenarioResult(option);
                          setShowAnimation(true);
                        }}
                        className={`w-full p-6 text-left rounded-xl border-2 transition-smooth animate-fadeIn ${
                          scenarioAnswer === option.id
                            ? 'bg-blue-600/20 border-blue-500 shadow-lg animate-pulse'
                            : 'bg-gray-700/50 border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        aria-label={`Option ${option.id.toUpperCase()}: ${option.text}`}
                        aria-pressed={scenarioAnswer === option.id}
                      >
                        <div className="flex items-start gap-4">
                          <div 
                            className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold flex-shrink-0"
                            aria-hidden="true"
                          >
                            {option.id.toUpperCase()}
                          </div>
                          <p className="text-white text-lg">{option.text}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div 
                  className={`p-8 rounded-xl border-2 animate-fadeIn ${
                    scenarioResult.correct 
                      ? 'bg-green-600/20 border-green-500' 
                      : 'bg-red-600/20 border-red-500'
                  }`}
                  role="alert"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {scenarioResult.correct ? '✅ Correct Answer!' : '❌ Incorrect Answer'}
                  </h2>
                  
                  {/* Feedback Section */}
                  <div className="bg-gray-900/50 p-6 rounded-lg mb-4">
                    <p className="text-gray-100 text-lg leading-relaxed">{scenarioResult.feedback}</p>
                  </div>

                  {/* Points and Consequence */}
                  {scenarioResult.points && (
                    <div className={`p-4 rounded-lg mb-4 animate-scaleUp ${
                      scenarioResult.points > 0 ? 'bg-green-700/30' : 'bg-red-700/30'
                    }`}>
                      <p className="text-white font-semibold">
                        {scenarioResult.points > 0 ? '🎯' : '⚠️'} Points: {scenarioResult.points > 0 ? '+' : ''}{scenarioResult.points}
                      </p>
                    </div>
                  )}

                  {scenarioResult.consequence && (
                    <div className="bg-yellow-900/30 border border-yellow-600 p-4 rounded-lg mb-4 animate-slideInRight">
                      <p className="text-yellow-100">
                        <strong>📋 Consequence:</strong> {scenarioResult.consequence}
                      </p>
                    </div>
                  )}

                  {/* Follow-up Question (Branching) */}
                  {scenarioResult.followUp && !scenarioBranch.includes(scenarioResult.id) && (
                    <div className="mt-6 p-6 bg-gray-800/50 rounded-lg border border-blue-500 animate-slideInLeft">
                      <h3 className="text-xl font-bold text-white mb-4">🔀 Follow-up Situation</h3>
                      <p className="text-gray-200 mb-4">{scenarioResult.followUp.situation}</p>
                      <div className="space-y-3">
                        {scenarioResult.followUp.options.map((followUpOption) => (
                          <button
                            key={followUpOption.id}
                            onClick={() => {
                              setScenarioBranch([...scenarioBranch, scenarioResult.id]);
                              setFeedbackHistory([...feedbackHistory, {
                                scenario: currentScenario.title,
                                choice: followUpOption.text,
                                feedback: followUpOption.feedback,
                                correct: followUpOption.correct
                              }]);
                              alert(followUpOption.feedback);
                            }}
                            className="w-full p-4 text-left rounded-lg bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-blue-500 transition-smooth text-white"
                            aria-label={`Follow-up option: ${followUpOption.text}`}
                          >
                            {followUpOption.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feedback History */}
                  {feedbackHistory.length > 0 && (
                    <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
                      <h4 className="text-lg font-semibold text-white mb-3">📊 Your Decision Path</h4>
                      <div className="branch-path">
                        {feedbackHistory.map((item, index) => (
                          <div key={index} className="branch-node mb-3">
                            <p className="text-sm text-gray-400">{item.scenario}</p>
                            <p className={`text-white ${item.correct ? 'text-green-400' : 'text-red-400'}`}>
                              {item.correct ? '✓' : '✗'} {item.choice}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => {
                        setCurrentScenario(null);
                        setScenarioAnswer('');
                        setScenarioResult(null);
                        setScenarioBranch([]);
                      }}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-smooth"
                      aria-label="Go back to course overview"
                    >
                      ← Back to Course
                    </button>
                    {currentCourse.scenarios && currentCourse.scenarios.length > 1 && (() => {
                      const currentIndex = currentCourse.scenarios.findIndex(s => s.id === currentScenario.id);
                      const hasNextScenario = currentIndex < currentCourse.scenarios.length - 1;
                      
                      return hasNextScenario ? (
                        <button
                          onClick={() => {
                            const nextIndex = currentIndex + 1;
                            setCurrentScenario(currentCourse.scenarios[nextIndex]);
                            setScenarioAnswer('');
                            setScenarioResult(null);
                          }}
                          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
                        >
                          Next Scenario ({currentIndex + 2}/{currentCourse.scenarios.length}) →
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setCurrentScenario(null);
                            setScenarioAnswer('');
                            setScenarioResult(null);
                            setShowKeyLearning(true);
                            setClickedLearningPoints([]);
                            // Scroll to Key Learning Points section after a brief delay
                            setTimeout(() => {
                              keyLearningRef.current?.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start' 
                              });
                            }, 100);
                          }}
                          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                        >
                          ✓ All Scenarios Complete - Review Key Learning Points →
                        </button>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default App;
