import mysql from "mysql";
import config from "../config/config";

// Create a connection to the database
const connection = mysql.createConnection({
	host: config.HOST,
	user: config.USER,
	password: config.PASSWORD,
	database: config.DB,
	port: 3306,
});

// open the MySQL connection
connection.connect((error) => {
	if (error) throw error;
	console.log("Successfully connected to the database.");
});

export default connection;
