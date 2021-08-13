import React from "react";
import "./App.css";
import Header from "./components/Header";
import Inputs from "./components/Inputs";
import { useState } from "react";
import Game from "./components/Game";
import axios, { AxiosResponse } from "axios";
import EloRank from "elo-rank";
import DataPage from "./DataPage";

const elo = new EloRank(24);

export interface GameElement {
	id: string;
	thumbnail: string;
	image: string;
	name: string;
	yearpublished: number;
	rank: number;
	weight: number;
	rating: number;
}

enum Question {
	Mechanically = "mechanically",
	Depth = "depth",
}

enum WhichGames {
	Next = "next",
	Current = "current",
}

export enum Page {
	Main = "main",
	Data = "data",
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
	thumbnail: string | null;
	image: string | null;
	name: string | null;
	yearpublished: number;
	rank: number;
	weight: number;
	rating: number;
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
	const [nextGames, setNextGames] = useState<Games | null>(null);
	const [page, setPage] = useState<Page>(Page.Main);

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

			generateNewGames(userI, WhichGames.Current, null);
			generateNewGames(userI, WhichGames.Next, null);
		} else {
			setUserValid(false);
		}
	};

	const handleGameClick = async (winner: number) => {
		if (question === Question.Mechanically) {
			setMechanically(winner);
			setQuestion(Question.Depth);
		} else {
			handleChoice(
				{ winnerDepth: winner, winnerMechanically: mechanically },
				false
			);
			setQuestion(Question.Mechanically);
		}
	};

	const handleChoice = async (winners: Choice, skip: boolean) => {
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
				thumbnail: String(games?.gameA.thumbnail),
				image: String(games?.gameA.image),
				name: String(games?.gameA.name),
				yearpublished: Number(games?.gameA.yearpublished),
				rank: Number(games?.gameA.yearpublished),
				weight: Number(games?.gameA.weight),
				rating: Number(games?.gameA.rating),
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
				thumbnail: String(games?.gameB.thumbnail),
				image: String(games?.gameB.image),
				name: String(games?.gameB.name),
				yearpublished: Number(games?.gameB.yearpublished),
				rank: Number(games?.gameB.yearpublished),
				weight: Number(games?.gameB.weight),
				rating: Number(games?.gameB.rating),
			};
			await axios.post("/api/elo/", {
				body: newGame,
			});
		}

		let data;

		if (skip === false) {
			data = {
				gameA: Number(games?.gameA.id),
				gameB: Number(games?.gameB.id),
				winnerMechanically: Number(winners.winnerMechanically),
				winnerDepth: Number(winners.winnerDepth),
				userID: userID,
			};
		} else {
			data = {
				gameA: Number(games?.gameA.id),
				gameB: Number(games?.gameB.id),
				userID: userID,
			};
		}

		await axios.post("/api/comparison/", {
			body: data,
			header: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		if (skip === false) {
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

			const newGameA = {
				gameID: gameA.gameID,
				DepthElo: depthNewElo.gameA,
				ComplexElo: complexNewElo.gameA,
			};
			const newGameB = {
				gameID: gameB.gameID,
				DepthElo: depthNewElo.gameB,
				ComplexElo: complexNewElo.gameB,
			};

			await axios.patch("/api/elo/update", {
				body: newGameA,
			});

			await axios.patch("/api/elo/update", {
				body: newGameB,
			});
		} else {
			setQuestion(Question.Mechanically);
		}

		generateNewGames(user, WhichGames.Current, games);
	};

	const fetchGameData = async (
		gameA: number,
		gameB: number,
		update: WhichGames
	) => {
		const restA: Response = await fetch(`/api/game/${gameA}`);
		const dataA: GameRes = await restA.json();
		const restB: Response = await fetch(`/api/game/${gameB}`);
		const dataB: GameRes = await restB.json();

		const data: Games = { gameA: dataA.message, gameB: dataB.message };
		if (update === WhichGames.Current) {
			setGames(data);
		} else {
			setNextGames(data);
		}
	};

	const generateNewGames = async (
		userI: string,
		update: WhichGames,
		currentGames: Games | null
	) => {
		if (update === WhichGames.Current && !(nextGames === null)) {
			setGames(nextGames);
			// set the game to the current game
			console.log("updating");
			generateNewGames(userI, WhichGames.Next, nextGames);
		} else {
			const rest: AxiosResponse = await axios.get(`/api/user/games/${userI}`, {
				validateStatus: (status: number) => status === 404 || status === 200,
			});

			const gamesRes: number[] = await rest.data.message;
			if (rest.data.message === "404: User not found") {
				alert("You haven't logged enough games on BGG");
			} else if (gamesRes.length <= 2) {
				alert("You haven't logged enough games on BGG");
			} else {
				console.log(gamesRes);

				const data = { ids: gamesRes };

				const playedGames = await axios.post("/api/elo/ids", {
					body: data,
					header: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				});

				const results: Elo[] = await playedGames.data;

				results.sort((a, b) => a.ComplexElo - b.ComplexElo);

				const comparisons: AxiosResponse = await axios.get(
					`/api/comparison/${userID}`
				);

				//console.log(comparisons);

				let combos: number[][] = [[]];

				if (!(comparisons.data === "")) {
					combos = comparisons.data.map((e: PostWinner) => [e.gameA, e.gameB]);
				}

				for (let i = 0; i < 1000000000000; i++) {
					if (i < results.length * 10) {
						const seed: number = Math.floor(Math.random() * results.length - 1);
						let secondarySeed: number = Math.floor(Math.random() * 20) - 10;
						secondarySeed =
							seed + secondarySeed > results.length - 1
								? seed + secondarySeed - results.length - 1
								: secondarySeed;

						if (secondarySeed === 0) {
							secondarySeed = 1;
						}

						//console.log(combos, results[i], "hello");
						const a: string = JSON.stringify(combos);
						const b: string = JSON.stringify([
							String(results[seed].gameID),
							String(results[seed + secondarySeed].gameID),
						]);
						const c: string = JSON.stringify([
							String(results[seed + secondarySeed].gameID),
							String(results[seed].gameID),
						]);

						if (a.indexOf(b) !== -1) {
							//console.log("already done boyo");
						} else if (a.indexOf(c) !== -1) {
							//console.log("already done boyo");
						} else if (
							[
								String(results[seed].gameID),
								String(results[seed + secondarySeed].gameID),
							] === [games?.gameA.id, games?.gameB.id] ||
							[
								String(results[seed + secondarySeed].gameID),
								String(results[seed].gameID),
							] === [games?.gameA.id, games?.gameB.id]
						) {
							//
						} else if (
							[
								String(results[seed].gameID),
								String(results[seed + secondarySeed].gameID),
							] === [nextGames?.gameA.id, nextGames?.gameB.id] ||
							[
								String(results[seed + secondarySeed].gameID),
								String(results[seed].gameID),
							] === [nextGames?.gameA.id, nextGames?.gameB.id]
						) {
							//
						} else {
							fetchGameData(
								results[seed].gameID,
								results[seed + secondarySeed].gameID,
								update
							);

							break;
						}
					} else {
						let preShuffle = [];

						for (let i = 0; i < gamesRes.length - 1; i++) {
							for (let j = i + 1; j < gamesRes.length; j++) {
								preShuffle.push([Number(gamesRes[i]), Number(gamesRes[j])]);
							}
						}

						const results: any[] = shuffle(preShuffle);

						const comparisons: AxiosResponse = await axios.get(
							`/api/comparison/${userID}`
						);

						//console.log(comparisons);

						if (!(comparisons.data === "")) {
							combos = comparisons.data.map((e: PostWinner) => [
								e.gameA,
								e.gameB,
							]);
						}

						for (let i in results) {
							//console.log(combos, results[i], "hello");
							const a: string = JSON.stringify(combos);
							const b: string = JSON.stringify(results[i]);
							const c: string = JSON.stringify([results[i][1], results[i][0]]);

							if (a.indexOf(b) !== -1) {
								//console.log("already done boyo");
							} else if (a.indexOf(c) !== -1) {
								//console.log("already done boyo");
							} else if (
								[results[i][0], results[i][1]] ===
									[games?.gameA.id, games?.gameB.id] ||
								[results[i][1], results[i][0]] ===
									[games?.gameA.id, games?.gameB.id]
							) {
								//
							} else if (
								[results[i][0], results[i][1]] ===
									[nextGames?.gameA.id, nextGames?.gameB.id] ||
								[results[i][1], results[i][0]] ===
									[nextGames?.gameA.id, nextGames?.gameB.id]
							) {
								//
							} else {
								fetchGameData(results[i][0], results[i][1], update);

								break;
							}
						}
					}
				}
			}
		}
	};

	const handlePageChange = () => {
		if (page === Page.Main) {
			setPage(Page.Data);
		} else {
			setPage(Page.Main);
		}
	};

	return (
		<div>
			{page === Page.Main ? (
				<main className="div">
					<Header page={page} onButtonClick={handlePageChange} />
					<Inputs
						user={user}
						onChangedUser={handleChangedUser}
						userValid={userValid}
					/>
					{userValid && (
						<button
							onClick={() =>
								handleChoice({ winnerDepth: 0, winnerMechanically: 0 }, true)
							}
							className="skip"
						>
							Skip
						</button>
					)}
					{userValid && (
						<h2 className="question">
							{question === Question.Mechanically
								? "Which game is more mechanically complex?"
								: "Which game has more depth?"}
						</h2>
					)}
					{games !== null && (
						<Game
							key="left"
							onBtnClick={handleGameClick}
							game={games.gameA}
							align="gameL"
						/>
					)}
					{games !== null && (
						<Game
							key="right"
							onBtnClick={handleGameClick}
							game={games.gameB}
							align="gameR"
						/>
					)}
				</main>
			) : (
				<DataPage page={page} onButtonClick={handlePageChange} />
			)}
		</div>
	);
}

export default App;
