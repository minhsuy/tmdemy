"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Clock, 
  Award, 
  Star, 
  BookOpen, 
  Code, 
  Quiz, 
  Flame,
  CheckCircle,
  Gift
} from "lucide-react";
import { updateChallengeProgress } from "@/lib/actions/gamification.action";

interface DailyChallengeCardProps {
  challenge: {
    _id: string;
    title: string;
    description: string;
    type: string;
    target: number;
    reward: {
      points: number;
      badge?: any;
    };
    startDate: string;
    endDate: string;
    progress: {
      progress: number;
      isCompleted: boolean;
      rewardClaimed: boolean;
    };
  };
  onProgressUpdate: () => void;
}

const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({ 
  challenge, 
  onProgressUpdate 
}) => {
  const { 
    title, 
    description, 
    type, 
    target, 
    reward, 
    endDate, 
    progress 
  } = challenge;

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'complete_lessons':
        return <BookOpen className="h-5 w-5" />;
      case 'study_time':
        return <Clock className="h-5 w-5" />;
      case 'quiz_score':
        return <Quiz className="h-5 w-5" />;
      case 'code_exercise':
        return <Code className="h-5 w-5" />;
      case 'streak':
        return <Flame className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getChallengeTypeLabel = (type: string) => {
    switch (type) {
      case 'complete_lessons':
        return 'Hoàn thành bài học';
      case 'study_time':
        return 'Thời gian học';
      case 'quiz_score':
        return 'Điểm quiz';
      case 'code_exercise':
        return 'Bài tập code';
      case 'streak':
        return 'Chuỗi học tập';
      default:
        return type;
    }
  };

  const getProgressPercentage = () => {
    return Math.min((progress.progress / target) * 100, 100);
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Đã hết hạn';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const isExpired = new Date(endDate) < new Date();
  const isCompleted = progress.isCompleted;
  const progressPercentage = getProgressPercentage();

  const getStatusColor = () => {
    if (isExpired) return 'text-red-600';
    if (isCompleted) return 'text-green-600';
    return 'text-blue-600';
  };

  const getProgressColor = () => {
    if (isExpired) return 'bg-red-500';
    if (isCompleted) return 'bg-green-500';
    return 'bg-blue-500';
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${
      isCompleted ? 'ring-2 ring-green-200 bg-green-50' : ''
    }`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {getChallengeIcon(type)}
            {title}
          </CardTitle>
          <Badge 
            variant={isCompleted ? "default" : "secondary"}
            className={isCompleted ? "bg-green-500" : ""}
          >
            {isCompleted ? "Hoàn thành" : getChallengeTypeLabel(type)}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tiến độ</span>
            <span className={getStatusColor()}>
              {progress.progress} / {target}
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3"
          />
          <div className="text-center">
            <span className={`text-lg font-bold ${getStatusColor()}`}>
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>

        {/* Reward */}
        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium">Phần thưởng:</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-bold text-yellow-700">
              +{reward.points} điểm
            </span>
          </div>
        </div>

        {/* Time Remaining */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Còn lại:</span>
          </div>
          <span className={`font-medium ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
            {getTimeRemaining()}
          </span>
        </div>

        {/* Status */}
        {isCompleted && (
          <div className="flex items-center gap-2 p-3 bg-green-100 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Thử thách đã hoàn thành!
            </span>
          </div>
        )}

        {isExpired && !isCompleted && (
          <div className="flex items-center gap-2 p-3 bg-red-100 rounded-lg">
            <Clock className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">
              Thử thách đã hết hạn
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyChallengeCard;
