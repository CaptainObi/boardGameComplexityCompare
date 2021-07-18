import { Request, Response, NextFunction } from "express";
import comparison from "../models/comparison";

interface Comparison {
	GameA: number;
	GameB: number;
	Winner: number;
	user: number;
}

const postComparisons = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Validate request
	if (!req.body) {
		res.status(400).send({
			message: "Content can not be empty!",
		});
	}

	// Create a Customer
	const newComparison: Comparison = {
		GameA: req.body.gameA,
		GameB: req.body.gameB,
		Winner: req.body.winner,
		user: req.body.userID,
	};

	// Save Customer in the database
	comparison.create(newComparison, (err: Error, data: Response) => {
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
	comparison.getAll((err: Error, data: Response) => {
		if (err)
			res.status(500).send({
				message:
					err.message || "Some error occurred while creating the comparison.",
			});
		else res.send(data);
	});
};

export default { postComparisons, getAll };
