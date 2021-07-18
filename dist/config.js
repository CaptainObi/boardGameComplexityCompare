"use strict";
const env = process.env;
const config = {
    db: {
        host: env.DB_HOST || "localhost",
        user: env.DB_USER || "express",
        password: env.DB_PASSWORD || "rooter",
        database: env.DB_NAME || "boardgamecompare",
    },
    listPerPage: env.LIST_PER_PAGE || 10,
};
module.exports = config;
