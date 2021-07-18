"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const config_1 = __importDefault(require("../config/config"));
// Create a connection to the database
const connection = mysql_1.default.createConnection({
    host: config_1.default.HOST,
    user: config_1.default.USER,
    password: config_1.default.PASSWORD,
    database: config_1.default.DB,
    port: 3306,
});
// open the MySQL connection
connection.connect((error) => {
    if (error)
        throw error;
    console.log("Successfully connected to the database.");
});
exports.default = connection;
