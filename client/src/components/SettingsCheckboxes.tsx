import { FetchGameOptions, Options } from "../App";
import "./css/InputUser.css";

type InputSettingsCheckboxesProps = {
	onChangedSettings: (setting: Options, target: boolean) => Promise<void>;
	settings: FetchGameOptions;
};

/**
 * Generates a input box for a user to input their username
 * @param props {InputSettingsCheckboxesProps}
 * @returns
 */

function SettingsCheckboxes({
	onChangedSettings,
	settings,
}: InputSettingsCheckboxesProps) {
	return (
		<form className="">
			<div>
				{Object.keys(settings).map((key) => (
					<label>
						<input
							type="checkbox"
							onChange={(e) =>
								onChangedSettings(
									key as Options,
									!settings[key as keyof FetchGameOptions]
								)
							}
							checked={settings[key as keyof FetchGameOptions]}
						/>
						{key}
					</label>
				))}
			</div>
		</form>
	);
}

export default SettingsCheckboxes;
