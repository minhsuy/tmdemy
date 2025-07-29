import { ICommentItem } from "@/types/type";
import { clsx, type ClassValue } from "clsx";
import { comment } from "postcss";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (time: number) => {
  if (time < 60) {
    return `${time}p`;
  }
  const hour = Math.floor(time / 60);
  const minute = time % 60;
  return `${hour}h${minute}p`;
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("vi-VN");
};
export const timeAgo = (data: string) => {
  const date = new Date(data);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) {
    return `${seconds} giây`;
  }
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} phút`;
  }
  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours} giờ`;
  }
  const days = Math.round(hours / 24);
  if (days < 7) {
    return `${days} ngày`;
  }
  const weeks = Math.round(days / 7);
  if (weeks < 4) {
    return `${weeks} tuần`;
  }
  const months = Math.round(weeks / 4);
  if (months < 12) {
    return `${months} tháng`;
  }
  const years = Math.round(months / 12);
  return `${years} năm`;
};
export const getRepliesComment = ({
  comments,
  parentId,
}: {
  comments: ICommentItem[] | undefined;
  parentId: string;
}) => {
  return comments?.filter(
    (comment: ICommentItem) =>
      comment?.parentId?.toString() === parentId.toString()
  );
};
