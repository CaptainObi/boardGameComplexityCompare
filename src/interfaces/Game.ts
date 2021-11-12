export interface GameInterface {
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
