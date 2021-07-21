"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Value = exports.Objecttype = void 0;
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
var Objecttype;
(function (Objecttype) {
    Objecttype["Thing"] = "thing";
})(Objecttype = exports.Objecttype || (exports.Objecttype = {}));
var Value;
(function (Value) {
    Value["Boardgame"] = "boardgame";
    Value["Boardgameexpansion"] = "boardgameexpansion";
    Value["Boardgameimplementation"] = "boardgameimplementation";
    Value["Boardgameintegration"] = "boardgameintegration";
})(Value = exports.Value || (exports.Value = {}));
// gets the userID of a username
const getUserID = async (req, res, next) => {
    // get the post id from the req
    let id = req.params.id;
    // get the post
    let result = await axios_1.default.get(`https://api.geekdo.com/xmlapi2/plays?username=${id}`, {
        headers: {
            Accept: "application/json",
        },
    });
    let post = {};
    //console.log(result.data);
    xml2js_1.parseString(result.data, (err, result) => {
        if (err) {
            throw err;
        }
        post = result;
    });
    let output = post;
    try {
        var temp = output["plays"]["$"]["userid"];
    }
    catch (TypeError) {
        return res.status(404).json({ message: "404: User not found" });
    }
    return res.status(200).json({
        message: temp,
    });
};
// gets all the IDs of games that a user has played
const getUserPlays = async (req, res, next) => {
    // get the post id from the req
    let id = req.params.id;
    // get the post
    let result = await axios_1.default.get(`https://api.geekdo.com/xmlapi2/plays?username=${id}`, {
        headers: {
            Accept: "application/json",
        },
    });
    let post = {};
    //console.log(result.data);
    xml2js_1.parseString(result.data, (err, result) => {
        if (err) {
            throw err;
        }
        post = result;
    });
    let output = post;
    try {
        var total = Number(output["plays"].$.total);
    }
    catch (TypeError) {
        return res.status(404).json({ message: "404: User not found" });
    }
    const numberOfSearches = Math.floor(total / 100) + 1;
    const fullListOfGames = [];
    for (let i = 0; i < numberOfSearches; i++) {
        const page = i + 1;
        let result = await axios_1.default.get(`https://api.geekdo.com/xmlapi2/plays?username=${id}&page=${page}`, {
            headers: {
                Accept: "application/json",
            },
        });
        let postR = {};
        //console.log(result.data);
        xml2js_1.parseString(result.data, (err, result) => {
            if (err) {
                throw err;
            }
            postR = result;
        });
        let output = postR;
        output.plays.play.map((e) => fullListOfGames.push(e));
    }
    let games = [];
    try {
        let temp = fullListOfGames.map((e) => {
            let game = e.item[0]["$"]["objectid"];
            if (games.includes(game) === false) {
                games.push(game);
            }
        });
    }
    catch (TypeError) {
        return res.status(404).json({ message: "404: User not found" });
    }
    console.log(games.length);
    return res.status(200).json({
        message: games,
    });
};
// updating a post
const updatePost = async (req, res, next) => {
    var _a, _b;
    // get the post id from the req.params
    let id = req.params.id;
    // get the data from req.body
    let title = (_a = req.body.title) !== null && _a !== void 0 ? _a : null;
    let body = (_b = req.body.body) !== null && _b !== void 0 ? _b : null;
    // update the post
    let response = await axios_1.default.put(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        ...(title && { title }),
        ...(body && { body }),
    });
    // return response
    return res.status(200).json({
        message: response.data,
    });
};
// deleting a post
const deletePost = async (req, res, next) => {
    // get the post id from req.params
    let id = req.params.id;
    // delete the post
    let response = await axios_1.default.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
    // return response
    return res.status(200).json({
        message: "post deleted successfully",
    });
};
// adding a post
const addPost = async (req, res, next) => {
    // get the data from req.body
    let title = req.body.title;
    let body = req.body.body;
    // add the post
    let response = await axios_1.default.post(`https://jsonplaceholder.typicode.com/posts`, {
        title,
        body,
    });
    // return response
    return res.status(200).json({
        message: response.data,
    });
};
exports.default = {
    getUserID,
    getUserPlays,
    updatePost,
    deletePost,
    addPost,
};
