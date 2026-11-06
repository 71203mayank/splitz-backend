import express from "express";
import roomController from "../controllers/roomController";
import coreController from "../controllers/coreController"

const router = express.Router();

router.get("/health",  coreController.healthCheck);
router.post("/create-room", roomController.createRoom);
router.get("/members/:roomId", roomController.members );

export default router;