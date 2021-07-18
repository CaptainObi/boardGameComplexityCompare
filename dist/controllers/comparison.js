"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comparison_1 = __importDefault(require("../models/comparison"));
const postComparisons = async (req, res, next) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
    }
    // Create a Customer
    const newComparison = {
        GameA: req.body.gameA,
        GameB: req.body.gameB,
        Winner: req.body.winner,
        user: req.body.userID,
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
exports.default = { postComparisons, getAll };
