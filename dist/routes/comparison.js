"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const comparison_1 = __importDefault(require("../controllers/comparison"));
const router = express_1.default.Router();
router.post("/", comparison_1.default.postComparisons);
router.get("/", comparison_1.default.getAll);
module.exports = router;
