"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const elo_1 = __importDefault(require("../controllers/elo"));
const router = express_1.default.Router();
router.get("/", elo_1.default.getAll);
router.get("/:id", elo_1.default.getID);
router.post("/", elo_1.default.postElo);
router.post("/update", elo_1.default.updateElo);
module.exports = router;
