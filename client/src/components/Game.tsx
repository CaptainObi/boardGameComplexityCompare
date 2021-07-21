import { GameElement } from "../App";
import "./Game.css";
import "../App.css";

type GameProps = {
	game: GameElement;
	align: string;
};

function Game({ game, align }: GameProps) {
	return (
		<div className={align}>
			<h1>{game.name}</h1>
			<p>({game.yearpublished})</p>
			<div className="image">
				<img src={game.image} alt="thumbnail" className="thumbnail" />
			</div>
		</div>
	);
}

export default Game;
