import { GameElement } from "../App";
import { Image } from "use-image-color";
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
	const { colors } = useImageColor(game.image, {
		cors: false,
		format: "hex",
		windowSize: 25,
	});

	console.log(colors);

	let primary: string;
	let secondary: string;

	try {
		primary = colors[0];
		secondary = colors[1];
	} catch (TypeError) {
		primary = "black";
		secondary = "gray";
	}

	return (
		<div
			className={align}
			style={{ backgroundColor: secondary }}
			onClick={() => onBtnClick(Number(game.id))}
		>
			<h1 style={{ color: primary }}>{game.name}</h1>
			<p style={{ color: primary }}>({game.yearpublished})</p>
			<div className="image">
				<Image src={game.image} thumbnail={game.thumbnail} />
			</div>
		</div>
	);
}

export default Game;
