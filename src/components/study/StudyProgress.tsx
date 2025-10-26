"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  CheckCircle, 
  Award, 
  Clock, 
  BookOpen,
  Video,
  FileText,
  Code,
  Quiz,
  Target,
  Calendar
} from "lucide-react";
import { ICourse } from "@/database/course.model";
import Link from "next/link";
import Image from "next/image";

interface CourseProgress {
  courseId: string;
  completionPercentage: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed?: Date;
  certificateEligible: boolean;
  hasCertificate: boolean;
}

interface StudyProgressProps {
  courses: ICourse[];
  courseProgress: CourseProgress[];
  onCourseClick?: (course: ICourse) => void;
  lastLesson?: any[];
}

const StudyProgress: React.FC<StudyProgressProps> = ({ 
  courses, 
  courseProgress, 
  onCourseClick,
  lastLesson = []
}) => {
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

  const getStatusIcon = (percentage: number, hasCertificate: boolean) => {
    if (hasCertificate) {
      return <Award className="h-5 w-5 text-yellow-500" />;
    }
    if (percentage === 100) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (percentage > 0) {
      return <Play className="h-5 w-5 text-blue-500" />;
    }
    return <BookOpen className="h-5 w-5 text-gray-400" />;
  };

  const getStatusText = (percentage: number, hasCertificate: boolean) => {
    if (hasCertificate) {
      return "Đã có chứng chỉ";
    }
    if (percentage === 100) {
      return "Đã hoàn thành";
    }
    if (percentage > 0) {
      return "Đang học";
    }
    return "Chưa bắt đầu";
  };

  const getStatusColor = (percentage: number, hasCertificate: boolean) => {
    if (hasCertificate) {
      return "bg-yellow-100 text-yellow-800";
    }
    if (percentage === 100) {
      return "bg-green-100 text-green-800";
    }
    if (percentage > 0) {
      return "bg-blue-100 text-blue-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="h-6 w-6" />
          Tiến độ học tập
        </h2>
        <Badge variant="outline" className="text-sm">
          {courses.length} khóa học
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses
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
              <Card key={course._id} className={`group hover:shadow-lg transition-all duration-300 border-l-4 ${
                progress.completionPercentage === 100 
                  ? 'border-l-primary ring-2 ring-primary/20 bg-primary/5' 
                  : 'border-l-blue-500'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getDifficultyColor(course.level)}>
                          {course.level}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {progress.completedLessons}/{progress.totalLessons} bài
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(progress.completionPercentage, progress.hasCertificate)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Course Image */}
                  <div className="relative">
                    <Image
                      src={course.image || "https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                      alt={course.title}
                      width={300}
                      height={150}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    
                    {/* Progress overlay */}
                    <div className="absolute top-2 right-2">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-1">
                        <div className="w-8 h-8 relative">
                          <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-gray-300"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className={getProgressBarColor(progress.completionPercentage)}
                              stroke="currentColor"
                              strokeWidth="2"
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
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-yellow-500 text-white">
                          <Award className="h-3 w-3 mr-1" />
                          Chứng chỉ
                        </Badge>
                      </div>
                    )}

                    {/* Completion badge */}
                    {progress.completionPercentage === 100 && !progress.hasCertificate && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Hoàn thành
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Progress Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tiến độ học tập</span>
                      <span className={`font-semibold ${getProgressColor(progress.completionPercentage)}`}>
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
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{progress.completedLessons} bài đã hoàn thành</span>
                      <span>{progress.totalLessons - progress.completedLessons} bài còn lại</span>
                    </div>
                  </div>

                  {/* Status and Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(progress.completionPercentage, progress.hasCertificate)}>
                        {getStatusText(progress.completionPercentage, progress.hasCertificate)}
                      </Badge>
                      
                      {progress.certificateEligible && !progress.hasCertificate && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                          <Trophy className="h-3 w-3 mr-1" />
                          Đủ điều kiện
                        </Badge>
                      )}
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          <span>Video</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>Tài liệu</span>
                        </div>
                      </div>
                      
                      {progress.lastAccessed && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(progress.lastAccessed).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      asChild 
                      className="flex-1 bg-primary hover:bg-primary/90 text-white"
                      onClick={() => onCourseClick?.(course)}
                    >
                      <Link href={(() => {
                        const lastLessonData = lastLesson.find((item) => item.course === course.slug);
                        if (lastLessonData?.url) {
                          return lastLessonData.url;
                        }
                        return `/${course.slug}/lesson?slug=${course.lectures?.[0]?.lessons?.[0]?.slug || ''}&page=1`;
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
                      <Button variant="outline" asChild size="sm">
                        <Link href="/my-certificates">
                          <Award className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Empty State */}
      {courses.filter(course => course.status === 'ACTIVE' && !course._destroy).length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Chưa có khóa học nào
            </h3>
            <p className="text-gray-500 mb-4">
              Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học có sẵn!
            </p>
            <Button asChild>
              <Link href="/">
                Khám phá khóa học
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudyProgress;
