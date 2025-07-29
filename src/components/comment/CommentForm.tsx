"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { useTransition } from "react";
import { set } from "lodash";
import { ICommentItem, ICreateComment } from "@/types/type";
import { createNewComment } from "@/lib/actions/comment.action";
import { toast } from "react-toastify";

const formSchema = z.object({
  content: z
    .string({
      message: "Nội dung không được để trống !",
    })
    .min(5, {
      message: "Bình luận phải có ít nhất 5 ký tự !",
    }),
});

export function CommentForm({
  data,
  comment,
  replyComment,
  setReplyComment,
}: {
  data: ICreateComment;
  comment?: ICreateComment;
  replyComment?: boolean;
  setReplyComment?: React.Dispatch<React.SetStateAction<boolean>> | any;
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (data.parentId) {
      data = {
        ...data,
        parentId: data.parentId,
        level: data.parentId && data?.level >= 0 ? data?.level + 1 : 0,
      };
    }
    startTransition(async () => {
      const res = await createNewComment({
        ...data,
        content: values.content,
        path: `${data.course}/lesson?slug=${data.slug}`,
      });
      if (res && !res?.success) {
        toast.error(res.message);
        form.setValue("content", "");
        if (replyComment) {
          setReplyComment(false);
        }
      } else {
        toast.success(res?.message);
        form.setValue("content", "");
        if (replyComment) {
          setReplyComment(false);
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Nhập bình luận ..."
                  {...field}
                  className="resize-none h-[120px]  text-sm font-semibold text-gray-700 focus:border-primary focus:ring-0"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="text-white ml-auto w-[150px]"
          isLoading={isPending}
        >
          Đăng bình luận
        </Button>
      </form>
    </Form>
  );
}
