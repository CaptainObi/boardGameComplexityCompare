/** src/routes/posts.ts */
import express from "express";
import controller from "../controllers/user";
const router = express.Router();

router.get("/:id", controller.getUserID);
router.get("/games/:id", controller.getUserPlays);
router.put("/posts/:id", controller.updatePost);
router.delete("/posts/:id", controller.deletePost);
router.post("/posts", controller.addPost);

export = router;
