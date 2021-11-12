export interface Collection {
	items: Items;
}

export interface Items {
	$: ItemsClass;
	item: ItemElement[];
}

export interface ItemsClass {
	totalitems: string;
	termsofuse: string;
	pubdate: string;
}

export interface ItemElement {
	$: Item;
	name: NameElement[];
	yearpublished: string[];
	image: string[];
	thumbnail: string[];
	stats: StatElement[];
	status: StatusElement[];
	numplays: string[];
}

export interface Item {
	objecttype: Objecttype;
	objectid: string;
	subtype: Subtype;
	collid: string;
}

export enum Objecttype {
	Thing = "thing",
}

export enum Subtype {
	Boardgame = "boardgame",
	Strategygames = "strategygames",
	Thematic = "thematic",
	Wargames = "wargames",
}

export interface NameElement {
	_: string;
	$: Name;
}

export interface Name {
	sortindex: string;
}

export interface StatElement {
	$: Stat;
	rating: RatingElement[];
}

export interface Stat {
	minplayers: string;
	maxplayers: string;
	minplaytime?: string;
	maxplaytime?: string;
	playingtime?: string;
	numowned: string;
}

export interface RatingElement {
	$: Rating;
	usersrated: Average[];
	average: Average[];
	bayesaverage: Average[];
	stddev: Average[];
	median: Average[];
	ranks: RatingRank[];
}

export interface Rating {
	value: string;
}

export interface Average {
	$: Rating;
}

export interface RatingRank {
	rank: RankRank[];
}

export interface RankRank {
	$: Rank;
}

export interface Rank {
	type: Type;
	id: string;
	name: Subtype;
	friendlyname: Friendlyname;
	value: string;
	bayesaverage: string;
}

export enum Friendlyname {
	BoardGameRank = "Board Game Rank",
	StrategyGameRank = "Strategy Game Rank",
	ThematicRank = "Thematic Rank",
	WarGameRank = "War Game Rank",
}

export enum Type {
	Family = "family",
	Subtype = "subtype",
}

export interface StatusElement {
	$: Status;
}

export interface Status {
	own: string;
	prevowned: string;
	fortrade: string;
	want: string;
	wanttoplay: string;
	wanttobuy: string;
	wishlist: string;
	preordered: string;
	lastmodified: string;
}
