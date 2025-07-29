import { CommentForm } from "@/components/comment/CommentForm";
import { formatDate, timeAgo } from "@/lib/utils";
import { ICommentItem, ICreateComment } from "@/types/type";
import Image from "next/image";
import React from "react";

import Swal from "sweetalert2";
import { deleteCommentByUser } from "@/lib/actions/comment.action";
import { toast } from "react-toastify";
import CommentDeleteAction from "@/components/comment/CommentDeleteAction";
import CommentReply from "@/components/comment/CommentReply";
import CommentItem from "@/components/comment/CommentItem";
const LessonComment = ({
  data,
  comments,
}: {
  data: ICreateComment;
  comments: ICommentItem[] | undefined;
}) => {
  const rootComment = comments?.filter(
    (comment: ICommentItem) => !comment.parentId
  );
  return (
    <div>
      <CommentForm data={data}></CommentForm>
      {comments && comments?.length > 0 && (
        <div className="flex flex-col justify-between gap-5 mt-10  w-full">
          <div className="flex items-center gap-x-2">
            <h2 className="text-2xl font-bold">Bình luận</h2>
            <span className="w-[40px] rounded-full bg-primary text-white text-center">
              {comments?.length}
            </span>
          </div>
          {rootComment &&
            rootComment.map((comment: ICommentItem) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                data={data}
                comments={comments}
              ></CommentItem>
            ))}
        </div>
      )}
    </div>
  );
};

export default LessonComment;
