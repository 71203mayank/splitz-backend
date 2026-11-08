// import * as roomSchemas from "../schemas/roomSchemas";
import type * as RoomInputs from "../schemas/roomSchemas";
import type {CreateRoomResult, MemberWithPresence} from "../types/roomTypes";


// TODO: take all these types inside roomTypes.
type UpdateClaim = RoomInputs.ClaimUpdatedInput & {
    roomId: string;
    actorMemberId: string;
}

type AddItem = RoomInputs.ItemAddInput & {
    roomId: string;
    actorMemberId: string;
}

type UpdateItem = RoomInputs.ItemUpdatedInput & {
    roomId: string;
    actorMemberId: string;
}

type RemoveItem = RoomInputs.ItemRemoveInput & {
    roomId: string;
    actorMemberId: string;
}

type Adjustments = RoomInputs.RoomAdjustmentUpdateInput & {
    roomId: string;
    actorMemberId: string;
}

type RoomMember = {
    roomId: string;
    actorMemberId: string;
}

class RoomService {
    createRoom = async (roomData: RoomInputs.CreateRoomInput): Promise<CreateRoomResult> => {
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
    
    addItem = async (item: AddItem) => {
        // verify presence.roomId === itme.roomId
        // NOTE:  all users are permitted to add item in the given room

        // write to DB

        // return + error handling.
    }

    updateItem = async (item: UpdateItem) => {
        // verify the room

        // verfiy if the user can update the item or not?
        // - Room admin can update it
        // - Item creator can update it.

        // write to DB

        // return + error handling.
    }

    removeItem = async (item: RemoveItem) => {
        // verify room

        // verify if the user can delete the item or not?
        // - Room admin can delete it
        // - Item creator can delete it.

        // write to DB

        // return + error handling.
    }

    updateClaim = async(claimData: UpdateClaim )  => {
        // identify actor from the presence
        // check permission
        // atomically insert/update/remove the target claim
        // return the change if success full
        // throw error if failed.
    }

    updateAdjustments = async(adjustments: Adjustments) => {
        // verify room

        // Only room admin can update this

        // write to DB

        // return + error handling.
    }

    getRoomForMember = async(roomData : RoomMember) => {
        // get the room from the DB

        // Check if this memberId belogns to this room

        // return + error handling
        let room, member;
        return {room, member};


    }
}

export default new RoomService();