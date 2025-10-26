# Tính năng Quiz - TMdemy

## Tổng quan
Tính năng Quiz cho phép giảng viên tạo các bài kiểm tra trắc nghiệm cho học viên trong từng bài học của khóa học.

## Các tính năng chính

### 1. Quản lý Quiz (Dành cho Admin/Giảng viên)
- **Tạo Quiz**: Tạo quiz mới với thông tin cơ bản
- **Chỉnh sửa Quiz**: Cập nhật thông tin quiz
- **Xóa Quiz**: Xóa quiz (soft delete)
- **Quản lý Câu hỏi**: Thêm, sửa, xóa câu hỏi trong quiz

### 2. Làm Quiz (Dành cho Học viên)
- **Làm Quiz**: Thực hiện bài kiểm tra với timer
- **Xem kết quả**: Hiển thị điểm số và kết quả
- **Lịch sử**: Xem lịch sử các lần làm bài
- **Giới hạn số lần thử**: Theo cài đặt của quiz

## Cấu trúc Database

### Quiz Model
```typescript
interface IQuiz {
  _id: string;
  title: string;
  description: string;
  course: ObjectId;
  lesson: ObjectId;
  timeLimit: number; // phút
  maxAttempts: number;
  passingScore: number; // %
  status: EQuizStatus;
  questions: ObjectId[];
  _destroy: boolean;
}
```

### Question Model
```typescript
interface IQuestion {
  _id: string;
  question: string;
  type: EQuestionType;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
  points: number;
  order: number;
  quiz: ObjectId;
  _destroy: boolean;
}
```

### QuizResult Model
```typescript
interface IQuizResult {
  _id: string;
  user: ObjectId;
  quiz: ObjectId;
  answers: {
    questionId: ObjectId;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
  score: number;
  percentage: number;
  passed: boolean;
  timeSpent: number; // giây
  attemptNumber: number;
  completedAt: Date;
}
```

## Cách sử dụng

### 1. Tạo Quiz (Admin)
1. Truy cập `/manage/course/update-content?slug={course-slug}`
2. Chọn bài học cần tạo quiz
3. Chuyển sang tab "Quiz"
4. Nhấn "Tạo Quiz" và điền thông tin:
   - Tiêu đề quiz
   - Mô tả
   - Thời gian làm bài (phút)
   - Số lần thử tối đa
   - Điểm đạt (%)
   - Trạng thái (Hoạt động/Tạm dừng)

### 2. Thêm Câu hỏi
1. Sau khi tạo quiz, nhấn vào quiz để mở rộng
2. Nhấn "Thêm câu hỏi"
3. Điền thông tin câu hỏi:
   - Nội dung câu hỏi
   - Loại câu hỏi (Trắc nghiệm/Đúng-Sai)
   - Các lựa chọn (tối thiểu 2, tối đa 6)
   - Đáp án đúng
   - Giải thích (tùy chọn)
   - Điểm số

### 3. Làm Quiz (Học viên)
1. Truy cập bài học có quiz
2. Xem danh sách quiz trong bài học
3. Nhấn "Bắt đầu làm" hoặc "Làm lại"
4. Trả lời các câu hỏi
5. Nhấn "Nộp bài" khi hoàn thành
6. Xem kết quả và điểm số

## API Endpoints

### Quiz Actions
- `createQuiz(params)` - Tạo quiz mới
- `getQuizById(quizId)` - Lấy thông tin quiz
- `getQuizzesByLesson(lessonId)` - Lấy danh sách quiz theo bài học
- `updateQuiz(params)` - Cập nhật quiz
- `deleteQuiz(quizId, pathname)` - Xóa quiz
- `submitQuizAttempt(params)` - Nộp bài quiz
- `getQuizResults(quizId)` - Lấy kết quả quiz của user

### Question Actions
- `createQuestion(params)` - Tạo câu hỏi mới
- `getQuestionsByQuiz(quizId)` - Lấy danh sách câu hỏi
- `updateQuestion(params)` - Cập nhật câu hỏi
- `deleteQuestion(questionId, pathname)` - Xóa câu hỏi
- `reorderQuestions(questionIds)` - Sắp xếp lại câu hỏi

## Components

### QuizManager
- Quản lý quiz và câu hỏi
- Tích hợp vào trang update-content
- Hỗ trợ CRUD operations

### QuizPlayer
- Giao diện làm quiz cho học viên
- Timer countdown
- Navigation giữa các câu hỏi
- Hiển thị kết quả

### QuizList
- Danh sách quiz trong bài học
- Hiển thị trạng thái làm bài
- Link đến trang làm quiz

## Tính năng nâng cao

### Timer
- Đếm ngược thời gian làm bài
- Tự động nộp bài khi hết thời gian
- Hiển thị thời gian còn lại

### Điều hướng
- Chuyển đổi giữa các câu hỏi
- Đánh dấu câu hỏi đã trả lời
- Navigation nhanh

### Kết quả
- Tính điểm tự động
- Hiển thị đáp án đúng/sai
- Lưu lịch sử làm bài
- Giới hạn số lần thử

### Responsive Design
- Tối ưu cho mobile
- Giao diện thân thiện
- Dark mode support

## Cài đặt

### Dependencies
```bash
npm install @radix-ui/react-tabs @radix-ui/react-progress @radix-ui/react-radio-group lucide-react
```

### Database
Các model đã được tạo sẵn trong:
- `src/database/quiz.model.ts`
- `src/database/question.model.ts`
- `src/database/quiz-result.model.ts`

### Server Actions
- `src/lib/actions/quiz.action.ts`
- `src/lib/actions/question.action.ts`

### Components
- `src/components/quiz/QuizManager.tsx`
- `src/components/quiz/QuizPlayer.tsx`
- `src/components/quiz/QuizList.tsx`

## Lưu ý

1. **Quyền truy cập**: Chỉ admin mới có thể tạo và quản lý quiz
2. **Giới hạn**: Học viên chỉ có thể làm quiz trong số lần thử được phép
3. **Timer**: Thời gian làm bài được tính bằng phút
4. **Điểm số**: Điểm đạt được tính bằng phần trăm
5. **Lịch sử**: Tất cả kết quả làm bài đều được lưu lại

## Troubleshooting

### Lỗi thường gặp
1. **Quiz không hiển thị**: Kiểm tra trạng thái quiz (ACTIVE/INACTIVE)
2. **Không thể làm quiz**: Kiểm tra số lần thử còn lại
3. **Lỗi timer**: Kiểm tra timeLimit trong database
4. **Kết quả không chính xác**: Kiểm tra correctAnswer index

### Debug
- Kiểm tra console log trong browser
- Kiểm tra network requests
- Kiểm tra database records
