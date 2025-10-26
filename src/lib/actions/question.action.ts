"use server";
import { connectToDatabase } from "../mongoose";
import Question from "@/database/question.model";
import Quiz from "@/database/quiz.model";
import { revalidatePath } from "next/cache";
import { ICreateQuestionParams, IUpdateQuestionParams } from "@/types/type";

// Create Question
export const createQuestion = async (params: ICreateQuestionParams): Promise<any> => {
  try {
    await connectToDatabase();
    
    // Simple validation
    if (!params.question?.trim()) {
      return { success: false, message: "Vui lòng nhập câu hỏi!" };
    }
    
    if (!params.quiz) {
      return { success: false, message: "Không tìm thấy quiz!" };
    }
    
    if (!params.options || params.options.length < 2) {
      return { success: false, message: "Cần ít nhất 2 lựa chọn!" };
    }
    
    if (params.correctAnswer < 0 || params.correctAnswer >= params.options.length) {
      return { success: false, message: "Đáp án đúng không hợp lệ!" };
    }

    // Check quiz exists
    const quiz = await Quiz.findById(params.quiz);
    if (!quiz) {
      return { success: false, message: "Quiz không tồn tại!" };
    }

    // Create question
    const question = await Question.create({
      question: params.question.trim(),
      type: params.type || "MULTIPLE_CHOICE",
      options: params.options,
      correctAnswer: params.correctAnswer,
      explanation: params.explanation?.trim() || "",
      points: params.points || 1,
      order: params.order || 0,
      quiz: params.quiz,
    });

    // Update quiz
    await Quiz.findByIdAndUpdate(
      params.quiz,
      { $push: { questions: question._id } }
    );

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
      message: "Tạo câu hỏi thành công!",
    };
  } catch (error) {
    console.error("Error creating question:", error);
    return {
      success: false,
      message: `Lỗi: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
    };
  }
};

// Get Questions by Quiz
export const getQuestionsByQuiz = async (quizId: string): Promise<any> => {
  try {
    await connectToDatabase();
    
    const questions = await Question.find({ 
      quiz: quizId, 
      _destroy: false 
    }).sort({ order: 1 });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(questions)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Không thể lấy danh sách câu hỏi!",
    };
  }
};

// Update Question
export const updateQuestion = async (params: IUpdateQuestionParams): Promise<any> => {
  try {
    await connectToDatabase();
    
    const updatedQuestion = await Question.findByIdAndUpdate(
      params._id,
      params.updatedData,
      { new: true }
    );

    if (!updatedQuestion) {
      return {
        success: false,
        message: "Không tìm thấy câu hỏi!",
      };
    }

    revalidatePath("/");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedQuestion)),
      message: "Cập nhật câu hỏi thành công!",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Không thể cập nhật câu hỏi!",
    };
  }
};

// Delete Question
export const deleteQuestion = async (questionId: string, pathname: string): Promise<any> => {
  try {
    await connectToDatabase();
    
    const question = await Question.findById(questionId);
    if (!question) {
      return {
        success: false,
        message: "Không tìm thấy câu hỏi!",
      };
    }

    if (question._destroy) {
      return {
        success: true,
        deleted: false,
        message: "Câu hỏi đã được xóa, bạn có muốn khôi phục lại không?",
      };
    }

    // Soft delete question
    await Question.findByIdAndUpdate(questionId, { _destroy: true });

    // Remove from quiz
    await Quiz.findByIdAndUpdate(
      question.quiz,
      { $pull: { questions: questionId } }
    );

    revalidatePath(pathname || "/");
    return {
      success: true,
      message: "Xóa câu hỏi thành công!",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Không thể xóa câu hỏi!",
    };
  }
};

// Reorder Questions
export const reorderQuestions = async (questionIds: string[]): Promise<any> => {
  try {
    await connectToDatabase();
    
    const updatePromises = questionIds.map((questionId, index) =>
      Question.findByIdAndUpdate(questionId, { order: index + 1 })
    );

    await Promise.all(updatePromises);

    return {
      success: true,
      message: "Sắp xếp lại câu hỏi thành công!",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Không thể sắp xếp lại câu hỏi!",
    };
  }
};
