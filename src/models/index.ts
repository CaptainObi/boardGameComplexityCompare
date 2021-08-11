import { Sequelize, Model, DataTypes } from "sequelize";

const devConfig: string =
	`postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}` as string;

const proConfig: string = process.env.DATABASE_URL as string; //heroku addons

const result: string =
	process.env.NODE_ENV === "production" ? proConfig : (devConfig as string);
// Create a connection to the database
const sequelize = new Sequelize(result, {
	dialect: "postgres",
	pool: { max: 9, min: 0, idle: 10000 },
});

try {
	sequelize.authenticate();
} catch (error) {
	console.log(error);
}

class Game extends Model {
	public gameID!: number;
	public ComplexElo!: number;
	public DepthElo!: number;

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

Game.init(
	{
		gameID: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		ComplexElo: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		DepthElo: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
	},
	{ sequelize, tableName: "games" }
);

Comparison.init(
	{
		ID: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		gameA: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
		gameB: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
		WinnerMechanically: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
		WinnerDepth: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
		user: { type: DataTypes.INTEGER, allowNull: false },
	},
	{ sequelize, tableName: "compare" }
);

Game.hasMany(Comparison, { sourceKey: "gameID", foreignKey: "gameA" });
Game.hasMany(Comparison, { sourceKey: "gameID", foreignKey: "gameB" });
Game.hasMany(Comparison, {
	sourceKey: "gameID",
	foreignKey: "WinnerMechanically",
});
Game.hasMany(Comparison, { sourceKey: "gameID", foreignKey: "WinnerDepth" });

/*ID SERIAL,
            gameA integer NOT NULL,
            gameB integer NOT NULL,
            WinnerMechanically integer DEFAULT null,
            WinnerDepth integer DEFAULT null,
            "user" integer NOT NULL});
			
			
			
			
			gameID SERIAL,
  ComplexElo INT NOT NULL,
  DepthElo INT NOT NULL,
  PRIMARY KEY (gameID)*/

export { Game, Comparison };
