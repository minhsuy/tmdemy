"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconStar } from "@/components/icons";
import Image from "next/image";
import { ratingList } from "@/constants";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { createNewRating } from "@/lib/actions/rating.action";
import { auth } from "@clerk/nextjs/server";
import { toast } from "react-toastify";

const RatingButton = ({
  data,
}: {
  data: {
    courseId: string;
    userId: string;
  };
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { courseId, userId } = data;
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingContent, setRatingContent] = useState("");
  const handleRatingCourse = async () => {
    setIsLoading(true);
    const res = await createNewRating({
      content: ratingContent,
      rate: ratingValue,
      course: courseId,
      user: userId,
    });
    if (res?.success) {
      toast.success(res.message);
      setOpen(false);
      setRatingContent("");
      setRatingValue(5);
      setIsLoading(false);
    } else {
      toast.error(res?.message);
      setOpen(false);
      setRatingContent("");
      setRatingValue(5);
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <div className="flex items-center gap-x-3 bg-primary text-white rounded-lg p-3 cursor-pointer group">
            <IconStar className="size-4 hover  group-hover:animate-spin"></IconStar>
            <span className="text-white text-sm ">Đánh giá khóa học</span>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className=" font-bold text-2xl mb-5">
              Đánh giá
            </DialogTitle>
            <DialogDescription>
              <div className="flex justify-between gap-5 mb-5">
                {ratingList.map((rating) => (
                  <button
                    key={rating.title}
                    className="flex flex-col gap-3 text-center text-xs items-center"
                    type="button"
                    onClick={() => setRatingValue(rating.value)}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center size-10 rounded-full bg-gray-300",
                        ratingValue === rating.value && "bg-primary text-white"
                      )}
                    >
                      <Image
                        width={20}
                        height={20}
                        alt={rating.title}
                        src={`/rating/${rating.title}.png`}
                      />
                    </span>
                    <strong className="capitalize">{rating.title}</strong>
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Cảm nhận của bạn về khóa học này ...."
                className="resize-none h-[200px]"
                onChange={(e) => setRatingContent(e.target.value)}
              />
              {ratingContent.trim().length > 0 &&
                ratingContent.trim().length < 5 && (
                  <p className="text-sm text-red-500 mt-2">
                    Vui lòng nhập ít nhất 5 ký tự.
                  </p>
                )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className="border border-gray-300 bg-white hover:bg-white "
                type="button"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-primary text-white"
              onClick={handleRatingCourse}
              disabled={ratingContent.trim().length < 5 || isLoading}
            >
              Đánh giá
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default RatingButton;
