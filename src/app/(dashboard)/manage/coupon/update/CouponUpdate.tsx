"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { boolean, z } from "zod";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { couponTypes } from "@/constants";
import { ECouponType } from "@/types/enums";
import { Switch } from "@/components/ui/switch";
import { createNewCoupon, updatedCoupon } from "@/lib/actions/coupon.action";
import { redirect, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getCourses } from "@/lib/actions/course.actions";
import { ICourse } from "@/database/course.model";
import { ICouponPopulated } from "@/types/type";
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Tên coupon phải có ít nhất 3 ký tự",
  }),
  code: z.string().min(2, {
    message: "Mã coupon phải có ít nhất 3 ký tự.",
  }),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  type: z.string().optional(),
  value: z.number().optional(),
  courses: z.array(z.string()).optional(),
  limit: z.number().optional(),
  active: z.boolean().optional(),
});

export function CouponUpdate({ data }: { data: ICouponPopulated }) {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date>(
    data.startDate || new Date()
  );
  const [endDate, setEndDate] = useState<Date>(data.endDate || new Date());
  const [findCourse, setFindCourse] = useState<any[] | undefined>([]);
  const [checkedCourses, setCheckedCourses] = useState<string[]>(
    data.courses.map((item: any) => item._id.toString())
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data.title,
      code: data.code,
      active: data.active,
      value: data.value,
      limit: data.limit,
      type: data.type,
    },
  });
  const handleFindCourse = debounce(async (value: string) => {
    const courses = await getCourses({ search: value });
    setFindCourse(courses);
  }, 500);
  const handleCheckedCourse = (checked: boolean | string, id: string) => {
    if (checked) {
      setCheckedCourses([...checkedCourses, id]);
      console.log(id);
    } else {
      setCheckedCourses(checkedCourses.filter((item) => item !== id));
      console.log(id);
    }
  };
  form.setValue("courses", checkedCourses);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (values.active === undefined) {
        values.active = false;
      }
      const dataUpdate = { ...values, startDate, endDate };
      const coupon = await updatedCoupon({ _id: data._id, ...dataUpdate });
      if (coupon.success) {
        toast.success(coupon.message);
        router.push("/manage/coupon");
      } else {
        toast.error(coupon.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-8 mt-10 mb-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu để</FormLabel>
                <FormControl>
                  <Input placeholder="Tiêu đề ...." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã giảm giá</FormLabel>
                <FormControl>
                  <Input placeholder="Tên mã giảm giá" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* start date */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full border border-gray-300"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "dd/MM/yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        initialFocus
                        selected={startDate}
                        onSelect={setStartDate as any}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* start date */}
          {/* end date */}

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày kết thúc</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full border border-gray-300"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "dd/MM/yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        initialFocus
                        selected={endDate}
                        onSelect={setEndDate as any}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* end date */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại coupon</FormLabel>
                <FormControl>
                  <RadioGroup
                    defaultValue={ECouponType.PERCENTAGE}
                    className="flex gap-5"
                    onValueChange={field.onChange}
                  >
                    {couponTypes.map((type) => (
                      <div
                        className="flex items-center space-x-2"
                        key={type.value}
                      >
                        <RadioGroupItem value={type.value} id={type.value} />
                        <Label htmlFor={type.value}>{type.title}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá trị</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="50%"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <FormControl>
                  <div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số lượng tối đa</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="100"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="courses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Khóa học</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tìm kiếm khóa học..."
                      onChange={(e) => handleFindCourse(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {findCourse &&
              findCourse.length > 0 &&
              findCourse.map((course: ICourse) => (
                <Label
                  className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
                  key={course._id}
                >
                  <Checkbox
                    id="toggle-2"
                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                    onCheckedChange={(checked) =>
                      handleCheckedCourse(checked, course._id)
                    }
                    checked={checkedCourses.some((item) => item === course._id)}
                  />
                  <p className="text-sm leading-none font-medium">
                    {course.title}
                  </p>
                </Label>
              ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button className="text-white w-[150px] mb-10" type="submit">
            Cập nhật coupon
          </Button>
        </div>
      </form>
    </Form>
  );
}
