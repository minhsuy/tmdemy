# 🎮 Hệ thống Gamification - TMdemy

## Tổng quan

Hệ thống gamification của TMdemy được thiết kế để làm cho việc học tập trở nên thú vị và hấp dẫn hơn thông qua các yếu tố game như điểm số, cấp độ, badges, streak, và bảng xếp hạng.

## 🏗️ Kiến trúc hệ thống

### 1. Database Models
- **UserGamification**: Profile gamification của user
- **Badge**: Hệ thống badges/achievements
- **Achievement**: Lịch sử đạt được badges
- **Leaderboard**: Bảng xếp hạng
- **StudyStreak**: Chuỗi học tập
- **DailyChallenge**: Thử thách hàng ngày
- **UserChallengeProgress**: Tiến độ thử thách

### 2. Core Features

#### 🎯 Hệ thống điểm số và cấp độ
- **Điểm số**: Tích lũy qua các hoạt động học tập
- **Cấp độ**: Tự động tính toán dựa trên kinh nghiệm
- **Công thức cấp độ**: `level = floor(sqrt(experiencePoints / 100)) + 1`

#### 🏆 Hệ thống Badges
- **4 loại badges**: Common, Rare, Epic, Legendary
- **4 categories**: Learning, Achievement, Social, Special
- **Tự động trao thưởng** khi đạt điều kiện

#### 🔥 Hệ thống Streak
- **Theo dõi chuỗi học tập** hàng ngày
- **Kỷ lục streak** dài nhất
- **Điểm thưởng** cho streak

#### 📊 Bảng xếp hạng
- **4 thời kỳ**: Daily, Weekly, Monthly, All-time
- **4 categories**: Points, Streak, Courses, Time
- **Real-time updates**

#### 🎯 Thử thách hàng ngày
- **Tự động tạo** mỗi ngày
- **Nhiều loại thử thách**: Lessons, Time, Quiz, Code
- **Phần thưởng** điểm số

## 🚀 Cách sử dụng

### 1. Khởi tạo dữ liệu

```bash
# Chạy script khởi tạo
npm run seed:gamification
```

### 2. Tích hợp vào components

```tsx
import { useGamification } from "@/hooks/useGamification";

function MyComponent() {
  const { 
    data, 
    isLoading, 
    trackLessonCompletion,
    awardPoints 
  } = useGamification();

  // Track lesson completion
  const handleLessonComplete = async (courseId: string, lessonId: string) => {
    await trackLessonCompletion(courseId, lessonId);
  };

  return (
    <div>
      {data && (
        <div>
          <p>Level: {data.currentLevel}</p>
          <p>Points: {data.totalPoints}</p>
          <p>Streak: {data.streak} days</p>
        </div>
      )}
    </div>
  );
}
```

### 3. Tracking Events

```tsx
// Track lesson completion
await trackLessonCompletion(courseId, lessonId);

// Track course completion
await trackCourseCompletion(courseId);

// Track quiz completion
await trackQuizCompletion(quizId, score, passed);

// Track code exercise completion
await trackCodeExerciseCompletion(exerciseId, score);

// Award custom points
await awardPoints(50, "Custom achievement");
```

## 🎨 UI Components

### 1. GamificationDashboard
Component chính hiển thị toàn bộ hệ thống gamification.

```tsx
import GamificationDashboard from "@/components/gamification/GamificationDashboard";

<GamificationDashboard />
```

### 2. AchievementBadge
Hiển thị badge/achievement với animation.

```tsx
import AchievementBadge from "@/components/gamification/AchievementBadge";

<AchievementBadge 
  achievement={achievement} 
  isNew={true} 
/>
```

### 3. AchievementNotification
Popup thông báo khi đạt achievement mới.

```tsx
import AchievementNotification from "@/components/gamification/AchievementNotification";

<AchievementNotification 
  achievement={newAchievement}
  onClose={() => setShowNotification(false)}
/>
```

### 4. LevelProgress
Hiển thị tiến độ cấp độ.

```tsx
import LevelProgress from "@/components/gamification/LevelProgress";

<LevelProgress 
  currentLevel={5}
  experiencePoints={2500}
  progressToNextLevel={75}
  nextLevelExp={3600}
/>
```

## 📈 Điểm số và Rewards

### Hệ thống điểm số
- **Lesson completion**: 10 điểm
- **Course completion**: 100 điểm
- **Quiz completion**: 10-50 điểm (dựa trên điểm số)
- **Code exercise**: 10-30 điểm (dựa trên điểm số)
- **Daily challenges**: 25-50 điểm
- **Badges**: 10-500 điểm (dựa trên rarity)

