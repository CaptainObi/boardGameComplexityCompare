import { Games, Choice } from "../App";
import "../App.css";
import InputUser from "./InputUser";
import "./InputUser.css";
import InputChoices from "./InputChoices";

type InputsProps = {
	onChangedUser: (user: string) => Promise<void>;
	onChoice: (user: Choice) => Promise<void>;
	userValid: boolean;
	user: string;
	game: Games | null;
};

function Inputs({
	onChangedUser,
	userValid,
	user,
	game,
	onChoice,
}: InputsProps) {
	return (
		<div className="buttons">
			{userValid ? (
				<div>
					<button
						className="form-control-b"
						onClick={() => onChangedUser("")}
					>{`Change User (${user})`}</button>
					{!(game === null) && <InputChoices onChoice={onChoice} game={game} />}
				</div>
			) : (
				<InputUser onChangedUser={onChangedUser} />
			)}
		</div>
	);
}

export default Inputs;
