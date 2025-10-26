"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Star, 
  Trophy, 
  Crown, 
  Shield, 
  Sword,
  Zap,
  Target,
  BookOpen,
  Code,
  Quiz,
  Flame,
  Calendar,
  Clock
} from "lucide-react";

interface AchievementBadgeProps {
  achievement: {
    _id: string;
    badge: {
      _id: string;
      name: string;
      description: string;
      icon: string;
      category: string;
      rarity: string;
      points: number;
    };
    earnedAt: string;
    points: number;
    isNew: boolean;
  };
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const { badge, earnedAt, points, isNew } = achievement;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-600';
      case 'rare':
        return 'from-green-400 to-green-600';
      case 'epic':
        return 'from-purple-400 to-purple-600';
      case 'legendary':
        return 'from-yellow-400 to-yellow-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600';
      case 'rare':
        return 'text-green-600';
      case 'epic':
        return 'text-purple-600';
      case 'legendary':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning':
        return <BookOpen className="h-5 w-5" />;
      case 'achievement':
        return <Trophy className="h-5 w-5" />;
      case 'social':
        return <Target className="h-5 w-5" />;
      case 'special':
        return <Crown className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
      isNew ? 'ring-2 ring-yellow-400 shadow-lg' : ''
    }`}>
      {isNew && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-yellow-500 text-white animate-pulse">
            MỚI!
          </Badge>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Badge Icon */}
          <div className={`w-16 h-16 bg-gradient-to-br ${getRarityColor(badge.rarity)} rounded-full flex items-center justify-center text-white shadow-lg`}>
            {getCategoryIcon(badge.category)}
          </div>
          
          {/* Badge Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{badge.name}</h3>
              <Badge 
                variant="outline" 
                className={`${getRarityTextColor(badge.rarity)} border-current`}
              >
                {badge.rarity.toUpperCase()}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600">{badge.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{points} điểm</span>
              </div>
              
              <div className="text-xs text-gray-500">
                {formatDate(earnedAt)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress indicator for new achievements */}
        {isNew && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Thành tích mới đạt được!</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementBadge;
