"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  Star, 
  TrendingUp,
  Calendar,
  Clock,
  BookOpen,
  Flame
} from "lucide-react";
import { getLeaderboard } from "@/lib/actions/gamification.action";

interface LeaderboardCardProps {
  leaderboard: any[];
  currentUserId?: string;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ 
  leaderboard, 
  currentUserId 
}) => {
  const [activePeriod, setActivePeriod] = useState("all_time");
  const [activeCategory, setActiveCategory] = useState("points");
  const [leaderboardData, setLeaderboardData] = useState(leaderboard);
  const [isLoading, setIsLoading] = useState(false);

  const loadLeaderboard = async (period: string, category: string) => {
    setIsLoading(true);
    try {
      const result = await getLeaderboard(period, category, 10);
      if (result.success) {
        setLeaderboardData(result.data);
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (period: string) => {
    setActivePeriod(period);
    loadLeaderboard(period, activeCategory);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    loadLeaderboard(activePeriod, category);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'points':
        return <Star className="h-4 w-4" />;
      case 'streak':
        return <Flame className="h-4 w-4" />;
      case 'courses':
        return <BookOpen className="h-4 w-4" />;
      case 'time':
        return <Clock className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'daily':
        return 'Hàng ngày';
      case 'weekly':
        return 'Hàng tuần';
      case 'monthly':
        return 'Hàng tháng';
      case 'all_time':
        return 'Tất cả thời gian';
      default:
        return period;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'points':
        return 'Điểm số';
      case 'streak':
        return 'Streak';
      case 'courses':
        return 'Khóa học';
      case 'time':
        return 'Thời gian';
      default:
        return category;
    }
  };

  const formatValue = (value: number, category: string) => {
    switch (category) {
      case 'points':
        return value.toLocaleString();
      case 'streak':
        return `${value} ngày`;
      case 'courses':
        return `${value} khóa`;
      case 'time':
        return `${Math.round(value / 60)}h`;
      default:
        return value.toString();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Bảng xếp hạng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Period Tabs */}
        <Tabs value={activePeriod} onValueChange={handlePeriodChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="daily">Ngày</TabsTrigger>
            <TabsTrigger value="weekly">Tuần</TabsTrigger>
            <TabsTrigger value="monthly">Tháng</TabsTrigger>
            <TabsTrigger value="all_time">Tất cả</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={handleCategoryChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="points" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              Điểm
            </TabsTrigger>
            <TabsTrigger value="streak" className="flex items-center gap-1">
              <Flame className="h-3 w-3" />
              Streak
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              Khóa học
            </TabsTrigger>
            <TabsTrigger value="time" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Thời gian
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Leaderboard List */}
        <div className="space-y-2">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : (
            leaderboardData.map((entry, index) => {
              const isCurrentUser = entry.user._id === currentUserId;
              const rank = index + 1;
              
              return (
                <div 
                  key={entry._id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isCurrentUser 
                      ? 'bg-blue-50 border-2 border-blue-200' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(rank)}
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <img 
                        src={entry.user.avatar || '/default-avatar.png'} 
                        alt={entry.user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className={`font-medium ${isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                          {entry.user.name}
                        </p>
                        <p className="text-xs text-gray-500">@{entry.user.username}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Score */}
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(activeCategory)}
                      <span className="font-bold text-lg">
                        {formatValue(entry.points, activeCategory)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Level {entry.level}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Current User Position */}
        {currentUserId && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Vị trí của bạn</span>
              <span>
                #{leaderboardData.findIndex(entry => entry.user._id === currentUserId) + 1 || 'Chưa xếp hạng'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