### Cấp độ
- **Level 1-5**: Người mới bắt đầu
- **Level 6-10**: Học viên
- **Level 11-20**: Sinh viên
- **Level 21-30**: Chuyên gia
- **Level 31-50**: Bậc thầy
- **Level 50+**: Huyền thoại

## 🎯 Badges System

### Learning Badges
- **Người mới bắt đầu**: 1 lesson
- **Học viên chăm chỉ**: 10 lessons
- **Sinh viên xuất sắc**: 50 lessons
- **Chuyên gia học tập**: 100 lessons

### Achievement Badges
- **Khóa học đầu tiên**: 1 course
- **Người học đa dạng**: 5 courses
- **Bậc thầy học tập**: 10 courses

### Streak Badges
- **Ngày đầu tiên**: 1 day
- **Tuần học tập**: 7 days
- **Tháng học tập**: 30 days
- **Huyền thoại học tập**: 100 days

### Special Badges
- **Người kiên trì**: 3 day streak
- **Người đa năng**: Quiz + Code exercise

## 🔧 Admin Management

### Quản lý Gamification
Truy cập `/manage/gamification` để:
- Xem thống kê hệ thống
- Quản lý badges
- Tạo thử thách
- Khởi tạo dữ liệu

### API Endpoints

```typescript
// Get user gamification data
const result = await getUserGamification(userId);

// Award points
const result = await awardPoints(userId, points, reason);

// Update streak
const result = await updateStudyStreak(userId);

// Track completions
const result = await trackLessonCompletion(userId, courseId, lessonId);
const result = await trackCourseCompletion(userId, courseId);
const result = await trackQuizCompletion(userId, quizId, score, passed);
const result = await trackCodeExerciseCompletion(userId, exerciseId, score);

// Get leaderboard
const result = await getLeaderboard(period, category, limit);

// Get daily challenges
const result = await getDailyChallenges(userId);
```

## 🎨 Customization

### Thêm Badge mới
```typescript
const newBadge = {
  name: "Custom Badge",
  description: "Description here",
  icon: "🎯",
  category: "learning",
  rarity: "common",
  points: 25,
  requirements: [
    {
      type: "lesson_completion",
      value: 5,
      condition: "greater_than"
    }
  ]
};
```

### Tạo thử thách mới
```typescript
const challenge = {
  title: "Custom Challenge",
  description: "Complete 5 lessons today",
  type: "complete_lessons",
  target: 5,
  reward: {
    points: 50
  },
  startDate: new Date(),
  endDate: tomorrow
};
```

## 📊 Analytics

### Metrics được theo dõi
- **User engagement**: Thời gian học, tần suất
- **Learning progress**: Tiến độ khóa học, bài học
- **Achievement rate**: Tỷ lệ đạt badges
- **Streak patterns**: Chuỗi học tập
- **Leaderboard activity**: Hoạt động xếp hạng

### Dashboard
- **Real-time stats**: Điểm số, cấp độ, streak
- **Achievement progress**: Tiến độ badges
- **Challenge status**: Trạng thái thử thách
- **Leaderboard position**: Vị trí xếp hạng

## 🔮 Future Enhancements

### Planned Features
- **Social features**: Friends, teams, competitions
- **Seasonal events**: Special challenges, limited badges
- **Personalization**: Custom goals, preferences
- **Mobile app**: Push notifications, offline tracking
- **AI recommendations**: Personalized learning paths

### Advanced Gamification
- **Virtual rewards**: Digital collectibles
- **Story mode**: Narrative-driven learning
- **Mini-games**: Educational games
- **Social challenges**: Group competitions
- **Real-world rewards**: Certificates, merchandise

## 🛠️ Troubleshooting

### Common Issues
1. **Gamification data not loading**: Check user authentication
2. **Points not updating**: Verify action calls
3. **Badges not awarding**: Check requirements
4. **Streak not updating**: Verify daily activity tracking

### Debug Tips
- Check console logs for errors
- Verify database connections
- Test with different user accounts
- Monitor network requests

## 📚 Resources

- [Gamification Design Principles](https://example.com)
- [User Engagement Best Practices](https://example.com)
- [Database Schema Documentation](https://example.com)
- [API Reference](https://example.com)

---

**Lưu ý**: Hệ thống gamification được thiết kế để tăng cường trải nghiệm học tập mà không làm mất đi tính giáo dục. Tất cả các yếu tố game đều hướng đến mục tiêu học tập chính.
