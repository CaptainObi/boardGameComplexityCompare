/** src/controllers/posts.ts */
import e, { Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import { parseString } from "xml2js";
import { Collection } from "../interfaces/Collection";
import { Plays, PlayElement } from "../interfaces/Plays";

//gets the userID of a username
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
	let id: string = req.params.id;

	const reqBody: any = req.body;

	// Validate request
	if (!req.body) {
		res.status(400).send({
			message: "Content can not be empty!",
		});
	}

	// create a new comparison
	const filters: { [key: string]: boolean } = {
		prevowned: reqBody.body.prevowned,
		own: reqBody.body.own,
		played: reqBody.body.played,
		rated: reqBody.body.rated,
	};

	const games: number[] = [];

	if (filters.played === true) {
		const result: AxiosResponse = await axios.get(
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

		const output: Plays = post;

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
				`https://api.geekdo.com/xmlapi2/plays?username=${id}&page=${page}&subtype=boardgame`,
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

		const fullListOfGames = await Promise.all(map);

		try {
			for (var i = 0; i < fullListOfGames.length; i++) {
				for (var e = 0; e < fullListOfGames[i].length; e++) {
					let game: string = fullListOfGames[i][e].item[0]["$"]["objectid"];
					if (games.includes(Number(game)) === false) {
						games.push(Number(game));
					}
				}
			}
		} catch (TypeError) {
			return res.status(404).json({ message: "404: User not found" });
		}
	}

	// get the post id from the re
	// get the post

	const url: string = `https://www.boardgamegeek.com/xmlapi2/collection?username=${id}&subtype=boardgame&brief=0&excludesubtype=boardgameexpansion&stats=1`;
	// `https://www.boardgamegeek.com/xmlapi2/collection?username=${id}&subtype=boardgame&brief=1&own=1&played=0`

	const initalQuerry = await axios.get(url, {
		validateStatus: (status: number) =>
			status === 429 || status === 200 || status === 202,
	});

	if (initalQuerry.status === 429) {
		return res.status(429).json({ message: "Too many requests." });
	}

	setTimeout(async () => {
		const result = await axios.get(url, {
			validateStatus: (status: number) =>
				status === 429 || status === 200 || status === 202,
		});

		if (result.status === 429 || result.status === 202) {
			return res.status(result.status).json({ message: "Too many requests." });
		}

		let post: any = {};

		parseString(result.data, (err: Error, result: Object) => {
			if (err) {
				throw err;
			}

			post = result;
		});

		const output: Collection = post;

		const fullListOfGames = output["items"]["item"];

		for (const i in filters) {
			try {
				if (filters[i] === true) {
					if (i === "prevowned") {
						const filtered = fullListOfGames.filter(
							(e) => e.status[0].$.prevowned === "1"
						);

						filtered.forEach((y) => {
							if (!games.includes(Number(y.$.objectid))) {
								games.push(Number(y.$.objectid));
							}
						});
					} else if (i === "own") {
						const filtered = fullListOfGames.filter(
							(e) => e.status[0].$.own === "1"
						);

						filtered.forEach((y) => {
							if (!games.includes(Number(y.$.objectid))) {
								games.push(Number(y.$.objectid));
							}
						});
					} else if (i === "rated") {
						const filtered = fullListOfGames.filter(
							(e) => e.stats[0].rating[0].$.value !== "N/A"
						);

						filtered.forEach((y) => {
							if (!games.includes(Number(y.$.objectid))) {
								games.push(Number(y.$.objectid));
							}
						});
					}
				}
			} catch (TypeError) {
				return res.status(404).json({ message: "404 User not found" });
			}
		}

		return res.status(200).json({ message: games });
	}, 5000);
};

export default {
	getUserID,
	getUserPlays,
};
