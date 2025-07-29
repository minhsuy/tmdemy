import Image from "next/image";
import React from "react";
import CommentDeleteAction from "./CommentDeleteAction";
import { formatDate, getRepliesComment, timeAgo } from "@/lib/utils";

import CommentReply from "./CommentReply";
import { ICommentItem, ICreateComment } from "@/types/type";

const CommentItem = ({
  comments,
  comment,
  data,
}: {
  comment: ICommentItem;
  comments: ICommentItem[] | undefined;

  data: ICreateComment;
}) => {
  const replies = getRepliesComment({ comments, parentId: comment._id });
  const level = comment.level || 0;
  return (
    <>
      <div
        className="relative flex items-start gap-3 p-3 rounded-md bg-white dark:bg-grayDarker shadow-lg border border-gray-300 flex-shrink-0 ml-auto"
        key={comment._id}
        style={{
          width: `calc(100% - ${level * 65}px)`,
        }}
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
        <div className="flex flex-col gap-1 w-full">
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
          </div>
          <div className="text-sm text-gray-400 font-medium">
            <CommentReply
              data={{
                course: data.course,
                user: data.user,
                lesson: data.lesson,
                slug: data.slug,
                parentId: comment._id,
                level: comment.level,
              }}
            ></CommentReply>
          </div>
        </div>
      </div>
      {replies &&
        replies.length > 0 &&
        replies.map((reply) => (
          <CommentItem
            key={reply._id}
            comment={reply}
            comments={comments}
            data={data}
          />
        ))}
    </>
  );
};

export default CommentItem;
