"use client";
import React, { useState } from "react";
import { CommentForm } from "./CommentForm";
import { ICommentItem, ICreateComment } from "@/types/type";

const CommentReply = ({ data }: { data: ICreateComment }) => {
  const [replyComment, setReplyComment] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="hover hover:text-gray-500 relative bottom-[24px] left-20"
        onClick={() => setReplyComment(!replyComment)}
      >
        {replyComment ? "Hủy" : "Trả lời"}
      </button>
      {replyComment && (
        <CommentForm
          data={data}
          replyComment={replyComment}
          setReplyComment={setReplyComment}
        ></CommentForm>
      )}
    </div>
  );
};

export default CommentReply;
