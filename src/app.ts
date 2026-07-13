import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./configs/db";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try{
        await connectDB();
        app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        });
    }catch (error){
        console.error("[ERROR] Failed to Start Server");
        console.error(error);
        process.exit(1);
    }
}


app.get("/", (req, res) => {
    res.json({
        message: "Splitz Backend 🚀",
    });
});

startServer();
