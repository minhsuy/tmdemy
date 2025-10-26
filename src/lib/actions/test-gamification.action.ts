"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { 
  UserGamification, 
  Badge, 
  Achievement, 
  Leaderboard, 
  StudyStreak,
  DailyChallenge,
  UserChallengeProgress
} from "@/database/gamification.model";

// Test database connection
export async function testDatabaseConnection() {
  try {
    await connectToDatabase();
    console.log("✅ Database connection successful");
    return { success: true, message: "Database connected successfully" };
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return { success: false, error: "Database connection failed" };
  }
}

// Test gamification models
export async function testGamificationModels() {
  try {
    await connectToDatabase();
    
    // Test UserGamification model
    const userGamificationCount = await UserGamification.countDocuments();
    console.log(`✅ UserGamification model: ${userGamificationCount} records`);
    
    // Test Badge model
    const badgeCount = await Badge.countDocuments();
    console.log(`✅ Badge model: ${badgeCount} records`);
    
    // Test Achievement model
    const achievementCount = await Achievement.countDocuments();
    console.log(`✅ Achievement model: ${achievementCount} records`);
    
    // Test Leaderboard model
    const leaderboardCount = await Leaderboard.countDocuments();
    console.log(`✅ Leaderboard model: ${leaderboardCount} records`);
    
    // Test StudyStreak model
    const streakCount = await StudyStreak.countDocuments();
    console.log(`✅ StudyStreak model: ${streakCount} records`);
    
    // Test DailyChallenge model
    const challengeCount = await DailyChallenge.countDocuments();
    console.log(`✅ DailyChallenge model: ${challengeCount} records`);
    
    // Test UserChallengeProgress model
    const progressCount = await UserChallengeProgress.countDocuments();
    console.log(`✅ UserChallengeProgress model: ${progressCount} records`);
    
    return {
      success: true,
      data: {
        userGamificationCount,
        badgeCount,
        achievementCount,
        leaderboardCount,
        streakCount,
        challengeCount,
        progressCount
      }
    };
  } catch (error) {
    console.error("❌ Error testing models:", error);
    return { success: false, error: "Error testing models" };
  }
}

// Test gamification actions
export async function testGamificationActions() {
  try {
    await connectToDatabase();
    
    // Test user ID (you can replace this with a real user ID)
    const testUserId = "test_user_123";
    
    console.log("🧪 Testing gamification actions...");
    
    // Test initializeUserGamification
    const { initializeUserGamification } = await import("@/lib/actions/gamification.action");
    const initResult = await initializeUserGamification(testUserId);
    console.log(`✅ Initialize user gamification: ${initResult.success ? 'SUCCESS' : 'FAILED'}`);
    
    // Test getUserGamification
    const { getUserGamification } = await import("@/lib/actions/gamification.action");
    const getResult = await getUserGamification(testUserId);
    console.log(`✅ Get user gamification: ${getResult.success ? 'SUCCESS' : 'FAILED'}`);
    
    // Test awardPoints
    const { awardPoints } = await import("@/lib/actions/gamification.action");
    const pointsResult = await awardPoints(testUserId, 50, "Test points");
    console.log(`✅ Award points: ${pointsResult.success ? 'SUCCESS' : 'FAILED'}`);
    
    // Test updateStudyStreak
    const { updateStudyStreak } = await import("@/lib/actions/gamification.action");
    const streakResult = await updateStudyStreak(testUserId);
    console.log(`✅ Update study streak: ${streakResult.success ? 'SUCCESS' : 'FAILED'}`);
    
    return {
      success: true,
      data: {
        initializeUserGamification: initResult.success,
        getUserGamification: getResult.success,
        awardPoints: pointsResult.success,
        updateStudyStreak: streakResult.success
      }
    };
  } catch (error) {
    console.error("❌ Error testing actions:", error);
    return { success: false, error: "Error testing actions" };
  }
}

// Test badge system
export async function testBadgeSystem() {
  try {
    await connectToDatabase();
    
    console.log("🏆 Testing badge system...");
    
    // Get all badges
    const badges = await Badge.find({ isActive: true });
    console.log(`✅ Found ${badges.length} active badges`);
    
    // Test badge categories
    const categories = await Badge.distinct("category");
    console.log(`✅ Badge categories: ${categories.join(", ")}`);
    
    // Test badge rarities
    const rarities = await Badge.distinct("rarity");
    console.log(`✅ Badge rarities: ${rarities.join(", ")}`);
    
    // Test badge requirements
    const badgesWithRequirements = await Badge.find({ 
      "requirements.0": { $exists: true } 
    });
    console.log(`✅ Badges with requirements: ${badgesWithRequirements.length}`);
    
    return {
      success: true,
      data: {
        totalBadges: badges.length,
        categories,
        rarities,
        badgesWithRequirements: badgesWithRequirements.length
      }
    };
  } catch (error) {
    console.error("❌ Error testing badge system:", error);
    return { success: false, error: "Error testing badge system" };
  }
}

// Test leaderboard system
export async function testLeaderboardSystem() {
  try {
    await connectToDatabase();
    
    console.log("📊 Testing leaderboard system...");
    
    // Test leaderboard periods
    const periods = await Leaderboard.distinct("period");
    console.log(`✅ Leaderboard periods: ${periods.join(", ")}`);
    
    // Test leaderboard categories
    const categories = await Leaderboard.distinct("category");
    console.log(`✅ Leaderboard categories: ${categories.join(", ")}`);
    
    // Test leaderboard data
    const leaderboardData = await Leaderboard.find()
      .populate("user", "name username")
      .sort({ points: -1 })
      .limit(5);
    
    console.log(`✅ Top 5 leaderboard entries: ${leaderboardData.length}`);
    
    return {
      success: true,
      data: {
        periods,
        categories,
        topEntries: leaderboardData.length
      }
    };
  } catch (error) {
    console.error("❌ Error testing leaderboard system:", error);
    return { success: false, error: "Error testing leaderboard system" };
  }
}

// Run all tests
export async function runAllTests() {
  console.log("🚀 Starting gamification system tests...\n");
  
  const results = {
    databaseConnection: await testDatabaseConnection(),
    models: await testGamificationModels(),
    actions: await testGamificationActions(),
    badgeSystem: await testBadgeSystem(),
    leaderboardSystem: await testLeaderboardSystem()
  };
  
  console.log("\n📋 Test Results Summary:");
  console.log("================================");
  
  Object.entries(results).forEach(([testName, result]) => {
    const status = result.success ? "✅ PASS" : "❌ FAIL";
    console.log(`${testName}: ${status}`);
    if (!result.success && result.error) {
      console.log(`  Error: ${result.error}`);
    }
  });
  
  const allPassed = Object.values(results).every(result => result.success);
  console.log(`\n🎯 Overall Result: ${allPassed ? "✅ ALL TESTS PASSED" : "❌ SOME TESTS FAILED"}`);
  
  return {
    success: allPassed,
    results
  };
}
