import {Server, Socket} from "socket.io";
import {Server as HttpServer} from "http";
import { handleRoom } from "./roomManager";

let io: Server;

export const initSocket = (httpServer: HttpServer) : Server => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        }
    });

    io.on('connection', (socket) => {
        console.log("[SOCKET LOG] User Connected: ", socket.id );
        handleRoom(socket, io);
    });

    return io;
}

// Helper function to enable access of "io" instance in the express contorllers
export const getIO = () : Server => {
    if (!io) {
        throw new Error("Socket.io has not been initialized!");
    }
    return io;
}