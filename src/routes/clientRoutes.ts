import express from "express";
import roomController from "../controllers/roomController";

const router = express.Router();

router.post("/create-room", roomController.createRoom);
router.get("/members", roomController.members );

export default router;