"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { ICertificateWithDetails } from "@/types/type";
import { getCertificatesByUser } from "@/lib/actions/certificate.action";
import Certificate from "./Certificate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, Award } from "lucide-react";
import { toast } from "react-toastify";

const CertificateList: React.FC = () => {
  const { user } = useUser();
  const [certificates, setCertificates] = useState<ICertificateWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<ICertificateWithDetails | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadCertificates();
    }
  }, [user?.id]);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const result = await getCertificatesByUser(user!.id);
      
      if (result.success) {
        setCertificates(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error loading certificates:", error);
      toast.error("Lỗi khi tải chứng chỉ!");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCertificate = (certificate: ICertificateWithDetails) => {
    setSelectedCertificate(certificate);
  };


  const handleShareCertificate = (certificate: ICertificateWithDetails) => {
    // TODO: Implement sharing
    toast.success("Tính năng chia sẻ sẽ được triển khai!");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Vui lòng đăng nhập để xem chứng chỉ!</p>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Chưa có chứng chỉ nào
        </h3>
        <p className="text-gray-600 mb-4">
          Hoàn thành khóa học để nhận chứng chỉ!
        </p>
        <Button 
          onClick={() => window.location.href = "/study"}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Xem khóa học của tôi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Chứng chỉ của tôi
        </h2>
        <p className="text-gray-600">
          Bạn đã hoàn thành {certificates.length} khóa học và nhận được chứng chỉ
        </p>
      </div>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCertificate(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Chứng chỉ</h3>
              <Button
                onClick={() => setSelectedCertificate(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Đóng
              </Button>
            </div>
            <div className="p-4">
              <Certificate
                certificate={selectedCertificate}
              />
            </div>
          </div>
        </div>
      )}

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate) => (
          <Card key={certificate._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2 mb-2">
                    {certificate.course.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {certificate.completionPercentage}% hoàn thành
                    </Badge>
                    <Badge variant="outline">
                      {certificate.status}
                    </Badge>
                  </div>
                </div>
                <Award className="w-8 h-8 text-yellow-500 flex-shrink-0" />
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Course Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Cấp ngày: {formatDate(certificate.issuedAt)}</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>ID: {certificate.certificateId}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleViewCertificate(certificate)}
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Xem chứng chỉ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CertificateList;
