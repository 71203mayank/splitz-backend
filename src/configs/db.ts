import mongoose from "mongoose";

const connectDB = async () => {
    const connect = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
}

export default connectDB;