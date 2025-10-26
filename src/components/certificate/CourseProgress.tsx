"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { checkCertificateEligibility, createCertificate } from "@/lib/actions/certificate.action";
import { getCourseProgress } from "@/lib/actions/history.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle, Clock } from "lucide-react";
import { toast } from "react-toastify";

interface CourseProgressProps {
  courseId: string;
  courseTitle: string;
}

const CourseProgress: React.FC<CourseProgressProps> = ({ courseId, courseTitle }) => {
  const { user } = useUser();
  const [progress, setProgress] = useState<{
    completionPercentage: number;
    totalLessons: number;
    completedLessons: number;
  } | null>(null);
  const [eligibility, setEligibility] = useState<{
    eligible: boolean;
    completionPercentage: number;
    reason: string;
    certificate?: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingCertificate, setCreatingCertificate] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadProgress();
      checkEligibility();
    }
  }, [user?.id, courseId]);

  const loadProgress = async () => {
    try {
      if (!user?.id) return;
      
      const result = await getCourseProgress({
        courseId,
        userId: user.id
      });
      
      if (result.success && result.data) {
        setProgress({
          completionPercentage: result.data.completionPercentage,
          totalLessons: result.data.totalLessons,
          completedLessons: result.data.completedLessons,
        });
      } else {
        console.error("Error loading progress:", result.message);
        // Fallback to 0 progress if error
        setProgress({
          completionPercentage: 0,
          totalLessons: 0,
          completedLessons: 0,
        });
      }
    } catch (error) {
      console.error("Error loading progress:", error);
      // Fallback to 0 progress if error
      setProgress({
        completionPercentage: 0,
        totalLessons: 0,
        completedLessons: 0,
      });
    }
  };

  const checkEligibility = async () => {
    try {
      const result = await checkCertificateEligibility(courseId, user!.id);
      
      if (result.success) {
        setEligibility(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error checking eligibility:", error);
      toast.error("Lỗi khi kiểm tra điều kiện chứng chỉ!");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCertificate = async () => {
    if (!user?.id || !progress) return;

    try {
      setCreatingCertificate(true);
      const result = await createCertificate({
        userId: user.id, // This will be converted to MongoDB ID in the action
        courseId,
        completionPercentage: progress.completionPercentage,
      });

      if (result.success) {
        toast.success("Chứng chỉ đã được cấp thành công!");
        // Refresh eligibility
        await checkEligibility();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error creating certificate:", error);
      toast.error("Lỗi khi tạo chứng chỉ!");
    } finally {
      setCreatingCertificate(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user?.id) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Vui lòng đăng nhập để xem tiến độ!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Tiến độ khóa học
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Course Title */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {courseTitle}
          </h3>
        </div>

        {/* Progress Bar */}
        {progress && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Tiến độ hoàn thành
              </span>
              <span className="text-sm font-bold text-blue-600">
                {progress.completionPercentage}%
              </span>
            </div>
            
            <Progress 
              value={progress.completionPercentage} 
              className="h-3"
            />
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>{progress.completedLessons} bài học đã hoàn thành</span>
              <span>{progress.totalLessons} bài học tổng cộng</span>
            </div>
          </div>
        )}

        {/* Certificate Eligibility */}
        {eligibility && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Chứng chỉ</h4>
              {eligibility.eligible ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Đủ điều kiện
                </Badge>
              ) : (
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  Chưa đủ điều kiện
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {eligibility.reason}
            </p>

            {/* Certificate Actions */}
            {eligibility.eligible && !eligibility.certificate && (
              <Button
                onClick={handleCreateCertificate}
                disabled={creatingCertificate}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                {creatingCertificate ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang tạo chứng chỉ...
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4 mr-2" />
                    Nhận chứng chỉ
                  </>
                )}
              </Button>
            )}

            {eligibility.certificate && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">
                    Đã có chứng chỉ
                  </span>
                </div>
                <p className="text-sm text-green-700 mb-3">
                  Bạn đã nhận được chứng chỉ cho khóa học này!
                </p>
                <Button
                  onClick={() => window.location.href = `/certificates/${eligibility.certificate.certificateId}`}
                  variant="outline"
                  size="sm"
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  Xem chứng chỉ
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Course Stats */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">
                {progress?.completedLessons || 0}
              </div>
              <div className="text-sm text-blue-700">Bài đã học</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">
                {progress?.totalLessons || 0}
              </div>
              <div className="text-sm text-green-700">Tổng bài học</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseProgress;
