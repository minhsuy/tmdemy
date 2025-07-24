import { CommentForm } from "@/components/comment/CommentForm";
import { formatDate, timeAgo } from "@/lib/utils";
import { ICommentItem, ICreateComment } from "@/types/type";
import Image from "next/image";
import React from "react";

import Swal from "sweetalert2";
import { deleteCommentByUser } from "@/lib/actions/comment.action";
import { toast } from "react-toastify";
import CommentDeleteAction from "@/components/comment/CommentDeleteAction";
const LessonComment = ({
  data,
  comments,
}: {
  data: ICreateComment;
  comments: ICommentItem[] | undefined | null;
}) => {
  return (
    <div>
      <CommentForm data={data}></CommentForm>
      {comments && comments?.length > 0 && (
        <div className="flex flex-col gap-5 mt-10">
          <div className="flex items-center gap-x-2">
            <h2 className="text-2xl font-bold">Bình luận</h2>
            <span className="w-[40px] rounded-full bg-primary text-white text-center">
              {comments?.length}
            </span>
          </div>
          {comments.map((comment: ICommentItem) => (
            <div
              className="relative flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-grayDarker shadow-lg border border-gray-300"
              key={comment._id}
            >
              {comment.user._id === data.user && (
                <CommentDeleteAction
                  id={comment._id}
                  path={`${data.course}/lesson?slug=${data.slug}`}
                ></CommentDeleteAction>
              )}

              <div className="size-10 rounded-full border shadow-sm flex-shrink-0">
                <Image
                  src={comment.user.avatar}
                  alt={comment.user.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-bold">{comment.user.username}</h4>
                  <span className="text-sm text-gray-400 font-medium">
                    {timeAgo(comment.createdAt)} trước
                  </span>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-gray-900 dark:text-white">
                  {comment.content}
                </p>
                <div className="flex items-center gap-5 text-sm text-gray-400 font-medium">
                  <span>{formatDate(comment.createdAt)}</span>
                  <span className="rounded-full size-1 bg-gray-300"></span>
                  <button type="button" className="hover hover:text-gray-500">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonComment;
