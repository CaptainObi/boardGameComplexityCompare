import connection from "./db";

interface Comparison {
	GameA: number;
	GameB: number;
	Winner: number;
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

export default { create, getAll };
