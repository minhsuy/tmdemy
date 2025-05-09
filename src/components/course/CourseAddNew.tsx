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

const formSchema = z.object({
  title: z.string().min(10, {
    message: "Tên khóa học phải có ít nhất 10 ký tự",
  }),
  slug: z.string().optional(),
});

function CourseAddNew() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const data = {
        title: values.title,
        slug:
          values.slug ||
          slugify(values.title, {
            lower: true,
            locale: "vi",
          }),
      };
      const course = await createCourse(data);
      if (course.success && course.data) {
        toast.success("Tạo khóa học thành công !");
        router.push(`/manage/course/update?slug=${course.data.slug}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating course:", error);
    } finally {
      setIsLoading(false);
      form.reset();
    }
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
        </div>
        <div className="mt-6">
          <Button
            disabled={isLoading}
            className="text-white w-[120px]"
            type="submit"
            isLoading={isLoading}
          >
            Tạo khóa học
          </Button>
        </div>
      </form>
    </Form>
  );
}
export default CourseAddNew;
