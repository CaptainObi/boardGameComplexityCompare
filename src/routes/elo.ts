import express from "express";
import controller from "../controllers/elo";
const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getID);
router.post("/", controller.postElo);
router.post("/update", controller.updateElo);

export = router;
