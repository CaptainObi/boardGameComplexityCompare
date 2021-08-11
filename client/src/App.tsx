import React from "react";
import "./App.css";
import Header from "./components/Header";
import Inputs from "./components/Inputs";
import { useState } from "react";
import Game from "./components/Game";
import axios, { AxiosResponse } from "axios";
import EloRank from "elo-rank";

const elo = new EloRank(24);

export interface GameElement {
	id: string;
	thumbnail: string;
	image: string;
	name: string;
	description: string[];
	yearpublished: number;
	rank: number;
	weight: number;
	rating: number;
}

enum Question {
	Mechanically = "mechanically",
	Depth = "depth",
}

interface PostWinner {
	gameA: number;
	gameB: number;
	winnerMechanically: number | null;
	winnerDepth: number | null;
	userID: number;
}

export interface GameRes {
	message: GameElement;
}

export interface Games {
	gameA: GameElement;
	gameB: GameElement;
}

export interface Choice {
	winnerMechanically: number;
	winnerDepth: number;
}

export interface GetUserID {
	message: string;
}

interface Elo {
	gameID: number;
	ComplexElo: number;
	DepthElo: number;
}

function shuffle(array: any[]) {
	var m = array.length,
		t,
		i;

	// While there remain elements to shuffle…
	while (m) {
		// Pick a remaining element…
		i = Math.floor(Math.random() * m--);

		// And swap it with the current element.
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}

	return array;
}

