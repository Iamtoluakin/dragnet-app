export const sectors = [
  { value: 'police', label: 'Police', icon: '🚔', color: 'from-blue-600 to-blue-800' },
  { value: 'civil', label: 'Civil Service', icon: '🏛️', color: 'from-purple-600 to-purple-800' },
  { value: 'immigration', label: 'Customs & Immigration', icon: '🛂', color: 'from-sky-600 to-sky-800' },
  { value: 'private', label: 'Private Sector', icon: '💼', color: 'from-orange-600 to-orange-800' },
  { value: 'students', label: 'Students', icon: '🎒', color: 'from-yellow-600 to-yellow-800' },
];

export const rolesBySection = {
  police: ['Patrol Officer', 'Traffic Officer', 'Detective', 'Intelligence Officer', 'Community Policing Officer', 'Administrative Officer'],
  civil: ['Procurement Officer', 'Finance Officer', 'Administrative Officer', 'IT Officer', 'HR Officer', 'Legal Officer'],
  immigration: ['Immigration Officer', 'Customs Officer', 'Border Control Officer', 'Passport Control Officer', 'Visa Officer', 'Compliance Investigator'],
  private: ['Bank Teller', 'Customer Service Representative', 'Accountant', 'Sales Representative', 'IT Support Specialist', 'Software Engineer', 'Operations Officer', 'Compliance Officer', 'Teacher', 'Nurse'],
  students: [
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3',
    '100 Level', '200 Level', '300 Level', '400 Level', '500 Level',
  ],
};

export const departmentsBySection = {
  police: ['Operations', 'Traffic', 'Criminal Investigation', 'Intelligence', 'Administration'],
  civil: ['Finance', 'Procurement', 'IT', 'HR', 'Legal', 'Administration'],
  immigration: ['Passport Control', 'Border Operations', 'Visa Processing', 'Customs Enforcement', 'Investigation & Compliance'],
  private: ['Banking & Finance', 'Customer Service', 'Finance', 'Sales', 'IT', 'IT & Engineering', 'Operations', 'Risk & Compliance', 'Education', 'Healthcare'],
  students: ['Primary School', 'Junior Secondary School', 'Senior Secondary School', 'University'],
};

// Only show departments that make sense for the selected role.
export const departmentsByRole = {
  police: {
    'Patrol Officer': ['Operations'], 'Traffic Officer': ['Traffic'], Detective: ['Criminal Investigation'],
    'Intelligence Officer': ['Intelligence'], 'Community Policing Officer': ['Operations'], 'Administrative Officer': ['Administration'],
  },
  civil: {
    'Procurement Officer': ['Procurement'], 'Finance Officer': ['Finance'], 'Administrative Officer': ['Administration'],
    'IT Officer': ['IT'], 'HR Officer': ['HR'], 'Legal Officer': ['Legal'],
  },
  immigration: {
    'Immigration Officer': ['Border Operations'], 'Customs Officer': ['Customs Enforcement'],
    'Border Control Officer': ['Border Operations'], 'Passport Control Officer': ['Passport Control'],
    'Visa Officer': ['Visa Processing'], 'Compliance Investigator': ['Investigation & Compliance'],
  },
  private: {
    'Bank Teller': ['Banking & Finance'], 'Customer Service Representative': ['Customer Service'],
    Accountant: ['Finance'], 'Sales Representative': ['Sales'], 'IT Support Specialist': ['IT'],
    'Software Engineer': ['IT & Engineering'], 'Operations Officer': ['Operations'],
    'Compliance Officer': ['Risk & Compliance'], Teacher: ['Education'], Nurse: ['Healthcare'],
  },
  students: {
    'Primary 1': ['Primary School'], 'Primary 2': ['Primary School'], 'Primary 3': ['Primary School'],
    'Primary 4': ['Primary School'], 'Primary 5': ['Primary School'], 'Primary 6': ['Primary School'],
    'JSS 1': ['Junior Secondary School'], 'JSS 2': ['Junior Secondary School'], 'JSS 3': ['Junior Secondary School'],
    'SS 1': ['Senior Secondary School'], 'SS 2': ['Senior Secondary School'], 'SS 3': ['Senior Secondary School'],
    '100 Level': ['University'], '200 Level': ['University'], '300 Level': ['University'],
    '400 Level': ['University'], '500 Level': ['University'],
  },
};

export const privateRanksByRole = {
  'Bank Teller': ['Teller', 'Senior Teller', 'Branch Supervisor', 'Branch Manager'],
  'Customer Service Representative': ['Service Associate', 'Senior Service Representative', 'Team Lead', 'Service Manager'],
  Accountant: ['Accounts Assistant', 'Accountant', 'Senior Accountant', 'Finance Manager'],
  'Sales Representative': ['Sales Associate', 'Sales Representative', 'Senior Sales Executive', 'Sales Manager'],
  'IT Support Specialist': ['IT Support Technician', 'IT Support Analyst', 'Systems Administrator', 'IT Manager'],
  'Software Engineer': ['Junior Software Engineer', 'Software Engineer', 'Senior Software Engineer', 'Engineering Lead'],
  'Operations Officer': ['Operations Assistant', 'Operations Officer', 'Senior Operations Officer', 'Operations Manager'],
  'Compliance Officer': ['Compliance Analyst', 'Compliance Officer', 'Senior Compliance Officer', 'Compliance Manager'],
  Teacher: ['Teaching Assistant', 'Teacher', 'Senior Teacher', 'Head Teacher'],
  Nurse: ['Nursing Assistant', 'Registered Nurse', 'Senior Nurse', 'Nurse Manager'],
};

export const ranksBySection = {
  police: ['Constable', 'Corporal', 'Sergeant', 'Inspector', 'Chief Inspector', 'Superintendent'],
  civil: ['GL06', 'GL07', 'GL08', 'GL09', 'GL10', 'GL12', 'GL14', 'GL15'],
  immigration: ['Assistant Immigration Officer I', 'Assistant Immigration Officer II', 'Immigration Officer I', 'Immigration Officer II', 'Chief Immigration Officer', 'Deputy Comptroller'],
  private: [],
  students: ['Primary (P1–P6)', 'Junior Secondary (JS1–JS3)', 'Senior Secondary (SS1–SS3)', 'University (100L–500L)'],
};

export const studentRankForRole = (role) => {
  if (role?.startsWith('Primary ')) return 'Primary (P1–P6)';
  if (role?.startsWith('JSS ')) return 'Junior Secondary (JS1–JS3)';
  if (role?.startsWith('SS ')) return 'Senior Secondary (SS1–SS3)';
  if (/^[1-5]00 Level$/.test(role || '')) return 'University (100L–500L)';
  return '';
};

export const analysisSteps = [
  { text: 'Analyzing your role and responsibilities...', icon: '🔍' },
  { text: 'Identifying compliance requirements...', icon: '📋' },
  { text: 'Mapping relevant regulations and policies...', icon: '⚖️' },
  { text: 'Calculating risk exposure level...', icon: '📊' },
  { text: 'Assigning personalized training modules...', icon: '🎯' },
  { text: 'Generating assessment scenarios...', icon: '✅' },
];
