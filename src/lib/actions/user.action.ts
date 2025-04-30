"use server";
import User from "@/database/user.model";
import { ICreateUser } from "@/types/type";
import { connectToDatabase } from "../mongoose";

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

export { createUser };
