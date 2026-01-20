import connectDB from "./db.js";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
    await connectDB();
    const existing = await User.findOne({ username: "admin" });
    if (!existing) {
        const admin = new User({
            username: "admin",
            password: "admin123",
            role: "admin"
        });
        await admin.save();
        console.log("✅ Admin user created: admin / admin123");
    } else {
        console.log("ℹ️ Admin user already exists");
    }
    process.exit(0);
};

createAdmin();
