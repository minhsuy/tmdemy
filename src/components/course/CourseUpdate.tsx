"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import slugify from "slugify";
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
import { useState } from "react";
import { createCourse } from "@/lib/actions/course.actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { IUser } from "@/types/type";
import { ECourseLevel, ECourseStatus } from "@/types/enums";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  title: z.string().min(10, {
    message: "Tên khóa học phải có ít nhất 10 ký tự",
  }),
  slug: z.string().optional(),
  price: z.number().int().positive().optional(),
  sale_price: z.number().int().positive().optional(),
  intro_url: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  views: z.number().int().positive().optional(),
  status: z
    .enum([ECourseStatus.ACTIVE, ECourseStatus.PENDING, ECourseStatus.REJECTED])
    .optional(),
  level: z
    .enum([
      ECourseLevel.BEGINNER,
      ECourseLevel.INTERMEDIATE,
      ECourseLevel.ADVANCED,
    ])
    .optional(),
  info: z.object({
    requirements: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional(),
    qa: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ),
  }),
});

function CourseUpdate() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      price: 0,
      sale_price: 0,
      intro_url: "",
      description: "",
      // image: "",
      views: 0,
      status: ECourseStatus.PENDING,
      level: ECourseLevel.BEGINNER,
      info: {
        requirements: [],
        benefits: [],
        qa: [],
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <div className="grid grid-cols-2 gap-4 mt-10">
          {/* title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên khóa học <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Tên khóa học" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* slug  */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đường dẫn khóa học</FormLabel>
                <FormControl>
                  <Input placeholder="khoa-hoc-lap-trinh" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* sale_price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá khuyến mãi</FormLabel>
                <FormControl>
                  <Input placeholder="599.000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* price */}
          <FormField
            control={form.control}
            name="sale_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá gốc</FormLabel>
                <FormControl>
                  <Input placeholder="999.000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả khóa học</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập mô tả..."
                    {...field}
                    className="h-[200px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* avatar course */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ảnh đại diện</FormLabel>
                <FormControl>
                  <div className="h-[200px] bg-white rounded-md border border-gray-200"></div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* intro url */}
          <FormField
            control={form.control}
            name="intro_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Youtube URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=OZmK0YuSmXU"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* views */}
          <FormField
            control={form.control}
            name="views"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lượt xem</FormLabel>
                <FormControl>
                  <Input placeholder="1000" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <FormControl></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* level */}
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trình độ</FormLabel>
                <FormControl></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* required */}
          <FormField
            control={form.control}
            name="info.requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Yêu cầu</FormLabel>
                <FormControl></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* benefits */}
          <FormField
            control={form.control}
            name="info.benefits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lợi ích</FormLabel>
                <FormControl></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* qna */}
          <FormField
            control={form.control}
            name="info.qa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question/Answer</FormLabel>
                <FormControl></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-6">
          <Button
            disabled={isLoading}
            className="text-white w-[150px]"
            type="submit"
            isLoading={isLoading}
          >
            Cập nhật khóa học
          </Button>
        </div>
      </form>
    </Form>
  );
}
export default CourseUpdate;
