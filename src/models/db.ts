import mysql from "mysql";

var mysqlHost = process.env.MYSQL_HOST || "localhost";
var mysqlPort = Number(process.env.MYSQL_PORT) || 3306;
var mysqlUser = process.env.MYSQL_USER || "root";
var mysqlPass = process.env.MYSQL_PASS || "root";
var mysqlDB = process.env.MYSQL_DB || "node_db";

console.log(mysqlHost);

// Create a connection to the database
const connection = mysql.createConnection({
	host: mysqlHost,
	user: mysqlUser,
	password: mysqlPass,
	database: mysqlDB,
	port: mysqlPort,
	connectTimeout: 30000,
});

// open the MySQL connection
connection.connect((error) => {
	if (error) throw error;
	console.log("Successfully connected to the database.");
});

export default connection;
