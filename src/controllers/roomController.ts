import { asyncHandler } from "../utils/asyncHandler";
// import roomService from "../services/roomService";

class RoomController {
  createRoom = asyncHandler(async (req, res) => {
    // const room = await roomService.createRoom(req.body);

    res.status(201).json({
      success: true,
      // data: { room_id, admin_id }
    });
  });

  members = asyncHandler(async (req, res) => {
    // const { roomId } = req.params;
    // const members = await roomService.getMembers(roomId);

    res.json({
      success: true,
      // data: members
    });
  });
}

export default new RoomController();