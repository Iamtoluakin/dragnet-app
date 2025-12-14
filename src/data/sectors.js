export const sectors = [
  { value: 'police', label: 'Police', icon: '🚔', color: 'from-blue-600 to-blue-800' },
  { value: 'civil', label: 'Civil Service', icon: '🏛️', color: 'from-purple-600 to-purple-800' },
  { value: 'student', label: 'Student', icon: '🎓', color: 'from-green-600 to-green-800' },
  { value: 'private', label: 'Private Sector', icon: '💼', color: 'from-orange-600 to-orange-800' }
];

export const rolesBySection = {
  police: ['Traffic Officer', 'Sergeant', 'Inspector', 'Detective', 'Corporal', 'Constable'],
  civil: ['Procurement Officer', 'Finance Officer', 'Admin Officer', 'IT Officer', 'HR Officer', 'Legal Officer'],
  student: ['Student Leader', 'NYSC Intern', 'Graduate Student', 'Undergraduate', 'Class Representative'],
  private: ['Bank Teller', 'Customer Service Rep', 'Manager', 'Accountant', 'Sales Rep', 'IT Staff']
};

export const departmentsBySection = {
  police: ['Operations', 'Traffic', 'Criminal Investigation', 'Intelligence', 'Administration'],
  civil: ['Finance', 'Procurement', 'IT', 'HR', 'Legal', 'Administration'],
  student: ['Education', 'Student Affairs', 'Administration', 'Community Service'],
  private: ['Finance', 'IT', 'Healthcare', 'Customer Service', 'Operations', 'Sales']
};

export const ranksBySection = {
  police: ['Constable', 'Corporal', 'Sergeant', 'Inspector', 'Chief Inspector', 'Superintendent'],
  civil: ['GL06', 'GL07', 'GL08', 'GL09', 'GL10', 'GL12', 'GL14', 'GL15'],
  student: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'NYSC Intern', 'Graduate Student'],
  private: ['Intern', 'Junior Officer', 'Officer', 'Senior Officer', 'Manager', 'Senior Manager']
};

export const analysisSteps = [
  { text: 'Analyzing your role and responsibilities...', icon: '🔍' },
  { text: 'Identifying compliance requirements...', icon: '📋' },
  { text: 'Mapping relevant regulations and policies...', icon: '⚖️' },
  { text: 'Calculating risk exposure level...', icon: '📊' },
  { text: 'Assigning personalized training modules...', icon: '🎯' },
  { text: 'Generating assessment scenarios...', icon: '✅' }
];
