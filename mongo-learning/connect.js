import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);

        // Check which database we are connected to
        console.log(`📂 Database Name: ${conn.connection.name}`);

        process.exit(0);
    } catch (error) {
        console.error(`❌ Connection Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();
