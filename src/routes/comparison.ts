import express from "express";
import controller from "../controllers/comparison";
const router = express.Router();

router.post("/", controller.postComparisons);
router.get("/", controller.getAll);

export = router;
