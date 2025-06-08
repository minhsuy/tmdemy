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
import { createCourse, updateCourse } from "@/lib/actions/course.actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { IUser } from "@/types/type";
import { ECourseLevel, ECourseStatus } from "@/types/enums";
import { Textarea } from "../ui/textarea";
import { ICourse } from "@/database/course.model";
import { useImmer } from "use-immer";
import IconAdd from "../icons/IconAdd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courseLevel, courseStatus } from "@/constants";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import IconTrash from "../icons/IconTrash";
const formSchema = z.object({
  title: z.string().min(10, {
    message: "Tên khóa học phải có ít nhất 10 ký tự",
  }),
  slug: z.string().optional(),
  price: z.number().int().nonnegative().optional(),
  sale_price: z.number().int().nonnegative().optional(),
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

function CourseUpdate({ data }: { data: ICourse }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [courseInfo, setCourseInfo] = useImmer({
    requirements: data.info.requirements,
    benefits: data.info.benefits,
    qa: data.info.qa,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data.title,
      slug: data.slug,
      price: data.price,
      sale_price: data.sale_price,
      intro_url: data.intro_url,
      description: data.description,
      image: data.image,
      views: data.views,
      status: data.status,
      level: data.level,
      info: {
        requirements: data.info.requirements,
        benefits: data.info.benefits,
        qa: data.info.qa,
      },
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const updatedCourse = await updateCourse({
        slug: data.slug,
        updateData: {
          title: values.title,
          slug: values.slug,
          price: values.price,
          sale_price: values.sale_price,
          intro_url: values.intro_url,
          description: values.description,
          views: values.views,
          info: {
            requirements: courseInfo.requirements,
            benefits: courseInfo.benefits,
            qa: courseInfo.qa,
          },
          level: values.level,
          image: values.image,
        },
      });
      if (updatedCourse.success) {
        toast.success("Cập nhật khóa học thành công!");
        router.push(`/manage/course/update?slug=${updatedCourse.data.slug}`);
      } else {
        toast.error(updatedCourse.message);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const watchImage = form.watch("image");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 min-h-screen mb-16"
      >
        <div className="grid grid-cols-2 gap-8 mt-10 mb-20">
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
                  <Input
                    type="number"
                    placeholder="599.000"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
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
                  <Input
                    type="number"
                    placeholder="999.000"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
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
                  <div className="h-[200px] bg-white rounded-md border border-gray-200 flex items-center justify-center relative">
                    {watchImage ? (
                      <div>
                        <Image
                          src={watchImage}
                          alt="avatar"
                          fill
                          className="w-full h-full object-cover"
                        />
                        <span
                          onClick={() => form.setValue("image", "")}
                          className="absolute top-2 right-2 cursor-pointer p-2 bg-red-500 rounded-lg"
                        >
                          <IconTrash className="size-5 text-white" />
                        </span>
                      </div>
                    ) : (
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          form.setValue("image", res[0]?.url);
                        }}
                        onUploadError={(error: Error) => {}}
                      />
                    )}
                  </div>
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
                  <Input
                    placeholder="1000"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
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
                <FormLabel className="flex items-center justify-between gap-5">
                  <span>Yêu cầu</span>
                  <button
                    className="bg-primary p-1 rounded-sm text-white"
                    onClick={() =>
                      setCourseInfo((draft) => {
                        draft.requirements.push("");
                      })
                    }
                    type="button"
                  >
                    <IconAdd className="size-5" />
                  </button>
                </FormLabel>
                {courseInfo.requirements.map((item, index) => (
                  <FormControl key={index}>
                    <Input
                      placeholder={`Yêu cầu số ${index + 1}`}
                      value={item}
                      onChange={(e) =>
                        setCourseInfo((draft) => {
                          draft.requirements[index] = e.target.value;
                        })
                      }
                    ></Input>
                  </FormControl>
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="info.benefits"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between gap-5">
                  <span>Lợi ích</span>
                  <button
                    className="bg-primary p-1 rounded-sm text-white"
                    onClick={() =>
                      setCourseInfo((draft) => {
                        draft.benefits.push("");
                      })
                    }
                    type="button"
                  >
                    <IconAdd className="size-5" />
                  </button>
                </FormLabel>
                {courseInfo.benefits.map((item, index) => (
                  <FormControl key={index}>
                    <Input
                      placeholder={`Lợi ích số ${index + 1}`}
                      value={item}
                      onChange={(e) =>
                        setCourseInfo((draft) => {
                          draft.benefits[index] = e.target.value;
                        })
                      }
                    ></Input>
                  </FormControl>
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* qna */}
          <FormField
            control={form.control}
            name="info.qa"
            render={({ field }) => (
              <FormItem className="col-start-1 col-end-3">
                <FormLabel className="flex items-center justify-between gap-5">
                  <span>Question/answer</span>
                  <button
                    className="bg-primary p-1 rounded-sm text-white"
                    onClick={() =>
                      setCourseInfo((draft) => {
                        draft.qa.push({
                          question: "",
                          answer: "",
                        });
                      })
                    }
                    type="button"
                  >
                    <IconAdd className="size-5" />
                  </button>
                </FormLabel>
                {courseInfo?.qa?.map((item, index) => (
                  <div key={index} className="grid grid-cols-2 gap-5">
                    <FormControl>
                      <Input
                        placeholder={`Câu hỏi số ${index + 1}`}
                        value={item.question}
                        onChange={(e) =>
                          setCourseInfo((draft) => {
                            draft.qa[index].question = e.target.value;
                          })
                        }
                      ></Input>
                    </FormControl>
                    <FormControl>
                      <Input
                        placeholder={`Câu trả lời số ${index + 1}`}
                        value={item.answer}
                        onChange={(e) =>
                          setCourseInfo((draft) => {
                            draft.qa[index].answer = e.target.value;
                          })
                        }
                      ></Input>
                    </FormControl>
                  </div>
                ))}
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
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Trình độ" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseLevel.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button
            disabled={isLoading}
            className="text-white w-[150px] "
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
