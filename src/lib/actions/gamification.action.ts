"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { 
  UserGamification, 
  Badge, 
  Achievement, 
  Leaderboard, 
  StudyStreak,
  DailyChallenge,
  UserChallengeProgress,
  IUserGamification,
  IBadge,
  IAchievement
} from "@/database/gamification.model";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

// Initialize user gamification profile
export async function initializeUserGamification(userId: string) {
  try {
    await connectToDatabase();
    
    const existingProfile = await UserGamification.findOne({ user: userId });
    if (existingProfile) {
      return { success: true, data: existingProfile };
    }

    const newProfile = new UserGamification({
      user: userId,
      totalPoints: 0,
      currentLevel: 1,
      experiencePoints: 0,
      streak: 0,
      longestStreak: 0,
      lastActiveDate: new Date(),
      badges: [],
      achievements: [],
      weeklyGoal: 5,
      monthlyGoal: 20,
      totalStudyTime: 0,
      coursesCompleted: 0,
      lessonsCompleted: 0,
      quizzesPassed: 0,
      codeExercisesCompleted: 0,
      certificatesEarned: 0
    });

    await newProfile.save();
    return { success: true, data: newProfile };
  } catch (error) {
    console.error("Error initializing user gamification:", error);
    return { success: false, error: "Failed to initialize gamification profile" };
  }
}

// Get user gamification profile
export async function getUserGamification(userId: string) {
  try {
    await connectToDatabase();
    
    const profile = await UserGamification.findOne({ user: userId })
      .populate('badges')
      .populate('achievements');
    
    if (!profile) {
      return await initializeUserGamification(userId);
    }
    
    return { success: true, data: profile };
  } catch (error) {
    console.error("Error getting user gamification:", error);
    return { success: false, error: "Failed to get gamification profile" };
  }
}

// Award points to user
export async function awardPoints(userId: string, points: number, reason: string) {
  try {
    await connectToDatabase();
    
    const profile = await UserGamification.findOne({ user: userId });
    if (!profile) {
      return { success: false, error: "User profile not found" };
    }

    profile.totalPoints += points;
    profile.experiencePoints += points;
    
    // Check for level up
    const newLevel = calculateLevel(profile.experiencePoints);
    const leveledUp = newLevel > profile.currentLevel;
    profile.currentLevel = newLevel;

    await profile.save();

    // Check for new achievements
    await checkAndAwardAchievements(userId);

    return { 
      success: true, 
      data: { 
        points, 
        reason, 
        newLevel, 
        leveledUp,
        totalPoints: profile.totalPoints 
      } 
    };
  } catch (error) {
    console.error("Error awarding points:", error);
    return { success: false, error: "Failed to award points" };
  }
}

// Calculate user level based on experience points
function calculateLevel(experiencePoints: number): number {
  // Level formula: level = floor(sqrt(experiencePoints / 100)) + 1
  return Math.floor(Math.sqrt(experiencePoints / 100)) + 1;
}

// Update study streak
export async function updateStudyStreak(userId: string) {
  try {
    await connectToDatabase();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = await StudyStreak.findOne({ user: userId });
    
    if (!streak) {
      streak = new StudyStreak({
        user: userId,
        currentStreak: 1,
        longestStreak: 1,
        lastStudyDate: today,
        streakStartDate: today,
        totalStudyDays: 1
      });
    } else {
      const lastStudyDate = new Date(streak.lastStudyDate);
      lastStudyDate.setHours(0, 0, 0, 0);
      
      const daysDifference = Math.floor((today.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDifference === 1) {
        // Consecutive day
        streak.currentStreak += 1;
        streak.totalStudyDays += 1;
      } else if (daysDifference > 1) {
        // Streak broken
        streak.currentStreak = 1;
        streak.streakStartDate = today;
        streak.totalStudyDays += 1;
      }
      // If daysDifference === 0, same day, don't update
      
      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }
      
      streak.lastStudyDate = today;
    }
    
    await streak.save();
    
    // Update gamification profile
    const profile = await UserGamification.findOne({ user: userId });
    if (profile) {
      profile.streak = streak.currentStreak;
      profile.longestStreak = streak.longestStreak;
      profile.lastActiveDate = today;
      await profile.save();
    }
    
    return { success: true, data: streak };
  } catch (error) {
    console.error("Error updating study streak:", error);
    return { success: false, error: "Failed to update study streak" };
  }
}

