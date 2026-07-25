import express from "express";
import {createServer} from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./configs/db";
import { initSocket } from "./socket";
import clientRoutes from "./routes/clientRoutes"

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/client", clientRoutes);
// admin routes
// error middleware.

initSocket(httpServer);
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try{
        await connectDB();
        //CRITICAL: Listen on httpServer instead of app.listen() [so that both socket and http server can be listend from the same port]
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }catch (error){
        console.error("[ERROR] Failed to Start Server");
        console.error(error);
        process.exit(1);
    }
}

// will remove later.
app.get("/", (req, res) => {
    res.json({
        message: "Splitz Backend 🚀",
    });
});

startServer();
