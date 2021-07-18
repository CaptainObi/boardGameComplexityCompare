"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/** src/routes/posts.ts */
const express_1 = __importDefault(require("express"));
const game_1 = __importDefault(require("../controllers/game"));
const router = express_1.default.Router();
router.get("/:id", game_1.default.getGameInfo);
module.exports = router;
