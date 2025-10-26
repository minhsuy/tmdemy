import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Award, 
  Star, 
  Target, 
  Plus,
  Settings,
  Users,
  BarChart3
} from "lucide-react";
import { seedGamificationData, createDailyChallenges } from "@/lib/actions/seed-gamification.action";
import { Badge as BadgeModel } from "@/database/gamification.model";
import { connectToDatabase } from "@/lib/mongoose";

async function getGamificationStats() {
  try {
    await connectToDatabase();
    
    const totalBadges = await BadgeModel.countDocuments();
    const activeBadges = await BadgeModel.countDocuments({ isActive: true });
    const commonBadges = await BadgeModel.countDocuments({ rarity: 'common' });
    const rareBadges = await BadgeModel.countDocuments({ rarity: 'rare' });
    const epicBadges = await BadgeModel.countDocuments({ rarity: 'epic' });
    const legendaryBadges = await BadgeModel.countDocuments({ rarity: 'legendary' });
    
    return {
      totalBadges,
      activeBadges,
      commonBadges,
      rareBadges,
      epicBadges,
      legendaryBadges
    };
  } catch (error) {
    console.error("Error getting gamification stats:", error);
    return {
      totalBadges: 0,
      activeBadges: 0,
      commonBadges: 0,
      rareBadges: 0,
      epicBadges: 0,
      legendaryBadges: 0
    };
  }
}

export default async function GamificationManagePage() {
  const stats = await getGamificationStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Gamification</h1>
          <p className="text-gray-600 mt-2">
            Quản lý hệ thống gamification, badges, và thử thách
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Cài đặt
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng badges</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBadges}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.activeBadges} đang hoạt động
                </p>
              </div>
              <Trophy className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Common</p>
                <p className="text-3xl font-bold text-gray-900">{stats.commonBadges}</p>
                <p className="text-xs text-gray-500 mt-1">Phổ biến</p>
              </div>
              <Star className="h-10 w-10 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rare</p>
                <p className="text-3xl font-bold text-gray-900">{stats.rareBadges}</p>
                <p className="text-xs text-gray-500 mt-1">Hiếm</p>
              </div>
              <Award className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Epic & Legendary</p>
                <p className="text-3xl font-bold text-gray-900">{stats.epicBadges + stats.legendaryBadges}</p>
                <p className="text-xs text-gray-500 mt-1">Cao cấp</p>
              </div>
              <Trophy className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badge Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Quản lý Badges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Quản lý hệ thống badges và achievements
            </p>
            
            <div className="space-y-2">
              <Button 
                className="w-full justify-start"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo badge mới
              </Button>
              
              <Button 
                className="w-full justify-start"
                variant="outline"
              >
                <Settings className="h-4 w-4 mr-2" />
                Chỉnh sửa badges
              </Button>
              
              <Button 
                className="w-full justify-start"
                variant="outline"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Thống kê badges
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Challenge Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quản lý Thử thách
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Tạo và quản lý thử thách hàng ngày
            </p>
            
            <div className="space-y-2">
              <Button 
                className="w-full justify-start"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo thử thách mới
              </Button>
              
              <Button 
                className="w-full justify-start"
                variant="outline"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Lịch thử thách
              </Button>
              
              <Button 
                className="w-full justify-start"
                variant="outline"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Thống kê thử thách
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Hành động hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Các hành động quản lý hệ thống gamification
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form action={async () => {
              "use server";
              const result = await seedGamificationData();
              if (result.success) {
                console.log("Gamification data seeded successfully");
              }
              }
            }}>
              <Button 
                type="submit"
                className="w-full"
                variant="outline"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Khởi tạo dữ liệu gamification
              </Button>
            </form>
            
            <form action={async () => {
              "use server";
              const result = await createDailyChallenges();
              if (result.success) {
                console.log("Daily challenges created successfully");
              }
            }}>
              <Button 
                type="submit"
                className="w-full"
                variant="outline"
              >
                <Target className="h-4 w-4 mr-2" />
                Tạo thử thách hàng ngày
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Badge Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Học tập</h3>
            <p className="text-sm text-gray-600">Badges cho hoạt động học tập</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Thành tích</h3>
            <p className="text-sm text-gray-600">Badges cho thành tích đặc biệt</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Xã hội</h3>
            <p className="text-sm text-gray-600">Badges cho tương tác xã hội</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Đặc biệt</h3>
            <p className="text-sm text-gray-600">Badges đặc biệt và hiếm</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
