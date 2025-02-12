import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected!");
  } catch (error) {
    console.log(`Error connection to db ${error}`);
    process.exit(1); //Completely stops server
  }
};

export default connectDB;
