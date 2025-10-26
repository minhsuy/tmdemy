import React from "react";

interface IconCertificateProps {
  className?: string;
}

const IconCertificate: React.FC<IconCertificateProps> = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Document */}
      <rect x="4" y="2" width="16" height="20" rx="2" fill="none" />
      
      {/* Document fold */}
      <path d="M16 2v6h6" fill="none" />
      
      {/* Content lines */}
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="14" y2="12" />
      <line x1="8" y1="16" x2="12" y2="16" />
      
      {/* Checkmark */}
      <path d="M9 12l2 2 4-4" strokeWidth="2" stroke="currentColor" fill="none" />
      
      {/* Official stamp */}
      <circle cx="18" cy="6" r="1.5" fill="currentColor" />
      <circle cx="18" cy="6" r="0.8" fill="white" />
    </svg>
  );
};

export default IconCertificate;
