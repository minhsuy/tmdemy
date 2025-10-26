"use server";

import { connectToDatabase } from "@/lib/mongoose";
import CodeExercise from "@/database/code-exercise.model";
import CodeExerciseResult from "@/database/code-exercise-result.model";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { ICreateCodeExerciseParams, IUpdateCodeExerciseParams } from "@/types/type";

// Helper function to get MongoDB User ID from Clerk ID
const getMongoUserId = async (clerkId: string): Promise<string | null> => {
  try {
    const user = await User.findOne({ clerkId }).lean();
    return user ? user._id.toString() : null;
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
};

export const createCodeExercise = async (params: ICreateCodeExerciseParams): Promise<any> => {
  try {
    await connectToDatabase();

    const codeExercise = await CodeExercise.create({
      title: params.title,
      description: params.description,
      instructions: params.instructions,
      starterCode: params.starterCode,
      solution: params.solution,
      testCases: params.testCases,
      language: params.language,
      difficulty: params.difficulty,
      timeLimit: params.timeLimit,
      maxAttempts: params.maxAttempts,
      points: params.points,
      course: params.course,
      lesson: params.lesson,
      order: params.order || 0,
      status: params.status || "ACTIVE",
    });

    revalidatePath("/manage/course/update-content");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(codeExercise)),
      message: "Tạo bài tập code thành công!",
    };
  } catch (error) {
    console.error("Error creating code exercise:", error);
    return {
      success: false,
      message: `Lỗi: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
    };
  }
};

export const getCodeExercisesByLesson = async (lessonId: string): Promise<any> => {
  try {
    await connectToDatabase();

    const codeExercises = await CodeExercise.find({
      lesson: lessonId,
      _destroy: false,
    })
      .sort({ order: 1 })
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(codeExercises)),
    };
  } catch (error) {
    console.error("Error getting code exercises:", error);
    return {
      success: false,
      message: `Lỗi: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
    };
  }
};

export const getCodeExerciseById = async (id: string): Promise<any> => {
  try {
    await connectToDatabase();

    const codeExercise = await CodeExercise.findById(id)
      .populate("course", "title slug")
      .populate("lesson", "title slug")
      .lean();

    if (!codeExercise) {
      return {
        success: false,
        message: "Không tìm thấy bài tập code!",
      };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(codeExercise)),
    };
  } catch (error) {
    console.error("Error getting code exercise:", error);
    return {
      success: false,
      message: `Lỗi: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
    };
  }
};

export const updateCodeExercise = async (params: IUpdateCodeExerciseParams): Promise<any> => {
  try {
    await connectToDatabase();

    const updateData: any = {};
    if (params.title !== undefined) updateData.title = params.title;
    if (params.description !== undefined) updateData.description = params.description;
    if (params.instructions !== undefined) updateData.instructions = params.instructions;
    if (params.starterCode !== undefined) updateData.starterCode = params.starterCode;
    if (params.solution !== undefined) updateData.solution = params.solution;
    if (params.testCases !== undefined) updateData.testCases = params.testCases;
    if (params.language !== undefined) updateData.language = params.language;
    if (params.difficulty !== undefined) updateData.difficulty = params.difficulty;
    if (params.timeLimit !== undefined) updateData.timeLimit = params.timeLimit;
    if (params.maxAttempts !== undefined) updateData.maxAttempts = params.maxAttempts;
    if (params.points !== undefined) updateData.points = params.points;
    if (params.order !== undefined) updateData.order = params.order;
    if (params.status !== undefined) updateData.status = params.status;

    const codeExercise = await CodeExercise.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    if (!codeExercise) {
      return {
        success: false,
        message: "Không tìm thấy bài tập code!",
      };
    }

    revalidatePath("/manage/course/update-content");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(codeExercise)),
      message: "Cập nhật bài tập code thành công!",
    };
  } catch (error) {
    console.error("Error updating code exercise:", error);
    return {
      success: false,
      message: `Lỗi: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
    };
  }
};

export const deleteCodeExercise = async (id: string): Promise<any> => {
  try {
    await connectToDatabase();

    const codeExercise = await CodeExercise.findByIdAndUpdate(
      id,
      { _destroy: true },
      { new: true }
    );

    if (!codeExercise) {
      return {
        success: false,
        message: "Không tìm thấy bài tập code!",
      };
    }

    revalidatePath("/manage/course/update-content");
    return {
      success: true,
      message: "Xóa bài tập code thành công!",
    };
  } catch (error) {
    console.error("Error deleting code exercise:", error);
    return {
      success: false,
      message: `Lỗi: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
    };
  }
};

export const submitCodeExercise = async (params: {
  codeExerciseId: string;
  code: string;
  language: string;
  clerkId: string;
}): Promise<any> => {
  try {
    await connectToDatabase();

    // Validate inputs
    if (!params.codeExerciseId || !params.clerkId) {
      return {
        success: false,
        message: "Thiếu thông tin cần thiết!",
      };
    }

    // Get MongoDB User ID from Clerk ID
    const mongoUserId = await getMongoUserId(params.clerkId);
    if (!mongoUserId) {
      return {
        success: false,
        message: "Không tìm thấy user!",
      };
    }

    const codeExercise = await CodeExercise.findById(params.codeExerciseId);
    if (!codeExercise) {
      return {
        success: false,
        message: "Không tìm thấy bài tập code!",
      };
    }

    // Check attempts
    const existingResults = await CodeExerciseResult.find({
      codeExercise: params.codeExerciseId,
      user: mongoUserId,
    });

    if (existingResults.length >= codeExercise.maxAttempts) {
      return {
        success: false,
        message: "Đã hết số lần thử!",
      };
    }

    // TODO: Implement code execution and testing
    // For now, we'll simulate test results
    const testResults = codeExercise.testCases.map((testCase, index) => ({
      testCase: index + 1,
      passed: Math.random() > 0.3, // Simulate random results
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: testCase.expectedOutput, // Simulate correct output
      error: Math.random() > 0.8 ? "Runtime error" : undefined,
    }));

    const passedTests = testResults.filter(result => result.passed).length;
    const score = Math.round((passedTests / testResults.length) * 100);

    const result = await CodeExerciseResult.create({
      codeExercise: params.codeExerciseId,
      user: mongoUserId,
      code: params.code,
      language: params.language,
      testResults,
      score,
      totalTests: testResults.length,
      passedTests,
      executionTime: Math.floor(Math.random() * 1000) + 100, // Simulate execution time
      attempts: existingResults.length + 1,
      completedAt: new Date(),
    });

    revalidatePath("/");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
      message: "Nộp bài tập code thành công!",
    };
  } catch (error) {
    console.error("Error submitting code exercise:", error);
    return {
      success: false,
      message: `Lỗi: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
    };
  }
};

export const getCodeExerciseResults = async (codeExerciseId: string, clerkId: string): Promise<any> => {
  try {
    await connectToDatabase();

    // Validate inputs
    if (!codeExerciseId || !clerkId) {
      return {
        success: false,
        message: "Thiếu thông tin cần thiết!",
      };
    }

    // Get MongoDB User ID from Clerk ID
    const mongoUserId = await getMongoUserId(clerkId);
    if (!mongoUserId) {
      return {
        success: false,
        message: "Không tìm thấy user!",
      };
    }

    const results = await CodeExerciseResult.find({
      codeExercise: codeExerciseId,
      user: mongoUserId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(results)),
    };
  } catch (error) {
    console.error("Error getting code exercise results:", error);
    return {
      success: false,
      message: `Lỗi: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
    };
  }
};
