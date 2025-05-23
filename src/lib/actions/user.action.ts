"use server";
import User from "@/database/user.model";
import { ICreateUser } from "@/types/type";
import { connectToDatabase } from "../mongoose";
import { NextResponse } from "next/server";

const createUser = async (params: ICreateUser): Promise<any> => {
  if (Object.keys(params).length === 0) {
    throw new Error("User data is required");
  }
  try {
    connectToDatabase();
    const result = await User.create(params);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getUserInfo = async ({ userId }: { userId: string }): Promise<any> => {
  if (!userId) {
    return;
  }
  try {
    connectToDatabase();
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({
        message: "User not found",
      });
    }
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong",
      error,
    });
  }
};

export { createUser, getUserInfo };
