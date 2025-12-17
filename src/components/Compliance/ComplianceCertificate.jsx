import React from 'react';

/**
 * Compliance Certificate Component
 * Displays the official training completion certificate
 */
export const ComplianceCertificate = ({ certificate, onDownload, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8" id="certificate">
        {/* Certificate Border */}
        <div className="border-8 border-double border-blue-800 rounded-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg mb-4">
              <h1 className="text-4xl font-bold">CERTIFICATE OF COMPLETION</h1>
              <p className="text-blue-100 text-lg mt-2">AML/BSA Compliance Training</p>
            </div>
            
            <div className="flex justify-center items-center gap-4 mt-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl">
                ✓
              </div>
              <div className="text-left">
                <p className="text-gray-600 text-sm">Certificate Number</p>
                <p className="text-2xl font-bold text-gray-800">{certificate.certificateNumber}</p>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="bg-gray-50 rounded-lg p-8 mb-6">
            <p className="text-center text-lg text-gray-700 mb-6">
              This certifies that
            </p>
            
            <h2 className="text-center text-4xl font-bold text-gray-900 mb-2">
              {certificate.fullName}
            </h2>
            
            <p className="text-center text-gray-600 mb-8">
              {certificate.position} • {certificate.company || 'Financial Institution'}
            </p>
            
            <p className="text-center text-lg text-gray-700 mb-6">
              has successfully completed comprehensive training in Anti-Money Laundering (AML) 
              and Bank Secrecy Act (BSA) compliance regulations
            </p>
            
            {/* Training Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
                <p className="text-gray-600 text-sm">Completion Date</p>
                <p className="font-bold text-gray-900">{formatDate(certificate.completionDate)}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
                <p className="text-gray-600 text-sm">Score</p>
                <p className="font-bold text-gray-900">{certificate.score}%</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
                <p className="text-gray-600 text-sm">Modules</p>
                <p className="font-bold text-gray-900">{certificate.modulesCompleted.length}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
                <p className="text-gray-600 text-sm">Valid Until</p>
                <p className="font-bold text-gray-900">{formatDate(certificate.validUntil)}</p>
              </div>
            </div>
          </div>
          
          {/* Legal Attestations */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-xl">📋</span>
              Legal Certifications
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>✓ Identity verified and confirmed</p>
              <p>✓ Training completed personally without outsourcing</p>
              <p>✓ Comprehension verified through examination</p>
              <p>✓ Legal consequences acknowledged</p>
              <p>✓ Commitment to comply affirmed under penalty of perjury</p>
            </div>
          </div>
          
          {/* Signatures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border-t-2 border-gray-300 pt-4">
              <p className="font-bold text-gray-900 text-xl italic mb-1">
                {certificate.fullName}
              </p>
              <p className="text-gray-600 text-sm">Participant Signature</p>
              <p className="text-gray-500 text-xs mt-2">Signed: {formatDate(certificate.issuedDate)}</p>
            </div>
            <div className="border-t-2 border-gray-300 pt-4">
              <p className="font-bold text-gray-900 text-xl italic mb-1">
                DragNet Training System
              </p>
              <p className="text-gray-600 text-sm">Authorized Training Provider</p>
              <p className="text-gray-500 text-xs mt-2">Verified: {formatDate(certificate.issuedDate)}</p>
            </div>
          </div>
          
          {/* Verification Info */}
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-2">
              <strong>Blockchain Verified:</strong> {certificate.blockchainHash.substring(0, 20)}...
            </p>
            <p className="text-gray-600 text-xs">
              This certificate can be verified at dragnet-verify.com using certificate number {certificate.certificateNumber}
            </p>
          </div>
          
          {/* QR Code Placeholder */}
          <div className="flex justify-center mt-6">
            <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs border-2 border-gray-300">
              QR Code
              <br />
              [Verify]
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="bg-gray-100 p-6 rounded-b-xl flex justify-between gap-4">
          <button
            onClick={onClose}
            className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
          >
            Close
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              <span>🖨️</span>
              Print Certificate
            </button>
            <button
              onClick={onDownload}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              <span>⬇️</span>
              Download PDF
            </button>
          </div>
        </div>
      </div>
      
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #certificate, #certificate * {
            visibility: visible;
          }
          #certificate {
            position: absolute;
            left: 0;
            top: 0;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ComplianceCertificate;
