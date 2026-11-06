import type {CreateRoomInput} from "../schemas/roomSchemas";
import type {CreateRoomResult, MemberWithPresence} from "../types/roomTypes";

class RoomService {
    createRoom = async (roomData: CreateRoomInput): Promise<CreateRoomResult> => {
        // Generate an unique id

        // include admin in members list

        // Create a room in the DB

        // return the Ids
        // Currently dummy
        return {
            roomId: "unique-room-id",
            adminMemberId: "unique-admin-id"
        };
    };

    getMembers = async (roomId: string) : Promise<MemberWithPresence[]> => {
        // Check if the room exsits in the DB, if not throw an error

        // Get all the active members of the room for the socker layer


        // return member + active or not
        // currenlty dummy.
        return [];

    };
}

export default new RoomService();