import { Metadata } from "next";
import CertificateList from "@/components/certificate/CertificateList";

export const metadata: Metadata = {
  title: "Chứng chỉ của tôi | TMDemy",
  description: "Xem và quản lý các chứng chỉ đã nhận được",
};

export default function MyCertificatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <CertificateList />
      </div>
    </div>
  );
}
