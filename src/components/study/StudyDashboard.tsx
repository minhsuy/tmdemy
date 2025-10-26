"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Award, 
  Play, 
  CheckCircle, 
  Star,
  Calendar,
  Target,
  TrendingUp,
  FileText,
  Video,
  Code
} from "lucide-react";
import { ICourse } from "@/database/course.model";
import { calculateCourseCompletion } from "@/lib/actions/certificate.action";
import { getCertificatesByUser } from "@/lib/actions/certificate.action";
import { getUserGamification } from "@/lib/actions/gamification.action";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import GamificationDashboard from "@/components/gamification/GamificationDashboard";

interface StudyDashboardProps {
  courseList: ICourse[];
}

interface CourseProgress {
  courseId: string;
  completionPercentage: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed?: Date;
  certificateEligible: boolean;
  hasCertificate: boolean;
}

const StudyDashboard: React.FC<StudyDashboardProps> = ({ courseList }) => {
  const { user } = useUser();
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastLesson, setLastLesson] = useState<any[]>([]);
  const [gamificationData, setGamificationData] = useState<any>(null);
  const [showGamification, setShowGamification] = useState(false);

  useEffect(() => {
    loadCourseProgress();
    loadCertificates();
    loadLastLesson();
    loadGamificationData();
  }, [user?.id]);

  const loadLastLesson = () => {
    if (typeof window !== "undefined") {
      const data = JSON.parse(localStorage?.getItem("lastLesson") || "[]");
      setLastLesson(data || []);
    }
  };

  const loadCourseProgress = async () => {
    if (!user?.id) return;
    
    try {
      const progressPromises = courseList.map(async (course) => {
        const result = await calculateCourseCompletion(course._id, user.id);
        return {
          courseId: course._id,
          completionPercentage: result.success ? result.data.completionPercentage : 0,
          totalLessons: result.success ? result.data.totalLessons : 0,
          completedLessons: result.success ? result.data.completedLessons : 0,
          certificateEligible: result.success ? result.data.completionPercentage >= 60 : false,
          hasCertificate: false, // Will be updated after loading certificates
        };
      });
      
      const progress = await Promise.all(progressPromises);
      setCourseProgress(progress);
    } catch (error) {
      console.error("Error loading course progress:", error);
    }
  };

  const loadCertificates = async () => {
    if (!user?.id) return;
    
    try {
      const result = await getCertificatesByUser(user.id);
      if (result.success) {
        setCertificates(result.data);
        // Update course progress with certificate status
        setCourseProgress(prev => prev.map(progress => ({
          ...progress,
          hasCertificate: result.data.some((cert: any) => cert.course._id === progress.courseId)
        })));
      }
    } catch (error) {
      console.error("Error loading certificates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadGamificationData = async () => {
    if (!user?.id) return;
    
    try {
      const result = await getUserGamification(user.id);
      if (result.success) {
        setGamificationData(result.data);
      }
    } catch (error) {
      console.error("Error loading gamification data:", error);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return "bg-green-100 text-green-800 border-green-200";
      case 'intermediate':
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'advanced':
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCourseStats = () => {
    const totalCourses = courseList.length;
    const completedCourses = courseProgress.filter(p => p.completionPercentage === 100).length;
    const inProgressCourses = courseProgress.filter(p => p.completionPercentage > 0 && p.completionPercentage < 100).length;
    const totalCertificates = certificates.length;
    const totalLessonsCompleted = courseProgress.reduce((sum, p) => sum + p.completedLessons, 0);
    const totalLessons = courseProgress.reduce((sum, p) => sum + p.totalLessons, 0);

    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      totalCertificates,
      totalLessonsCompleted,
      totalLessons,
      overallProgress: totalLessons > 0 ? Math.round((totalLessonsCompleted / totalLessons) * 100) : 0
    };
  };

  const stats = getCourseStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gamification Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Bảng điều khiển học tập</h2>
        <Button
          onClick={() => setShowGamification(!showGamification)}
          variant={showGamification ? "default" : "outline"}
          className="flex items-center gap-2"
        >
          <Trophy className="h-4 w-4" />
          {showGamification ? "Ẩn gamification" : "Hiển thị gamification"}
        </Button>
      </div>

      {/* Gamification Dashboard */}
      {showGamification && (
        <GamificationDashboard />
      )}

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng khóa học</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedCourses}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang học</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgressCourses}</p>
              </div>
              <Play className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chứng chỉ</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalCertificates}</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tiến độ tổng thể
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Hoàn thành bài học</span>
              <span className="text-sm text-gray-600">
                {stats.totalLessonsCompleted} / {stats.totalLessons}
              </span>
            </div>
            <Progress value={stats.overallProgress} className="h-3" />
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-600">{stats.overallProgress}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Khóa học của tôi
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseList
            .filter(course => course.status === 'ACTIVE' && !course._destroy)
            .map((course) => {
              const progress = courseProgress.find(p => p.courseId === course._id) || {
                completionPercentage: 0,
                totalLessons: 0,
                completedLessons: 0,
                certificateEligible: false,
                hasCertificate: false
              };

              return (
                <Card key={course._id} className={`overflow-hidden hover:shadow-lg transition-shadow text-primary ${
                progress.completionPercentage === 100 
                  ? 'ring-2 ring-primary/20' 
                  : ''
              }`}>
                  <div className="relative">
                    <Image
                      src={course.image || "https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                      alt={course.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    
                    {/* Progress overlay */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <div className="w-12 h-12 relative">
                          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-gray-300"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className={getProgressBarColor(progress.completionPercentage)}
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="none"
                              strokeDasharray={`${progress.completionPercentage}, 100`}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-700">
                              {progress.completionPercentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Certificate badge */}
                    {progress.hasCertificate && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-500 text-white">
                          <Award className="h-3 w-3 mr-1" />
                          Chứng chỉ
                        </Badge>
                      </div>
                    )}

                    {/* Completion badge */}
                    {progress.completionPercentage === 100 && !progress.hasCertificate && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Hoàn thành
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getDifficultyColor(course.level)}>
                            {course.level}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {progress.completedLessons}/{progress.totalLessons} bài học
                          </Badge>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tiến độ</span>
                          <span className={`font-medium ${getProgressColor(progress.completionPercentage)}`}>
                            {progress.completionPercentage}%
                          </span>
                        </div>
                        <Progress 
                          value={progress.completionPercentage} 
                          className={`h-2 ${
                            progress.completionPercentage === 100 
                              ? '[&>div]:bg-primary' 
                              : ''
                          }`}
                        />
                      </div>

                      {/* Status indicators */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Video className="h-4 w-4 text-blue-500" />
                            <span className="text-gray-600">Video</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4 text-green-500" />
                            <span className="text-gray-600">Tài liệu</span>
                          </div>
                        </div>
                        
                        {progress.certificateEligible && !progress.hasCertificate && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                            <Trophy className="h-3 w-3 mr-1" />
                            Đủ điều kiện
                          </Badge>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          asChild 
                          className="flex-1 bg-primary hover:bg-primary/90 text-white"
                        >
                          <Link href={(() => {
                            const lastLessonData = lastLesson.find((item) => item.course === course.slug);
                            if (lastLessonData?.url) {
                              return lastLessonData.url;
                            }
                            return `/${course.slug}/lesson?slug=${(course.lectures?.[0] as any)?.lessons?.[0]?.slug || ''}&page=1`;
                          })()}>
                            {progress.completionPercentage === 100 ? (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Tiếp tục học
                              </>
                            ) : progress.completionPercentage > 0 ? (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Tiếp tục
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Bắt đầu
                              </>
                            )}
                          </Link>
                        </Button>
                        
                        {progress.hasCertificate && (
                          <Button variant="outline" asChild>
                            <Link href="/my-certificates">
                              <Award className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>

      {/* Recent Activity */}
      {certificates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Chứng chỉ gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {certificates.slice(0, 3).map((certificate) => (
                <div key={certificate._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">{certificate.course.title}</p>
                      <p className="text-sm text-gray-600">
                        Hoàn thành {certificate.completionPercentage}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {new Date(certificate.issuedAt).toLocaleDateString('vi-VN')}
                    </p>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {certificate.certificateId}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudyDashboard;
