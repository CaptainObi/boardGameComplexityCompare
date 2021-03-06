import { Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import { parseString } from "xml2js";
import { Game } from "../models";
import { NameElement, GameInterface, ItemElement } from "../interfaces/Game";

// all of these interfaces are to deal with BGG's infurating API.
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
	// creates an elo
	try {
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

	// creates the elo
	const newGame = {
		gameID: reqBody.body.gameID,
		ComplexElo: reqBody.body.ComplexElo,
		DepthElo: reqBody.body.DepthElo,
	};

	// updates the elo
	const response = await Game.update(newGame, {
		returning: true,
		where: { gameID: newGame.gameID },
	});
	res.send(response);
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	// gets all the elos
	const response = await Game.findAll();
	res.send(response);
};

const getID = async (req: Request, res: Response, next: NextFunction) => {
	// gets the elos for a certain id
	let id: string = req.params.id;
	const response = await Game.findByPk(id);
	if (!response) {
		// if it doesnt exist it creates it
		let result: AxiosResponse = await axios.get(
			`https://api.geekdo.com/xmlapi2/thing?id=${id}&stats=1`,
			{
				headers: {
					Accept: "application/json",
				},
			}
		);

		let post: any = {};

		//console.log(result.data);
		parseString(result.data, (err: Error, result: Object) => {
			if (err) {
				throw err;
			}

			post = result;
		});

		let formatted: GameInterface = post;

		let output: Elo = {} as Elo;

		try {
			let item: ItemElement = formatted.items.item[0];

			let name: NameElement[] = item.name.filter((e: NameElement) => {
				return e.$.type === "primary";
			});

			output = {
				gameID: Number(item.$.id),
				ComplexElo: 1000,
				DepthElo: 1000,
				thumbnail: item.thumbnail[0],
				image: item.image[0],
				name: name[0].$.value,
				yearpublished: Number(item.yearpublished[0].$.value),
				rank: Number(item.statistics[0].ratings[0].ranks[0].rank[0].$.value),
				rating: Number(item.statistics[0].ratings[0].average[0].$.value),
				weight: Number(item.statistics[0].ratings[0].averageweight[0].$.value),
			};
		} catch (TypeError) {
			return res.status(404).json({ message: "404: Game not found" });
		}

		await Game.create(output);

		res.send(output);
	} else {
		res.send(response);
	}
};

const getIDs = async (req: Request, res: Response, next: NextFunction) => {
	// fetches elos from a array

	let ids: number[] = req.body.body.ids;

	const requestsNeeded: number[] = [];
	const pending: Elo[] = [];

	// sorts the ids with which ones need to have BGG requests
	for (const id of ids) {
		const response = await Game.findByPk(id);
		if (!response) {
			requestsNeeded.push(id);
		} else {
			const output: Elo = response;
			pending.push(output);
		}
	}

	const requests = await Promise.all(requestsNeeded);

	// sends all the BGG requests in one go
	if (requests.length !== 0) {
		let result: AxiosResponse = await axios.get(
			`https://api.geekdo.com/xmlapi2/thing?id=${requests}&stats=1`,
			{
				headers: {
					Accept: "application/json",
				},
			}
		);

		let post: any = {};

		//console.log(result.data);
		parseString(result.data, (err: Error, result: Object) => {
			if (err) {
				throw err;
			}

			post = result;
		});

		let formatted: GameInterface = await post;

		// processes the requests into saveable objects

		for (const i of formatted.items.item) {
			const response = await Game.findByPk(i.$.id);
			let output: Elo = {} as Elo;
			// creates the object for the elo
			try {
				let name: NameElement[] = i.name.filter((e: NameElement) => {
					return e.$.type === "primary";
				});

				output = {
					gameID: Number(i.$.id),
					ComplexElo: 1000,
					DepthElo: 1000,
					thumbnail: i.thumbnail[0],
					image: i.image[0],
					name: name[0].$.value,
					yearpublished: Number(i.yearpublished[0].$.value),
					rank: Number(i.statistics[0].ratings[0].ranks[0].rank[0].$.value),
					rating: Number(i.statistics[0].ratings[0].average[0].$.value),
					weight: Number(i.statistics[0].ratings[0].averageweight[0].$.value),
				};
			} catch (TypeError) {
				res.status(500);
			}

			// tries to create the object, there can be edit conflicts? sometimes
			try {
				const data = Game.create(output);
			} catch (error) {
				console.log(error);
			}
			// pushes it onto the output
			pending.push(output);
		}
	}

	// sends the output
	res.send(pending);
};

export default { postElo, getAll, getID, updateElo, getIDs };
