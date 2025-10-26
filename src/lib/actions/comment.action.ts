"use server";
import Comment from "@/database/comment.model";
import { connectToDatabase } from "../mongoose";
import { ICommentItem, ICreateComment, ICreateRating } from "@/types/type";
import { ECommentStatus } from "@/types/enums";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

const createNewComment = async (
  params: ICreateComment
): Promise<ICreateRating | undefined> => {
  try {
    connectToDatabase();
    const comment = await Comment.create(params);
    if (!comment)
      return {
        success: false,
        message: "Không thể tạo bình luận !",
      };
    revalidatePath(params.path || "/");
    return {
      success: true,
      message: "Đăng bình luận thành công !",
    };
  } catch (error) {
    console.log(error);
  }
};
const getCommentByLesson = async (
  params: ICreateComment
): Promise<ICommentItem[] | undefined> => {
  try {
    connectToDatabase();
    const comment = await Comment.find({
      lesson: params.lesson,
      course: params.course,
      status: ECommentStatus.ACTIVE,
    }).populate({
      path: "user",
      model: User,
      select: "username avatar ",

    }).sort({ createdAt: -1 });
    if (!comment) return undefined;
    return JSON.parse(JSON.stringify(comment));
  } catch (error) {
    console.log(error);
  }
};
const deleteCommentByUser = async ({
  id,
  path,
}: {
  id: string;
  path: string;
}): Promise<ICreateRating | undefined> => {
  try {
    await connectToDatabase();
    const comment = await Comment.findById(id);
    if (!comment)
      return {
        success: false,
        message: "Không thể xóa bình luận !",
      };
    if (comment.parentId) {
      const deleteComment = await Comment.findByIdAndDelete(id);
      if (!deleteComment)
        return {
          success: false,
          message: "Không thể xóa bình luận !",
        };
      revalidatePath(path || "/");
      return {
        success: true,
        message: "Xóa bình luận thành công !",
      };
    } else {
      await Comment.deleteMany({ parentId: id });
      const deleteComment = await Comment.findByIdAndDelete(id);
      if (!deleteComment) {
        return {
          success: false,
          message: "Không thể xóa bình luận!",
        };
      }
      revalidatePath(path || "/");
      return {
        success: true,
        message: "Xóa bình luận thành công !",
      };
    }
  } catch (error) {
    console.log(error);
  }
};
export { createNewComment, getCommentByLesson, deleteCommentByUser };
