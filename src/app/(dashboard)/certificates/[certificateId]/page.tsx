import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCertificateById } from "@/lib/actions/certificate.action";
import Certificate from "@/components/certificate/Certificate";

interface CertificatePageProps {
  params: {
    certificateId: string;
  };
}

export async function generateMetadata({ params }: CertificatePageProps): Promise<Metadata> {
  const result = await getCertificateById(params.certificateId);
  
  if (!result.success) {
    return {
      title: "Không tìm thấy chứng chỉ | TMDemy",
    };
  }

  const certificate = result.data;
  
  return {
    title: `Chứng chỉ ${certificate.course.title} | TMDemy`,
    description: `Chứng chỉ hoàn thành khóa học ${certificate.course.title} của ${certificate.user.name}`,
  };
}

export default async function CertificatePage({ params }: CertificatePageProps) {
  const result = await getCertificateById(params.certificateId);
  
  if (!result.success) {
    notFound();
  }

  const certificate = result.data;

  // Download and share are now handled by client components

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Certificate
            certificate={certificate}
          />
        </div>
      </div>
    </div>
  );
}
