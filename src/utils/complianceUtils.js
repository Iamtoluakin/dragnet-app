// Compliance & Security Utilities
// Handles identity verification, legal attestations, and audit trails

/**
 * Generate unique session ID for audit trail
 */
export const generateSessionId = () => {
  return `SESSION-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate certificate number
 */
export const generateCertificateNumber = (userId) => {
  const year = new Date().getFullYear();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `CERT-${year}-${random}-${userId.substr(0, 6).toUpperCase()}`;
};

/**
 * Get user's device fingerprint
 */
export const getDeviceFingerprint = () => {
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString(),
  };
  
  // Create a hash of the fingerprint
  const fingerprintString = JSON.stringify(fingerprint);
  return btoa(fingerprintString).substr(0, 32);
};

/**
 * Get user's IP address (requires external service)
 */
export const getUserIPAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to get IP address:', error);
    return 'IP-UNAVAILABLE';
  }
};

/**
 * Create audit log entry
 */
export const createAuditLog = async (eventType, data, userId) => {
  const ipAddress = await getUserIPAddress();
  const deviceId = getDeviceFingerprint();
  
  const auditEntry = {
    eventType,
    userId,
    timestamp: new Date().toISOString(),
    ipAddress,
    deviceId,
    data,
    userAgent: navigator.userAgent,
  };
  
  // Save to localStorage (in production, send to backend)
  const existingLogs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
  existingLogs.push(auditEntry);
  localStorage.setItem('auditLogs', JSON.stringify(existingLogs));
  
  return auditEntry;
};

/**
 * Create digital signature hash
 */
export const createDigitalSignature = (data) => {
  const signatureData = {
    ...data,
    timestamp: new Date().toISOString(),
    nonce: Math.random().toString(36).substr(2, 16),
  };
  
  const signatureString = JSON.stringify(signatureData);
  
  // Simple hash (in production, use proper cryptographic signing)
  return btoa(signatureString).substr(0, 64);
};

/**
 * Check if user has verified their identity
 */
export const hasVerifiedIdentity = (userId) => {
  const verification = localStorage.getItem(`identityVerified_${userId}`);
  return verification === 'true';
};

/**
 * Mark identity as verified
 */
export const setIdentityVerified = (userId, verified = true) => {
  localStorage.setItem(`identityVerified_${userId}`, verified.toString());
  
  // Log the verification
  createAuditLog('IDENTITY_VERIFICATION', { verified }, userId);
};

/**
 * Record legal attestation
 */
export const recordAttestation = async (userId, attestationType, attestationData) => {
  const signature = createDigitalSignature({
    userId,
    attestationType,
    ...attestationData,
  });
  
  const attestation = {
    userId,
    type: attestationType,
    data: attestationData,
    signature,
    timestamp: new Date().toISOString(),
    ipAddress: await getUserIPAddress(),
    deviceId: getDeviceFingerprint(),
  };
  
  // Save attestation
  const key = `attestation_${attestationType}_${userId}`;
  localStorage.setItem(key, JSON.stringify(attestation));
  
  // Create audit log
  await createAuditLog('ATTESTATION_SIGNED', { attestationType }, userId);
  
  return attestation;
};

/**
 * Get all attestations for a user
 */
export const getUserAttestations = (userId) => {
  const attestations = [];
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (key.startsWith(`attestation_`) && key.endsWith(`_${userId}`)) {
      try {
        const attestation = JSON.parse(localStorage.getItem(key));
        attestations.push(attestation);
      } catch (error) {
        console.error('Failed to parse attestation:', error);
      }
    }
  });
  
  return attestations;
};

/**
 * Generate compliance certificate
 */
export const generateCertificate = async (userData, trainingData) => {
  const certificateNumber = generateCertificateNumber(userData.userId);
  const signature = createDigitalSignature({
    ...userData,
    ...trainingData,
    certificateNumber,
  });
  
  const certificate = {
    certificateNumber,
    issuedDate: new Date().toISOString(),
    
    // User information
    userId: userData.userId,
    fullName: userData.fullName,
    email: userData.email,
    employeeId: userData.employeeId,
    position: userData.position,
    company: userData.company,
    
    // Training completion data
    trainingCompleted: trainingData.completed,
    completionDate: trainingData.completionDate,
    score: trainingData.score,
    passingScore: trainingData.passingScore,
    modulesCompleted: trainingData.modules,
    
    // Legal attestations
    attestationsSigned: trainingData.attestations || [],
    
    // Security metadata
    digitalSignature: signature,
    ipAddress: await getUserIPAddress(),
    deviceId: getDeviceFingerprint(),
    
    // Blockchain hash (placeholder for future implementation)
    blockchainHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    
    // Validity
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    
    // Audit trail
    auditTrail: JSON.parse(localStorage.getItem('auditLogs') || '[]').filter(
      log => log.userId === userData.userId
    ),
  };
  
  // Save certificate
  localStorage.setItem(`certificate_${userData.userId}`, JSON.stringify(certificate));
  
  // Create audit log
  await createAuditLog('CERTIFICATE_GENERATED', { certificateNumber }, userData.userId);
  
  return certificate;
};

/**
 * Verify certificate authenticity
 */
export const verifyCertificate = (certificateNumber) => {
  // In production, this would verify against blockchain/database
  const keys = Object.keys(localStorage);
  
  for (const key of keys) {
    if (key.startsWith('certificate_')) {
      try {
        const certificate = JSON.parse(localStorage.getItem(key));
        if (certificate.certificateNumber === certificateNumber) {
          // Check if still valid
          const validUntil = new Date(certificate.validUntil);
          const isValid = validUntil > new Date();
          
          return {
            valid: isValid,
            certificate,
            reason: isValid ? 'Valid certificate' : 'Certificate expired',
          };
        }
      } catch (error) {
        console.error('Failed to parse certificate:', error);
      }
    }
  }
  
  return {
    valid: false,
    certificate: null,
    reason: 'Certificate not found',
  };
};

/**
 * Export audit logs for regulator
 */
export const exportAuditLogs = (userId = null) => {
  const logs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
  
  const filteredLogs = userId 
    ? logs.filter(log => log.userId === userId)
    : logs;
  
  return {
    exportDate: new Date().toISOString(),
    totalEntries: filteredLogs.length,
    logs: filteredLogs,
  };
};

/**
 * Clear all compliance data (for testing only)
 */
export const clearComplianceData = () => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (
      key.startsWith('attestation_') ||
      key.startsWith('certificate_') ||
      key.startsWith('identityVerified_') ||
      key === 'auditLogs'
    ) {
      localStorage.removeItem(key);
    }
  });
};

export default {
  generateSessionId,
  generateCertificateNumber,
  getDeviceFingerprint,
  getUserIPAddress,
  createAuditLog,
  createDigitalSignature,
  hasVerifiedIdentity,
  setIdentityVerified,
  recordAttestation,
  getUserAttestations,
  generateCertificate,
  verifyCertificate,
  exportAuditLogs,
  clearComplianceData,
};
