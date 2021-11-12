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