// Check and award achievements
export async function checkAndAwardAchievements(userId: string) {
  try {
    await connectToDatabase();
    
    const profile = await UserGamification.findOne({ user: userId });
    if (!profile) return { success: false, error: "Profile not found" };
    
    const badges = await Badge.find({ isActive: true });
    const newAchievements = [];
    
    for (const badge of badges) {
      // Check if user already has this badge
      const existingAchievement = await Achievement.findOne({ 
        user: userId, 
        badge: badge._id 
      });
      
      if (existingAchievement) continue;
      
      // Check if user meets requirements
      let meetsRequirements = true;
      
      for (const requirement of badge.requirements) {
        let userValue = 0;
        
        switch (requirement.type) {
          case 'course_completion':
            userValue = profile.coursesCompleted;
            break;
          case 'lesson_completion':
            userValue = profile.lessonsCompleted;
            break;
          case 'streak':
            userValue = profile.streak;
            break;
          case 'points':
            userValue = profile.totalPoints;
            break;
          case 'time':
            userValue = profile.totalStudyTime;
            break;
          case 'quiz_score':
            userValue = profile.quizzesPassed;
            break;
          case 'code_exercise':
            userValue = profile.codeExercisesCompleted;
            break;
        }
        
        const meetsCondition = checkRequirement(userValue, requirement.value, requirement.condition);
        if (!meetsCondition) {
          meetsRequirements = false;
          break;
        }
      }
      
      if (meetsRequirements) {
        // Award badge
        const achievement = new Achievement({
          user: userId,
          badge: badge._id,
          points: badge.points,
          isNew: true
        });
        
        await achievement.save();
        
        // Add to user profile
        profile.badges.push(badge._id);
        profile.achievements.push(achievement._id);
        profile.totalPoints += badge.points;
        profile.experiencePoints += badge.points;
        
        newAchievements.push({
          badge,
          achievement,
          points: badge.points
        });
      }
    }
    
    if (newAchievements.length > 0) {
      await profile.save();
    }
    
    return { success: true, data: newAchievements };
  } catch (error) {
    console.error("Error checking achievements:", error);
    return { success: false, error: "Failed to check achievements" };
  }
}

// Helper function to check requirement
function checkRequirement(userValue: number, targetValue: number, condition: string): boolean {
  switch (condition) {
    case 'greater_than':
      return userValue > targetValue;
    case 'equal_to':
      return userValue === targetValue;
    case 'less_than':
      return userValue < targetValue;
    default:
      return userValue >= targetValue;
  }
}

// Get leaderboard
export async function getLeaderboard(period: string = 'all_time', category: string = 'points', limit: number = 10) {
  try {
    await connectToDatabase();
    
    const leaderboard = await Leaderboard.find({ period, category })
      .populate('user', 'name username avatar')
      .sort({ points: -1 })
      .limit(limit);
    
    return { success: true, data: leaderboard };
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    return { success: false, error: "Failed to get leaderboard" };
  }
}

