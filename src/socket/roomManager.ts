import {Server, Socket} from "socket.io";
import {
    addPresence,
    removePresence,
    getPresence,
    getUsersInRoom
} from "./store";

// TODO: May be we can take the business logic somewhere else.
export const handleRoom = (socket: Socket, io: Server) => {

    // 1. join room
    socket.on("room:join", async ({roomId, userId, userName}) => {
        try{
            // Validate existance of room either from DB or the io.adapter
            // Validate premission: OPTIONAL FOR NOW

            await socket.join(roomId);
            // add the presence
            addPresence({
                socketId: socket.id,
                roomId: roomId,
                userId: userId,
                userName: userName,
            });

        }catch(error){
            socket.emit("error", {
                message:"Failed joining room"
            });
        }
    });

    // updating a room => add/update/remove items, add/update/remove claims.

    // leave room => disconnect
    socket.on("disconnect", () => {
        console.log("[SOCKET] disconnected: ", socket.id);
        const presence = getPresence(socket.id);
        if(!presence) return;

        removePresence(socket.id);

        // broadcast to room that user left
        io.to(presence.roomId).emit("presence:update", {
            message: `${presence.userName} left`,

        });
    })


};