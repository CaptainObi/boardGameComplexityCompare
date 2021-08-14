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

// just a quick note, you might be wondering why I have two simmilar interfaces with Elo and GameElement.
// GameElement is designed to be used with data fetched directly from BGG without being retrived from the database.
// Elo is designed for games that have been fetched from the database.
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

/**
 * generates random number between -1 and 1 using a modified Gaussian Distribution
 * @returns {number} between -1 and 1 inclusive.
 */
function gaussianRand(): number {
	let u = 0,
		v = 0;
	while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
	while (v === 0) v = Math.random();
	let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	num = num / 10.0 + 0.5; // Translate to 0 -> 1
	if ((num - 0.5) * 2 > 1 || (num - 0.5) * 2 < -1 || (num - 0.5) * 2 === 0)
		return gaussianRand(); // resample between 0 and 1
	return (num - 0.5) * 2;
}

/**
 * Main function for the app.
 * @returns
 */
function App() {
	// creates useState hooks for all the varibles that are needed
	const [user, setUser] = useState("");
	const [userID, setUserID] = useState(0);
	const [userValid, setUserValid] = useState(false);
	const [games, setGames] = useState<Games | null>(null);
	const [question, setQuestion] = useState<Question>(Question.Mechanically);
	const [mechanically, setMechanically] = useState(0);
	const [nextGames, setNextGames] = useState<Games | null>(null);
	const [page, setPage] = useState<Page>(Page.Main);

	/**
	 * handles the things that need to be done when a username is inputed into the system
	 * @param userI {string} name of the user
	 */
	const handleChangedUser = async (userI: string) => {
		// fetches the userID of the user and checks if it exists
		const rest: AxiosResponse = await axios.get(`/api/user/${userI}`, {
			validateStatus: (status: number) => status === 404 || status === 200,
		});

		const data: GetUserID = await rest.data;

		// if it exists, it will set the user as valid, set the username and userID and then generate the games for the user to pick
		// if it doesn't exist it will promt the user to try again.

		if (Number(rest.status) === 200 || Number(rest.status) === 304) {
			// sets the user
			setUserValid(true);
			setUser(userI);
			setUserID(Number(data.message));

			// generates the new games
			await generateNewGames(userI, WhichGames.Current, null);
			generateNewGames(userI, WhichGames.Next, null);
		} else {
			setUserValid(false);
		}
	};

	/**
	 * handles what to do when a game is clicked
	 * @param winner {number} the number of the game that won
	 */
	const handleGameClick = async (winner: number) => {
		// checks to see what part of the matchup the game has won.
		// If its mech then it just proceeds to the next question
		// else it logs the full comparison and resets the process

		if (question === Question.Mechanically) {
			// logs the winner
			setMechanically(winner);
			// changes the question
			setQuestion(Question.Depth);
		} else {
			// sends the full comparison result to be logs and elos to be changed
			handleChoice(
				{ winnerDepth: winner, winnerMechanically: mechanically },
				false
			);
			// resets the question
			setQuestion(Question.Mechanically);
		}
	};

	/**
	 * Sends the winner of the game to the backend and updates the elos of each game.
	 * @param winners {Choice} an object of the winners of each question
	 * @param skip {boolean} whether or not the function was triggered by clicking the 'skip' button
	 */
	const handleChoice = async (winners: Choice, skip: boolean) => {
		const getGameA: AxiosResponse = await axios.get(
			`/api/elo/${games?.gameA.id}`
		);
		const getGameB: AxiosResponse = await axios.get(
			`/api/elo/${games?.gameB.id}`
		);

		// fetches the data regarding each game, if the game doesn't exist it creates it.

		if (getGameA.data.length === 0) {
			await createElo(games?.gameA);
		}
		if (getGameB.data.length === 0) {
			await createElo(games?.gameB);
		}

		// this creates the comparison in the database
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

		// if the user hasn't skipped the question it updates the elos

		if (skip === false) {
			// retrive ELOS and save
			const getGameAElo: AxiosResponse = await axios.get(
				`/api/elo/${games?.gameA.id}`
			);
			const getGameBElo: AxiosResponse = await axios.get(
				`/api/elo/${games?.gameB.id}`
			);

			// fetches the two games frmo the database

			const gameA: Elo = getGameAElo.data;
			const gameB: Elo = getGameBElo.data;

			/**
			 * calculates the new elos for the games
			 * @param AElo {number} elo for A
			 * @param BElo {number} elo for b
			 * @returns {object} containing the objects with the new elos
			 */
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

			// does this both for complexity and for depth

			const complexNewElo = computeNewElo(
				Number(gameA.ComplexElo),
				Number(gameB.ComplexElo)
			);
			const depthNewElo = computeNewElo(
				Number(gameA.DepthElo),
				Number(gameB.DepthElo)
			);

			// creates new objects and updates them with the database.

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
			// if it skips it doesn't update anything and just moves on
			setQuestion(Question.Mechanically);
		}

		// creates new games
		generateNewGames(user, WhichGames.Current, games);
	};

	/**
	 * creates new elos
	 * @param gameElementName {GameElement} for the games you want to create
	 */
	const createElo = async (gameElementName: GameElement | undefined) => {
		const newGame: Elo = {
			gameID: Number(gameElementName?.id),
			ComplexElo: 1000,
			DepthElo: 1000,
			thumbnail: String(gameElementName?.thumbnail),
			image: String(gameElementName?.image),
			name: String(gameElementName?.name),
			yearpublished: Number(gameElementName?.yearpublished),
			rank: Number(gameElementName?.yearpublished),
			weight: Number(gameElementName?.weight),
			rating: Number(gameElementName?.rating),
		};
		await axios.post("/api/elo/", {
			body: newGame,
		});
	};

	/**
	 * fetches the data about the games and saves them into the useState
	 * @param gameA {number} first game
	 * @param gameB {number} second game
	 * @param update {WhichGames} enum that determins if it updates the current games or the next game
	 */
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

	/**
	 * checks the validity of a given pair of games
	 * @param combos the combinations of the comparisons a user has done
	 * @param resultA first id
	 * @param resultB second id
	 * @returns {boolean} whether the comination is okay to use or not
	 */
	const checkValidity = async (
		combos: number[][],
		resultA: string,
		resultB: string
	) => {
		const a: string = JSON.stringify(combos);
		const b: string = JSON.stringify([resultA, resultB]);
		const c: string = JSON.stringify([resultB, resultA]);

		if (a.indexOf(b) !== -1) {
			return false;
		} else if (a.indexOf(c) !== -1) {
			return false;
		} else if (
			[resultA, resultB] === [games?.gameA.id, games?.gameB.id] ||
			[resultB, resultA] === [games?.gameA.id, games?.gameB.id]
		) {
			return false;
		} else if (
			[resultA, resultB] === [nextGames?.gameA.id, nextGames?.gameB.id] ||
			[resultB, resultA] === [nextGames?.gameA.id, nextGames?.gameB.id]
		) {
			return false;
		} else {
			return true;

			//break;
		}
	};

	/**
	 * Generates the new games for the software
	 * @param userI {string} name of the user
	 * @param update {WhichGames} enum that contains which game to update
	 * @param currentGames {Games} that contains the current games because react use state isn't always the fastest
	 */
	const generateNewGames = async (
		userI: string,
		update: WhichGames,
		currentGames: Games | null
	) => {
		// if its been asked to generate the current game and the next game has been generated
		if (update === WhichGames.Current && !(nextGames === null)) {
			setGames(nextGames);
			// set the game to the current game

			// generates the next game
			generateNewGames(userI, WhichGames.Next, nextGames);
		} else {
			// checks how many games the user has logged on bgg and retrives it

			const rest: AxiosResponse = await axios.get(`/api/user/games/${userI}`, {
				validateStatus: (status: number) => status === 404 || status === 200,
			});

			const gamesRes: number[] = await rest.data.message;

			// checks that everything is valid

			if (rest.data.message === "404: User not found") {
				alert("You haven't logged enough games on BGG");
			} else if (gamesRes.length <= 2) {
				alert("You haven't logged enough games on BGG");
			} else {
				// fetches the game data for all the games the user has played
				const data = { ids: gamesRes };

				const playedGames = await axios.post("/api/elo/ids", {
					body: data,
					header: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				});

				const results: Elo[] = await playedGames.data;

				// sorts the data based on its elo

				results.sort((a, b) => a.ComplexElo - b.ComplexElo);

				// fetches the list of comparisons the user has already done
				const comparisons: AxiosResponse = await axios.get(
					`/api/comparison/${userID}`
				);

				let combos: number[][] = [[]];

				if (!(comparisons.data === "")) {
					comparisons.data.forEach((e: PostWinner) =>
						combos.push([e.gameA, e.gameB])
					);
				}

				// timeout so it just doesn't get stuck to infinity

				for (let i = 0; i < 10000; i++) {
					// generates a random seed for the first number
					const seed: number = Math.floor(Math.random() * results.length - 1);

					// generates a second seed based on a normal distrubtion with the first number as the mean.
					let secondarySeed: number = Math.floor(
						seed + results.length * gaussianRand()
					);

					// makes sure the number isn't over or under the array's indexes.
					// Also makes sure you are never comparing a game to itself

					if (secondarySeed === seed) {
						secondarySeed++;
					} else if (secondarySeed >= results.length) {
						secondarySeed = results.length - 1;
					} else if (secondarySeed < 0) {
						secondarySeed = 0;
					}

					// fetches the games with those seeds

					const resultGameA: Elo = await results[seed];
					const resultGameB: Elo = await results[secondarySeed];

					// validates the games, and if they are valid it fetches the proper data and sends them off to the user, if not it continues
					if (
						typeof resultGameA !== undefined &&
						typeof resultGameB !== undefined &&
						(await checkValidity(
							combos,
							String(resultGameA.gameID),
							String(resultGameB.gameID)
						)) === true
					) {
						fetchGameData(resultGameA.gameID, resultGameB.gameID, update);
						break;
					}
				}
			}
		}
	};

	/**
	 * handles if the user clicks the buttons to change a page
	 */
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
					<Header page={page} onPageChange={handlePageChange} />
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
								? "Which game's rules are harder to learn?"
								: "Which game is harder to master?"}
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
				<DataPage page={page} onPageChange={handlePageChange} />
			)}
		</div>
	);
}

export default App;
