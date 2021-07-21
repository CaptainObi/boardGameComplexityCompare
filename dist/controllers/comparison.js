"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comparison_1 = __importDefault(require("../models/comparison"));
const postComparisons = async (req, res, next) => {
    const reqBody = req.body;
    console.log(reqBody);
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
    }
    // Create a Customer
    const newComparison = {
        GameA: reqBody.body.gameA,
        GameB: reqBody.body.gameB,
        WinnerMechanically: reqBody.body.winnerMechanically,
        WinnerDepth: reqBody.body.winnerDepth,
        user: reqBody.body.userID,
    };
    // Save Customer in the database
    comparison_1.default.create(newComparison, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the comparison.",
            });
        else
            res.send(data);
    });
};
const getAll = async (req, res, next) => {
    // Validate request
    // Save Customer in the database
    comparison_1.default.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the comparison.",
            });
        else
            res.send(data);
    });
};
const getID = async (req, res, next) => {
    // Validate request
    let id = req.params.id;
    // Save Customer in the database
    comparison_1.default.getID(Number(id), (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the comparison.",
            });
        else
            res.send(data);
    });
};
exports.default = { postComparisons, getAll, getID };
