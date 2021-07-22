/** src/controllers/posts.ts */
import { Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import { parseString } from "xml2js";

interface Post {
	userId: Number;
	id: Number;
	title: String;
	body: String;
}

export interface Plays {
	plays: PlaysClass;
}

export interface PlaysClass {
	$: Purple;
	play: PlayElement[];
}

export interface Purple {
	username: string;
	userid: string;
	total: string;
	page: string;
	termsofuse: string;
}

export interface PlayElement {
	$: Play;
	item: ItemElement[];
	comments?: string[];
}

export interface Play {
	id: string;
	date: string;
	quantity: string;
	length: string;
	incomplete: string;
	nowinstats: string;
	location: string;
}

export interface ItemElement {
	$: Item;
	subtypes: ItemSubtype[];
}

export interface Item {
	name: string;
	objecttype: Objecttype;
	objectid: string;
}

export enum Objecttype {
	Thing = "thing",
}

export interface ItemSubtype {
	subtype: SubtypeSubtype[];
}

export interface SubtypeSubtype {
	$: Subtype;
}

export interface Subtype {
	value: Value;
}

export enum Value {
	Boardgame = "boardgame",
	Boardgameexpansion = "boardgameexpansion",
	Boardgameimplementation = "boardgameimplementation",
	Boardgameintegration = "boardgameintegration",
}

// gets the userID of a username
const getUserID = async (req: Request, res: Response, next: NextFunction) => {
	// get the post id from the req
	let id: string = req.params.id;
	// get the post
	let result: AxiosResponse = await axios.get(
		`https://api.geekdo.com/xmlapi2/plays?username=${id}`,
		{
			headers: {
				Accept: "application/json",
			},
		}
	);

	let post: any = {};
	parseString(result.data, (err: Error, result: Object) => {
		if (err) {
			throw err;
		}

		post = result;
	});

	let output: Plays = post;

	try {
		var temp: string = output["plays"]["$"]["userid"];
	} catch (TypeError) {
		return res.status(404).json({ message: "404: User not found" });
	}

	return res.status(200).json({
		message: temp,
	});
};

// gets all the IDs of games that a user has played
const getUserPlays = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// get the post id from the req
	let id: string = req.params.id;
	// get the post
	let result: AxiosResponse = await axios.get(
		`https://api.geekdo.com/xmlapi2/plays?username=${id}`,
		{
			headers: {
				Accept: "application/json",
			},
		}
	);

	let post: any = {};

	parseString(result.data, (err: Error, result: Object) => {
		if (err) {
			throw err;
		}

		post = result;
	});

	let output: Plays = post;

	try {
		var total: number = Number(output["plays"].$.total);
	} catch (TypeError) {
		return res.status(404).json({ message: "404: User not found" });
	}

	const numberOfSearches: number = Math.floor(total / 100) + 1;

	const iterations: number[] = [...Array(numberOfSearches).keys()];

	const map: Promise<PlayElement[]>[] = iterations.map(async (e: number) => {
		const page: number = e + 1;
		let result: AxiosResponse = await axios.get(
			`https://api.geekdo.com/xmlapi2/plays?username=${id}&page=${page}`,
			{
				headers: {
					Accept: "application/json",
				},
			}
		);

		let postR: any = {};

		parseString(result.data, (err: Error, result: Object) => {
			if (err) {
				throw err;
			}

			postR = result;
		});

		let output: Plays = postR;
		return output.plays.play;
	});

	const fullListOfGames: PlayElement[][] = await Promise.all(map);
	let games: string[] = [];

	try {
		for (var i = 0; i < fullListOfGames.length; i++) {
			for (var e = 0; e < fullListOfGames[i].length; e++) {
				let game: string = fullListOfGames[i][e].item[0]["$"]["objectid"];
				if (games.includes(game) === false) {
					games.push(game);
				}
			}
		}
	} catch (TypeError) {
		return res.status(404).json({ message: "404: User not found" });
	}

	return res.status(200).json({
		message: games,
	});
};

// updating a post
const updatePost = async (req: Request, res: Response, next: NextFunction) => {
	// get the post id from the req.params
	let id: string = req.params.id;
	// get the data from req.body
	let title: string = req.body.title ?? null;
	let body: string = req.body.body ?? null;
	// update the post
	let response: AxiosResponse = await axios.put(
		`https://jsonplaceholder.typicode.com/posts/${id}`,
		{
			...(title && { title }),
			...(body && { body }),
		}
	);
	// return response
	return res.status(200).json({
		message: response.data,
	});
};

// deleting a post
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
	// get the post id from req.params
	let id: string = req.params.id;
	// delete the post
	let response: AxiosResponse = await axios.delete(
		`https://jsonplaceholder.typicode.com/posts/${id}`
	);
	// return response
	return res.status(200).json({
		message: "post deleted successfully",
	});
};

// adding a post
const addPost = async (req: Request, res: Response, next: NextFunction) => {
	// get the data from req.body
	let title: string = req.body.title;
	let body: string = req.body.body;
	// add the post
	let response: AxiosResponse = await axios.post(
		`https://jsonplaceholder.typicode.com/posts`,
		{
			title,
			body,
		}
	);
	// return response
	return res.status(200).json({
		message: response.data,
	});
};

export default {
	getUserID,
	getUserPlays,
	updatePost,
	deletePost,
	addPost,
};
