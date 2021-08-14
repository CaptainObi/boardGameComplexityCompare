import "../App.css";
import InputUser from "./InputUser";
import "./InputUser.css";
//import InputChoices from "./InputChoices";

type InputsProps = {
	onChangedUser: (user: string) => Promise<void>;
	userValid: boolean;
	user: string;
};

/**
 * Generates a input panel for users to input their username or change it
 * @param props {InputsProps}
 * @returns
 */

function Inputs({ onChangedUser, userValid, user }: InputsProps) {
	return (
		<div className={userValid ? "buttons" : "button"}>
			{userValid ? (
				<div>
					<button
						className="form-control-b"
						onClick={() => onChangedUser("")}
					>{`Change User (${user})`}</button>
				</div>
			) : (
				<InputUser onChangedUser={onChangedUser} />
			)}
		</div>
	);
}

export default Inputs;
