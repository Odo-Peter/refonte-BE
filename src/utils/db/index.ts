import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL as string;
const PASSWORD = process.env.PASSWORD as string;
const USER = process.env.MONGO_USER as string;
const connectDB = () => {
  return mongoose.connect(DATABASE_URL, {
    pass: PASSWORD,
    user: USER,
  });
};

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection failed"));

export default connectDB;
