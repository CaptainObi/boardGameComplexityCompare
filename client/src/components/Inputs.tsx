import "../App.css";
import InputUser from "./InputUser";
import "./css/InputUser.css";
import SettingsCheckboxes from "./SettingsCheckboxes";
import { FetchGameOptions, Options } from "../App";
//import InputChoices from "./InputChoices";

type InputsProps = {
	onChangedUser: (user: string) => Promise<void>;
	userValid: boolean;
	user: string;
	onChangedSettings: (setting: Options, target: boolean) => Promise<void>;
	settings: FetchGameOptions;
};

/**
 * Generates a input panel for users to input their username or change it
 * @param props {InputsProps}
 * @returns
 */

function Inputs({
	onChangedUser,
	userValid,
	user,
	settings,
	onChangedSettings,
}: InputsProps) {
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
				<>
					<InputUser onChangedUser={onChangedUser} />
					<SettingsCheckboxes
						onChangedSettings={onChangedSettings}
						settings={settings}
					/>
				</>
			)}
		</div>
	);
}

export default Inputs;
