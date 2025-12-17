import React, { useState } from 'react';

/**
 * Legal Warning Modal - Displays before training begins
 */
export const LegalWarningModal = ({ onAccept, onDecline, userName }) => {
  const [hasRead, setHasRead] = useState(false);
  const [initials, setInitials] = useState('');
  
  const handleAccept = () => {
    if (!hasRead || !initials.trim()) {
      alert('Please read the full warning and provide your initials to continue.');
      return;
    }
    onAccept(initials);
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl max-w-4xl w-full border-2 border-red-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-xl">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-4xl">🚨</span>
            LEGAL NOTICE & COMPLIANCE WARNING
          </h2>
        </div>
        
        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="bg-yellow-500/10 border-2 border-yellow-500 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">
              ⚠️ REQUIRED BY LAW
            </h3>
            <p className="text-white text-lg leading-relaxed">
              This training is <strong>MANDATORY</strong> under federal and state law for your position as <strong>{userName}</strong>.
            </p>
          </div>
          
          {/* Legal Consequences */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-red-400">
              Legal Consequences of Non-Compliance
            </h3>
            
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 space-y-2">
              <p className="text-white font-semibold">Failure to complete this training OR violation of AML/BSA regulations may result in:</p>
              <ul className="list-disc list-inside space-y-2 text-white ml-4">
                <li><strong>Criminal Fines:</strong> Up to $250,000 per violation (individual)</li>
                <li><strong>Imprisonment:</strong> Up to 10 years (20 years for repeat offenders)</li>
                <li><strong>Civil Penalties:</strong> Disgorgement of profits and additional fines</li>
                <li><strong>Professional Sanctions:</strong> License revocation, industry ban</li>
                <li><strong>Personal Liability:</strong> Cannot be shielded by corporate protection</li>
                <li><strong>Reputational Damage:</strong> Public record, career impact</li>
              </ul>
            </div>
          </div>
          
          {/* Regulatory Framework */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-blue-400">
              Applicable Laws & Regulations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-blue-500/10 border border-blue-500 rounded p-3">
                <p className="text-white text-sm">• Bank Secrecy Act (BSA)</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500 rounded p-3">
                <p className="text-white text-sm">• Anti-Money Laundering (AML)</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500 rounded p-3">
                <p className="text-white text-sm">• OFAC Sanctions</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500 rounded p-3">
                <p className="text-white text-sm">• USA PATRIOT Act</p>
              </div>
            </div>
          </div>
          
          {/* Monitoring Notice */}
          <div className="bg-purple-500/10 border border-purple-500 rounded-lg p-4">
            <h3 className="text-lg font-bold text-purple-400 mb-2">
              📹 Session Monitoring & Audit Trail
            </h3>
            <p className="text-white text-sm">
              Your training session is being monitored and recorded for compliance purposes. 
              All activities, including timestamps, answers, and identity verifications, will be 
              maintained in an audit trail accessible to regulators for 7 years.
            </p>
          </div>
          
          {/* Certification Requirements */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-green-400">
              ✓ Certification Requirements
            </h3>
            <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 space-y-2">
              <p className="text-white font-semibold">By proceeding, you certify that:</p>
              <ul className="list-disc list-inside space-y-2 text-white ml-4 text-sm">
                <li>You are the person whose identity was verified at registration</li>
                <li>You will personally complete this training without assistance or outsourcing</li>
                <li>You understand your legal obligations and the consequences of violations</li>
                <li>You authorize your employer and regulators to audit your training records</li>
                <li>You acknowledge this certification is legally binding</li>
              </ul>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-4">
            <input
              type="checkbox"
              id="hasRead"
              checked={hasRead}
              onChange={(e) => setHasRead(e.target.checked)}
              className="w-5 h-5 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="hasRead" className="text-white text-sm cursor-pointer">
              I have read and understand all the above warnings and legal consequences
            </label>
          </div>
          
          {/* Initials */}
          <div className="space-y-2">
            <label className="text-white font-semibold">
              Enter your initials to acknowledge:
            </label>
            <input
              type="text"
              value={initials}
              onChange={(e) => setInitials(e.target.value.toUpperCase())}
              placeholder="Your Initials (e.g., JD)"
              maxLength={4}
              className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-center text-2xl font-bold tracking-widest"
            />
          </div>
          
          {/* Date & Time */}
          <div className="text-center text-gray-400 text-sm">
            Date & Time: {new Date().toLocaleString()}
          </div>
        </div>
        
        {/* Footer Buttons */}
        <div className="bg-gray-800 p-6 rounded-b-xl flex justify-between gap-4">
          <button
            onClick={onDecline}
            className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
          >
            ← Decline & Exit
          </button>
          <button
            onClick={handleAccept}
            disabled={!hasRead || !initials.trim()}
            className={`px-8 py-4 font-semibold rounded-lg transition-all ${
              hasRead && initials.trim()
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            I Accept - Begin Training →
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Module Attestation - After each module
 */
export const ModuleAttestation = ({ moduleName, onSign, onCancel }) => {
  const [initials, setInitials] = useState('');
  
  const handleSign = () => {
    if (!initials.trim()) {
      alert('Please provide your initials to continue.');
      return;
    }
    onSign(initials);
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl max-w-2xl w-full border border-blue-500">
        <div className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">📝</span>
            Module Completion Attestation
          </h2>
          
          <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-6 space-y-4">
            <p className="text-white text-lg">
              <strong>Module:</strong> {moduleName}
            </p>
            
            <div className="space-y-2">
              <p className="text-white font-semibold">I hereby certify that:</p>
              <ul className="list-disc list-inside space-y-2 text-white ml-4">
                <li>I personally completed this module</li>
                <li>I understood all key concepts presented</li>
                <li>I can apply this knowledge in my role</li>
                <li>No portion was outsourced or delegated</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-white font-semibold">
              Your Initials:
            </label>
            <input
              type="text"
              value={initials}
              onChange={(e) => setInitials(e.target.value.toUpperCase())}
              placeholder="Initials"
              maxLength={4}
              className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-center text-xl font-bold tracking-widest"
            />
          </div>
          
          <div className="text-center text-gray-400 text-sm">
            {new Date().toLocaleString()}
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSign}
              disabled={!initials.trim()}
              className={`px-6 py-3 font-semibold rounded-lg transition-all ${
                initials.trim()
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Sign & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Final Certification - After completing all training
 */
export const FinalCertification = ({ userData, trainingData, onSign, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: userData.fullName || '',
    employeeId: userData.employeeId || '',
    position: userData.position || '',
    company: userData.company || '',
    initials: '',
    signature: '',
    agreedToTerms: false,
    acknowledgedConsequences: false,
    authorizedAudit: false,
    committedToComply: false,
  });
  
  const canSubmit = () => {
    return (
      formData.fullName.trim() &&
      formData.position.trim() &&
      formData.initials.trim() &&
      formData.signature.trim() &&
      formData.agreedToTerms &&
      formData.acknowledgedConsequences &&
      formData.authorizedAudit &&
      formData.committedToComply
    );
  };
  
  const handleSubmit = () => {
    if (!canSubmit()) {
      alert('Please complete all required fields and check all boxes.');
      return;
    }
    onSign(formData);
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl max-w-5xl w-full border-2 border-green-500 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-t-xl">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-4xl">✅</span>
            LEGAL CERTIFICATION OF TRAINING COMPLETION
          </h2>
          <p className="text-green-100 mt-2">
            This is a legally binding document. Read carefully before signing.
          </p>
        </div>
        
        {/* Content */}
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">
              1. Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm font-semibold block mb-2">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-white text-sm font-semibold block mb-2">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-white text-sm font-semibold block mb-2">
                  Position/Title *
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-white text-sm font-semibold block mb-2">
                  Company/Organization
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
          
          {/* Training Summary */}
          <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4">
            <h3 className="text-lg font-bold text-blue-400 mb-3">
              Training Completion Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-sm">
              <div>
                <p className="text-gray-400">Modules Completed:</p>
                <p className="font-bold text-lg">{trainingData.modulesCompleted || 0}</p>
              </div>
              <div>
                <p className="text-gray-400">Final Score:</p>
                <p className="font-bold text-lg">{trainingData.score || 0}%</p>
              </div>
              <div>
                <p className="text-gray-400">Passing Score:</p>
                <p className="font-bold text-lg">{trainingData.passingScore || 80}%</p>
              </div>
              <div>
                <p className="text-gray-400">Status:</p>
                <p className="font-bold text-lg text-green-400">PASSED</p>
              </div>
            </div>
          </div>
          
          {/* Legal Certifications */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">
              2. Legal Certifications (Check all that apply)
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-start gap-3 bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-750">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded border-gray-400 text-green-600 focus:ring-green-500"
                />
                <span className="text-white text-sm">
                  I personally completed all training modules without outsourcing or assistance during assessments
                </span>
              </label>
              
              <label className="flex items-start gap-3 bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-750">
                <input
                  type="checkbox"
                  checked={formData.acknowledgedConsequences}
                  onChange={(e) => setFormData({ ...formData, acknowledgedConsequences: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded border-gray-400 text-green-600 focus:ring-green-500"
                />
                <span className="text-white text-sm">
                  I understand that willful violation may result in fines up to $250,000 and imprisonment up to 10 years
                </span>
              </label>
              
              <label className="flex items-start gap-3 bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-750">
                <input
                  type="checkbox"
                  checked={formData.committedToComply}
                  onChange={(e) => setFormData({ ...formData, committedToComply: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded border-gray-400 text-green-600 focus:ring-green-500"
                />
                <span className="text-white text-sm">
                  I commit to applying this training, reporting suspicious activities, and complying with all applicable laws
                </span>
              </label>
              
              <label className="flex items-start gap-3 bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-750">
                <input
                  type="checkbox"
                  checked={formData.authorizedAudit}
                  onChange={(e) => setFormData({ ...formData, authorizedAudit: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded border-gray-400 text-green-600 focus:ring-green-500"
                />
                <span className="text-white text-sm">
                  I authorize my employer and regulators to audit and verify my training records
                </span>
              </label>
            </div>
          </div>
          
          {/* Signatures */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">
              3. Digital Signatures
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm font-semibold block mb-2">
                  Initials *
                </label>
                <input
                  type="text"
                  value={formData.initials}
                  onChange={(e) => setFormData({ ...formData, initials: e.target.value.toUpperCase() })}
                  placeholder="Your Initials"
                  maxLength={4}
                  className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none text-center text-2xl font-bold tracking-widest"
                />
              </div>
              <div>
                <label className="text-white text-sm font-semibold block mb-2">
                  Full Signature (Type your full name) *
                </label>
                <input
                  type="text"
                  value={formData.signature}
                  onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                  placeholder="Type your full name"
                  className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none font-signature text-xl italic"
                />
              </div>
            </div>
          </div>
          
          {/* Legal Disclaimer */}
          <div className="bg-yellow-500/10 border-2 border-yellow-500 rounded-lg p-4">
            <p className="text-yellow-300 text-sm font-semibold">
              ⚠️ UNDER PENALTY OF PERJURY, I declare that the above is true and correct.
            </p>
            <p className="text-yellow-200 text-xs mt-2">
              This certification is a legal document and may be used as evidence in regulatory proceedings or legal actions.
            </p>
          </div>
          
          {/* Date & Metadata */}
          <div className="bg-gray-800 rounded-lg p-4 text-sm text-gray-400 space-y-1">
            <p><strong>Certification Date:</strong> {new Date().toLocaleString()}</p>
            <p><strong>IP Address:</strong> [Will be recorded]</p>
            <p><strong>Device ID:</strong> [Will be recorded]</p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-800 p-6 rounded-b-xl flex justify-between gap-4">
          <button
            onClick={onCancel}
            className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
          >
            ← Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit()}
            className={`px-8 py-4 font-semibold rounded-lg transition-all ${
              canSubmit()
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Sign & Generate Certificate →
          </button>
        </div>
      </div>
    </div>
  );
};

export default {
  LegalWarningModal,
  ModuleAttestation,
  FinalCertification,
};
