/**
 * AI-powered career recommendations based on user profile and performance
 */

/**
 * Generate career recommendations based on completed courses and user profile
 * @param {Array} completedCourses - Array of completed course objects
 * @param {Object} userProfile - User profile with sector, role, rank info
 * @returns {Object} Recommendations object with nextCourses, strengths, and suitability
 */
export const generateCareerRecommendations = (completedCourses, userProfile) => {
  const recommendations = {
    nextCourses: [],
    strengths: [],
    suitability: []
  };

  if (!completedCourses || completedCourses.length === 0) {
    return recommendations;
  }

  const { sector, role, rank } = userProfile || {};
  
  // Analyze course performance
  const highRiskCompleted = completedCourses.some(c => c.risk === 'high');
  const mediumRiskCompleted = completedCourses.some(c => c.risk === 'medium');
  const totalCourses = completedCourses.length;

  // Next Course Recommendations
  if (sector === 'police') {
    if (totalCourses >= 3) {
      recommendations.nextCourses.push(
        'Advanced Criminal Investigation Techniques',
        'Leadership in Law Enforcement',
        'Community Policing Strategies'
      );
    } else if (totalCourses >= 1) {
      recommendations.nextCourses.push(
        'Evidence Handling & Chain of Custody',
        'Human Rights & Civil Liberties',
        'Use of Force Policy'
      );
    }
  } else if (sector === 'civil') {
    if (totalCourses >= 3) {
      recommendations.nextCourses.push(
        'Advanced Procurement Compliance',
        'Public Sector Leadership',
        'Ethical Decision Making in Government'
      );
    } else {
      recommendations.nextCourses.push(
        'Procurement & Tendering Ethics',
        'Conflicts of Interest Management',
        'Financial Regulations Compliance'
      );
    }
  } else if (sector === 'student') {
    if (totalCourses >= 3) {
      recommendations.nextCourses.push(
        'Career Ethics & Workplace Integrity',
        'Leadership Development',
        'Research Ethics & Academic Integrity'
      );
    } else {
      recommendations.nextCourses.push(
        'Academic Integrity Fundamentals',
        'Student Leadership Ethics',
        'Campus Compliance Guidelines'
      );
    }
  } else if (sector === 'private') {
    if (totalCourses >= 3) {
      recommendations.nextCourses.push(
        'Corporate Governance',
        'Advanced Data Privacy & Security',
        'Business Ethics Leadership'
      );
    } else {
      recommendations.nextCourses.push(
        'Corporate Compliance Essentials',
        'Anti-Fraud Measures',
        'Workplace Ethics'
      );
    }
  }

  // Identify Strengths
  if (highRiskCompleted) {
    recommendations.strengths.push(
      'Demonstrates ability to handle high-risk compliance scenarios',
      'Strong understanding of critical regulations and ethics'
    );
  }

  if (totalCourses >= 3) {
    recommendations.strengths.push(
      'Committed to continuous compliance learning',
      'Broad knowledge across multiple compliance areas'
    );
  }

  if (mediumRiskCompleted) {
    recommendations.strengths.push(
      'Good grasp of moderate-complexity compliance issues',
      'Balanced understanding of risk management'
    );
  }

  // Career Suitability Based on Performance
  if (sector === 'police') {
    if (totalCourses >= 3) {
      recommendations.suitability.push(
        'Supervisory roles in law enforcement',
        'Training and mentorship positions',
        'Internal affairs and compliance units'
      );
    } else {
      recommendations.suitability.push(
        'Specialized investigative units',
        'Community relations officer',
        'Compliance monitoring roles'
      );
    }
  } else if (sector === 'civil') {
    if (totalCourses >= 3) {
      recommendations.suitability.push(
        'Senior administrative positions',
        'Compliance officer roles',
        'Policy development and implementation'
      );
    } else {
      recommendations.suitability.push(
        'Mid-level procurement positions',
        'Financial compliance roles',
        'Ethics committee participation'
      );
    }
  } else if (sector === 'student') {
    if (totalCourses >= 3) {
      recommendations.suitability.push(
        'Student governance leadership',
        'Peer mentoring and advocacy',
        'Academic integrity committees'
      );
    } else {
      recommendations.suitability.push(
        'Campus organization leadership',
        'Student representative roles',
        'Community service coordination'
      );
    }
  } else if (sector === 'private') {
    if (totalCourses >= 3) {
      recommendations.suitability.push(
        'Compliance and risk management',
        'Corporate ethics officer',
        'Internal audit and governance'
      );
    } else {
      recommendations.suitability.push(
        'Junior compliance analyst',
        'Ethics and integrity roles',
        'Regulatory affairs positions'
      );
    }
  }

  // Add rank-specific recommendations
  if (rank) {
    const seniorRanks = ['Superintendent', 'GL14', 'GL15', 'Senior Manager', 'Senior', 'Graduate Student'];
    const isSenior = seniorRanks.some(r => rank.includes(r));
    
    if (isSenior && totalCourses >= 2) {
      recommendations.strengths.push('Leadership potential in compliance and ethics');
      recommendations.suitability.push('Strategic compliance planning and oversight');
    }
  }

  return recommendations;
};
