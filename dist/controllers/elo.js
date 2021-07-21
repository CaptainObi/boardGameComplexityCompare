"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const elo_1 = __importDefault(require("../models/elo"));
const postElo = async (req, res, next) => {
    // Validate request
    const reqBody = req.body;
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
    }
    // Create a Customer
    const newGame = {
        gameID: reqBody.body.gameID,
        ComplexElo: reqBody.body.ComplexElo,
        DepthElo: reqBody.body.DepthElo,
    };
    // Save Customer in the database
    elo_1.default.create(newGame, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the comparison.",
            });
        else
            res.send(data);
    });
};
const updateElo = async (req, res, next) => {
    // Validate request
    const reqBody = req.body;
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
    }
    // Create a Customer
    const newGame = {
        gameID: reqBody.body.gameID,
        ComplexElo: reqBody.body.ComplexElo,
        DepthElo: reqBody.body.DepthElo,
    };
    // Save Customer in the database
    elo_1.default.update(newGame, (err, data) => {
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
    elo_1.default.getAll((err, data) => {
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
    elo_1.default.getID(Number(id), (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the comparison.",
            });
        else
            res.send(data);
    });
};
exports.default = { postElo, getAll, getID, updateElo };
