import {Server, Socket} from "socket.io";
import {
    addPresence,
    removePresence,
    getPresence,
    getUsersInRoom,
} from "./store";

import * as roomSchemas from "../schemas/roomSchemas";
// import type * as RoomInputs from "../schemas/roomSchemas";
import { withSocketHandler } from "./utils";
import roomServices from "../services/roomServices";
import { AppError } from "../utils/AppError";


// TODO: May be we can take the business logic somewhere else.
export const handleRoom = (socket: Socket, io: Server) => {

    let joinInProgress = false;

    // Event to join the room
    /**
     * NOTE:
     * Snapshots can overlap with incoming updates.
        During join or sync, a client might receive an item update before receiving the snapshot acknowledgement.
        Replacing its state with an older snapshot could erase that update.
        Plan snapshot revisions and client buffering before connecting the frontend.
     */
    socket.on("room:join",
        withSocketHandler({
            socket,
            schema: roomSchemas.roomJoinSchema,
            requirePresence: false,
            handler: async({data, presence}) => {
                if(presence){
                    throw new AppError(
                        "ALREADY_JOINED",
                        "Leave your current room before joining again",
                    );
                }

                if(joinInProgress){
                    throw new AppError(
                        "JOIN_IN_PROGRESS",
                        "A room join is already in progress",
                    );
                }

                joinInProgress = true;

                try {
                    const {roomId, memberId} = data;

                    const {member} = await roomServices.getRoomForMember({
                        roomId,
                        actorMemberId: memberId
                    });

                    if(!socket.connected){
                        throw new AppError("DISCONNECTED", "Connection closed");
                    }

                    const isActive = getUsersInRoom(roomId).some(
                        (entry) => entry.userId === memberId,
                    );

                    if(isActive) {
                        throw new AppError(
                            "MEMBER_ACTIVE",
                            "This member has already joined the room",
                        );
                    }

                    /**
                     * Reserve immediatley. No await b/w checking
                     * availability and adding presence.
                     */
                    addPresence({
                        socketId: socket.id,
                        roomId,
                        userId: memberId,
                        // @ts-ignore
                        userName: member.name,
                    });

                    try{
                        await socket.join(roomId);

                        // Fetch the snapshot after subscribing to updates
                        const {room} = await roomServices.getRoomForMember({
                            roomId,
                            actorMemberId: memberId,
                        });

                        if(!socket.connected){
                            throw new AppError("DISCONNECTED", "Connection closed");
                        }

                        const activeMemberIds = getUsersInRoom(roomId).map((entry) => entry.userId);

                        io.to(roomId).emit("presence:updated",{
                            roomId,
                            activeMemberIds,
                        })

                        // Wrapper sends this only to the caller via ack.
                        return {
                            room,
                            memberId,
                            activeMemberIds,
                        };
                    } catch (error) {
                        removePresence(socket.id);
                        await socket.leave(roomId);
                        throw error;
                    }

                }finally {
                    joinInProgress = false;
                }
            },
        })
    );

    // Event to sync the room
    socket.on("room:sync",
        withSocketHandler({
            socket,
            schema: roomSchemas.roomSyncSchema,
            requirePresence: true,
            handler: async ({presence}) => {
                const {room} = await roomServices.getRoomForMember({
                    roomId: presence.roomId,
                    actorMemberId:presence.userId,
                })

                return {
                    room,
                    activeMemberIds: getUsersInRoom(presence.roomId)
                        .map((entry) => entry.userId)
                };
            },
        })
    )

    // Event to add item
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

                io.to(presence.roomId).emit("item:added", item);

                return item;
            }
        })
    )

    // Event to update item
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

                io.to(presence.roomId).emit("item:updated", change);

                return change;
            }
        })
    )

    // Event to remove item
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

                io.to(presence.roomId).emit("item:removed", itemId);

                return itemId;
            }
        })
    )


    // Event to update claim on any item
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

    // Event to change group additions and discounts [only Admin]
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

            io.to(presence.roomId).emit("room:adjustments:updated", change);
            
            return change;
        }
    }))

    // Event to leave the room.
    socket.on("disconnect", () => {
        console.log("[SOCKET] disconnected: ", socket.id);
        
        const presence = getPresence(socket.id);
        if(!presence) return;

        const {roomId, userId, userName} = presence;

        removePresence(socket.id);

        const activeMemberIds = getUsersInRoom(roomId)
            .map((entry) => entry.userId);

        io.to(roomId).emit("presence:updated", {
            roomId,
            activeMemberIds,
            leftMemberId: userId,
            message: `${userName} left`,
        })
    })


};
