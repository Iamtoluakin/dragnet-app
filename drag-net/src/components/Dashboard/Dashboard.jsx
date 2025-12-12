import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DragCard } from '../DragCard';
import { CourseCard } from '../CourseCard';
import { PrimaryButton } from '../PrimaryButton';
import { SecondaryButton } from '../SecondaryButton';

function getModules({ sector, role }) {
  // Mock AI assignment logic
  if (sector === 'Police') {
    if (role === 'Traffic Officer') {
      return [
        'Anti-bribery compliance',
        'Use of force policy',
        'Roadside conduct rules',
        'Human rights module',
        'Quarterly scenario test on checkpoints'
      ];
    }
    return [
      'Police code of conduct',
      'Human rights module',
      'Quarterly scenario test',
      'Bribery awareness'
    ];
  }
  if (sector === 'Civil Service') {
    if (role === 'Procurement Officer') {
      return [
        'Procurement Act compliance',
        'Conflict of interest declaration',
        'Financial transparency rules',
        'Document integrity module',
        'Fraud detection quiz'
      ];
    }
    return [
      'Public sector rules',
      'Financial Conduct Code',
      'Data Protection Policy',
      'Workplace ethics'
    ];
  }
  if (sector === 'Student') {
    return [
      'Exam malpractice regulations',
      'Social media ethics',
      'Anti-bullying policy',
      'Campus safety protocols'
    ];
  }
  if (sector === 'Private') {
    return [
      'Anti-bribery Act',
      'Fraud prevention',
      'Data privacy',
      'IT Usage Policy'
    ];
  }
  return ['General compliance module'];
}

function PoliceModuleCard({ module, progress, status }) {
  return (
    <div className="bg-white/90 rounded-xl shadow p-4 mb-4 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-gray-800">{module}</span>
        <span className={`text-xs px-2 py-1 rounded ${status === 'Completed' ? 'bg-green-100 text-green-700' : status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'}`}>{status}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <span className="text-xs text-gray-500">Progress: {progress}%</span>
    </div>
  );
}

const preTestQuestions = [
  {
    question: 'What is the main purpose of anti-bribery compliance?',
    options: ['To prevent bribery', 'To encourage bribery', 'To ignore bribery'],
    answer: 0,
    explanation: 'Anti-bribery compliance is designed to prevent bribery and corruption in law enforcement. It sets clear rules and expectations for officers, helping to build public trust and ensure fair treatment for all citizens. By following these guidelines, officers protect themselves and their organization from legal and reputational risks.'
  },
  {
    question: 'Which module covers human rights?',
    options: ['Roadside conduct', 'Human rights module', 'Bribery awareness'],
    answer: 1,
    explanation: 'The Human Rights module specifically covers the rights and freedoms that every individual is entitled to, regardless of their background. It teaches officers how to respect and protect these rights during interactions, investigations, and arrests, ensuring ethical and lawful conduct at all times.'
  },
  {
    question: 'What is required at a checkpoint?',
    options: ['Use of force', 'Scenario test', 'Proper conduct'],
    answer: 2,
    explanation: 'Proper conduct at checkpoints means treating all individuals with respect, following established procedures, and avoiding unnecessary use of force. Officers should remain professional, communicate clearly, and ensure the safety of everyone involved. This helps prevent misunderstandings and maintains public confidence in police operations.'
  }
];

