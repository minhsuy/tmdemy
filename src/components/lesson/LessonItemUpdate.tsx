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
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateLesson } from "@/lib/actions/lesson.actions";
import { Editor } from "@tinymce/tinymce-react";
import { ICreateLessonParams } from "@/types/type";
const formSchema = z.object({
  title: z.string().min(5, {
    message: "Tên bài học phải có ít nhất 5 ký tự",
  }),
  slug: z.string().optional(),
  video_url: z.string().optional(),
  content: z.string().optional(),
  duration: z.number().optional(),
});

function LessonItemUpdate({
  lesson,
  path,
}: {
  lesson: ICreateLessonParams;
  path: string;
}) {
  console.log(lesson);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: lesson.title,
      slug: lesson.slug,
      video_url: lesson.video_url,
      content: lesson.content,
      duration: lesson.duration,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const updatedLesson = await updateLesson({
        _id: lesson._id!,
        updatedData: {
          ...values,
          path,
        },
      });
      if (updatedLesson.success) {
        toast.success(updatedLesson.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    } finally {
      setIsLoading(false);
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
                  Tên bài học <span className="text-primary">*</span>
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
                <FormLabel>Đường dẫn bài học</FormLabel>
                <FormControl>
                  <Input placeholder="khoa-hoc-lap-trinh" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* video_url  */}
          <FormField
            control={form.control}
            name="video_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video Url</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=fTrqoVSrw1Y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* duration  */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thời lượng khóa học</FormLabel>
                <FormControl>
                  <Input
                    placeholder="20"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* content  */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Nội dung</FormLabel>
                <FormControl>
                  <Editor
                    apiKey="ox2i4ag3cmm97n826f5eo9joriytzho3w1axxucno0kpevzp"
                    init={{
                      plugins:
                        "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                      toolbar:
                        "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                    }}
                    value={field.value}
                    onEditorChange={(content: any) => field.onChange(content)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-5 items-center mt-8">
          <Button
            type="submit"
            className="text-white"
            disabled={isLoading}
            isLoading={isLoading}
          >
            Cập nhật
          </Button>
        </div>
      </form>
    </Form>
  );
}
export default LessonItemUpdate;
