"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { Badge } from "@/database/gamification.model";

// Seed initial badges and achievements
export async function seedGamificationData() {
  try {
    await connectToDatabase();
    
    const badges = [
      // Learning badges
      {
        name: "Người mới bắt đầu",
        description: "Hoàn thành bài học đầu tiên",
        icon: "🎓",
        category: "learning",
        rarity: "common",
        points: 10,
        requirements: [
          {
            type: "lesson_completion",
            value: 1,
            condition: "greater_than"
          }
        ]
      },
      {
        name: "Học viên chăm chỉ",
        description: "Hoàn thành 10 bài học",
        icon: "📚",
        category: "learning",
        rarity: "common",
        points: 25,
        requirements: [
          {
            type: "lesson_completion",
            value: 10,
            condition: "greater_than"
          }
        ]
      },
      {
        name: "Sinh viên xuất sắc",
        description: "Hoàn thành 50 bài học",
        icon: "🎯",
        category: "learning",
        rarity: "rare",
        points: 50,
        requirements: [
          {
            type: "lesson_completion",
            value: 50,
            condition: "greater_than"
          }
        ]
      },
      {
        name: "Chuyên gia học tập",
        description: "Hoàn thành 100 bài học",
        icon: "🏆",
        category: "learning",
        rarity: "epic",
        points: 100,
        requirements: [
          {
            type: "lesson_completion",
            value: 100,
            condition: "greater_than"
          }
        ]
      },
      
      // Course completion badges
      {
        name: "Khóa học đầu tiên",
        description: "Hoàn thành khóa học đầu tiên",
        icon: "🎉",
        category: "achievement",
        rarity: "common",
        points: 50,
        requirements: [
          {
            type: "course_completion",
            value: 1,
            condition: "greater_than"
          }
        ]
      },
      {
        name: "Người học đa dạng",
        description: "Hoàn thành 5 khóa học",
        icon: "🌟",
        category: "achievement",
        rarity: "rare",
        points: 100,
        requirements: [
          {
            type: "course_completion",
            value: 5,
            condition: "greater_than"
          }
        ]
      },
      {
        name: "Bậc thầy học tập",
        description: "Hoàn thành 10 khóa học",
        icon: "👑",
        category: "achievement",
        rarity: "epic",
        points: 200,
        requirements: [
          {
            type: "course_completion",
            value: 10,
            condition: "greater_than"
          }
        ]
      },
      
      // Streak badges
      {
        name: "Ngày đầu tiên",
        description: "Học liên tiếp 1 ngày",
        icon: "🔥",
        category: "learning",
        rarity: "common",
        points: 5,
        requirements: [
          {
            type: "streak",
            value: 1,
            condition: "greater_than"
          }
        ]
      },
      {
        name: "Tuần học tập",
        description: "Học liên tiếp 7 ngày",
        icon: "🔥🔥",
        category: "learning",
        rarity: "rare",
        points: 50,
        requirements: [
          {
            type: "streak",
            value: 7,
            condition: "greater_than"
          }
        ]
      },
      {
        name: "Tháng học tập",
        description: "Học liên tiếp 30 ngày",
        icon: "🔥🔥🔥",
        category: "learning",
        rarity: "epic",
        points: 200,
        requirements: [
          {
            type: "streak",
            value: 30,
            condition: "greater_than"
          }
        ]
      },
      {
        name: "Huyền thoại học tập",
        description: "Học liên tiếp 100 ngày",
        icon: "🔥🔥🔥🔥",
        category: "learning",
        rarity: "legendary",
        points: 500,
        requirements: [
          {
            type: "streak",
            value: 100,
            condition: "greater_than"
          }
        ]
      },
      
      // Points badges
      {
        name: "Điểm đầu tiên",
        description: "Đạt được 100 điểm",
        icon: "⭐",
        category: "achievement",
        rarity: "common",
        points: 10,
        requirements: [
          {
            type: "points",
            value: 100,
            condition: "greater_than"
          }
        ]
      },
      {
        name: "Người tích lũy",
        description: "Đạt được 1000 điểm",
        icon: "⭐⭐",
        category: "achievement",
        rarity: "rare",
        points: 25,
        requirements: [
          {
            type: "points",
            value: 1000,
            condition: "greater_than"
          }
        ]
      },
      {
        name: "Bậc thầy điểm số",
        description: "Đạt được 5000 điểm",
        icon: "⭐⭐⭐",
        category: "achievement",
        rarity: "epic",
        points: 50,
        requirements: [
          {
            type: "points",
            value: 5000,
            condition: "greater_than"
          }
        ]
      },
      {
        name: "Huyền thoại điểm số",
        description: "Đạt được 10000 điểm",
        icon: "⭐⭐⭐⭐",
        category: "achievement",
        rarity: "legendary",
        points: 100,
        requirements: [
          {
            type: "points",
            value: 10000,
            condition: "greater_than"
          }
        ]
      },
      
      // Quiz badges
      {
        name: "Người làm quiz",
        description: "Hoàn thành quiz đầu tiên",
        icon: "❓",
        category: "learning",
        rarity: "common",
        points: 15,
        requirements: [
          {
            type: "quiz_score",
            value: 1,
            condition: "greater_than"
          }
        ]
      },
      {
        name: "Chuyên gia quiz",
        description: "Hoàn thành 10 quiz",
        icon: "🧠",
        category: "learning",
        rarity: "rare",
        points: 75,
        requirements: [
          {
            type: "quiz_score",
            value: 10,
            condition: "greater_than"
          }
        ]
      },
      
      // Code exercise badges
      {
        name: "Lập trình viên mới",
        description: "Hoàn thành bài tập code đầu tiên",
        icon: "💻",
        category: "learning",
        rarity: "common",
        points: 20,
        requirements: [
          {
            type: "code_exercise",
            value: 1,
            condition: "greater_than"
          }
        ]
      },
      {
        name: "Lập trình viên chuyên nghiệp",
        description: "Hoàn thành 20 bài tập code",
        icon: "🚀",
        category: "learning",
        rarity: "epic",
        points: 150,
        requirements: [
          {
            type: "code_exercise",
            value: 20,
            condition: "greater_than"
          }
        ]
      },
      
      // Special badges
      {
        name: "Người kiên trì",
        description: "Học liên tiếp 3 ngày",
        icon: "💪",
        category: "special",
        rarity: "common",
        points: 20,
        requirements: [
          {
            type: "streak",
            value: 3,
            condition: "greater_than"
          }
        ]
      },
      {
        name: "Người đa năng",
        description: "Hoàn thành cả quiz và code exercise",
        icon: "🎭",
        category: "special",
        rarity: "rare",
        points: 100,
        requirements: [
          {
            type: "quiz_score",
            value: 1,
            condition: "greater_than"
          },
          {
            type: "code_exercise",
            value: 1,
            condition: "greater_than"
          }
        ]
      }
    ];

    // Clear existing badges
    await Badge.deleteMany({});
    
    // Insert new badges
    const createdBadges = await Badge.insertMany(badges);
    
    console.log(`Created ${createdBadges.length} badges`);
    
    return { success: true, data: createdBadges };
  } catch (error) {
    console.error("Error seeding gamification data:", error);
    return { success: false, error: "Failed to seed gamification data" };
  }
}

