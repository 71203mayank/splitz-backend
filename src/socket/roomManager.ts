import {Server, Socket} from "socket.io";
import {
    addPresence,
    removePresence,
    getPresence,
    // getUsersInRoom
} from "./store";

import * as roomSchemas from "../schemas/roomSchemas";
// import type * as RoomInputs from "../schemas/roomSchemas";
import { withSocketHandler } from "./utils";
import roomServices from "../services/roomServices";


// TODO: May be we can take the business logic somewhere else.
export const handleRoom = (socket: Socket, io: Server) => {

    // 1. join room
    socket.on("room:join",
        withSocketHandler({
            socket,
            schema: roomSchemas.roomJoinSchema,
            requirePresence: false,
            handler: async({data, presence}) => {
                const {roomId, memberId, userName} = data;
                // TODO
                // if already present to the same room or a differnt room return the error
                // throw error

                socket.join(roomId);
                addPresence({
                    socketId: socket.id,
                    userId: memberId,
                    roomId: roomId,
                    userName: userName
                })
                
                /**
                 * Broadcast to everyone in the room except the caller
                 * that this userName has joined.
                 */
                socket.to(roomId).emit("room:join",{
                    userId: memberId,
                    userName: userName,
                });

                // for the caller's ack
                return {
                    userId: memberId,
                    userName: userName,
                }
                
            }
        })
    );

    // room sync: NEED A DIFFERENT APPROACH.
    socket.on("room:sync", async() => {
        // get the latest snapshot of the room
        // only send it back to the user requested for the room sync
    })

    // updating a room => add/update/remove items, add/remove claims.
    // add item
    socket.on("item:add",
        withSocketHandler({
            socket,
            schema: roomSchemas.itemAddSchema,
            requirePresence: true,
            handler: async ({data, presence}) => {
                const item = await roomServices.addItem({
                    ...data,
                    roomId: presence.roomId,
                    actorMemberId: presence.userId,
                })

                io.to(presence.roomId).emit("item:add", item);

                return item;
            }
        })
    )

    // update item
    socket.on("item:update",
        withSocketHandler({
            socket,
            schema: roomSchemas.itemUpdateSchema,
            requirePresence: true,
            handler: async ({data, presence}) => {
                const change = await roomServices.updateItem({
                    ...data,
                    roomId: presence.roomId,
                    actorMemberId: presence.userId,
                })

                io.to(presence.roomId).emit("item:update", change);

                return change;
            }
        })
    )

    // remove item
    socket.on("item:remove",
        withSocketHandler({
            socket,
            schema: roomSchemas.itemRemoveSchema,
            requirePresence: true,
            handler: async ({data, presence}) => {
                const itemId = await roomServices.removeItem({
                    ...data,
                    roomId: presence.roomId,
                    actorMemberId: presence.userId,
                })

                io.to(presence.roomId).emit("item:remove", itemId);

                return itemId;
            }
        })
    )


    // updated claim
    socket.on("claim:update",
        withSocketHandler({
            socket,
            schema: roomSchemas.claimUpdateSchema,
            requirePresence: true,
            handler: async ({data, presence}) => {
                const change = await roomServices.updateClaim({
                    ...data,
                    roomId: presence.roomId,
                    actorMemberId: presence.userId,
                })

                io.to(presence.roomId).emit("claim:updated", change);

                return change;
            }
        })
    )

    // change group additions and discounts [only Admin]
    socket.on("room:adjustments:update", withSocketHandler({
        socket,
        schema: roomSchemas.roomAdjustmentUpdateSchema,
        requirePresence: true,
        handler: async ({data, presence}) => {
            const change = await roomServices.updateAdjustments({
                ...data,
                roomId: presence.roomId,
                actorMemberId: presence.userId
            })

            io.to(presence.roomId).emit("room:adjustments:update", change);
            
            return change;
        }
    }))

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