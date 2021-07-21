import express from "express";
import controller from "../controllers/comparison";
const router = express.Router();

router.post("/", controller.postComparisons);
router.get("/", controller.getAll);
router.get("/:id", controller.getID);
router.options("*", (req, res) => res.json({ status: "OK" }));

export = router;
