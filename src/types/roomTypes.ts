// shared result and domain types
import type {Room} from "../models/roomModel";

export type MemberWithPresence = Room["members"][number] & {isActive: boolean};

export interface CreateRoomResult {
    roomId: string;
    adminMemberId: string;
}