import React from "react";
import { GameElement } from "../App";
import { Image } from "use-image-color";
import "./Game.css";
import "../App.css";
import useImageColor from "use-image-color";

type GameProps = {
	game: GameElement;
	align: string;
	onBtnClick: (winner: number) => void;
};

/**
 * Generates a view for the game, it features clickable buttons and automatic colouring
 * @param props {GameProps}
 * @returns
 */

function Game({ game, align, onBtnClick }: GameProps) {
	// gets the dominant colours from the image
	const { colors } = useImageColor(game.image, {
		cors: false,
		format: "hex",
		windowSize: 25,
	});

	let primary: string;
	let secondary: string;

	// if they have been retrived yet it sets them as that, otherwise it just sets the colours as black and gray
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