const postTestQuestions = [
  {
    question: 'What should you do if offered a bribe?',
    options: ['Accept', 'Report', 'Ignore'],
    answer: 1,
    explanation: 'If you are offered a bribe, you must report it immediately according to department policy. Accepting or ignoring a bribe undermines the integrity of law enforcement and can lead to disciplinary action or criminal charges. Reporting helps maintain transparency and accountability, protecting both the officer and the public.'
  },
  {
    question: 'Who is protected by human rights policies?',
    options: ['Officers', 'Civilians', 'Both'],
    answer: 2,
    explanation: 'Human rights policies are designed to protect both officers and civilians. They ensure that everyone is treated fairly and with dignity, regardless of their role or status. By upholding these policies, officers contribute to a safer and more just society.'
  },
  {
    question: 'When is force justified?',
    options: ['Always', 'Never', 'When necessary'],
    answer: 2,
    explanation: 'Force is only justified when absolutely necessary to protect yourself or others, and must be proportional to the threat faced. Unjustified or excessive force can result in harm, legal consequences, and loss of public trust. Officers should always seek to de-escalate situations whenever possible.'
  },
  {
    question: 'What is the goal of scenario tests?',
    options: ['Punishment', 'Training', 'Assessment'],
    answer: 2,
    explanation: 'Scenario tests are used to assess an officer’s ability to respond to real-life situations. They help identify strengths and areas for improvement, ensuring officers are prepared to handle complex challenges ethically and effectively. These tests are not meant to punish, but to support ongoing professional development.'
  },
  {
    question: 'Which module covers bribery awareness?',
    options: ['Human rights', 'Bribery awareness', 'Roadside conduct'],
    answer: 1,
    explanation: 'The Bribery Awareness module educates officers about the risks and consequences of bribery, how to recognize attempts, and the correct procedures for reporting. It reinforces the importance of integrity and ethical decision-making in all aspects of police work.'
  }
];

// Add cartoon-style police scenario images for each question
const policeImages = [
  'https://openmoji.org/data/color/svg/1F46E.svg',
  'https://openmoji.org/data/color/svg/1F46E-200D-2640-FE0F.svg',
  'https://openmoji.org/data/color/svg/1F46E-200D-2642-FE0F.svg',
  // post-test
  'https://openmoji.org/data/color/svg/1F46E-1F3FD.svg',
  'https://openmoji.org/data/color/svg/1F575-1F3FB.svg',
  'https://openmoji.org/data/color/svg/1F6A8.svg',
  'https://openmoji.org/data/color/svg/1F4CB.svg',
  'https://openmoji.org/data/color/svg/26A0.svg'
];

function SingleQuestion({ questionObj, onAnswer, showExplanation, userAnswer, imageUrl }) {
  const [imgError, setImgError] = useState(false);
  // Use a reliable fallback police cartoon image
  const fallbackImg = 'https://static.thenounproject.com/png/104062-200.png'; // simple police cartoon icon
  return (
    <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center">
      {imageUrl && !imgError ? (
        <img
          src={imageUrl}
          alt="Police scenario illustration"
          className="mb-6 w-full max-w-xl h-64 object-cover rounded-2xl border shadow"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex flex-col items-center mb-6 w-full">
          <img
            src={fallbackImg}
            alt="Police scenario illustration not available"
            className="w-32 h-32 object-contain rounded-xl border shadow mb-2"
          />
          <span className="text-gray-500 text-sm">Scenario illustration not available</span>
        </div>
      )}
      <div className="font-semibold mb-4 text-lg text-center w-full">{questionObj.question}</div>
      <div className="flex flex-col gap-3 mb-4 w-full">
        {questionObj.options.map((opt, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 rounded-lg border text-left w-full ${userAnswer === idx ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'} hover:bg-blue-100`}
            onClick={() => onAnswer(idx)}
            disabled={userAnswer !== null}
          >
            {opt}
          </button>
        ))}
      </div>
      {showExplanation && (
        <div className="mt-2 text-sm text-gray-700 bg-yellow-100 rounded p-2 w-full">
          <b>Explanation:</b> {questionObj.explanation}
        </div>
      )}
    </div>
  );
}

function RemediationForm({ missedQuestions, onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(Array(missedQuestions.length).fill(null));
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (idx) => {
    setAnswers(prev => {
      const newArr = [...prev];
      newArr[step] = idx;
      return newArr;
    });
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (step < missedQuestions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(answers);
    }
  };

  const qObj = missedQuestions[step];
  return (
    <div className="flex flex-col items-center">
      <SingleQuestion
        questionObj={qObj}
        onAnswer={handleAnswer}
        showExplanation={showExplanation}
        userAnswer={answers[step]}
        imageUrl={policeImages[qObj.imageIdx]}
      />
      {showExplanation && (
        <button className="mt-4 bg-green-600 text-white font-semibold py-2 px-6 rounded-lg" onClick={handleNext}>
          {step < missedQuestions.length - 1 ? 'Next' : 'Finish'}
        </button>
      )}
    </div>
  );
}

function StepQuestions({ questions, onComplete, imageStartIdx = 0 }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (idx) => {
    setAnswers(prev => {
      const newArr = [...prev];
      newArr[step] = idx;
      return newArr;
    });
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(answers);
    }
  };

  const qObj = questions[step];
  return (
    <div className="flex flex-col items-center">
      <SingleQuestion
        questionObj={qObj}
        onAnswer={handleAnswer}
        showExplanation={showExplanation && answers[step] !== null && answers[step] !== qObj.answer}
        userAnswer={answers[step]}
        imageUrl={policeImages[imageStartIdx + step]}
      />
      {showExplanation && (
        <button className="mt-4 bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg" onClick={handleNext}>
          {step < questions.length - 1 ? 'Next' : 'Finish'}
        </button>
      )}
    </div>
  );
}

function TrainingVideo({ onNext }) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <video width="480" controls className="rounded-xl shadow">
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <button onClick={onNext} className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg">Continue to Assessment</button>
    </div>
  );
}

