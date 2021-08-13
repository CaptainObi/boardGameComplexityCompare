import express from "express";
import controller from "../controllers/elo";
const router = express.Router();

router.get("/", controller.getAll);
router.post("/ids", controller.getIDs);
router.get("/:id", controller.getID);
router.post("/", controller.postElo);
router.patch("/update", controller.updateElo);

export = router;
