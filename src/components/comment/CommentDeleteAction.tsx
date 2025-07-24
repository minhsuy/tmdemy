"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IconMore from "../icons/IconMore";
import IconTrash from "../icons/IconTrash";
import { deleteCommentByUser } from "@/lib/actions/comment.action";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
const CommentDeleteAction = ({ id, path }: { id: string; path: string }) => {
  const handleDeleteComment = async () => {
    try {
      Swal.fire({
        text: `Bạn có muốn xóa bình luận này ?`,
        title: "Xóa bình luận",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await deleteCommentByUser({
            id,
            path,
          });
          if (res && !res.success) {
            toast.error(res.message);
          } else {
            toast.success(res?.message);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="absolute top-2 right-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-gray-400 hover:text-gray-600">
            <IconMore className="size-6" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem>
            <button
              className="text-gray-400 hover:text-red-600 flex items-center gap-2"
              onClick={handleDeleteComment}
            >
              <IconTrash className="size-5" />
              <span> Xóa bình luận</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CommentDeleteAction;
