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
export {
  EUserRole,
  EUserStatus,
  ECourseStatus,
  ECourseLevel,
  ELessonType,
  EOrderStatus,
  ECouponType,
  ERatingStatus,
};
