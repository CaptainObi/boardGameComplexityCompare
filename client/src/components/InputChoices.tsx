import { Games, Choice } from "../App";
import { useState } from "react";
import "./InputChoices.css";
type InputChoicesProps = {
	game: Games | null;
	onChoice: (user: Choice) => Promise<void>;
};

function InputChoices({ game, onChoice }: InputChoicesProps) {
	const [depth, setDepth] = useState("");
	const [mechanically, setMechanically] = useState("");

	const onSubmit = (e: any) => {
		e.preventDefault();

		if (!depth) {
			alert("Please input which game is deeper");
		} else if (!mechanically) {
			alert("Please input which game is more mechenically complex");
		} else {
			let newDepth: number = 0;
			let newMechanically: number = 0;

			if (game?.gameA.name === depth) {
				newDepth = Number(game?.gameA.id);
			} else {
				newDepth = Number(game?.gameB.id);
			}

			if (game?.gameA.name === mechanically) {
				newMechanically = Number(game?.gameA.id);
			} else {
				newMechanically = Number(game?.gameB.id);
			}

			const data: Choice = {
				winnerDepth: newDepth,
				winnerMechanically: newMechanically,
			};
			onChoice(data);

			setDepth("");
			setMechanically("");
		}
	};

	const onDepthChange = (event: any) => {
		setDepth(event.target.value);
	};

	const onMechChange = (event: any) => {
		setMechanically(event.target.value);
	};

	return (
		<form className="wpforms-container" onSubmit={onSubmit}>
			<ul className="wpforms-container">
				<p className="wpforms-container-D">Which game has more depth?</p>
				<li className="wpforms-container-ad">
					<label
						className={`wpforms-container${
							depth === game?.gameA.name ? "-c" : "-l"
						}`}
					>
						<input
							className="wpforms-container"
							type="radio"
							value={game?.gameA.name}
							checked={depth === game?.gameA.name}
							onChange={onDepthChange}
						/>
						{game?.gameA.name}
					</label>
				</li>
				<li className="wpforms-container-bd">
					<label
						className={`wpforms-container${
							depth === game?.gameB.name ? "-c" : "-l"
						}`}
					>
						<input
							className="wpforms-container"
							type="radio"
							value={game?.gameB.name}
							checked={depth === game?.gameB.name}
							onChange={onDepthChange}
						/>
						{game?.gameB.name}
					</label>
				</li>
				<p className="wpforms-container-M">
					Which game is harder to learn mechanically?
				</p>
				<li className="wpforms-container-am">
					<label
						className={`wpforms-container${
							mechanically === game?.gameA.name ? "-c" : "-l"
						}`}
					>
						<input
							className="wpforms-container"
							type="radio"
							value={game?.gameA.name}
							checked={mechanically === game?.gameA.name}
							onChange={onMechChange}
						/>
						{game?.gameA.name}
					</label>
				</li>
				<li className="wpforms-container-bm">
					<label
						className={`wpforms-container${
							mechanically === game?.gameB.name ? "-c" : "-l"
						}`}
					>
						<input
							className="wpforms-container"
							type="radio"
							value={game?.gameB.name}
							checked={mechanically === game?.gameB.name}
							onChange={onMechChange}
						/>
						{game?.gameB.name}
					</label>
				</li>
				<input type="submit" value="Go" className="submit" />
			</ul>
		</form>
	);
}

export default InputChoices;
