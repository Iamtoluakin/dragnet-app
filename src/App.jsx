import { useState, useRef, useEffect } from 'react';
import './App.css';
import { narrate, stopAudio, isAudioPlaying } from './utils/pollyNarration';

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
  const [hasReadScenario, setHasReadScenario] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [clickedLearningPoints, setClickedLearningPoints] = useState([]);
  const [showKeyLearning, setShowKeyLearning] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [narrationError, setNarrationError] = useState(null);
  const [scenarioBranch, setScenarioBranch] = useState([]);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentStep, setCurrentStep] = useState('video'); // 'video', 'scenarios', 'keyPoints', 'laws', 'assessment'
  
  // Form states for auth
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Stop narration when scenario changes or component unmounts
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [currentScenario]);

  // Function to narrate text using browser TTS (100% FREE)
  const narrateText = async (text) => {
    try {
      setIsNarrating(true);
      setNarrationError(null);
      
      console.log('🎙️ Starting narration...');
      await narrate(text, {
        rate: 0.95, // Slightly slower for clarity
        pitch: 1.0,
        volume: 1.0
      });
      
      setIsNarrating(false);
      console.log('✅ Narration completed successfully');
    } catch (error) {
      console.error('❌ Narration failed:', error);
      setIsNarrating(false);
      setNarrationError('Unable to play narration. Please check your browser settings.');
      
      // Show error to user for 5 seconds
      setTimeout(() => setNarrationError(null), 5000);
    }
  };

  // Function to stop narration
  const stopNarration = () => {
    stopAudio();
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

  const sectors = [
    { value: 'police', label: 'Police', icon: '🚔', color: 'from-blue-600 to-blue-800' },
    { value: 'civil', label: 'Civil Service', icon: '🏛️', color: 'from-purple-600 to-purple-800' },
    { value: 'immigration', label: 'Customs & Immigration', icon: '🛂', color: 'from-green-600 to-green-800' },
    { value: 'private', label: 'Private Sector', icon: '💼', color: 'from-orange-600 to-orange-800' }
  ];

  const rolesBySection = {
    police: ['Traffic Officer', 'Sergeant', 'Inspector', 'Detective', 'Corporal', 'Constable'],
    civil: ['Procurement Officer', 'Finance Officer', 'Admin Officer', 'IT Officer', 'HR Officer', 'Legal Officer'],
    immigration: ['Immigration Officer', 'Customs Officer', 'Border Control Agent', 'Passport Control Officer', 'Senior Immigration Officer', 'Chief Customs Officer'],
    private: ['Bank Teller', 'Customer Service Rep', 'Manager', 'Accountant', 'Sales Rep', 'IT Staff']
  };

  const departmentsBySection = {
    police: ['Operations', 'Traffic', 'Criminal Investigation', 'Intelligence', 'Administration'],
    civil: ['Finance', 'Procurement', 'IT', 'HR', 'Legal', 'Administration'],
    immigration: ['Passport Control', 'Border Operations', 'Visa Processing', 'Customs Enforcement', 'Investigation & Compliance', 'Airport Operations'],
    private: ['Finance', 'IT', 'Healthcare', 'Customer Service', 'Operations', 'Sales']
  };

  const ranksBySection = {
    police: ['Constable', 'Corporal', 'Sergeant', 'Inspector', 'Chief Inspector', 'Superintendent'],
    civil: ['GL06', 'GL07', 'GL08', 'GL09', 'GL10', 'GL12', 'GL14', 'GL15'],
    immigration: ['Assistant Immigration Officer I', 'Assistant Immigration Officer II', 'Immigration Officer I', 'Immigration Officer II', 'Chief Immigration Officer', 'Deputy Comptroller'],
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
    immigration: [
      { 
        id: 7,
        title: 'Customs & Immigration Compliance',
        description: 'Best practices for passport processing, border control, and anti-corruption',
        progress: 0,
        risk: 'high',
        duration: '18 min',
        content: {
          introduction: 'As a customs or immigration officer, you are entrusted with upholding national security, facilitating lawful travel, and ensuring the integrity of border processes. Strict compliance with regulations and ethical standards is essential to prevent fraud, protect citizens, and maintain public trust.',
          keyPoints: [
            'Always verify the authenticity of documents and applicant identity',
            'Never accept bribes or gifts in exchange for services',
            'Follow due process for passport issuance and border checks',
            'Report any suspicious activity or attempted fraud immediately',
            'Respect the rights and dignity of all applicants and travelers'
          ],
          laws: [
            'Nigeria Immigration Act (2015)',
            'Passport (Miscellaneous Provisions) Act',
            'Corrupt Practices and Other Related Offences Act (2000)',
            'Nigerian Customs Service Act',
            'Public Service Rules'
          ]
        },
        scenarios: [        {
          id: 'immigration-passport-1',
          title: 'Passport Application Bribery',
          videoUrl: 'https://www.youtube.com/embed/lwfijBPReoY',
          videoThumbnail: '🎥',
          situation: 'You are working at the passport office. An applicant offers you ₦20,000 to "fast-track" their passport application, claiming they are in a hurry and know "this is how things work."',
            options: [
              {
                id: 'a',
                text: 'Accept the money and process the application quickly',
                correct: false,
                feedback: '❌ INCORRECT: Accepting a bribe is illegal and unethical. You risk dismissal, prosecution, and imprisonment under the Corrupt Practices Act.',
                consequence: 'You are reported by a colleague and face disciplinary action.',
                points: -10
              },
              {
                id: 'b',
                text: 'Refuse the bribe and process the application according to standard procedure',
                correct: true,
                feedback: '✅ CORRECT: This is the right action. Refuse any inducement, follow due process, and document the attempted bribery.',
                consequence: 'You maintain your integrity and set a positive example for others.',
                points: 10
              },
              {
                id: 'c',
                text: 'Ignore the offer and continue processing without reporting',
                correct: false,
                feedback: '⚠️ PARTIALLY CORRECT: While you did not accept the bribe, failing to report the attempt is a violation of anti-corruption policy.',
                consequence: 'The applicant tries to bribe another officer.',
                points: -3
              },
              {
                id: 'd',
                text: 'Tell the applicant to come back after office hours',
                correct: false,
                feedback: '❌ INCORRECT: This creates suspicion and may be seen as soliciting a bribe. Always maintain transparency.',
                consequence: 'You are placed under investigation for improper conduct.',
                points: -8
              }
            ]
          },
          {
            id: 'immigration-border-1',
            title: 'Suspicious Traveler at Border',
            videoUrl: 'https://www.youtube.com/embed/lwfijBPReoY',
            videoThumbnail: '🎥',
            situation: 'At a border post, a traveler presents a passport with signs of tampering. They become agitated and offer you a "gift" to let them pass without further checks.',
            options: [
              {
                id: 'a',
                text: 'Accept the gift and allow passage',
                correct: false,
                feedback: '❌ INCORRECT: Accepting gifts in exchange for official action is bribery and a serious offense.',
                consequence: 'You are caught in a sting operation and arrested.',
                points: -10
              },
              {
                id: 'b',
                text: 'Refuse the gift, detain the traveler, and follow protocol for document verification',
                correct: true,
                feedback: '✅ CORRECT: Detain the traveler, verify the document, and report the incident to your supervisor and security agencies.',
                consequence: 'You prevent a potential security breach and uphold the law.',
                points: 10
              },
              {
                id: 'c',
                text: 'Let the traveler go to avoid confrontation',
                correct: false,
                feedback: '❌ INCORRECT: Allowing passage without proper checks endangers national security.',
                consequence: 'The traveler is later found to be on a watchlist.',
                points: -8
              },
              {
                id: 'd',
                text: 'Confiscate the passport but do not report the incident',
                correct: false,
                feedback: '⚠️ PARTIALLY CORRECT: Confiscating the document is right, but you must also report and document the incident.',
                consequence: 'The incident is not properly recorded, leading to accountability issues.',
                points: -5
              }
            ]
          },
          {
            id: 'immigration-data-1',
            title: 'Data Privacy Violation',
            videoUrl: 'https://www.youtube.com/embed/lwfijBPReoY',
            videoThumbnail: '🎥',
            situation: 'A friend asks you to check the immigration records of someone they are suspicious about, offering you a small token of appreciation.',
            options: [
              {
                id: 'a',
                text: 'Access and share the information as a favor',
                correct: false,
                feedback: '❌ INCORRECT: Sharing confidential data without authorization is illegal and a breach of privacy laws.',
                consequence: 'You are disciplined for violating data protection regulations.',
                points: -10
              },
              {
                id: 'b',
                text: 'Refuse the request and explain the importance of data privacy',
                correct: true,
                feedback: '✅ CORRECT: You must protect confidential records and refuse any unauthorized request.',
                consequence: 'You uphold professional standards and avoid legal trouble.',
                points: 10
              },
              {
                id: 'c',
                text: 'Check the records but do not share any information',
                correct: false,
                feedback: '❌ INCORRECT: Accessing records without official reason is still a violation.',
                consequence: 'Your access is logged and you are questioned by IT security.',
                points: -5
              },
              {
                id: 'd',
                text: 'Tell your friend you will try but do nothing',
                correct: false,
                feedback: '⚠️ INCORRECT: Even implying willingness to break the rules is unethical.',
                consequence: 'Your friend pressures you again, putting you in a difficult position.',
                points: -3
              }
            ]
          }
        ],
        quiz: [
          {
            id: 'q1',
            question: 'What is the correct procedure if an applicant offers a bribe for faster passport processing?',
            options: [
              { id: 'a', text: 'Accept and process quickly', correct: false },
              { id: 'b', text: 'Refuse, process normally, and report the attempt', correct: true },
              { id: 'c', text: 'Ignore and continue', correct: false },
              { id: 'd', text: 'Tell them to come back later', correct: false }
            ]
          },
          {
            id: 'q2',
            question: 'Which law governs the issuance of Nigerian passports?',
            options: [
              { id: 'a', text: 'Nigerian Customs Service Act', correct: false },
              { id: 'b', text: 'Passport (Miscellaneous Provisions) Act', correct: true },
              { id: 'c', text: 'Public Procurement Act', correct: false },
              { id: 'd', text: 'Criminal Code Act', correct: false }
            ]
          },
          {
            id: 'q3',
            question: 'What should you do if you suspect a traveler\'s passport is fake at a border post?',
            options: [
              { id: 'a', text: 'Let them go if they offer a gift', correct: false },
              { id: 'b', text: 'Detain the traveler, verify the document, and report', correct: true },
              { id: 'c', text: 'Confiscate the passport and ignore the rest', correct: false },
              { id: 'd', text: 'Allow passage to avoid confrontation', correct: false }
            ]
          },
          {
            id: 'q4',
            question: 'Is it ever acceptable to access immigration records for personal reasons?',
            options: [
              { id: 'a', text: 'Yes, if a friend asks', correct: false },
              { id: 'b', text: 'No, it is a violation of data privacy laws', correct: true },
              { id: 'c', text: 'Yes, if you do not share the information', correct: false },
              { id: 'd', text: 'Yes, if you are curious', correct: false }
            ]
          },
          {
            id: 'q5',
            question: 'Which of the following is NOT a best practice for customs and immigration officers?',
            options: [
              { id: 'a', text: 'Accepting gifts from applicants', correct: true },
              { id: 'b', text: 'Verifying document authenticity', correct: false },
              { id: 'c', text: 'Reporting suspicious activity', correct: false },
              { id: 'd', text: 'Respecting applicant rights', correct: false }
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
    setIsAuthenticated(false);
    setUserName('');
    setUserEmail('');
    setUserProfile(null);
    setView('landing');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
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
            <p className="text-2xl text-blue-300 mb-8">
              Compliance Training Platform
            </p>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Master compliance and ethical practices in your workplace and daily life
            </p>
            
            <div className="flex gap-4 justify-center mb-16">
              <button 
                onClick={() => setView('auth')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
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

          {/* Main Feature Cards - 6 Key Features */}
          <div className="max-w-7xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-blue-500/30 hover:border-blue-400/60 transition-all duration-300">
                <div className="text-4xl mb-3">📚</div>
                <h4 className="text-lg font-bold text-white mb-3">Nigerian Laws & Regulations</h4>
                <p className="text-gray-300 text-sm">
                  ICPC Act, Criminal Code, and sector-specific regulations explained clearly
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-purple-500/30 hover:border-purple-400/60 transition-all duration-300">
                <div className="text-4xl mb-3">🎭</div>
                <h4 className="text-lg font-bold text-white mb-3">50+ Real Scenarios</h4>
                <p className="text-gray-300 text-sm">
                  Practice with actual ethical dilemmas from Nigerian workplaces
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-pink-900/40 to-pink-800/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-pink-500/30 hover:border-pink-400/60 transition-all duration-300">
                <div className="text-4xl mb-3">🎥</div>
                <h4 className="text-lg font-bold text-white mb-3">Video Training</h4>
                <p className="text-gray-300 text-sm">
                  Sector-specific video lessons tailored to your role
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300">
                <div className="text-4xl mb-3">🔊</div>
                <h4 className="text-lg font-bold text-white mb-3">Audio Narration</h4>
                <p className="text-gray-300 text-sm">
                  Listen to lessons while multitasking with text-to-speech
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-indigo-500/30 hover:border-indigo-400/60 transition-all duration-300">
                <div className="text-4xl mb-3">🏆</div>
                <h4 className="text-lg font-bold text-white mb-3">AI Career Recommendations</h4>
                <p className="text-gray-300 text-sm">
                  Get personalized career path suggestions based on your training
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-900/40 to-teal-800/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-teal-500/30 hover:border-teal-400/60 transition-all duration-300">
                <div className="text-4xl mb-3">�</div>
                <h4 className="text-lg font-bold text-white mb-3">Progress Tracking</h4>
                <p className="text-gray-300 text-sm">
                  Track completed courses, achievements, and learning milestones
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="max-w-7xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              How DragNet Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl text-white font-bold">1</span>
                </div>
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-white mb-2">Sign Up</h3>
                <p className="text-gray-400">
                  Create your account and tell us about your sector and role
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl text-white font-bold">2</span>
                </div>
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-bold text-white mb-2">Get Your Plan</h3>
                <p className="text-gray-400">
                  AI analyzes your profile and creates personalized training
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-pink-500 to-pink-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl text-white font-bold">3</span>
                </div>
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-bold text-white mb-2">Learn by Doing</h3>
                <p className="text-gray-400">
                  Practice with interactive scenarios and real case studies
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-green-500 to-green-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl text-white font-bold">4</span>
                </div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-white mb-2">Track & Grow</h3>
                <p className="text-gray-400">
                  Earn achievements and get career recommendations
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="max-w-7xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm p-10 rounded-2xl border-2 border-purple-500/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-5xl font-bold text-blue-400 mb-2">10+</div>
                  <p className="text-xl text-gray-300">Compliance Courses</p>
                  <p className="text-sm text-gray-400 mt-2">Covering all major sectors</p>
                </div>
                <div>
                  <div className="text-5xl font-bold text-purple-400 mb-2">50+</div>
                  <p className="text-xl text-gray-300">Real-World Scenarios</p>
                  <p className="text-sm text-gray-400 mt-2">Practice ethical decision-making</p>
                </div>
                <div>
                  <div className="text-5xl font-bold text-pink-400 mb-2">100%</div>
                  <p className="text-xl text-gray-300">Personalized</p>
                  <p className="text-sm text-gray-400 mt-2">Customized training plans</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-7xl mx-auto mb-16">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm p-12 rounded-3xl border-2 border-blue-500/30">
                <div className="text-6xl mb-6">🚀</div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Ready to Build Your Compliance Knowledge?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of Nigerian professionals strengthening their ethical decision-making skills
                </p>
                <button 
                  onClick={() => setView('auth')}
                  className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-xl transition-all duration-200 shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105"
                >
                  Start Learning Today →
                </button>
                <p className="text-gray-400 mt-6">
                  No credit card required • Get started in 2 minutes
                </p>
              </div>
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
                  disabled={authLoading}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? '⏳ Processing...' : (authMode === 'signin' ? 'Sign In' : 'Create Account')}
                </button>

                {authError && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-300 text-sm">{authError}</p>
                  </div>
                )}
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {authMode === 'signin' 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Sign in'}
                </button>
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
                Select your sector and role. We'll automatically assign the right compliance training, policies, and assessments for your position.
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
                    🚀 Analyze My Role & Get Training Plan
                  </button>
                  <p className="text-center text-gray-400 text-sm mt-4">
                    We'll analyze your role and assign personalized compliance courses
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
                <div className="text-6xl mb-4 animate-pulse">🧠</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Analyzing Your Profile, {userName}...
                </h2>
                <p className="text-gray-300">
                  Creating a personalized training plan based on your role as {selectedRole}
                </p>
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
        <div className="p-3 sm:p-6 md:p-8">
          {/* Clean Mobile Header */}
          <nav className="mb-6 sm:mb-8 bg-gray-800/50 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-gray-700">
            {/* Top Row: Profile Info */}
            <div className="flex items-center justify-between mb-3 sm:mb-0">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <button 
                  onClick={() => setView('profile')}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-lg sm:text-xl transition-all shadow-md hover:shadow-lg touch-manipulation"
                  aria-label="View profile"
                >
                  �
                </button>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-xl font-bold text-white truncate">
                    Welcome, {userProfile?.name || userName}
                  </h2>
                  {userProfile && (
                    <p className="text-xs sm:text-sm text-gray-400 truncate">
                      {userProfile.role}
                    </p>
                  )}
                </div>
              </div>
              {/* Desktop buttons */}
              <div className="hidden sm:flex gap-2">
                <button 
                  onClick={() => setView('landing')}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all font-medium text-sm"
                >
                  ← Home
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
            
            {/* Mobile Only: Bottom Row Buttons */}
            <div className="flex sm:hidden gap-2 mt-3">
              <button 
                onClick={() => setView('landing')}
                className="flex-1 px-3 py-2.5 bg-gray-700 active:bg-gray-600 text-white rounded-lg font-medium text-sm touch-manipulation"
              >
                Home
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 px-3 py-2.5 bg-red-600 active:bg-red-700 text-white rounded-lg font-medium text-sm touch-manipulation"
              >
                Logout
              </button>
            </div>
          </nav>

          {/* Clean Welcome Message - Mobile Friendly */}
          {userProfile && (
            <div className="max-w-7xl mx-auto mb-4 bg-blue-600/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-white mb-1">
                Training Plan Ready
              </h3>
              <p className="text-xs sm:text-sm text-blue-200">
                {userProfile.courses.length} compliance modules assigned for your role
              </p>
            </div>
          )}

          {/* Risk Level Alert - Simplified for Mobile */}
          {userProfile && userProfile.riskLevel === 'high' && (
            <div className="max-w-7xl mx-auto mb-4 bg-red-600/10 border border-red-500/30 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">⚠️</span>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-white">High-Risk Position</h3>
                  <p className="text-xs sm:text-sm text-red-200 mt-0.5">
                    Enhanced training required
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Stats Cards - Clean Mobile Design */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 max-w-7xl mx-auto mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 sm:p-5 rounded-lg shadow-lg">
              <p className="text-xs sm:text-sm text-blue-100 mb-1">Progress</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {userProfile ? Math.round((completedCourses.length / userProfile.courses.length) * 100) : 0}%
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-600 to-green-700 p-3 sm:p-5 rounded-lg shadow-lg">
              <p className="text-xs sm:text-sm text-green-100 mb-1">Assigned</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">{userProfile?.courses.length || 0}</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-3 sm:p-5 rounded-lg shadow-lg">
              <p className="text-xs sm:text-sm text-orange-100 mb-1">Completed</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">{completedCourses.length}</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-3 sm:p-5 rounded-lg shadow-lg">
              <p className="text-xs sm:text-sm text-purple-100 mb-1">Risk Level</p>
              <p className="text-xl sm:text-2xl font-bold text-white uppercase">{userProfile?.riskLevel || 'N/A'}</p>
            </div>
          </div>
          
          {/* Completed Courses Section - Simplified */}
          {completedCourses.length > 0 && (
            <div className="mt-6 sm:mt-8 max-w-7xl mx-auto">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span>✓</span> Completed Courses
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {completedCourses.map((completed, idx) => (
                  <div key={idx} className="bg-green-600/10 border border-green-500/30 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-lg flex-shrink-0">✓</span>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm sm:text-base font-semibold text-white break-words">{completed.courseName}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{completed.completedDate}</p>
                      </div>
                    </div>
                    <div className="bg-green-900/20 p-2 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base text-green-300 font-semibold">Final Score:</span>
                        <span className="text-xl sm:text-2xl font-bold text-green-400">{completed.score}%</span>
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

          <div className="mt-6 sm:mt-8 max-w-7xl mx-auto">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
              Your Training Modules
            </h3>
            {userProfile && userProfile.courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {userProfile.courses.map((course) => (
                  <div 
                    key={course.id}
                    className="bg-gray-800/70 border border-gray-700 hover:border-blue-500 p-3 sm:p-5 rounded-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h4 className="text-base sm:text-lg font-semibold text-white break-words flex-1">
                        {course.title}
                      </h4>
                      {course.risk === 'high' && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs font-medium rounded whitespace-nowrap">
                          HIGH RISK
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 mb-3 line-clamp-2">{course.description}</p>
                    
                    {/* Simplified scenarios list for mobile */}
                    {course.scenarios && course.scenarios.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-blue-400 font-medium mb-1.5">
                          {course.scenarios.length} Interactive Scenarios
                        </p>
                      </div>
                    )}
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all" 
                        style={{width: `${course.progress}%`}}
                      ></div>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-xs text-gray-400">{course.progress}% Complete</p>
                      <button 
                        onClick={() => {
                          setCurrentCourse(course);
                          setView('course');
                        }}
                        className={`px-3 sm:px-4 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-medium transition-all touch-manipulation ${
                          course.progress === 100 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {course.progress === 100 ? 'Review' : 'Start'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p className="text-sm sm:text-base">No courses assigned yet</p>
              </div>
            )}
          </div>
        </div>
      ) : view === 'course' ? (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
          {/* Skip to main content link for accessibility */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          {/* Progress Indicator */}
          {currentCourse && !currentScenario && (
            <div className="mb-4 sm:mb-6 bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700" role="navigation" aria-label="Learning progress">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-300">Learning Progress</h2>
                <span className="text-xs text-gray-400">Step {['video', 'scenarios', 'keyPoints', 'laws', 'assessment'].indexOf(currentStep) + 1} of 5</span>
              </div>
              <div className="flex gap-1 sm:gap-2">
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
              <div className="hidden sm:flex justify-between mt-2 text-xs text-gray-400">
                <span>📹 Video</span>
                <span>🎭 Scenarios</span>
                <span>💡 Key Points</span>
                <span>⚖️ Laws</span>
                <span>✅ Assessment</span>
              </div>
            </div>
          )}

          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <button 
              onClick={() => {
                setView('dashboard');
                setCurrentCourse(null);
                setCurrentScenario(null);
                setScenarioResult(null);
                setCurrentStep('video');
              }}
              className="px-4 py-2 min-h-[44px] bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white text-sm sm:text-base rounded-lg transition-smooth touch-manipulation w-full sm:w-auto"
              aria-label="Return to dashboard"
            >
              ← Back to Dashboard
            </button>
            {currentCourse && currentCourse.risk === 'high' && (
              <span className="px-3 py-1 bg-red-500/20 text-red-300 text-xs sm:text-sm font-semibold rounded whitespace-nowrap" role="status">
                🔥 HIGH RISK MODULE
              </span>
            )}
          </div>

          {currentCourse && !currentScenario && (
            <div className="space-y-4 sm:space-y-6">
              {/* Course Header with Visual */}
              <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-4 sm:p-6 md:p-8 rounded-2xl text-white overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full -ml-16 sm:-ml-24 -mb-16 sm:-mb-24"></div>
                
                <div className="relative z-10 flex items-start gap-3 sm:gap-4 md:gap-6">
                  {/* Course Icon/Illustration */}
                  <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl md:text-5xl backdrop-blur-sm border-2 border-white/30">
                    {currentCourse.id === 1 ? '🚫' : currentCourse.id === 2 ? '🛡️' : currentCourse.id === 3 ? '⚖️' : '🔍'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">{currentCourse.title}</h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 mb-3 sm:mb-4">{currentCourse.description}</p>
                    <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
                      <span className="px-2 sm:px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm whitespace-nowrap">⏱️ {currentCourse.duration}</span>
                      <span className="px-2 sm:px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm whitespace-nowrap">📊 {currentCourse.progress}% Complete</span>
                      <span className="px-2 sm:px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm whitespace-nowrap">🎯 {currentCourse.scenarios?.length || 0} Scenarios</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. VIDEO TRAINING - First Section */}
              <div id="video-section" className="relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 p-4 sm:p-6 md:p-8 rounded-xl overflow-hidden scroll-mt-4">
                
                <div className="absolute top-0 left-0 text-6xl sm:text-9xl opacity-10">🎥</div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/30 rounded-lg flex items-center justify-center text-xl sm:text-2xl">
                      🎥
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">Step 1: Video Training</h2>
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs font-bold rounded sm:hidden">REQUIRED</span>
                      </div>
                      <p className="text-xs sm:text-sm text-purple-300">Watch this first before continuing</p>
                    </div>
                  </div>
                  
                  <div className="bg-purple-900/20 p-4 rounded-lg mb-6 border-l-4 border-purple-500">
                    <p className="text-gray-300">
                      📺 Watch this comprehensive training video to understand the key concepts and real-world applications.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-3 sm:p-4 md:p-6 rounded-xl border-2 border-purple-600/30">
                    <div className="aspect-video w-full min-h-[200px] sm:min-h-[300px] md:min-h-[400px] bg-black rounded-lg overflow-hidden shadow-2xl mb-4">
                      <iframe
                        className="w-full h-full"
                        src={
                          userProfile?.sector === 'police' ? 'https://www.youtube.com/embed/eeM1Ga76bA4' :
                          userProfile?.sector === 'civil' ? 'https://www.youtube.com/embed/3ilFN6NaHVk' :
                          userProfile?.sector === 'immigration' ? 'https://www.youtube.com/embed/lwfijBPReoY' :
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
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full">
                        🏅 Essential Knowledge
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. INTERACTIVE SCENARIO SIMULATIONS - Second Section */}
              {currentCourse.scenarios && currentCourse.scenarios.length > 0 && (
                <div className="relative bg-gradient-to-br from-orange-600/20 to-red-600/20 border-2 border-orange-500/50 p-4 sm:p-6 md:p-8 rounded-xl overflow-hidden">
                  <div className="absolute top-0 right-0 text-6xl sm:text-9xl opacity-10">🎭</div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/30 rounded-lg flex items-center justify-center text-xl sm:text-2xl">
                        🎭
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-2xl font-bold text-white">Step 2: Interactive Scenarios</h2>
                        <p className="text-xs sm:text-sm text-orange-300">Practice with real-world situations</p>
                      </div>
                    </div>
                    
                    <div className="bg-orange-900/20 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 border-l-4 border-orange-500">
                      <p className="text-sm sm:text-base text-gray-300">
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
                            setHasReadScenario(false);
                            setCurrentStep('scenarios');
                          }}
                          className="w-full p-4 sm:p-5 md:p-6 min-h-[88px] bg-gray-800/80 hover:bg-gray-700 active:bg-gray-600 border-2 border-gray-600 hover:border-orange-500 rounded-xl text-left transition-smooth group relative overflow-hidden animate-fadeIn touch-manipulation"
                          style={{ animationDelay: `${idx * 0.1}s` }}
                          aria-label={`Practice scenario ${idx + 1}: ${scenario.title}`}
                        >
                          {/* Animated hover effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          
                          <div className="relative flex items-center gap-3 sm:gap-4">
                            <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                              {idx === 0 ? '🚦' : idx === 1 ? '🔍' : '📋'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white group-hover:text-orange-400 transition-colors mb-1">
                                Scenario {idx + 1}: {scenario.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-400">🎮 Click to begin interactive simulation</p>
                            </div>
                            <div className="flex-shrink-0 text-2xl sm:text-3xl group-hover:translate-x-2 transition-transform">
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
                <div ref={keyLearningRef} className="relative bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl border-2 border-blue-700/50 overflow-hidden animate-fadeIn" id="main-content">
                  <div className="absolute bottom-0 right-0 text-6xl sm:text-9xl opacity-10" aria-hidden="true">🎯</div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/30 rounded-lg flex items-center justify-center text-xl sm:text-2xl" aria-hidden="true">
                        🎯
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-2xl font-bold text-white">Step 3: Key Learning Points</h2>
                        <p className="text-xs sm:text-sm text-blue-300">Review essential takeaways</p>
                      </div>
                    </div>
                    <div className="bg-blue-900/20 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 border-l-4 border-blue-500" role="status" aria-live="polite">
                      <p className="text-sm sm:text-base text-gray-300">
                        📝 Click on each learning point to review before taking the assessment. ({clickedLearningPoints.length}/{currentCourse.content.keyPoints.length} reviewed)
                      </p>
                    </div>
                    <div className="grid gap-4" role="list" aria-label="Key learning points">
                      {currentCourse.content.keyPoints.map((point, idx) => {
                        const isClicked = clickedLearningPoints.includes(idx);
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              if (!isClicked) {
                                setClickedLearningPoints([...clickedLearningPoints, idx]);
                                if (clickedLearningPoints.length + 1 === currentCourse.content.keyPoints.length) {
                                  setCurrentStep('laws');
                                }
                              }
                            }}
                            className={`flex items-start gap-3 sm:gap-4 p-4 sm:p-5 min-h-[72px] rounded-lg border-2 transition-smooth text-left animate-fadeIn touch-manipulation ${
                              isClicked
                                ? 'bg-green-600/20 border-green-500 cursor-default'
                                : 'bg-gray-800/60 border-gray-700/50 hover:border-blue-500 active:border-blue-400 hover:bg-gray-800 active:bg-gray-700 cursor-pointer'
                            }`}
                            style={{ animationDelay: `${idx * 0.05}s` }}
                            aria-label={`Learning point ${idx + 1}: ${point}`}
                            aria-pressed={isClicked}
                            role="listitem"
                          >
                            <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base transition-all ${
                              isClicked
                                ? 'bg-green-500'
                                : 'bg-gradient-to-br from-blue-500 to-purple-500'
                            }`}>
                              {isClicked ? '✓' : idx + 1}
                            </div>
                            <span className={`text-base sm:text-lg leading-relaxed ${
                              isClicked ? 'text-green-300' : 'text-gray-300'
                            }`}>{point}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAKE ASSESSMENT BUTTON - Shows after all key points clicked */}
              {showKeyLearning && clickedLearningPoints.length === currentCourse.content.keyPoints.length && (
                <div className="flex justify-center pt-6 animate-fadeIn">
                  <button
                    onClick={() => {
                      setShowQuiz(true);
                      setQuizAnswers({});
                      setQuizResult(null);
                      setCurrentStep('assessment');
                    }}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 min-h-[52px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:from-green-800 active:to-emerald-800 text-white rounded-xl font-semibold text-base sm:text-lg transition-smooth shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100 animate-pulse touch-manipulation"
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
            <div className="space-y-4 sm:space-y-6">
              <div className="relative bg-gradient-to-br from-green-600 to-emerald-600 p-4 sm:p-6 md:p-8 rounded-2xl text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full -mr-16 sm:-mr-24 -mt-16 sm:-mt-24"></div>
                <div className="relative z-10 flex items-center gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl backdrop-blur-sm border-2 border-white/30">
                    📝
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Step 5: Final Assessment</h1>
                    <p className="text-sm sm:text-base md:text-lg text-green-100">Answer all 5 questions • Pass Mark: 80% (4/5 correct)</p>
                  </div>
                </div>
              </div>

              {currentCourse.quiz && currentCourse.quiz.map((question, qIdx) => (
                <div key={question.id} className="bg-gray-800/80 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl border-2 border-gray-700">
                  <div className="flex items-start gap-3 sm:gap-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
                      {qIdx + 1}
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white leading-snug">{question.question}</h3>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 ml-0 sm:ml-14">
                    {question.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setQuizAnswers({...quizAnswers, [question.id]: option.id})}
                        className={`w-full p-3 sm:p-4 min-h-[56px] text-left rounded-lg border-2 transition-all touch-manipulation ${
                          quizAnswers[question.id] === option.id
                            ? 'bg-green-600/20 border-green-500 shadow-lg'
                            : 'bg-gray-700/50 border-gray-600 hover:border-gray-500 active:border-gray-400 hover:bg-gray-700 active:bg-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            quizAnswers[question.id] === option.id
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-500'
                          }`}>
                            {quizAnswers[question.id] === option.id && <span className="text-white text-sm">✓</span>}
                          </div>
                          <span className="text-white text-sm sm:text-base leading-relaxed">{option.text}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    setShowQuiz(false);
                    setQuizAnswers({});
                    setShowKeyLearning(true);
                    setCurrentStep('laws');
                    // Scroll to Key Learning Points section
                    setTimeout(() => {
                      keyLearningRef.current?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                      });
                    }, 100);
                  }}
                  className="w-full sm:w-auto px-5 sm:px-6 py-3 min-h-[48px] bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg font-semibold transition-all touch-manipulation"
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
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 min-h-[48px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:from-green-800 active:to-emerald-800 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
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
                      setShowKeyLearning(true);
                      setCurrentStep('keyPoints');
                      // Scroll to Key Learning Points section
                      setTimeout(() => {
                        keyLearningRef.current?.scrollIntoView({ 
                          behavior: 'smooth', 
                          block: 'start' 
                        });
                      }, 100);
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
            <div className="space-y-4 sm:space-y-6">
              <div className="relative bg-gradient-to-br from-orange-600 to-red-600 p-4 sm:p-6 md:p-8 rounded-2xl text-white overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full -mr-16 sm:-mr-24 -mt-16 sm:-mt-24"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -ml-12 sm:-ml-16 -mb-12 sm:-mb-16"></div>
                
                <div className="relative z-10 flex items-center gap-3 sm:gap-4 md:gap-6">
                  {/* Scenario Icon */}
                  <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl backdrop-blur-sm border-2 border-white/30 animate-pulse">
                    🎭
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{currentScenario.title}</h1>
                    <p className="text-sm sm:text-base md:text-lg text-orange-100">🎮 Interactive Ethical Dilemma Simulation</p>
                  </div>
                </div>
              </div>

              {/* Scenario Video (if available) */}
              {currentScenario && currentScenario.videoUrl && (
                <div className="relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 p-3 sm:p-4 md:p-6 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/30 rounded-lg flex items-center justify-center text-lg sm:text-xl">
                      🎥
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">Scenario Context Video</h3>
                      <p className="text-xs sm:text-sm text-purple-300">Watch for background context</p>
                    </div>
                  </div>
                  <div className="aspect-video w-full min-h-[180px] sm:min-h-[250px] md:min-h-[350px] bg-black rounded-lg overflow-hidden shadow-xl">
                    <iframe
                      className="w-full h-full"
                      src={currentScenario.videoUrl}
                      title={`${currentScenario.title} - Context Video`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Cartoon Illustration Section */}
              <div className="relative bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl border-2 border-indigo-500/50 overflow-hidden">
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
                    <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg border-2 border-white/20 relative">
                      <div className="absolute -top-3 left-4 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 rounded-full text-xs font-bold text-gray-900">
                        💭 SCENARIO STORY
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 mb-2 italic mt-2 sm:mt-0">You are in this situation...</p>
                      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-3 sm:p-4 md:p-5 rounded-lg border-l-4 border-orange-500">
                        <p className="text-white text-base sm:text-lg leading-relaxed">
                          {currentScenario.situation}
                        </p>
                      </div>
                      
                      {/* Narration Button */}
                      <div className="mt-3 sm:mt-4 flex flex-col items-center gap-2">
                        <button
                          onClick={() => toggleNarration(currentScenario.situation)}
                          className={`px-4 sm:px-6 py-2 sm:py-3 min-h-[48px] rounded-lg font-semibold text-white transition-smooth shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100 flex items-center gap-2 text-sm sm:text-base touch-manipulation ${
                            isNarrating 
                              ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 animate-pulse' 
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                          }`}
                          aria-label={isNarrating ? 'Stop narration' : 'Listen to narration'}
                          aria-pressed={isNarrating}
                          title={isNarrating ? 'Stop narration' : 'Listen to scenario narration'}
                        >
                          {isNarrating ? (
                            <>
                              <span className="text-xl" aria-hidden="true">⏸️</span>
                              <span>Stop Narration</span>
                            </>
                          ) : (
                            <>
                              <span className="text-xl" aria-hidden="true">🎙️</span>
                              <span>Listen to Scenario</span>
                            </>
                          )}
                        </button>
                        <p className="text-xs text-gray-400 italic">Click to hear the scenario read aloud</p>
                        
                        {/* Error Message */}
                        {narrationError && (
                          <div className="mt-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg max-w-md">
                            <p className="text-red-300 text-sm flex items-center gap-2">
                              <span className="text-xl">⚠️</span>
                              <span>{narrationError}</span>
                            </p>
                          </div>
                        )}
                      </div>
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

              {/* Continue Button - Shows before options */}
              {!hasReadScenario && !scenarioResult && (
                <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl border-2 border-blue-500/50 text-center animate-fadeIn">
                  <div className="mb-4 sm:mb-6">
                    <p className="text-lg sm:text-xl text-white mb-2">📖 Take your time to read and understand the scenario above</p>
                    <p className="text-sm sm:text-base text-gray-300">Think carefully about the ethical implications before making your choice</p>
                  </div>
                  <button
                    onClick={() => setHasReadScenario(true)}
                    className="px-6 sm:px-8 py-3 sm:py-4 min-h-[56px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:from-green-800 active:to-emerald-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100 transition-smooth flex items-center gap-2 sm:gap-3 mx-auto text-base sm:text-lg touch-manipulation"
                    aria-label="Continue to answer options"
                  >
                    <span className="text-xl sm:text-2xl">✅</span>
                    <span className="whitespace-nowrap sm:whitespace-normal">I've Read the Scenario - Show Options</span>
                    <span className="text-xl sm:text-2xl">➡️</span>
                  </button>
                </div>
              )}

              {hasReadScenario && !scenarioResult ? (
                <div className="bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl border-2 border-gray-700 animate-fadeIn">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">🤔 What would you do? Select your response:</h2>
                  <div className="space-y-3 sm:space-y-4">
                    {currentScenario.options.map((option, index) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setScenarioAnswer(option.id);
                          setScenarioResult(option);
                          setShowAnimation(true);
                        }}
                        className={`w-full p-4 sm:p-5 md:p-6 min-h-[80px] text-left rounded-xl border-2 transition-smooth animate-fadeIn touch-manipulation ${
                          scenarioAnswer === option.id
                            ? 'bg-blue-600/20 border-blue-500 shadow-lg animate-pulse'
                            : 'bg-gray-700/50 border-gray-600 hover:border-gray-500 active:border-gray-400 hover:bg-gray-700 active:bg-gray-600'
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        aria-label={`Option ${option.id.toUpperCase()}: ${option.text}`}
                        aria-pressed={scenarioAnswer === option.id}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div 
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0"
                            aria-hidden="true"
                          >
                            {option.id.toUpperCase()}
                          </div>
                          <p className="text-white text-base sm:text-lg leading-relaxed">{option.text}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {scenarioResult && (
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

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                    <button
                      onClick={() => {
                        setCurrentScenario(null);
                        setScenarioAnswer('');
                        setScenarioResult(null);
                        setHasReadScenario(false);
                        setScenarioBranch([]);
                        setShowKeyLearning(true);
                        setCurrentStep('keyPoints');
                        // Scroll to Key Learning Points section
                        setTimeout(() => {
                          keyLearningRef.current?.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                          });
                        }, 100);
                      }}
                      className="w-full sm:w-auto px-5 sm:px-6 py-3 min-h-[48px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg font-semibold transition-smooth touch-manipulation"
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
                            setHasReadScenario(false);
                          }}
                          className="w-full sm:w-auto px-5 sm:px-6 py-3 min-h-[48px] bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-lg font-semibold transition-all touch-manipulation"
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
                            setCurrentStep('keyPoints');
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
      ) : view === 'profile' ? (
        <div className="min-h-screen p-8">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
                  �
                </div>
                <h1 className="text-4xl font-bold text-white">My Profile</h1>
              </div>
              <button 
                onClick={() => setView('dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all font-semibold shadow-lg"
              >
                ← Back to Dashboard
              </button>
            </div>

            {/* Profile Information Card */}
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm p-8 rounded-2xl border-2 border-purple-500/30 mb-8 shadow-xl">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-5xl shadow-lg">
                  �
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">{userName || 'User'}</h2>
                  <p className="text-blue-300 text-lg mb-4">{userEmail || 'No email provided'}</p>
                  {userProfile ? (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-gray-400 text-sm">Sector</p>
                        <p className="text-white font-semibold">{selectedSector}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Role</p>
                        <p className="text-white font-semibold">{userProfile.role}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Department</p>
                        <p className="text-white font-semibold">{userProfile.department}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Rank</p>
                        <p className="text-white font-semibold">{userProfile.rank}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm mt-4">Loading profile information...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-sm p-6 rounded-2xl border-2 border-green-500/30">
                <div className="text-4xl mb-2">🎓</div>
                <p className="text-gray-400 text-sm">Completed Courses</p>
                <p className="text-3xl font-bold text-white">{completedCourses.length}</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-sm p-6 rounded-2xl border-2 border-blue-500/30">
                <div className="text-4xl mb-2">⭐</div>
                <p className="text-gray-400 text-sm">Achievement Level</p>
                <p className="text-2xl font-bold text-white">
                  {completedCourses.length === 0 ? 'Beginner' : 
                   completedCourses.length < 3 ? 'Intermediate' : 
                   completedCourses.length < 5 ? 'Advanced' : 'Expert'}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm p-6 rounded-2xl border-2 border-purple-500/30">
                <div className="text-4xl mb-2">🔥</div>
                <p className="text-gray-400 text-sm">Total Modules</p>
                <p className="text-3xl font-bold text-white">{userProfile?.courses?.length || 0}</p>
              </div>
            </div>

            {/* Completed Courses */}
            {completedCourses.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border-2 border-gray-700 mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">📚 Completed Courses</h3>
                <div className="space-y-4">
                  {completedCourses.map((course, index) => (
                    <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{course.title}</h4>
                          <p className="text-gray-400 text-sm">Completed on {course.completedDate}</p>
                        </div>
                        <div className="text-green-400 text-2xl">✓</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Career Recommendations */}
            {userProfile && completedCourses.length > 0 && (() => {
              const recommendations = generateCareerRecommendations();
              return (
                <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm p-8 rounded-2xl border-2 border-purple-500/30">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">🤖</span>
                    <h3 className="text-2xl font-bold text-white">AI Career Recommendations</h3>
                  </div>
                  
                  {recommendations.recommendations.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-purple-300 mb-3">📈 Recommended Career Paths</h4>
                      <ul className="space-y-2">
                        {recommendations.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <span className="text-purple-400">●</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recommendations.strengths.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-blue-300 mb-3">💪 Your Strengths</h4>
                      <ul className="space-y-2">
                        {recommendations.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <span className="text-blue-400">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recommendations.suitability.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-green-300 mb-3">🎯 Well-Suited For</h4>
                      <ul className="space-y-2">
                        {recommendations.suitability.map((suit, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <span className="text-green-400">→</span>
                            <span>{suit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}

            {completedCourses.length === 0 && (
              <div className="bg-gray-800/30 backdrop-blur-sm p-12 rounded-2xl border-2 border-gray-700 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Courses Completed Yet</h3>
                <p className="text-gray-400 mb-6">Start learning to unlock career recommendations and achievements!</p>
                <button
                  onClick={() => setView('dashboard')}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                >
                  Go to Dashboard →
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
