import { Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import { parseString } from "xml2js";
import { GameInterface, ItemElement, NameElement } from "../interfaces/Game";

interface Output {
	id: string;
	thumbnail: string;
	image: string;
	name: string;
	yearpublished: number;
	rank: number;
	weight: number;
	rating: number;
}

const getGameInfo = async (req: Request, res: Response, next: NextFunction) => {
	// gets the game from bgg
	// note: this is used to get the most up to date info from BGG instead from the elo table
	let id: string = req.params.id;
	let result: AxiosResponse = await axios.get(
		`https://api.geekdo.com/xmlapi2/thing?id=${id}&stats=1`,
		{
			headers: {
				Accept: "application/json",
			},
		}
	);

	let post: any = {};

	// parses into a json
	parseString(result.data, (err: Error, result: Object) => {
		if (err) {
			throw err;
		}

		post = result;
	});

	let formatted: GameInterface = post;

	try {
		let item: ItemElement = formatted.items.item[0];

		let name: NameElement[] = item.name.filter((e: NameElement) => {
			return e.$.type === "primary";
		});

		var output: Output = {
			id: item.$.id,
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

	return res.status(200).json({
		message: output,
	});
};

export default {
	getGameInfo,
};
