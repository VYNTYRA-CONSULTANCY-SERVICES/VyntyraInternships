import mongoose from "mongoose";

const defaultUri = "mongodb://127.0.0.1:27017/vyntyra-internships";

const connectDB = async (uri) => {
  const connectionString = uri ?? defaultUri;
  try {
    await mongoose.connect(connectionString);
    console.log(`MongoDB connected to ${mongoose.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection failed", error);
    throw error;
  }
};

export default connectDB;
