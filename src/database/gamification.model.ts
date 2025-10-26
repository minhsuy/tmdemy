import mongoose, { models, Schema } from "mongoose";

// User Gamification Profile
export interface IUserGamification extends Document {
  _id: string;
  user: Schema.Types.ObjectId;
  totalPoints: number;
  currentLevel: number;
  experiencePoints: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: Date;
  badges: Schema.Types.ObjectId[];
  achievements: Schema.Types.ObjectId[];
  weeklyGoal: number;
  monthlyGoal: number;
  totalStudyTime: number; // in minutes
  coursesCompleted: number;
  lessonsCompleted: number;
  quizzesPassed: number;
  codeExercisesCompleted: number;
  certificatesEarned: number;
  createdAt: Date;
  updatedAt: Date;
}

// Badge System
export interface IBadge extends Document {
  _id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'achievement' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  requirements: {
    type: 'course_completion' | 'lesson_completion' | 'streak' | 'points' | 'time' | 'quiz_score' | 'code_exercise';
    value: number;
    condition?: 'greater_than' | 'equal_to' | 'less_than';
  }[];
  isActive: boolean;
  createdAt: Date;
}

// Achievement System
export interface IAchievement extends Document {
  _id: string;
  user: Schema.Types.ObjectId;
  badge: Schema.Types.ObjectId;
  earnedAt: Date;
  points: number;
  isNew: boolean;
}

// Leaderboard
export interface ILeaderboard extends Document {
  _id: string;
  user: Schema.Types.ObjectId;
  points: number;
  level: number;
  rank: number;
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  category: 'points' | 'streak' | 'courses' | 'time';
  createdAt: Date;
  updatedAt: Date;
}

// Study Streak
export interface IStudyStreak extends Document {
  _id: string;
  user: Schema.Types.ObjectId;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: Date;
  streakStartDate: Date;
  totalStudyDays: number;
}

// Daily Challenge
export interface IDailyChallenge extends Document {
  _id: string;
  title: string;
  description: string;
  type: 'complete_lessons' | 'study_time' | 'quiz_score' | 'code_exercise' | 'streak';
  target: number;
  reward: {
    points: number;
    badge?: Schema.Types.ObjectId;
  };
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

// User Challenge Progress
export interface IUserChallengeProgress extends Document {
  _id: string;
  user: Schema.Types.ObjectId;
  challenge: Schema.Types.ObjectId;
  progress: number;
  isCompleted: boolean;
  completedAt?: Date;
  rewardClaimed: boolean;
}

// Schemas
const userGamificationSchema = new mongoose.Schema<IUserGamification>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  currentLevel: {
    type: Number,
    default: 1
  },
  experiencePoints: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },
  badges: [{
    type: Schema.Types.ObjectId,
    ref: "Badge"
  }],
  achievements: [{
    type: Schema.Types.ObjectId,
    ref: "Achievement"
  }],
  weeklyGoal: {
    type: Number,
    default: 5 // 5 lessons per week
  },
  monthlyGoal: {
    type: Number,
    default: 20 // 20 lessons per month
  },
  totalStudyTime: {
    type: Number,
    default: 0
  },
  coursesCompleted: {
    type: Number,
    default: 0
  },
  lessonsCompleted: {
    type: Number,
    default: 0
  },
  quizzesPassed: {
    type: Number,
    default: 0
  },
  codeExercisesCompleted: {
    type: Number,
    default: 0
  },
  certificatesEarned: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const badgeSchema = new mongoose.Schema<IBadge>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['learning', 'achievement', 'social', 'special'],
    default: 'learning'
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  points: {
    type: Number,
    default: 10
  },
  requirements: [{
    type: {
      type: String,
      enum: ['course_completion', 'lesson_completion', 'streak', 'points', 'time', 'quiz_score', 'code_exercise'],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    condition: {
      type: String,
      enum: ['greater_than', 'equal_to', 'less_than'],
      default: 'greater_than'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const achievementSchema = new mongoose.Schema<IAchievement>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  badge: {
    type: Schema.Types.ObjectId,
    ref: "Badge",
    required: true
  },
  earnedAt: {
    type: Date,
    default: Date.now
  },
  points: {
    type: Number,
    required: true
  },
  isNew: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const leaderboardSchema = new mongoose.Schema<ILeaderboard>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  rank: {
    type: Number,
    default: 0
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'all_time'],
    default: 'all_time'
  },
  category: {
    type: String,
    enum: ['points', 'streak', 'courses', 'time'],
    default: 'points'
  }
}, { timestamps: true });

const studyStreakSchema = new mongoose.Schema<IStudyStreak>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastStudyDate: {
    type: Date,
    default: Date.now
  },
  streakStartDate: {
    type: Date,
    default: Date.now
  },
  totalStudyDays: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const dailyChallengeSchema = new mongoose.Schema<IDailyChallenge>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['complete_lessons', 'study_time', 'quiz_score', 'code_exercise', 'streak'],
    required: true
  },
  target: {
    type: Number,
    required: true
  },
  reward: {
    points: {
      type: Number,
      default: 0
    },
    badge: {
      type: Schema.Types.ObjectId,
      ref: "Badge"
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

const userChallengeProgressSchema = new mongoose.Schema<IUserChallengeProgress>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  challenge: {
    type: Schema.Types.ObjectId,
    ref: "DailyChallenge",
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  rewardClaimed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Models
const UserGamification = models.UserGamification || mongoose.model("UserGamification", userGamificationSchema);
const Badge = models.Badge || mongoose.model("Badge", badgeSchema);
const Achievement = models.Achievement || mongoose.model("Achievement", achievementSchema);
const Leaderboard = models.Leaderboard || mongoose.model("Leaderboard", leaderboardSchema);
const StudyStreak = models.StudyStreak || mongoose.model("StudyStreak", studyStreakSchema);
const DailyChallenge = models.DailyChallenge || mongoose.model("DailyChallenge", dailyChallengeSchema);
const UserChallengeProgress = models.UserChallengeProgress || mongoose.model("UserChallengeProgress", userChallengeProgressSchema);

export {
  UserGamification,
  Badge,
  Achievement,
  Leaderboard,
  StudyStreak,
  DailyChallenge,
  UserChallengeProgress
};
