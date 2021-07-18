"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = void 0;
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
var Type;
(function (Type) {
    Type["Alternate"] = "alternate";
    Type["Primary"] = "primary";
})(Type = exports.Type || (exports.Type = {}));
const getGameInfo = async (req, res, next) => {
    // get the post id from the req
    let id = req.params.id;
    // get the post
    let result = await axios_1.default.get(`https://api.geekdo.com/xmlapi2/thing?id=${id}`, {
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
    let formatted = post;
    try {
        let item = formatted.items.item[0];
        let name = item.name.filter((e) => {
            return e.$.type === "primary";
        });
        var output = {
            id: item.$.id,
            thumbnail: item.thumbnail[0],
            image: item.image[0],
            name: name[0].$.value,
            description: item.description,
            yearpublished: item.yearpublished[0].$.value,
        };
    }
    catch (TypeError) {
        return res.status(404).json({ message: "404: Game not found" });
    }
    return res.status(200).json({
        message: formatted,
    });
};
exports.default = {
    getGameInfo,
};
