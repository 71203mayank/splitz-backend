import { asyncHandler } from "../utils/asyncHandler";
import { createRoomSchema } from "../schemas/roomSchemas";
import roomService from "../services/roomServices";

class RoomController {
  createRoom = asyncHandler(async (req, res) => {
    // validate the request body using zod schema
    const result = createRoomSchema.safeParse(req.body);
    if(!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues,
      })
    }

    const room = await roomService.createRoom(result.data);


    res.status(201).json({
      success: true,
      data: room,
    });
  });

  members = asyncHandler(async (req, res) => {

    const { roomId } = req.params;

    if(typeof roomId !== "string" || roomId.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Invalid roomId",
      });
    }

    // get the members of the room from the service layer.
    const members = await roomService.getMembers(roomId);

    res.json({
      success: true,
      data: members, // NOTE: this is an array of members with presence info
    });
  });
}

export default new RoomController();