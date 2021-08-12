import { Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import { parseString } from "xml2js";

// Generated by https://quicktype.io

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
	// get the post id from the req
	let id: string = req.params.id;
	// get the post
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
