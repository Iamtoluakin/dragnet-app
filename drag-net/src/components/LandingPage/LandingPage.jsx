import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Dropdown option maps
const sectorOptions = [
  { value: '', label: 'Select Sector' },
  { value: 'Police', label: 'Police' },
  { value: 'Civil Service', label: 'Civil Service' },
  { value: 'Student', label: 'Student' },
  { value: 'Private', label: 'Private' }
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
    <select value={value} onChange={onChange} required className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
      {sectorOptions.map(opt => (
        <option key={opt.value} value={opt.value} disabled={opt.value === ''}>{opt.label}</option>
      ))}
    </select>
  );
}

function RoleDropdown({ sector, value, onChange }) {
  if (!sector) return null;
  return (
    <select value={value} onChange={onChange} required className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
      {roleOptions[sector].map(opt => (
        <option key={opt.value} value={opt.value} disabled={opt.value === ''}>{opt.label}</option>
      ))}
    </select>
  );
}

function DepartmentDropdown({ sector, value, onChange }) {
  if (!sector) return null;
  return (
    <select value={value} onChange={onChange} required className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
      {departmentOptions[sector].map(opt => (
        <option key={opt.value} value={opt.value} disabled={opt.value === ''}>{opt.label}</option>
      ))}
    </select>
  );
}

function RankDropdown({ sector, value, onChange }) {
  if (!sector) return null;
  return (
    <select value={value} onChange={onChange} required className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
      {/* HERO HEADER */}
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Dragnet Compliance Platform</h1>
        <p className="text-gray-300 mt-3 text-lg">AI-powered compliance tailored to every role.</p>
      </header>
      {/* CARD CONTAINER */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-10 w-full max-w-lg shadow-xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Welcome to Dragnet</h2>
        <p className="text-gray-300 text-center mb-6">Enter your details to generate your custom compliance path.</p>
        {/* FORM */}
        {!loading ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <SectorDropdown value={sector} onChange={e => {
              setSector(e.target.value);
              setRole('');
              setDepartment('');
              setRank('');
            }} />
            <RoleDropdown sector={sector} value={role} onChange={e => setRole(e.target.value)} />
            <DepartmentDropdown sector={sector} value={department} onChange={e => setDepartment(e.target.value)} />
            <RankDropdown sector={sector} value={rank} onChange={e => setRank(e.target.value)} />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-lg">Get My Compliance Path</button>
          </form>
        ) : (
          <div className="text-center">
            <h3 className="text-xl text-white font-semibold mb-3">Your Compliance Path is Being Generated...</h3>
            <p className="text-gray-300 mb-6">Please wait while we personalize your learning modules.</p>
            <div className="flex justify-center">
              <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
