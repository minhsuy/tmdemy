enum EUserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}
enum EUserStatus {
  ACTIVE = "ACTIVE",
  UNACTIVE = "UNACTIVE",
  BANNED = "BANNED",
}

enum ECourseStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}
enum ECourseLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}
enum ELessonType {
  VIDEO = "VIDEO",
  TEXT = "TEXT",
}
enum EOrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}
enum ECouponType {
  PERCENTAGE = "PERCENTAGE",
}
enum ERatingStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
enum ECommentStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}
enum EQuizStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
enum EQuestionType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  TRUE_FALSE = "TRUE_FALSE",
}

enum ECodeExerciseStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

enum ECodeExerciseDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

enum ECodeLanguage {
  JAVASCRIPT = "javascript",
  PYTHON = "python",
  JAVA = "java",
  CPP = "cpp",
  CSHARP = "csharp",
  PHP = "php",
  RUBY = "ruby",
  GO = "go",
}

enum ECertificateStatus {
  ACTIVE = "ACTIVE",
  REVOKED = "REVOKED",
}

export {
  ECommentStatus,
  EUserRole,
  EUserStatus,
  ECourseStatus,
  ECourseLevel,
  ELessonType,
  EOrderStatus,
  ECouponType,
  ERatingStatus,
  EQuizStatus,
  EQuestionType,
  ECodeExerciseStatus,
  ECodeExerciseDifficulty,
  ECodeLanguage,
  ECertificateStatus,
};
