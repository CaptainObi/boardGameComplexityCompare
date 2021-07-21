"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
// constructor
const create = (game, result) => {
    console.log(game);
    db_1.default.query("INSERT INTO games SET ?", game, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...game });
    });
};
const update = (game, result) => {
    db_1.default.query("UPDATE games SET ? WHERE gameID=?", [game, game.gameID], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...game });
    });
};
const getAll = (result) => {
    db_1.default.query("SELECT * FROM games", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
};
const getID = (id, result) => {
    db_1.default.query("SELECT * FROM games WHERE gameID=?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
};
exports.default = { create, getAll, getID, update };
