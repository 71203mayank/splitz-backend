// Request and socket payload validation
import {z} from "zod";

export const createRoomSchema = z.object({
    roomName: z.string().trim().min(1),
    adminName: z.string().trim().min(1),
    memberNames: z.array(z.string().trim().min(1)),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;