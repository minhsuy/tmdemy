"use server";
import { connectToDatabase } from "../mongoose";
import Quiz from "@/database/quiz.model";
import Question from "@/database/question.model";
import QuizResult from "@/database/quiz-result.model";
import { revalidatePath } from "next/cache";
import { ICreateQuizParams, IUpdateQuizParams, IQuizWithQuestions } from "@/types/type";
import { EQuizStatus } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";
import User from "@/database/user.model";

// Create Quiz
export const createQuiz = async (params: ICreateQuizParams): Promise<any> => {
  try {
    await connectToDatabase();
    
    const quiz = await Quiz.create({
      ...params,
      timeLimit: params.timeLimit || 30,
      maxAttempts: params.maxAttempts || 3,
      passingScore: params.passingScore || 70,
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(quiz)),
      message: "Tạo quiz thành công!",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Không thể tạo quiz!",
    };
  }
};

// Get Quiz by ID
export const getQuizById = async (quizId: string): Promise<any> => {
  try {
    await connectToDatabase();
    
    const quiz = await Quiz.findById(quizId)
      .populate({
        path: "questions",
        model: Question,
        match: { _destroy: false },
        options: { sort: { order: 1 } },
      })
      .populate("course", "title")
      .populate("lesson", "title");

    if (!quiz) {
      return {
        success: false,
        message: "Không tìm thấy quiz!",
      };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(quiz)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Không thể lấy thông tin quiz!",
    };
  }
};

// Get Quizzes by Lesson
export const getQuizzesByLesson = async (lessonId: string): Promise<any> => {
  try {
    await connectToDatabase();
    
    const quizzes = await Quiz.find({ 
      lesson: lessonId, 
      _destroy: false 
    })
    .populate({
      path: "questions",
      model: Question,
      match: { _destroy: false },
    })
    .sort({ createdAt: -1 });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(quizzes)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Không thể lấy danh sách quiz!",
    };
  }
};

// Update Quiz
export const updateQuiz = async (params: IUpdateQuizParams): Promise<any> => {
  try {
    await connectToDatabase();
    
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      params._id,
      params.updatedData,
      { new: true }
    );

    if (!updatedQuiz) {
      return {
        success: false,
        message: "Không tìm thấy quiz!",
      };
    }

    revalidatePath("/");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedQuiz)),
      message: "Cập nhật quiz thành công!",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Không thể cập nhật quiz!",
    };
  }
};

// Delete Quiz
export const deleteQuiz = async (quizId: string, pathname: string): Promise<any> => {
  try {
    await connectToDatabase();
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return {
        success: false,
        message: "Không tìm thấy quiz!",
      };
    }

    if (quiz._destroy) {
      return {
        success: true,
        deleted: false,
        message: "Quiz đã được xóa, bạn có muốn khôi phục lại không?",
      };
    }

    // Soft delete quiz and all its questions
    await Quiz.findByIdAndUpdate(quizId, { _destroy: true });
    await Question.updateMany({ quiz: quizId }, { _destroy: true });

    revalidatePath(pathname || "/");
    return {
      success: true,
      message: "Xóa quiz thành công!",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Không thể xóa quiz!",
    };
  }
};

// Submit Quiz Attempt
export const submitQuizAttempt = async (params: {
  quizId: string;
  answers: { questionId: string; selectedAnswer: number }[];
  timeSpent: number;
}): Promise<any> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Bạn cần đăng nhập để làm quiz!",
      };
    }

    await connectToDatabase();
    
    // Get user info
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return {
        success: false,
        message: "Không tìm thấy thông tin người dùng!",
      };
    }

    // Get quiz with questions
    const quiz = await Quiz.findById(params.quizId)
      .populate({
        path: "questions",
        model: Question,
        match: { _destroy: false },
      });

    if (!quiz) {
      return {
        success: false,
        message: "Không tìm thấy quiz!",
      };
    }

    // Check if user has exceeded max attempts
    const existingAttempts = await QuizResult.countDocuments({
      user: user._id,
      quiz: params.quizId,
    });

    if (existingAttempts >= quiz.maxAttempts) {
      return {
        success: false,
        message: `Bạn đã vượt quá số lần thử tối đa (${quiz.maxAttempts})!`,
      };
    }

    // Calculate score
    let correctAnswers = 0;
    let totalPoints = 0;
    const answers = [];

    for (const answer of params.answers) {
      const question = quiz.questions.find((q: any) => q._id.toString() === answer.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === answer.selectedAnswer;
        if (isCorrect) {
          correctAnswers++;
          totalPoints += question.points;
        }
        
        answers.push({
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect,
        });
      }
    }

    const percentage = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = percentage >= quiz.passingScore;

    // Save quiz result
    const quizResult = await QuizResult.create({
      user: user._id,
      quiz: params.quizId,
      answers,
      score: totalPoints,
      percentage,
      passed,
      timeSpent: params.timeSpent,
      attemptNumber: existingAttempts + 1,
      completedAt: new Date(),
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(quizResult)),
      message: passed ? "Chúc mừng! Bạn đã vượt qua quiz!" : "Bạn chưa đạt điểm yêu cầu. Hãy thử lại!",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Không thể nộp bài quiz!",
    };
  }
};

// Get Quiz Results for User
export const getQuizResults = async (quizId: string): Promise<any> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Bạn cần đăng nhập!",
      };
    }

    await connectToDatabase();
    
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return {
        success: false,
        message: "Không tìm thấy thông tin người dùng!",
      };
    }

    const results = await QuizResult.find({
      user: user._id,
      quiz: quizId,
    }).sort({ createdAt: -1 });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(results)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Không thể lấy kết quả quiz!",
    };
  }
};
