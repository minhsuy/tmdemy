"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target,
  BookOpen,
  Award,
  Play,
  CheckCircle
} from "lucide-react";

interface StudyStatsProps {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalCertificates: number;
  totalLessonsCompleted: number;
  totalLessons: number;
  overallProgress: number;
  thisWeekProgress?: number;
  thisMonthProgress?: number;
}

const StudyStats: React.FC<StudyStatsProps> = ({
  totalCourses,
  completedCourses,
  inProgressCourses,
  totalCertificates,
  totalLessonsCompleted,
  totalLessons,
  overallProgress,
  thisWeekProgress = 0,
  thisMonthProgress = 0
}) => {
  const completionRate = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;
  const averageProgress = totalCourses > 0 ? Math.round(overallProgress / totalCourses) : 0;

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Tổng khóa học</p>
                <p className="text-3xl font-bold text-blue-900">{totalCourses}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {completedCourses} đã hoàn thành
                </p>
              </div>
              <BookOpen className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Tỷ lệ hoàn thành</p>
                <p className="text-3xl font-bold text-green-900">{completionRate}%</p>
                <p className="text-xs text-green-600 mt-1">
                  {completedCourses}/{totalCourses} khóa học
                </p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Đang học</p>
                <p className="text-3xl font-bold text-yellow-900">{inProgressCourses}</p>
                <p className="text-xs text-yellow-600 mt-1">
                  {averageProgress}% tiến độ TB
                </p>
              </div>
              <Play className="h-10 w-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Chứng chỉ</p>
                <p className="text-3xl font-bold text-purple-900">{totalCertificates}</p>
                <p className="text-xs text-purple-600 mt-1">
                  {totalCertificates > 0 ? 'Đã đạt được' : 'Chưa có'}
                </p>
              </div>
              <Award className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <span className="text-sm font-medium">Bài học đã hoàn thành</span>
                <span className="text-sm text-gray-600">
                  {totalLessonsCompleted} / {totalLessons}
                </span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <div className="text-center">
                <span className="text-3xl font-bold text-blue-600">{overallProgress}%</span>
                <p className="text-sm text-gray-600 mt-1">Hoàn thành tổng thể</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tuần này</span>
                <span className="text-sm text-gray-600">{thisWeekProgress}%</span>
              </div>
              <Progress value={thisWeekProgress} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tháng này</span>
                <span className="text-sm text-gray-600">{thisMonthProgress}%</span>
              </div>
              <Progress value={thisMonthProgress} className="h-2" />
              
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tỷ lệ hoàn thành</span>
                  <span className="font-medium text-green-600">{completionRate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Tóm tắt thành tích
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">{totalCourses}</h3>
              <p className="text-sm text-gray-600">Khóa học đã đăng ký</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">{completedCourses}</h3>
              <p className="text-sm text-gray-600">Khóa học đã hoàn thành</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg">{totalCertificates}</h3>
              <p className="text-sm text-gray-600">Chứng chỉ đã nhận</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyStats;
