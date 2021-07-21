import { Request, Response, NextFunction } from "express";
import elo from "../models/elo";

interface Elo {
	gameID: number;
	ComplexElo: number;
	DepthElo: number;
}

const postElo = async (req: Request, res: Response, next: NextFunction) => {
	// Validate request

	const reqBody: any = req.body;

	if (!req.body) {
		res.status(400).send({
			message: "Content can not be empty!",
		});
	}

	// Create a Customer
	const newGame: Elo = {
		gameID: reqBody.body.gameID,
		ComplexElo: reqBody.body.ComplexElo,
		DepthElo: reqBody.body.DepthElo,
	};

	// Save Customer in the database
	elo.create(newGame, (err: Error, data: Response) => {
		if (err)
			res.status(500).send({
				message:
					err.message || "Some error occurred while creating the comparison.",
			});
		else res.send(data);
	});
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
	const newGame: Elo = {
		gameID: reqBody.body.gameID,
		ComplexElo: reqBody.body.ComplexElo,
		DepthElo: reqBody.body.DepthElo,
	};

	// Save Customer in the database
	elo.update(newGame, (err: Error, data: Response) => {
		if (err)
			res.status(500).send({
				message:
					err.message || "Some error occurred while creating the comparison.",
			});
		else res.send(data);
	});
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	// Validate request

	// Save Customer in the database
	elo.getAll((err: Error, data: Response) => {
		if (err)
			res.status(500).send({
				message:
					err.message || "Some error occurred while creating the comparison.",
			});
		else res.send(data);
	});
};

const getID = async (req: Request, res: Response, next: NextFunction) => {
	// Validate request
	let id: string = req.params.id;
	// Save Customer in the database
	elo.getID(Number(id), (err: Error, data: Response) => {
		if (err)
			res.status(500).send({
				message:
					err.message || "Some error occurred while creating the comparison.",
			});
		else res.send(data);
	});
};

export default { postElo, getAll, getID, updateElo };
