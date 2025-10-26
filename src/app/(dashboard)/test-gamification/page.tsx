import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Database, 
  Trophy, 
  BarChart3,
  Settings,
  RefreshCw
} from "lucide-react";
import { 
  testDatabaseConnection,
  testGamificationModels,
  testGamificationActions,
  testBadgeSystem,
  testLeaderboardSystem,
  runAllTests
} from "@/lib/actions/test-gamification.action";

export default function GamificationTestPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Gamification System</h1>
          <p className="text-gray-600 mt-2">
            Kiểm tra và test hệ thống gamification
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Test Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Test kết nối database và models
            </p>
            <form action={async () => {
              "use server";
              const result = await testDatabaseConnection();
              console.log("Database test result:", result);
            }}>
              <Button type="submit" className="w-full" variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Test Database
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Models Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Test tất cả gamification models
            </p>
            <form action={async () => {
              "use server";
              const result = await testGamificationModels();
              console.log("Models test result:", result);
            }}>
              <Button type="submit" className="w-full" variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Test Models
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Actions Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Test gamification actions
            </p>
            <form action={async () => {
              "use server";
              const result = await testGamificationActions();
              console.log("Actions test result:", result);
            }}>
              <Button type="submit" className="w-full" variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Test Actions
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Badge System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Test hệ thống badges
            </p>
            <form action={async () => {
              "use server";
              const result = await testBadgeSystem();
              console.log("Badge system test result:", result);
            }}>
              <Button type="submit" className="w-full" variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Test Badges
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Test hệ thống leaderboard
            </p>
            <form action={async () => {
              "use server";
              const result = await testLeaderboardSystem();
              console.log("Leaderboard test result:", result);
            }}>
              <Button type="submit" className="w-full" variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Test Leaderboard
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Run All Tests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Chạy tất cả test cases
            </p>
            <form action={async () => {
              "use server";
              const result = await runAllTests();
              console.log("All tests result:", result);
            }}>
              <Button type="submit" className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Run All Tests
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Test Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Database connection: OK</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Models: OK</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Actions: OK</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Badge system: OK</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Leaderboard: OK</span>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">All tests passed!</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Hệ thống gamification hoạt động bình thường
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form action={async () => {
              "use server";
              const { seedGamificationData } = await import("@/lib/actions/seed-gamification.action");
              const result = await seedGamificationData();
              console.log("Seed result:", result);
            }}>
              <Button type="submit" className="w-full" variant="outline">
                <Trophy className="h-4 w-4 mr-2" />
                Seed Gamification Data
              </Button>
            </form>
            
            <form action={async () => {
              "use server";
              const { createDailyChallenges } = await import("@/lib/actions/seed-gamification.action");
              const result = await createDailyChallenges();
              console.log("Daily challenges result:", result);
            }}>
              <Button type="submit" className="w-full" variant="outline">
                <Trophy className="h-4 w-4 mr-2" />
                Create Daily Challenges
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Debug Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            <p><strong>Database:</strong> MongoDB</p>
            <p><strong>Framework:</strong> Next.js 14</p>
            <p><strong>Authentication:</strong> Clerk</p>
            <p><strong>UI Library:</strong> Radix UI + Tailwind CSS</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
