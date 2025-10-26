"use server";

import { connectToDatabase } from "@/lib/mongoose";
import Certificate from "@/database/certificate.model";
import User from "@/database/user.model";
import Course from "@/database/course.model";
import Lesson from "@/database/lesson.model";
import History from "@/database/history.model";
import { revalidatePath } from "next/cache";
import { ICreateCertificateParams } from "@/types/type";

// Helper function to get MongoDB User ID from Clerk ID
const getMongoUserId = async (clerkId: string): Promise<string | null> => {
  try {
    const user = await User.findOne({ clerkId }).lean();
    return user ? (user as any)._id.toString() : null;
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
};

// Calculate course completion percentage
export const calculateCourseCompletion = async (courseId: string, clerkId: string): Promise<any> => {
  try {
    await connectToDatabase();

    // Get MongoDB User ID from Clerk ID
    const mongoUserId = await getMongoUserId(clerkId);
    if (!mongoUserId) {
      return {
        success: false,
        message: "Không tìm thấy user!",
      };
    }

    // Get course with lessons
    const course = await Course.findById(courseId).populate({
      path: "lectures",
      populate: {
        path: "lessons",
        match: { _destroy: false },
      },
    });

    if (!course) {
      return {
        success: false,
        message: "Không tìm thấy khóa học!",
      };
    }

    // Get all lessons from course
    const lessons = await Lesson.find({
      course: courseId,
      _destroy: false,
    }).lean();

    if (lessons.length === 0) {
      return {
        success: true,
        data: {
          completionPercentage: 0,
          totalLessons: 0,
          completedLessons: 0,
        },
      };
    }

    // Get actual completion from History
    const completedHistory = await History.find({
      user: mongoUserId,
      course: courseId
    });

    const completedLessons = completedHistory.length;
    const completionPercentage = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

    return {
      success: true,
      data: {
        completionPercentage,
        totalLessons: lessons.length,
        completedLessons,
      },
    };
  } catch (error) {
    console.error("Error calculating course completion:", error);
    return {
      success: false,
      message: `Lỗi: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
    };
  }
};

// Create certificate
export const createCertificate = async (params: ICreateCertificateParams): Promise<any> => {
  try {
    await connectToDatabase();

    // Convert Clerk ID to MongoDB User ID
    const mongoUserId = await getMongoUserId(params.userId);
    if (!mongoUserId) {
      return {
        success: false,
        message: "Không tìm thấy user!",
      };
    }

    // Validate inputs
    if (!params.courseId || params.completionPercentage < 60) {
      return {
        success: false,
        message: "Không đủ điều kiện để cấp chứng chỉ! (Cần hoàn thành ≥60%)",
      };
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      user: mongoUserId,
      course: params.courseId,
      _destroy: false,
    });

    if (existingCertificate) {
      return {
        success: false,
        message: "Chứng chỉ đã được cấp cho khóa học này!",
      };
    }

    // Generate unique certificate ID
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const certificateId = `CERT-${timestamp}-${random}`;

    // Create certificate
    const certificate = await Certificate.create({
      user: mongoUserId,
      course: params.courseId,
      certificateId: certificateId,
      completionPercentage: params.completionPercentage,
    });

    revalidatePath("/");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(certificate)),
    };
  } catch (error) {
    console.error("Error creating certificate:", error);
    return {
      success: false,
      message: `Lỗi: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
    };
  }
};

// Get certificates by user
export const getCertificatesByUser = async (clerkId: string): Promise<any> => {
  try {
    await connectToDatabase();

    // Get MongoDB User ID from Clerk ID
    const mongoUserId = await getMongoUserId(clerkId);
    if (!mongoUserId) {
      return {
        success: false,
        message: "Không tìm thấy user!",
      };
    }

    const certificates = await Certificate.find({
      user: mongoUserId,
      _destroy: false,
      status: "ACTIVE",
    })
      .populate("course", "title image author")
      .populate("user", "name email")
      .sort({ issuedAt: -1 })
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(certificates)),
    };
  } catch (error) {
    console.error("Error getting certificates by user:", error);
    return {
      success: false,
      message: `Lỗi: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
    };
  }
};

// Get certificate by ID
export const getCertificateById = async (certificateId: string): Promise<any> => {
  try {
    await connectToDatabase();

    const certificate = await Certificate.findOne({
      certificateId,
      _destroy: false,
      status: "ACTIVE",
    })
      .populate("course", "title image author")
      .populate("user", "name email")
      .lean();

    if (!certificate) {
      return {
        success: false,
        message: "Không tìm thấy chứng chỉ!",
      };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(certificate)),
    };
  } catch (error) {
    console.error("Error getting certificate by ID:", error);
    return {
      success: false,
      message: `Lỗi: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
    };
  }
};

// Check if user is eligible for certificate
export const checkCertificateEligibility = async (courseId: string, clerkId: string): Promise<any> => {
  try {
    await connectToDatabase();

    // Get MongoDB User ID from Clerk ID
    const mongoUserId = await getMongoUserId(clerkId);
    if (!mongoUserId) {
      return {
        success: false,
        message: "Không tìm thấy user!",
      };
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      user: mongoUserId,
      course: courseId,
      _destroy: false,
    });

    if (existingCertificate) {
      return {
        success: true,
        data: {
          eligible: false,
          reason: "Chứng chỉ đã được cấp",
          certificate: JSON.parse(JSON.stringify(existingCertificate)),
        },
      };
    }

    // Calculate completion percentage
    const completionResult = await calculateCourseCompletion(courseId, clerkId);
    
    if (!completionResult.success) {
      return completionResult;
    }

    const { completionPercentage } = completionResult.data;
    const eligible = completionPercentage >= 60;

    return {
      success: true,
      data: {
        eligible,
        completionPercentage,
        reason: eligible ? "Đủ điều kiện cấp chứng chỉ" : "Chưa đủ điều kiện (cần ≥60%)",
      },
    };
  } catch (error) {
    console.error("Error checking certificate eligibility:", error);
    return {
      success: false,
      message: `Lỗi: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
    };
  }
};
