import { Pool } from "pg";

const devConfig = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

const proConfig = process.env.DATABASE_URL; //heroku addons
// Create a connection to the database
const connection = new Pool({
	connectionString:
		process.env.NODE_ENV === "production" ? proConfig : devConfig,
	ssl: {
		rejectUnauthorized: false,
	},
});

export default connection;
