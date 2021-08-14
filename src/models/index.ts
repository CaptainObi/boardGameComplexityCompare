import { Sequelize, Model, DataTypes } from "sequelize";

// generates the connection string

const devConfig: string = `postgresql://${
	process.env.POSTGRES_USER || "node"
}:${process.env.POSTGRES_PASSWORD || "password"}@${
	process.env.POSTGRES_HOST || "localhost"
}:${process.env.POSTGRES_PORT || 5432}/${
	process.env.POSTGRES_DB || "template1"
}` as string;

const proConfig: string = process.env.DATABASE_URL as string; //heroku addons

console.log(devConfig);

const result: string =
	process.env.NODE_ENV === "production" ? proConfig : (devConfig as string);

// Create a connection to the database
if (process.env.NODE_ENV === "production") {
	var sequelize = new Sequelize(result, {
		dialect: "postgres",
		pool: { max: 9, min: 0, idle: 10000 },
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
		},
	});
} else {
	var sequelize = new Sequelize(result, {
		dialect: "postgres",
		pool: { max: 9, min: 0, idle: 10000 },
	});
}

try {
	sequelize.authenticate();
} catch (error) {
	console.log(error);
}

// creates the models for everything

class Game extends Model {
	public gameID!: number;
	public ComplexElo!: number;
	public DepthElo!: number;
	public thumbnail!: string | null;
	public image!: string | null;
	public name!: string | null;
	public yearpublished!: number;
	public rank!: number;
	public weight!: number;
	public rating!: number;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

class Comparison extends Model {
	public ID!: number;
	public gameA!: number;
	public gameB!: number;
	public WinnerMechanically!: number | null;
	public WinnerDepth!: number | null;
	public user!: number;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

// inits

Game.init(
	{
		gameID: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		ComplexElo: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		DepthElo: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		thumbnail: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		image: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		yearpublished: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		rank: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		weight: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		rating: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ sequelize, tableName: "games" }
);

Comparison.init(
	{
		ID: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		gameA: { type: DataTypes.INTEGER, allowNull: false },
		gameB: { type: DataTypes.INTEGER, allowNull: false },
		WinnerMechanically: { type: DataTypes.INTEGER, allowNull: true },
		WinnerDepth: { type: DataTypes.INTEGER, allowNull: true },
		user: { type: DataTypes.INTEGER, allowNull: false },
	},
	{ sequelize, tableName: "compare" }
);

// generates the relationships

Game.hasMany(Comparison, { sourceKey: "gameID", foreignKey: "gameA" });
Game.hasMany(Comparison, { sourceKey: "gameID", foreignKey: "gameB" });
Game.hasMany(Comparison, {
	sourceKey: "gameID",
	foreignKey: "WinnerMechanically",
});
Game.hasMany(Comparison, { sourceKey: "gameID", foreignKey: "WinnerDepth" });

// syncs
sequelize.sync();

export { Game, Comparison };
