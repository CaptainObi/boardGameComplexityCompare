import connection from "./db";

interface Elo {
	gameID: number;
	ComplexElo: number;
	DepthElo: number;
}

// constructor

const create = (game: Elo, result: Function) => {
	console.log(game);
	connection.query(
		"INSERT INTO games VALUES ($1) RETURNING *",
		[game],
		(err, res) => {
			if (err) {
				console.log("error: ", err);
				result(err, null);
				return;
			}

			result(null, res);
		}
	);
};

const update = (game: Elo, result: Function) => {
	connection.query(
		"UPDATE games SET $1 WHERE gameID=$2",
		[game, game.gameID],
		(err, res) => {
			if (err) {
				console.log("error: ", err);
				result(err, null);
				return;
			}

			result(null, res);
		}
	);
};

const getAll = (result: Function) => {
	connection.query("SELECT * FROM games", [], (err, res) => {
		if (err) {
			console.log("error: ", err);
			result(null, err);
			return;
		}

		result(null, res);
	});
};

const getID = (id: number, result: Function) => {
	connection.query("SELECT * FROM games WHERE gameID=$1", [id], (err, res) => {
		if (err) {
			console.log("error: ", err);
			result(null, err);
			return;
		}

		result(null, res);
	});
};

export default { create, getAll, getID, update };
