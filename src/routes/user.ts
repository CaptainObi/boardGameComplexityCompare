/** src/routes/posts.ts */
import express from "express";
import controller from "../controllers/user";
const router = express.Router();

router.get("/:id", controller.getUserID);
router.post("/games/:id", controller.getUserPlays);

export = router;
