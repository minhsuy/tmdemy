"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Star, 
  Target, 
  Award, 
  Flame, 
  Clock, 
  BookOpen, 
  Code, 
  Quiz,
  Calendar,
  TrendingUp,
  Crown,
  Zap,
  Shield,
  Sword
} from "lucide-react";
import { getUserGamification } from "@/lib/actions/gamification.action";
import { useUser } from "@clerk/nextjs";
import AchievementBadge from "./AchievementBadge";
import LeaderboardCard from "./LeaderboardCard";
import DailyChallengeCard from "./DailyChallengeCard";
import LevelProgress from "./LevelProgress";

interface GamificationDashboardProps {
  className?: string;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ className }) => {
  const { user } = useUser();
  const [gamificationData, setGamificationData] = useState<any>(null);
  const [dailyChallenges, setDailyChallenges] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user?.id) {
      loadGamificationData();
    }
  }, [user?.id]);

  const loadGamificationData = async () => {
    try {
      setIsLoading(true);
      
      const profileResult = await getUserGamification(user?.id || "");

      if (profileResult.success) {
        setGamificationData(profileResult.data);
      }
    } catch (error) {
      console.error("Error loading gamification data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!gamificationData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Không thể tải dữ liệu gamification</p>
        </CardContent>
      </Card>
    );
  }

  const { 
    totalPoints, 
    currentLevel, 
    experiencePoints, 
    streak, 
    longestStreak,
    badges,
    achievements,
    coursesCompleted,
    lessonsCompleted,
    quizzesPassed,
    codeExercisesCompleted,
    certificatesEarned,
    totalStudyTime
  } = gamificationData;

  const nextLevelExp = Math.pow(currentLevel, 2) * 100;
  const currentLevelExp = Math.pow(currentLevel - 1, 2) * 100;
  const progressToNextLevel = ((experiencePoints - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Điểm số</p>
                <p className="text-3xl font-bold text-blue-900">{totalPoints.toLocaleString()}</p>
                <p className="text-xs text-blue-600 mt-1">Tổng điểm</p>
              </div>
              <Star className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Cấp độ</p>
                <p className="text-3xl font-bold text-purple-900">{currentLevel}</p>
                <p className="text-xs text-purple-600 mt-1">Level {currentLevel}</p>
              </div>
              <Crown className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Streak</p>
                <p className="text-3xl font-bold text-orange-900">{streak}</p>
                <p className="text-xs text-orange-600 mt-1">Ngày liên tiếp</p>
              </div>
              <Flame className="h-10 w-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Thành tích</p>
                <p className="text-3xl font-bold text-green-900">{achievements?.length || 0}</p>
                <p className="text-xs text-green-600 mt-1">Badges đã đạt</p>
              </div>
              <Award className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <LevelProgress 
        currentLevel={currentLevel}
        experiencePoints={experiencePoints}
        progressToNextLevel={progressToNextLevel}
        nextLevelExp={nextLevelExp}
      />

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="achievements">Thành tích</TabsTrigger>
          <TabsTrigger value="challenges">Thử thách</TabsTrigger>
          <TabsTrigger value="leaderboard">Bảng xếp hạng</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Study Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Thống kê học tập
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-900">{coursesCompleted}</p>
                    <p className="text-sm text-blue-600">Khóa học</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-900">{lessonsCompleted}</p>
                    <p className="text-sm text-green-600">Bài học</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Quiz className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-900">{quizzesPassed}</p>
                    <p className="text-sm text-purple-600">Quiz</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Code className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-900">{codeExercisesCompleted}</p>
                    <p className="text-sm text-orange-600">Code</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Thời gian học</span>
                    <span className="text-sm text-gray-600">{Math.round(totalStudyTime / 60)}h</span>
                  </div>
                  <Progress value={(totalStudyTime / (30 * 60)) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Streak Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  Chuỗi học tập
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Flame className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-4xl font-bold text-orange-600">{streak}</p>
                  <p className="text-lg text-gray-600">Ngày liên tiếp</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{longestStreak}</p>
                    <p className="text-sm text-gray-600">Kỷ lục</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{certificatesEarned}</p>
                    <p className="text-sm text-gray-600">Chứng chỉ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements?.map((achievement: any) => (
              <AchievementBadge 
                key={achievement._id}
                achievement={achievement}
                isNew={achievement.isNew}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyChallenges.map((challenge: any) => (
              <DailyChallengeCard 
                key={challenge._id}
                challenge={challenge}
                onProgressUpdate={() => loadGamificationData()}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <LeaderboardCard 
            leaderboard={leaderboard}
            currentUserId={user?.id}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationDashboard;
