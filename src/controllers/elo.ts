import { Request, Response, NextFunction } from "express";
import { Game } from "../models/index";

interface Elo {
	gameID: number;
	ComplexElo: number;
	DepthElo: number;
	thumbnail: string | null;
	image: string | null;
	name: string | null;
	yearpublished: number;
	rank: number;
	weight: number;
	rating: number;
}

const postElo = async (req: Request, res: Response, next: NextFunction) => {
	// Validate request
	try {
		const reqBody: any = req.body;

		if (!req.body) {
			res.status(400).send({
				message: "Content can not be empty!",
			});
		}

		console.log(reqBody);

		// Create a Customer
		const newGame: Elo = {
			gameID: reqBody.body.gameID,
			ComplexElo: reqBody.body.ComplexElo,
			DepthElo: reqBody.body.DepthElo,
			thumbnail: reqBody.body.thumbnail,
			image: reqBody.body.image,
			name: reqBody.body.name,
			yearpublished: reqBody.body.yearpublished,
			rank: reqBody.body.rank,
			weight: reqBody.body.weight,
			rating: reqBody.body.rating,
		};

		// Save Customer in the database
		const response = await Game.create(newGame);
		res.send(response);
	} catch (err) {
		res.status(500).send({ message: err.message || "Some error occured" });
	}
};

const updateElo = async (req: Request, res: Response, next: NextFunction) => {
	// Validate request
	const reqBody: any = req.body;
	if (!req.body) {
		res.status(400).send({
			message: "Content can not be empty!",
		});
	}

	// Create a Customer
	const newGame = {
		gameID: reqBody.body.gameID,
		ComplexElo: reqBody.body.ComplexElo,
		DepthElo: reqBody.body.DepthElo,
	};

	// Save Customer in the database
	const response = await Game.update(newGame, {
		returning: true,
		where: { gameID: newGame.gameID },
	});
	res.send(response);
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	// Validate request

	// Save Customer in the database
	const response = await Game.findAll();
	res.send(response);
};

const getID = async (req: Request, res: Response, next: NextFunction) => {
	// Validate request
	let id: string = req.params.id;
	// Save Customer in the database
	const response = await Game.findByPk(id);
	res.send(response);
};

export default { postElo, getAll, getID, updateElo };
