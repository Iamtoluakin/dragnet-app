import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Dropdown option maps with icons
const sectorOptions = [
  { value: '', label: 'Select Sector', icon: '' },
  { value: 'Police', label: '🚔 Police', icon: '🚔' },
  { value: 'Civil Service', label: '🏛️ Civil Service', icon: '🏛️' },
  { value: 'Student', label: '🎓 Student', icon: '🎓' },
  { value: 'Private', label: '💼 Private Sector', icon: '💼' }
];

const roleOptions = {
  Police: [
    { value: '', label: 'Select Job Title' },
    { value: 'Traffic Officer', label: 'Traffic Officer' },
    { value: 'Sergeant', label: 'Sergeant' }
  ],
  'Civil Service': [
    { value: '', label: 'Select Job Title' },
    { value: 'Procurement Officer', label: 'Procurement Officer' }
  ],
  Student: [
    { value: '', label: 'Select Job Title' },
    { value: 'Student Leader', label: 'Student Leader' },
    { value: 'NYSC Intern', label: 'NYSC Intern' }
  ],
  Private: [
    { value: '', label: 'Select Job Title' },
    { value: 'Bank Teller', label: 'Bank Teller' }
  ]
};

const departmentOptions = {
  Police: [
    { value: '', label: 'Select Department' },
    { value: 'Operations', label: 'Operations' }
  ],
  'Civil Service': [
    { value: '', label: 'Select Department' },
    { value: 'Finance', label: 'Finance' }
  ],
  Student: [
    { value: '', label: 'Select Department' },
    { value: 'Education', label: 'Education' }
  ],
  Private: [
    { value: '', label: 'Select Department' },
    { value: 'IT', label: 'IT' },
    { value: 'Healthcare', label: 'Healthcare' }
  ]
};

const rankOptions = {
  Police: [
    { value: '', label: 'Select Rank / Grade Level' },
    { value: 'Sergeant', label: 'Sergeant' }
  ],
  'Civil Service': [
    { value: '', label: 'Select Rank / Grade Level' },
    { value: 'GL08', label: 'GL08' },
    { value: 'GL10', label: 'GL10' }
  ],
  Student: [
    { value: '', label: 'Select Rank / Grade Level' },
    { value: 'NYSC Intern', label: 'NYSC Intern' }
  ],
  Private: [
    { value: '', label: 'Select Rank / Grade Level' },
    { value: 'Intern', label: 'Intern' },
    { value: 'Principal', label: 'Principal' }
  ]
};

function SectorDropdown({ value, onChange }) {
  return (
    <select 
      value={value} 
      onChange={onChange} 
      required 
      className="w-full px-4 py-3.5 rounded-xl bg-gray-800/90 text-white border-2 border-gray-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 cursor-pointer hover:bg-gray-800 backdrop-blur-sm"
    >
      {sectorOptions.map(opt => (
        <option key={opt.value} value={opt.value} disabled={opt.value === ''}>{opt.label}</option>
      ))}
    </select>
  );
}

function RoleDropdown({ sector, value, onChange }) {
  if (!sector) return null;
  return (
    <select 
      value={value} 
      onChange={onChange} 
      required 
      className="w-full px-4 py-3.5 rounded-xl bg-gray-800/90 text-white border-2 border-gray-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 cursor-pointer hover:bg-gray-800 backdrop-blur-sm"
    >
      {roleOptions[sector].map(opt => (
        <option key={opt.value} value={opt.value} disabled={opt.value === ''}>{opt.label}</option>
      ))}
    </select>
  );
}

function DepartmentDropdown({ sector, value, onChange }) {
  if (!sector) return null;
  return (
    <select 
      value={value} 
      onChange={onChange} 
      required 
      className="w-full px-4 py-3.5 rounded-xl bg-gray-800/90 text-white border-2 border-gray-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 cursor-pointer hover:bg-gray-800 backdrop-blur-sm"
    >
      {departmentOptions[sector].map(opt => (
        <option key={opt.value} value={opt.value} disabled={opt.value === ''}>{opt.label}</option>
      ))}
    </select>
  );
}

function RankDropdown({ sector, value, onChange }) {
  if (!sector) return null;
  return (
    <select 
      value={value} 
      onChange={onChange} 
      required 
      className="w-full px-4 py-3.5 rounded-xl bg-gray-800/90 text-white border-2 border-gray-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 cursor-pointer hover:bg-gray-800 backdrop-blur-sm"
    >
      {rankOptions[sector].map(opt => (
        <option key={opt.value} value={opt.value} disabled={opt.value === ''}>{opt.label}</option>
      ))}
    </select>
  );
}

function LandingPage() {
  const [sector, setSector] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [rank, setRank] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard', {
        state: { sector, role, department, rank }
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* HERO HEADER */}
      <header className="text-center mb-10 relative z-10">
        <div className="mb-4">
          <img src={'/logo-dragnet.svg?url'} alt="Dragnet logo" className="w-20 h-20 mx-auto mb-4 animate-bounce" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Dragnet
          </span>
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-blue-300 mt-2">Compliance Platform</p>
        <p className="text-gray-300 mt-3 text-base md:text-lg max-w-2xl mx-auto">
          AI-powered compliance training tailored to your role, sector, and responsibility level
        </p>
      </header>
      
      {/* CARD CONTAINER */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl p-8 md:p-10 w-full max-w-lg shadow-2xl relative z-10 transform transition-all hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl"></div>
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-3">
            Welcome to Dragnet
          </h2>
          <p className="text-gray-300 text-center mb-8 text-sm md:text-base">
            Enter your details to generate your personalized compliance path
          </p>
          {/* FORM */}
          {!loading ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300 pl-1">Sector</label>
                <SectorDropdown value={sector} onChange={e => {
                  setSector(e.target.value);
                  setRole('');
                  setDepartment('');
                  setRank('');
                }} />
              </div>
              
              {sector && (
                <div className="space-y-1 animate-fadeIn">
                  <label className="text-sm font-medium text-gray-300 pl-1">Job Title</label>
                  <RoleDropdown sector={sector} value={role} onChange={e => setRole(e.target.value)} />
                </div>
              )}
              
              {sector && (
                <div className="space-y-1 animate-fadeIn">
                  <label className="text-sm font-medium text-gray-300 pl-1">Department</label>
                  <DepartmentDropdown sector={sector} value={department} onChange={e => setDepartment(e.target.value)} />
                </div>
              )}
              
              {sector && (
                <div className="space-y-1 animate-fadeIn">
                  <label className="text-sm font-medium text-gray-300 pl-1">Rank / Grade Level</label>
                  <RankDropdown sector={sector} value={rank} onChange={e => setRank(e.target.value)} />
                </div>
              )}
              
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-4"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>Get My Compliance Path</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </form>
          ) : (
            <div className="text-center py-8 animate-fadeIn">
              <div className="mb-6">
                <div className="relative w-24 h-24 mx-auto">
                  <svg className="animate-spin h-24 w-24 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl text-white font-bold mb-3">Generating Your Path...</h3>
              <p className="text-gray-300 mb-4">Analyzing your role and responsibilities</p>
              <div className="flex justify-center gap-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-8 text-center text-gray-400 text-sm relative z-10">
        <p>Powered by AI • Secure • Compliant</p>
      </footer>
    </div>
  );
}

export default LandingPage;
