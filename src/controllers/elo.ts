import { Request, Response, NextFunction } from "express";
import { Game } from "../models/index";
import axios, { AxiosResponse } from "axios";
import { parseString } from "xml2js";
import game from "./game";

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

export interface GameResponse {
	message: Message;
}

export interface Message {
	items: Items;
}

export interface Items {
	$: ItemsClass;
	item: ItemElement[];
}

export interface ItemsClass {
	termsofuse: string;
}

export interface ItemElement {
	$: Item;
	thumbnail: string[];
	image: string[];
	name: NameElement[];
	description: string[];
	yearpublished: PurpleMaxplayer[];
	minplayers: PurpleMaxplayer[];
	maxplayers: PurpleMaxplayer[];
	poll: PollElement[];
	playingtime: PurpleMaxplayer[];
	minplaytime: PurpleMaxplayer[];
	maxplaytime: PurpleMaxplayer[];
	minage: PurpleMaxplayer[];
	link: LinkElement[];
	statistics: Statistic[];
}

export interface Item {
	type: string;
	id: string;
}

export interface LinkElement {
	$: Link;
}

export interface Link {
	type: string;
	id: string;
	value: string;
}

export interface PurpleMaxplayer {
	$: Maxplayer;
}

export interface Maxplayer {
	value: string;
}

export interface NameElement {
	$: Name;
}

export interface Name {
	type: Type;
	sortindex: string;
	value: string;
}

export enum Type {
	Alternate = "alternate",
	Primary = "primary",
}

export interface PollElement {
	$: Poll;
	results: PollResult[];
}

export interface Poll {
	name: string;
	title: string;
	totalvotes: string;
}

export interface PollResult {
	$?: Purple;
	result: ResultResult[];
}

export interface Purple {
	numplayers: string;
}

export interface ResultResult {
	$: Fluffy;
}

export interface Fluffy {
	value: string;
	numvotes: string;
	level?: string;
}

export interface Statistic {
	$: StatisticClass;
	ratings: Rating[];
}

export interface StatisticClass {
	page: string;
}

export interface Rating {
	usersrated: Average[];
	average: Average[];
	bayesaverage: Average[];
	ranks: RatingRank[];
	stddev: Average[];
	median: Average[];
	owned: Average[];
	trading: Average[];
	wanting: Average[];
	wishing: Average[];
	numcomments: Average[];
	numweights: Average[];
	averageweight: Average[];
}

export interface Average {
	$: Purple;
}

export interface Purple {
	value: string;
}

export interface RatingRank {
	rank: RankRank[];
}

export interface RankRank {
	$: Rank;
}

export interface Rank {
	type: string;
	id: string;
	name: string;
	friendlyname: string;
	value: string;
	bayesaverage: string;
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
	if (!response) {
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

		let formatted: Message = post;

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
	// Validate request

	let ids: number[] = req.body.body.ids;
	// Save Customer in the database

	const requestsNeeded: number[] = [];
	const pending: Elo[] = [];

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

		let formatted: Message = await post;

		console.log("STARTING");

		for (const i of formatted.items.item) {
			const response = await Game.findByPk(i.$.id);
			console.log(response, "HELLO");
			let output: Elo = {} as Elo;
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

			const data = await Game.create(output);
			pending.push(output);
		}
	}

	res.send(pending);
};

export default { postElo, getAll, getID, updateElo, getIDs };
