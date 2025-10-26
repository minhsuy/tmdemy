"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Zap } from "lucide-react";

interface LevelProgressProps {
  currentLevel: number;
  experiencePoints: number;
  progressToNextLevel: number;
  nextLevelExp: number;
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  currentLevel,
  experiencePoints,
  progressToNextLevel,
  nextLevelExp
}) => {
  const getLevelTitle = (level: number) => {
    if (level <= 5) return "Người mới bắt đầu";
    if (level <= 10) return "Học viên";
    if (level <= 20) return "Sinh viên";
    if (level <= 30) return "Chuyên gia";
    if (level <= 50) return "Bậc thầy";
    return "Huyền thoại";
  };

  const getLevelColor = (level: number) => {
    if (level <= 5) return "from-gray-400 to-gray-600";
    if (level <= 10) return "from-green-400 to-green-600";
    if (level <= 20) return "from-blue-400 to-blue-600";
    if (level <= 30) return "from-purple-400 to-purple-600";
    if (level <= 50) return "from-orange-400 to-orange-600";
    return "from-yellow-400 to-yellow-600";
  };

  const getLevelIcon = (level: number) => {
    if (level <= 5) return <Star className="h-6 w-6" />;
    if (level <= 10) return <Zap className="h-6 w-6" />;
    if (level <= 20) return <Crown className="h-6 w-6" />;
    return <Crown className="h-6 w-6" />;
  };

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className={`w-8 h-8 bg-gradient-to-r ${getLevelColor(currentLevel)} rounded-full flex items-center justify-center text-white`}>
            {getLevelIcon(currentLevel)}
          </div>
          <div>
            <p className="text-lg font-bold">Cấp độ {currentLevel}</p>
            <p className="text-sm text-gray-600">{getLevelTitle(currentLevel)}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tiến độ đến cấp {currentLevel + 1}</span>
            <span>{Math.round(progressToNextLevel)}%</span>
          </div>
          <Progress value={progressToNextLevel} className="h-3" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{experiencePoints.toLocaleString()} XP</span>
            <span>{nextLevelExp.toLocaleString()} XP</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Điểm kinh nghiệm</span>
          </div>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {experiencePoints.toLocaleString()} XP
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default LevelProgress;