function App() {
	const [user, setUser] = useState("");
	const [userID, setUserID] = useState(0);
	const [userValid, setUserValid] = useState(false);
	const [games, setGames] = useState<Games | null>(null);
	const [question, setQuestion] = useState<Question>(Question.Mechanically);
	const [mechanically, setMechanically] = useState(0);

	const handleChangedUser = async (userI: string) => {
		//const rest: Response = await fetch(`/api/user/${user}`);

		const rest: AxiosResponse = await axios.get(`/api/user/${userI}`, {
			validateStatus: (status: number) => status === 404 || status === 200,
		});

		const data: GetUserID = await rest.data;
		//console.log(data);
		if (Number(rest.status) === 200 || Number(rest.status) === 304) {
			setUserValid(true);
			setUser(userI);
			setUserID(Number(data.message));

			generateNewGames(userI);
		} else {
			setUserValid(false);
		}
	};

	const handleClick = async (winner: number) => {
		if (question === Question.Mechanically) {
			setMechanically(winner);
			setQuestion(Question.Depth);
			console.log("now going to depth");
		} else {
			handleChoice({ winnerDepth: winner, winnerMechanically: mechanically });
			setQuestion(Question.Mechanically);
			console.log("now going to mech");
		}
	};

	const handleChoice = async (winners: Choice) => {
		const getGameA: AxiosResponse = await axios.get(
			`/api/elo/${games?.gameA.id}`
		);
		const getGameB: AxiosResponse = await axios.get(
			`/api/elo/${games?.gameB.id}`
		);

		if (getGameA.data.length === 0) {
			const newGame: Elo = {
				gameID: Number(games?.gameA.id),
				ComplexElo: 1000,
				DepthElo: 1000,
			};
			await axios.post("/api/elo/", {
				body: newGame,
			});
		}
		if (getGameB.data.length === 0) {
			const newGame: Elo = {
				gameID: Number(games?.gameB.id),
				ComplexElo: 1000,
				DepthElo: 1000,
			};
			await axios.post("/api/elo/", {
				body: newGame,
			});
		}

		const data: PostWinner = {
			gameA: Number(games?.gameA.id),
			gameB: Number(games?.gameB.id),
			winnerMechanically: Number(winners.winnerMechanically),
			winnerDepth: Number(winners.winnerDepth),
			userID: userID,
		};

		await axios.post("/api/comparison/", {
			body: data,
			header: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		// retrive ELOS and save
		const getGameAElo: AxiosResponse = await axios.get(
			`/api/elo/${games?.gameA.id}`
		);
		const getGameBElo: AxiosResponse = await axios.get(
			`/api/elo/${games?.gameB.id}`
		);

		// function to fetch two more games

		//console.log([getGameAElo, getGameBElo]);

		const gameA: Elo = getGameAElo.data;
		const gameB: Elo = getGameBElo.data;

		const computeNewElo = (AElo: number, BElo: number) => {
			const expectedScoreA: number = elo.getExpected(AElo, BElo);

			const expectedScoreB: number = elo.getExpected(BElo, AElo);

			const newGameA = elo.updateRating(
				expectedScoreA,
				winners.winnerMechanically === gameA.gameID ? 1 : 0,
				AElo
			);
			const newGameB = elo.updateRating(
				expectedScoreB,
				winners.winnerMechanically === gameB.gameID ? 1 : 0,
				gameB.ComplexElo
			);

			return { gameA: newGameA, gameB: newGameB };
		};

		//console.log(gameA.ComplexElo);

		const complexNewElo = computeNewElo(
			Number(gameA.ComplexElo),
			Number(gameB.ComplexElo)
		);
		const depthNewElo = computeNewElo(
			Number(gameA.DepthElo),
			Number(gameB.DepthElo)
		);

		//console.log(complexNewElo, depthNewElo);

		const newGameA: Elo = {
			gameID: gameA.gameID,
			DepthElo: depthNewElo.gameA,
			ComplexElo: complexNewElo.gameA,
		};
		const newGameB: Elo = {
			gameID: gameB.gameID,
			DepthElo: depthNewElo.gameB,
			ComplexElo: complexNewElo.gameB,
		};

		await axios.post("/api/elo/update", {
			body: newGameA,
		});

		await axios.post("/api/elo/update", {
			body: newGameB,
		});

		generateNewGames(user);
	};

	const fetchGameData = async (gameA: number, gameB: number) => {
		const restA: Response = await fetch(`/api/game/${gameA}`);
		const dataA: GameRes = await restA.json();
		const restB: Response = await fetch(`/api/game/${gameB}`);
		const dataB: GameRes = await restB.json();

		const data: Games = { gameA: dataA.message, gameB: dataB.message };

		setGames(data);
	};

	const generateNewGames = async (userI: string) => {
		const rest: AxiosResponse = await axios.get(`/api/user/games/${userI}`, {
			validateStatus: (status: number) => status === 404 || status === 200,
		});

		const games: number[] = await rest.data.message;
		if (rest.data.message === "404: User not found") {
			alert("You haven't logged enough games on BGG");
		} else if (games.length <= 2) {
			alert("You haven't logged enough games on BGG");
		} else {
			let preShuffle = [];

			for (let i = 0; i < games.length - 1; i++) {
				for (let j = i + 1; j < games.length; j++) {
					preShuffle.push([Number(games[i]), Number(games[j])]);
				}
			}

			const results: any[] = shuffle(preShuffle);

			const comparisons: AxiosResponse = await axios.get(
				`/api/comparison/${userID}`
			);

			//console.log(comparisons);

			let combos: number[][] = [[]];

			if (!(comparisons.data === "")) {
				combos = comparisons.data.map((e: PostWinner) => [e.gameA, e.gameB]);
			}

			for (let i in results) {
				//console.log(combos, results[i], "hello");
				const a: string = JSON.stringify(combos);
				const b: string = JSON.stringify(results[i]);
				const c: string = JSON.stringify([results[i][1], results[i][0]]);

				if (a.indexOf(b) !== -1) {
					//
				} else if (a.indexOf(c) !== -1) {
					//
				} else {
					fetchGameData(results[i][0], results[i][1]);
					break;
				}
			}
		}
	};

	return (
		<main className="div">
			<Header />
			<Inputs
				user={user}
				onChangedUser={handleChangedUser}
				userValid={userValid}
				game={games}
				onChoice={handleChoice}
			/>
			<h2 className="question">
				{question === Question.Mechanically
					? "Which game is more mechanically complex?"
					: "Which game has more depth?"}
			</h2>
			{games !== null && (
				<Game
					key="left"
					onBtnClick={handleClick}
					game={games.gameA}
					align="gameL"
				/>
			)}
			{games !== null && (
				<Game
					key="right"
					onBtnClick={handleClick}
					game={games.gameB}
					align="gameR"
				/>
			)}
		</main>
	);
}

export default App;
