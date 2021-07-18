/** src/routes/posts.ts */
import express from "express";
import controller from "../controllers/game";
const router = express.Router();

router.get("/:id", controller.getGameInfo);

export = router;
