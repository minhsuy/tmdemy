"use server";
import { ICreateHistory } from "@/types/type";
import { connectToDatabase } from "../mongoose";
import { auth } from "@clerk/nextjs/server";
import History from "@/database/history.model";
import { revalidatePath } from "next/cache";
import { getUserInfo } from "./user.action";
import { console } from "inspector";

const createHistory = async (params: ICreateHistory) => {
  try {
    await connectToDatabase();
    const { userId } = await auth();
    if (!userId) {
      return;
    }
    const findUser = await getUserInfo({ userId });
    if (!findUser) return;
    if (params.checked) {
      await History.create({
        course: params.course,
        lesson: params.lesson,
        user: findUser._id,
      });
    } else {
      await History.findOneAndDelete({
        course: params.course,
        lesson: params.lesson,
        user: findUser._id,
      });
    }
    revalidatePath(params.path || "/");
  } catch (error) {
    console.log(error);
  }
};
const getHistory = async ({ course }: { course: string }) => {
  try {
    await connectToDatabase();
    const { userId } = await auth();
    if (!userId) {
      return;
    }
    const findUser = await getUserInfo({ userId });
    if (!findUser) return;
    const history = await History.find({
      user: findUser._id,
      course,
    });
    return history;
  } catch (error) {
    console.log(error);
  }
};

export { createHistory, getHistory };