function Dashboard() {
  const location = useLocation();
  const { sector, role, department, rank } = location.state || {};
  const modules = getModules({ sector, role });
  const [step, setStep] = useState(0); // 0: pre-test, 1: video, 2: post-test, 3: remediation, 4: dashboard
  const [preTestScore, setPreTestScore] = useState(null);
  const [postTestScore, setPostTestScore] = useState(null);
  const [missedRemediation, setMissedRemediation] = useState([]);

  // Fallback UI if no state is present
  if (!sector || !role || !department || !rank) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-red-50 rounded-xl text-red-700">
        <h2 className="font-bold text-2xl mb-2">Missing User Data</h2>
        <p>Some required information is missing. Please return to the landing page and fill out all fields.</p>
      </div>
    );
  }

  // --- Step-based Police dashboard ---
  if (sector === 'Police') {
    if (step === 0) {
      return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
          <div className="bg-white/90 rounded-2xl shadow-xl p-10 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Pre-Training Assessment</h2>
            <p className="mb-6 text-gray-700 text-center">Answer these questions before starting your training.</p>
            <StepQuestions questions={preTestQuestions.map((q, i) => ({ ...q, imageIdx: i }))} onComplete={answers => {
              const score = answers.filter((a, i) => a === preTestQuestions[i].answer).length;
              setPreTestScore(score);
              setStep(1);
            }} imageStartIdx={0} />
          </div>
        </div>
      );
    }
    if (step === 1) {
      return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
          <div className="bg-white/90 rounded-2xl shadow-xl p-10 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Training Video</h2>
            <p className="mb-6 text-gray-700 text-center">Watch the video below, then continue to your assessment.</p>
            <TrainingVideo onNext={() => setStep(2)} />
          </div>
        </div>
      );
    }
    if (step === 2) {
      return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
          <div className="bg-white/90 rounded-2xl shadow-xl p-10 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Post-Training Assessment</h2>
            <p className="mb-6 text-gray-700 text-center">Answer these questions to complete your training.</p>
            <StepQuestions questions={postTestQuestions.map((q, i) => ({ ...q, imageIdx: 3 + i }))} onComplete={answers => {
              const score = answers.filter((a, i) => a === postTestQuestions[i].answer).length;
              setPostTestScore(score);
              // Find missed questions for remediation
              const missed = postTestQuestions
                .map((q, i) => ({ ...q, userAnswer: answers[i], imageIdx: 3 + i }))
                .filter((q, i) => answers[i] !== q.answer);
              setMissedRemediation(missed);
              setStep(missed.length > 0 ? 3 : 4);
            }} imageStartIdx={3} />
          </div>
        </div>
      );
    }
    if (step === 3) {
      // Remediation step for missed questions
      return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
          <div className="bg-white/90 rounded-2xl shadow-xl p-10 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Remediation</h2>
            <p className="mb-6 text-gray-700 text-center">Let's review the questions you missed. Read the explanation and try again.</p>
            <RemediationForm missedQuestions={missedRemediation} onComplete={() => setStep(4)} />
          </div>
        </div>
      );
    }
    if (step === 4) {
      // Simulate progress/status for demo
      const moduleProgress = [
        { progress: 100, status: 'Completed' },
        { progress: 60, status: 'In Progress' },
        { progress: 0, status: 'Not Started' },
        { progress: 80, status: 'In Progress' },
        { progress: 100, status: 'Completed' }
      ];
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-4 md:p-6">
          <div className="max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <img src={'/logo-dragnet.svg?url'} alt="Dragnet logo" className="w-16 h-16" />
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-700">Police Compliance Dashboard</h1>
                    <p className="text-gray-600 mt-1">
                      Welcome, <b>{role}</b> ({rank}) • <span className="text-blue-600 font-semibold">{department}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                    ✓ Active
                  </div>
                </div>
              </div>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-100">Overall Progress</span>
                  <span className="text-3xl">📊</span>
                </div>
                <div className="text-4xl font-bold mb-1">87%</div>
                <div className="text-blue-100 text-sm">Courses completed</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-100">Pre-Test Score</span>
                  <span className="text-3xl">✓</span>
                </div>
                <div className="text-4xl font-bold mb-1">{preTestScore}/3</div>
                <div className="text-green-100 text-sm">Passed assessment</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-100">Post-Test Score</span>
                  <span className="text-3xl">🎯</span>
                </div>
                <div className="text-4xl font-bold mb-1">{postTestScore}/5</div>
                <div className="text-purple-100 text-sm">Final assessment</div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <DragCard title={<span className="flex items-center gap-2 text-xl"><span role="img" aria-label="chart">📈</span> Learning Journey</span>}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Current Status</span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">Active Learner</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>{modules.length} courses assigned</span>
                      <span>Last activity: 2 days ago</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                </div>
              </DragCard>
              <DragCard title={<span className="flex items-center gap-2 text-xl"><span role="img" aria-label="assessment">📝</span> Recent Assessments</span>}>
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-blue-50 rounded-xl">
                    <div>
                      <div className="font-semibold text-gray-800">Police Compliance Test</div>
                      <div className="text-sm text-gray-600 mt-1">Completed on {new Date().toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-3 mt-3 md:mt-0">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">Passed</span>
                      <SecondaryButton onClick={() => {}}>View Results</SecondaryButton>
                    </div>
                  </div>
                </div>
              </DragCard>
              
              <DragCard title={<span className="flex items-center gap-2 text-xl"><span role="img" aria-label="courses">📚</span> Your Compliance Courses</span>}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {modules.map((m, i) => (
                    <CourseCard 
                      key={i} 
                      title={m} 
                      desc="AI-assigned based on your role" 
                      progress={moduleProgress[i % moduleProgress.length].progress} 
                      status={moduleProgress[i % moduleProgress.length].status} 
                    />
                  ))}
                </div>
              </DragCard>
            </div>
          </div>
        </div>
      );
    }
  }

  if (sector === 'Civil Service') {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto">
          <img src={'/logo-dragnet.svg?url'} alt="Dragnet logo" className="w-32 mb-6 mx-auto" />
          <h1 className="text-3xl font-bold mb-2 text-blue-700 text-center">Civil Service Dashboard</h1>
          <p className="text-gray-600 text-center mb-6">
            Welcome, <b>{role}</b> ({rank}) — <span className="text-blue-600 font-semibold">{department}</span>
          </p>
          <div className="flex flex-col gap-6">
            <DragCard title="📘 Your Compliance Path">
              <p>Your AI-generated compliance curriculum is ready.</p>
              <PrimaryButton onClick={() => {}}>
                View Courses
              </PrimaryButton>
            </DragCard>
            <DragCard title="📊 Progress Overview">
              <ul className="text-gray-700">
                <li>✔ 80% completed</li>
                <li>📚 {modules.length} courses assigned</li>
                <li>⏳ Last activity: 1 day ago</li>
              </ul>
            </DragCard>
            <DragCard title="📝 Assessments">
              <p>Latest assessment: <b>Civil service compliance test</b></p>
              <SecondaryButton onClick={() => {}}>View Results</SecondaryButton>
            </DragCard>
            <DragCard title="📚 Assigned Courses">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((m, i) => (
                  <CourseCard key={i} title={m} desc="AI-assigned module" progress={i === 0 ? 80 : i === 1 ? 50 : 0} status={i === 0 ? 'Completed' : i === 1 ? 'In Progress' : 'Not Started'} />
                ))}
              </div>
            </DragCard>
          </div>
        </div>
      </div>
    );
  }

  if (sector === 'Student') {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto">
          <img src={'/logo-dragnet.svg?url'} alt="Dragnet logo" className="w-32 mb-6 mx-auto" />
          <h1 className="text-3xl font-bold mb-2 text-blue-700 text-center">Student Compliance Dashboard</h1>
          <p className="text-gray-600 text-center mb-6">
            Welcome, <b>{role}</b> ({rank}) — <span className="text-blue-600 font-semibold">{department}</span>
          </p>
          <div className="flex flex-col gap-6">
            <DragCard title="📘 Your Compliance Path">
              <p>Your AI-generated compliance curriculum is ready.</p>
              <PrimaryButton onClick={() => {}}>
                View Courses
              </PrimaryButton>
            </DragCard>
            <DragCard title="📊 Progress Overview">
              <ul className="text-gray-700">
                <li>✔ 60% completed</li>
                <li>📚 {modules.length} courses assigned</li>
                <li>⏳ Last activity: 3 days ago</li>
              </ul>
            </DragCard>
            <DragCard title="📝 Assessments">
              <p>Latest assessment: <b>Student awareness test</b></p>
              <SecondaryButton onClick={() => {}}>View Results</SecondaryButton>
            </DragCard>
            <DragCard title="📚 Assigned Courses">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((m, i) => (
                  <CourseCard key={i} title={m} desc="AI-assigned module" progress={i === 0 ? 60 : i === 1 ? 40 : 0} status={i === 0 ? 'Completed' : i === 1 ? 'In Progress' : 'Not Started'} />
                ))}
              </div>
            </DragCard>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback for other sectors
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <img src={'/logo-dragnet.svg?url'} alt="Dragnet logo" className="w-32 mb-6 mx-auto" />
        <h1 className="text-3xl font-bold mb-2 text-blue-700 text-center">Your Compliance Dashboard</h1>
        <p className="text-gray-600 text-center mb-6">
          Sector: <b>{sector}</b> • Role: <b>{role}</b> • Department: <b>{department}</b> • Rank: <b>{rank}</b>
        </p>
        <DragCard title="📘 Your Compliance Path">
          <p>Your AI-generated compliance curriculum is ready.</p>
          <PrimaryButton onClick={() => {}}>
            View Courses
          </PrimaryButton>
        </DragCard>
        <DragCard title="📚 Assigned Courses">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((m, i) => (
              <CourseCard key={i} title={m} desc="AI-assigned module" progress={0} status={'Not Started'} />
            ))}
          </div>
        </DragCard>
      </div>
    </div>
  );
}

export default Dashboard;
