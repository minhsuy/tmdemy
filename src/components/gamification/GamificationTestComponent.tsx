"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Award, 
  Crown, 
  Flame,
  Play,
  CheckCircle,
  XCircle
} from "lucide-react";
import GamificationDashboard from "@/components/gamification/GamificationDashboard";
import AchievementBadge from "@/components/gamification/AchievementBadge";
import LevelProgress from "@/components/gamification/LevelProgress";
import AchievementNotification from "@/components/gamification/AchievementNotification";

const GamificationTestComponent: React.FC = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [showGamification, setShowGamification] = useState(false);

  // Mock data for testing
  const mockAchievement = {
    _id: "test_achievement_1",
    badge: {
      _id: "test_badge_1",
      name: "Người mới bắt đầu",
      description: "Hoàn thành bài học đầu tiên",
      icon: "🎓",
      category: "learning",
      rarity: "common",
      points: 10
    },
    earnedAt: new Date().toISOString(),
    points: 10,
    isNew: true
  };

  const mockGamificationData = {
    totalPoints: 1250,
    currentLevel: 5,
    experiencePoints: 2500,
    streak: 7,
    longestStreak: 15,
    badges: [],
    achievements: [mockAchievement],
    coursesCompleted: 3,
    lessonsCompleted: 25,
    quizzesPassed: 8,
    codeExercisesCompleted: 5,
    certificatesEarned: 2,
    totalStudyTime: 1800
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Gamification UI</h1>
          <p className="text-gray-600 mt-2">
            Test các component UI của hệ thống gamification
          </p>
        </div>
      </div>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Test Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={() => setShowGamification(!showGamification)}
              variant={showGamification ? "default" : "outline"}
            >
              <Trophy className="h-4 w-4 mr-2" />
              {showGamification ? "Hide" : "Show"} Gamification Dashboard
            </Button>
            
            <Button 
              onClick={() => setShowNotification(!showNotification)}
              variant={showNotification ? "default" : "outline"}
            >
              <Award className="h-4 w-4 mr-2" />
              {showNotification ? "Hide" : "Show"} Achievement Notification
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gamification Dashboard Test */}
      {showGamification && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Gamification Dashboard Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">Điểm số</p>
                        <p className="text-3xl font-bold text-blue-900">{mockGamificationData.totalPoints}</p>
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
                        <p className="text-3xl font-bold text-purple-900">{mockGamificationData.currentLevel}</p>
                        <p className="text-xs text-purple-600 mt-1">Level {mockGamificationData.currentLevel}</p>
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
                        <p className="text-3xl font-bold text-orange-900">{mockGamificationData.streak}</p>
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
                        <p className="text-3xl font-bold text-green-900">{mockGamificationData.achievements.length}</p>
                        <p className="text-xs text-green-600 mt-1">Badges đã đạt</p>
                      </div>
                      <Award className="h-10 w-10 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Level Progress Test */}
              <LevelProgress 
                currentLevel={mockGamificationData.currentLevel}
                experiencePoints={mockGamificationData.experiencePoints}
                progressToNextLevel={75}
                nextLevelExp={3600}
              />

              {/* Achievement Badge Test */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AchievementBadge 
                  achievement={mockAchievement}
                  isNew={true}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Component Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Level Progress Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Level Progress Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LevelProgress 
              currentLevel={5}
              experiencePoints={2500}
              progressToNextLevel={75}
              nextLevelExp={3600}
            />
          </CardContent>
        </Card>

        {/* Achievement Badge Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievement Badge Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AchievementBadge 
              achievement={mockAchievement}
              isNew={true}
            />
          </CardContent>
        </Card>
      </div>

      {/* Progress Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Progress Components Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level Progress</span>
              <span>75%</span>
            </div>
            <Progress value={75} className="h-3" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Course Progress</span>
              <span>60%</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Streak Progress</span>
              <span>90%</span>
            </div>
            <Progress value={90} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Badge Rarity Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Badge Rarity Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="h-8 w-8 text-white" />
              </div>
              <Badge variant="outline" className="text-gray-600 border-gray-600">
                COMMON
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="h-8 w-8 text-white" />
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                RARE
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                EPIC
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                LEGENDARY
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Notification */}
      {showNotification && (
        <AchievementNotification 
          achievement={mockAchievement}
          onClose={() => setShowNotification(false)}
          autoClose={false}
        />
      )}
    </div>
  );
};

export default GamificationTestComponent;
