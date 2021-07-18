"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/** src/routes/posts.ts */
const express_1 = __importDefault(require("express"));
const posts_1 = __importDefault(require("../controllers/posts"));
const router = express_1.default.Router();
router.get("/:id", posts_1.default.getUserID);
router.get("/games/:id", posts_1.default.getUserPlays);
router.put("/posts/:id", posts_1.default.updatePost);
router.delete("/posts/:id", posts_1.default.deletePost);
router.post("/posts", posts_1.default.addPost);
module.exports = router;
