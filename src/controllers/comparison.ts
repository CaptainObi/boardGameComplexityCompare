import { Request, Response, NextFunction } from "express";
import { Comparison } from "../models/index";

interface ComparisonInterface {
	gameA: number;
	gameB: number;
	WinnerMechanically: number;
	WinnerDepth: number;
	user: number;
}

const postComparisons = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const reqBody: any = req.body;

	// Validate request
	if (!req.body) {
		res.status(400).send({
			message: "Content can not be empty!",
		});
	}

	// create a new comparison
	const newComparison: ComparisonInterface = {
		gameA: reqBody.body.gameA,
		gameB: reqBody.body.gameB,
		WinnerMechanically: reqBody.body.winnerMechanically,
		WinnerDepth: reqBody.body.winnerDepth,
		user: reqBody.body.userID,
	};

	// Save Customer in the database
	const response = await Comparison.create(newComparison);
	res.send(response);
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	// gets all the comparisons
	const response = await Comparison.findAll();
	res.send(response);
};

const getID = async (req: Request, res: Response, next: NextFunction) => {
	// gets comparisons for a certain user id
	let id: string = req.params.id;
	const response = await Comparison.findAll({ where: { user: id } });
	res.send(response);
};

export default { postComparisons, getAll, getID };
