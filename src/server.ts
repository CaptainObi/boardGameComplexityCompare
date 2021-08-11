/** source/server.ts */
import http from "http";
import express, { Express } from "express";
import morgan from "morgan";
import userRoutes from "./routes/user";
import gameRoutes from "./routes/game";
import comparisonRoutes from "./routes/comparison";
import eloRoutes from "./routes/elo";
const router: Express = express();
import path from "path";

/** Logging */
router.use(morgan("dev"));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

if (process.env.NODE_ENV === "production") {
	//server static content
	//npm run build
	router.use(express.static("/app/client/build"));
	console.log("/app/client/build");
	console.log("ello");
}

/** RULES OF OUR API */
router.use((req, res, next) => {
	// set the CORS policy
	res.header("Access-Control-Allow-Origin", "*");
	// set the CORS headers
	res.header(
		"Access-Control-Allow-Headers",
		"origin, X-Requested-With,Content-Type,Accept, Authorization"
	);
	// set the CORS method headers
	if (req.method === "OPTIONS") {
		return res.status(200).json({});
	}
	next();
});

/** Routes */
router.use("/api/user", userRoutes);
router.use("/api/game", gameRoutes);
router.use("/api/comparison", comparisonRoutes);
router.use("/api/elo", eloRoutes);
router.use("/api/*", (req, res, next) => {
	const error = new Error("not found");
	return res.status(404).json({
		message: error.message,
	});
});

router.use("/", (req, res) => {
	res.sendFile("/app/client/build/index.html");
});
/** Error handling */
router.use((req, res, next) => {
	const error = new Error("not found");
	return res.status(404).json({
		message: error.message,
	});
});

router.options("*", (req, res) => res.json({ status: "OK" }));

/** Server */

const httpServer = http.createServer(router);
const PORT: any = process.env.PORT || 8080;
httpServer.listen(PORT, () =>
	console.log(`The server is running on port ${PORT}`)
);
