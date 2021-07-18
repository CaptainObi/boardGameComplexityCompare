"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
// constructor
const create = (comparison, result) => {
    db_1.default.query("INSERT INTO compare SET ?", comparison, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created customer: ", { id: res.insertId, ...comparison });
        result(null, { id: res.insertId, ...comparison });
    });
};
const getAll = (result) => {
    db_1.default.query("SELECT * FROM compare", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("customers: ", res);
        result(null, res);
    });
};
exports.default = { create, getAll };
