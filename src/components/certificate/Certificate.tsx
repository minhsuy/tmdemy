"use client";

import React from "react";
import { ICertificateWithDetails } from "@/types/type";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import CertificateDownload from "./CertificateDownload";

interface CertificateProps {
  certificate: ICertificateWithDetails;
}

const Certificate: React.FC<CertificateProps> = ({
  certificate,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Certificate Container */}
      <Card className="bg-white border-2 border-gray-200 shadow-lg">
        <CardContent className="p-0">
          {/* Certificate Design */}
          <div 
            id="certificate-content" 
            className="relative bg-white p-8 text-center"
            style={{
              minHeight: '600px',
              minWidth: '800px',
              fontFamily: 'Arial, sans-serif',
              fontSize: '16px',
              lineHeight: '1.5',
              color: '#000000',
              backgroundColor: '#ffffff',
              position: 'relative',
              display: 'block',
              visibility: 'visible',
              opacity: '1',
              zIndex: '1'
            }}
          >
            {/* Border */}
            <div className="absolute inset-4 border border-gray-300 rounded-lg"></div>
            
            {/* Header Section */}
            <div className="relative z-10">
              {/* Logo/Badge */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 border-2 border-black rounded-lg bg-white">
                  <div className="text-2xl font-bold text-black">T</div>
                </div>
              </div>

              {/* Purple Banner */}
              <div className="mb-4">
                <div className="inline-block bg-purple-600 text-white px-6 py-2 rounded-md">
                  <span className="text-sm font-semibold uppercase tracking-wide">
                    {certificate.course.title.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Professional Certification */}
              <div className="mb-6">
                <p className="text-sm uppercase tracking-wide font-medium" style={{ color: '#666666' }}>
                  Professional Certification
                </p>
                <h1 className="text-3xl font-bold mt-2" style={{ color: '#000000' }}>
                  {certificate.course.title}
                </h1>
              </div>

              {/* Issued To */}
              <div className="mb-6">
                <p className="text-sm uppercase tracking-wide font-medium" style={{ color: '#666666' }}>
                  Issued To
                </p>
                <h2 className="text-2xl font-bold mt-2" style={{ color: '#000000' }}>
                  {certificate.user.name}
                </h2>
              </div>

              {/* Certificate Statement */}
              <div className="mb-8 max-w-2xl mx-auto">
                <p className="text-base leading-relaxed" style={{ color: '#000000' }}>
                  The bearer of this professional certificate has demonstrated mastery of{" "}
                  <strong style={{ color: '#000000' }}>{certificate.course.title}</strong> and completed{" "}
                  <strong style={{ color: '#000000' }}>{certificate.completionPercentage}%</strong> of the course curriculum.
                </p>
              </div>

              {/* Footer Section */}
              <div className="flex justify-between items-end">
                {/* Left - Signature */}
                <div className="text-left">
                  <div className="mb-2">
                    <div className="w-32 h-16 border-b-2 border-black"></div>
                    <div className="w-32 h-16 border-b-2 border-black mt-2"></div>
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#000000' }}>
                    Founders, TMDemy
                  </p>
                </div>

                {/* Center - Logo */}
                <div className="flex items-center">
                  <div className="w-8 h-8 border border-black rounded flex items-center justify-center mr-2">
                    <span className="text-sm font-bold">T</span>
                  </div>
                  <span className="text-lg font-semibold" style={{ color: '#000000' }}>TMDemy</span>
                </div>

                {/* Right - QR Code & Details */}
                <div className="text-right">
                  <div className="w-16 h-16 bg-black mb-2 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white grid grid-cols-3 gap-0.5">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className={`${i % 2 === 0 ? 'bg-black' : 'bg-white'} w-full h-full`}></div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: '#000000' }}>
                    Issued: {formatDate(certificate.issuedAt)}
                  </p>
                  <p className="text-xs" style={{ color: '#000000' }}>
                    ID: {certificate.certificateId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <CertificateDownload
          certificate={certificate}
        />
        
        <Button
          onClick={() => {
            // TODO: Implement sharing
            console.log("Share certificate:", certificate.certificateId);
          }}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white"
        >
          <Share2 className="w-4 h-4" />
          Chia sẻ
        </Button>
      </div>
    </div>
  );
};

export default Certificate;