// Update leaderboard
export async function updateLeaderboard(userId: string) {
  try {
    await connectToDatabase();
    
    const profile = await UserGamification.findOne({ user: userId });
    if (!profile) return { success: false, error: "Profile not found" };
    
    const periods = ['daily', 'weekly', 'monthly', 'all_time'];
    const categories = ['points', 'streak', 'courses', 'time'];
    
    for (const period of periods) {
      for (const category of categories) {
        let value = 0;
        
        switch (category) {
          case 'points':
            value = profile.totalPoints;
            break;
          case 'streak':
            value = profile.streak;
            break;
          case 'courses':
            value = profile.coursesCompleted;
            break;
          case 'time':
            value = profile.totalStudyTime;
            break;
        }
        
        await Leaderboard.findOneAndUpdate(
          { user: userId, period, category },
          { 
            points: value,
            level: profile.currentLevel,
            rank: 0 // Will be calculated separately
          },
          { upsert: true, new: true }
        );
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    return { success: false, error: "Failed to update leaderboard" };
  }
}

// Get daily challenges
export async function getDailyChallenges(userId: string) {
  try {
    await connectToDatabase();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const challenges = await DailyChallenge.find({
      isActive: true,
      startDate: { $lte: today },
      endDate: { $gte: today }
    }).populate('reward.badge');
    
    // Get user progress for each challenge
    const challengesWithProgress = await Promise.all(
      challenges.map(async (challenge) => {
        const progress = await UserChallengeProgress.findOne({
          user: userId,
          challenge: challenge._id
        });
        
        return {
          ...challenge.toObject(),
          progress: progress || {
            progress: 0,
            isCompleted: false,
            rewardClaimed: false
          }
        };
      })
    );
    
    return { success: true, data: challengesWithProgress };
  } catch (error) {
    console.error("Error getting daily challenges:", error);
    return { success: false, error: "Failed to get daily challenges" };
  }
}

// Update challenge progress
export async function updateChallengeProgress(userId: string, challengeId: string, progress: number) {
  try {
    await connectToDatabase();
    
    const challenge = await DailyChallenge.findById(challengeId);
    if (!challenge) return { success: false, error: "Challenge not found" };
    
    let userProgress = await UserChallengeProgress.findOne({
      user: userId,
      challenge: challengeId
    });
    
    if (!userProgress) {
      userProgress = new UserChallengeProgress({
        user: userId,
        challenge: challengeId,
        progress: 0,
        isCompleted: false,
        rewardClaimed: false
      });
    }
    
    userProgress.progress = Math.min(progress, challenge.target);
    
    if (userProgress.progress >= challenge.target && !userProgress.isCompleted) {
      userProgress.isCompleted = true;
      userProgress.completedAt = new Date();
      
      // Award points
      if (challenge.reward.points > 0) {
        await awardPoints(userId, challenge.reward.points, `Daily challenge: ${challenge.title}`);
      }
    }
    
    await userProgress.save();
    
    return { success: true, data: userProgress };
  } catch (error) {
    console.error("Error updating challenge progress:", error);
    return { success: false, error: "Failed to update challenge progress" };
  }
}

// Track lesson completion
export async function trackLessonCompletion(userId: string, courseId: string, lessonId: string) {
  try {
    await connectToDatabase();
    
    // Initialize profile if not exists
    await initializeUserGamification(userId);
    
    // Update streak
    await updateStudyStreak(userId);
    
    // Award points for lesson completion
    await awardPoints(userId, 10, "Lesson completed");
    
    // Update profile stats
    const profile = await UserGamification.findOne({ user: userId });
    if (profile) {
      profile.lessonsCompleted += 1;
      await profile.save();
    }
    
    // Update challenge progress
    const challenges = await getDailyChallenges(userId);
    if (challenges.success) {
      for (const challenge of challenges.data) {
        if (challenge.type === 'complete_lessons') {
          await updateChallengeProgress(userId, challenge._id, challenge.progress.progress + 1);
        }
      }
    }
    
    revalidatePath('/study');
    return { success: true };
  } catch (error) {
    console.error("Error tracking lesson completion:", error);
    return { success: false, error: "Failed to track lesson completion" };
  }
}

// Track course completion
export async function trackCourseCompletion(userId: string, courseId: string) {
  try {
    await connectToDatabase();
    
    const profile = await UserGamification.findOne({ user: userId });
    if (profile) {
      profile.coursesCompleted += 1;
      profile.certificatesEarned += 1;
      await profile.save();
      
      // Award bonus points for course completion
      await awardPoints(userId, 100, "Course completed");
    }
    
    revalidatePath('/study');
    return { success: true };
  } catch (error) {
    console.error("Error tracking course completion:", error);
    return { success: false, error: "Failed to track course completion" };
  }
}

// Track quiz completion
export async function trackQuizCompletion(userId: string, quizId: string, score: number, passed: boolean) {
  try {
    await connectToDatabase();
    
    const profile = await UserGamification.findOne({ user: userId });
    if (profile) {
      if (passed) {
        profile.quizzesPassed += 1;
        await profile.save();
        
        // Award points based on score
        const points = Math.round((score / 100) * 50); // Max 50 points for quiz
        await awardPoints(userId, points, `Quiz passed with ${score}%`);
      }
    }
    
    // Update challenge progress
    const challenges = await getDailyChallenges(userId);
    if (challenges.success) {
      for (const challenge of challenges.data) {
        if (challenge.type === 'quiz_score' && score >= challenge.target) {
          await updateChallengeProgress(userId, challenge._id, challenge.progress.progress + 1);
        }
      }
    }
    
    revalidatePath('/study');
    return { success: true };
  } catch (error) {
    console.error("Error tracking quiz completion:", error);
    return { success: false, error: "Failed to track quiz completion" };
  }
}

// Track code exercise completion
export async function trackCodeExerciseCompletion(userId: string, exerciseId: string, score: number) {
  try {
    await connectToDatabase();
    
    const profile = await UserGamification.findOne({ user: userId });
    if (profile) {
      profile.codeExercisesCompleted += 1;
      await profile.save();
      
      // Award points based on score
      const points = Math.round((score / 100) * 30); // Max 30 points for code exercise
      await awardPoints(userId, points, `Code exercise completed with ${score}%`);
    }
    
    // Update challenge progress
    const challenges = await getDailyChallenges(userId);
    if (challenges.success) {
      for (const challenge of challenges.data) {
        if (challenge.type === 'code_exercise' && score >= challenge.target) {
          await updateChallengeProgress(userId, challenge._id, challenge.progress.progress + 1);
        }
      }
    }
    
    revalidatePath('/study');
    return { success: true };
  } catch (error) {
    console.error("Error tracking code exercise completion:", error);
    return { success: false, error: "Failed to track code exercise completion" };
  }
}
