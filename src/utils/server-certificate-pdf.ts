import { ICertificateWithDetails } from "@/types/type";

export interface ServerCertificatePDFOptions {
  filename?: string;
}

export const generateServerCertificatePDF = async (
  certificate: ICertificateWithDetails,
  options: ServerCertificatePDFOptions = {}
): Promise<Blob> => {
  const {
    filename = `certificate-${certificate.course.title.replace(/\s+/g, '-').toLowerCase()}-${certificate.certificateId}.pdf`
  } = options;

  // Create HTML content for the certificate
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Certificate - ${certificate.course.title}</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 0;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background: white;
          color: black;
        }
        
        .certificate-container {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          position: relative;
        }
        
        .certificate-content {
          width: 800px;
          height: 600px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 32px;
          text-align: center;
          position: relative;
          box-sizing: border-box;
        }
        
        .certificate-border {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          bottom: 16px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
        }
        
        .logo-section {
          margin-bottom: 24px;
        }
        
        .logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border: 2px solid black;
          border-radius: 8px;
          background: white;
          font-size: 32px;
          font-weight: bold;
          color: black;
        }
        
        .course-banner {
          margin-bottom: 16px;
        }
        
        .course-banner .banner {
          display: inline-block;
          background: #7c3aed;
          color: white;
          padding: 8px 24px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .certification-title {
          margin-bottom: 24px;
        }
        
        .certification-title .subtitle {
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #666666;
          margin-bottom: 8px;
        }
        
        .certification-title .title {
          font-size: 32px;
          font-weight: bold;
          color: black;
          margin: 0;
        }
        
        .student-section {
          margin-bottom: 24px;
        }
        
        .student-section .subtitle {
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #666666;
          margin-bottom: 8px;
        }
        
        .student-section .name {
          font-size: 24px;
          font-weight: bold;
          color: black;
          margin: 0;
        }
        
        .certificate-statement {
          margin-bottom: 32px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .certificate-statement p {
          font-size: 16px;
          line-height: 1.5;
          color: black;
          margin: 0;
        }
        
        .certificate-statement strong {
          color: black;
          font-weight: bold;
        }
        
        .footer-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 32px;
        }
        
        .signature-section {
          text-align: left;
        }
        
        .signature-lines {
          margin-bottom: 8px;
        }
        
        .signature-line {
          width: 128px;
          height: 64px;
          border-bottom: 2px solid black;
          margin-bottom: 8px;
        }
        
        .signature-text {
          font-size: 14px;
          font-weight: 500;
          color: black;
        }
        
        .logo-section-footer {
          display: flex;
          align-items: center;
        }
        
        .logo-small {
          width: 32px;
          height: 32px;
          border: 1px solid black;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
          font-size: 14px;
          font-weight: bold;
          color: black;
        }
        
        .company-name {
          font-size: 18px;
          font-weight: 600;
          color: black;
        }
        
        .qr-section {
          text-align: right;
        }
        
        .qr-code {
          width: 64px;
          height: 64px;
          background: black;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .qr-pattern {
          width: 48px;
          height: 48px;
          background: white;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        
        .qr-square {
          background: black;
        }
        
        .qr-square:nth-child(even) {
          background: white;
        }
        
        .certificate-details {
          font-size: 12px;
          color: black;
          line-height: 1.2;
        }
        
        .certificate-details p {
          margin: 2px 0;
        }
      </style>
    </head>
    <body>
      <div class="certificate-container">
        <div class="certificate-content">
          <div class="certificate-border"></div>
          
          <!-- Logo Section -->
          <div class="logo-section">
            <div class="logo">T</div>
          </div>
          
          <!-- Course Banner -->
          <div class="course-banner">
            <div class="banner">${certificate.course.title.toUpperCase()}</div>
          </div>
          
          <!-- Certification Title -->
          <div class="certification-title">
            <div class="subtitle">Professional Certification</div>
            <h1 class="title">${certificate.course.title}</h1>
          </div>
          
          <!-- Student Section -->
          <div class="student-section">
            <div class="subtitle">Issued To</div>
            <h2 class="name">${certificate.user.name}</h2>
          </div>
          
          <!-- Certificate Statement -->
          <div class="certificate-statement">
            <p>
              The bearer of this professional certificate has demonstrated mastery of 
              <strong>${certificate.course.title}</strong> and completed 
              <strong>${certificate.completionPercentage}%</strong> of the course curriculum.
            </p>
          </div>
          
          <!-- Footer Section -->
          <div class="footer-section">
            <!-- Signature -->
            <div class="signature-section">
              <div class="signature-lines">
                <div class="signature-line"></div>
                <div class="signature-line"></div>
              </div>
              <div class="signature-text">Founders, TMDemy</div>
            </div>
            
            <!-- Logo -->
            <div class="logo-section-footer">
              <div class="logo-small">T</div>
              <div class="company-name">TMDemy</div>
            </div>
            
            <!-- QR Code & Details -->
            <div class="qr-section">
              <div class="qr-code">
                <div class="qr-pattern">
                  <div class="qr-square"></div>
                  <div class="qr-square"></div>
                  <div class="qr-square"></div>
                  <div class="qr-square"></div>
                  <div class="qr-square"></div>
                  <div class="qr-square"></div>
                  <div class="qr-square"></div>
                  <div class="qr-square"></div>
                  <div class="qr-square"></div>
                </div>
              </div>
              <div class="certificate-details">
                <p>Issued: ${new Date(certificate.issuedAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>
                <p>ID: ${certificate.certificateId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // For now, we'll return the HTML as a blob
  // In a real implementation, you would use a server-side PDF library like Puppeteer
  const blob = new Blob([htmlContent], { type: 'text/html' });
  return blob;
};

export const downloadServerCertificatePDF = async (
  certificate: ICertificateWithDetails,
  options: ServerCertificatePDFOptions = {}
): Promise<void> => {
  try {
    const blob = await generateServerCertificatePDF(certificate, options);
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = options.filename || `certificate-${certificate.course.title.replace(/\s+/g, '-').toLowerCase()}-${certificate.certificateId}.html`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error generating server certificate PDF:', error);
    throw new Error('Failed to generate certificate PDF');
  }
};