// Create daily challenges
export async function createDailyChallenges() {
  try {
    await connectToDatabase();
    
    const { DailyChallenge } = await import("@/database/gamification.model");
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const challenges = [
      {
        title: "Học 3 bài học hôm nay",
        description: "Hoàn thành 3 bài học để nhận điểm thưởng",
        type: "complete_lessons",
        target: 3,
        reward: {
          points: 30
        },
        startDate: today,
        endDate: tomorrow,
        isActive: true
      },
      {
        title: "Học 30 phút hôm nay",
        description: "Dành 30 phút học tập để nhận điểm thưởng",
        type: "study_time",
        target: 30,
        reward: {
          points: 25
        },
        startDate: today,
        endDate: tomorrow,
        isActive: true
      },
      {
        title: "Hoàn thành 1 quiz",
        description: "Làm và đạt điểm cao trong 1 quiz",
        type: "quiz_score",
        target: 70,
        reward: {
          points: 40
        },
        startDate: today,
        endDate: tomorrow,
        isActive: true
      }
    ];
    
    // Clear existing challenges for today
    await DailyChallenge.deleteMany({
      startDate: { $gte: today, $lt: tomorrow }
    });
    
    // Create new challenges
    const createdChallenges = await DailyChallenge.insertMany(challenges);
    
    console.log(`Created ${createdChallenges.length} daily challenges`);
    
    return { success: true, data: createdChallenges };
  } catch (error) {
    console.error("Error creating daily challenges:", error);
    return { success: false, error: "Failed to create daily challenges" };
  }
}
