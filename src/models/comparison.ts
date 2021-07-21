import connection from "./db";

interface Comparison {
	GameA: number;
	GameB: number;
	WinnerMechanically: number | null;
	WinnerDepth: number | null;
	user: number;
}

// constructor

const create = (comparison: Comparison, result: Function) => {
	connection.query("INSERT INTO compare SET ?", comparison, (err, res) => {
		if (err) {
			console.log("error: ", err);
			result(err, null);
			return;
		}

		console.log("created customer: ", { id: res.insertId, ...comparison });
		result(null, { id: res.insertId, ...comparison });
	});
};

const getAll = (result: Function) => {
	connection.query("SELECT * FROM compare", (err: Error, res: Response) => {
		if (err) {
			console.log("error: ", err);
			result(null, err);
			return;
		}

		console.log("customers: ", res);
		result(null, res);
	});
};

const getID = (id: number, result: Function) => {
	connection.query("SELECT * FROM compare WHERE user=?", id, (err, res) => {
		if (err) {
			console.log("error: ", err);
			result(null, err);
			return;
		}

		result(null, res);
	});
};

export default { create, getAll, getID };
