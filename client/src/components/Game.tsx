import { GameElement } from "../App";
import "./Game.css";
import "../App.css";
import useImageColor from "use-image-color";
//import { usePalette } from "react-palette";

type GameProps = {
	game: GameElement;
	align: string;
	onBtnClick: (winner: number) => void;
};

function Game({ game, align, onBtnClick }: GameProps) {
	//const { data } = usePalette(game.image);

	const { colors } = useImageColor(game.image, { cors: false });

	console.log(colors);

	return (
		<div
			className={align}
			style={{ backgroundColor: "gray" }}
			onClick={() => onBtnClick(Number(game.id))}
		>
			<h1>{game.name}</h1>
			<p>({game.yearpublished})</p>
			<div className="image">
				<img src={game.image} alt="thumbnail" className="thumbnail" />
			</div>
		</div>
	);
}

export default Game;
