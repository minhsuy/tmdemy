"use client";

import { useState } from "react";
import { downloadCertificatePDF } from "@/utils/certificate-pdf";
import { downloadServerCertificatePDF } from "@/utils/server-certificate-pdf";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { ICertificateWithDetails } from "@/types/type";

interface CertificateDownloadProps {
  certificate: ICertificateWithDetails;
}

const CertificateDownload: React.FC<CertificateDownloadProps> = ({
  certificate,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      console.log("=== Starting Certificate PDF Generation ===");
      console.log("Certificate data:", certificate);
      
      // Try client-side generation first
      try {
        await downloadCertificatePDF(
          certificate.certificateId, 
          certificate.course.title, 
          certificate.user.name
        );
        toast.success("Chứng chỉ đã được tải xuống thành công!");
        return;
      } catch (clientError) {
        console.warn("Client-side PDF generation failed, trying server-side:", clientError);
        
        // Fallback to server-side generation
        await downloadServerCertificatePDF(certificate, {
          filename: `certificate-${certificate.course.title.replace(/\s+/g, '-').toLowerCase()}-${certificate.certificateId}.html`
        });
        toast.success("Chứng chỉ đã được tải xuống thành công! (HTML format)");
      }
      
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error(`Lỗi: ${error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải xuống chứng chỉ'}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Đang tạo PDF...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Tải xuống PDF
        </>
      )}
    </Button>
  );
};

export default CertificateDownload;
