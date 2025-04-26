"use server";
import mongoose from "mongoose";

export const connectToDatabase = async () => {
  const connectUrl = process.env.MONGODB_URL as string;
  if (!connectUrl) {
    throw new Error(
      "MongoDB connection URL is not defined in environment variables."
    );
  }
  try {
    await mongoose.connect(connectUrl, {
      dbName: "tmdemy",
    });
    console.log("MongoDB connected successfully !");
  } catch (error) {
    console.log("MongoDB connection failed !", error);
  }
};
