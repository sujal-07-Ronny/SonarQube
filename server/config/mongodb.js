import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
    try {
        // Fetch the MongoDB URI from environment variables
        const mongoUri = process.env.MONGODB_URI;

        // Check if the URI is present
        if (!mongoUri) throw new Error("MONGODB_URI is not defined in .env");

        // Connect to MongoDB
        await mongoose.connect(mongoUri);

        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        // Log the error message and exit the process
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1); // Exit the application on error
    }
};

export default connectDB;
