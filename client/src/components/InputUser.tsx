import { useState } from "react";
import "./css/InputUser.css";

type InputUserProps = {
	onChangedUser: (user: string) => Promise<void>;
};

/**
 * Generates a input box for a user to input their username
 * @param props {InputUserProps}
 * @returns
 */

function InputUser({ onChangedUser }: InputUserProps) {
	const [text, setText] = useState("");

	const onSubmit = (e: any) => {
		e.preventDefault();

		if (!text) {
			alert("Please input a username");
		}

		onChangedUser(text);

		setText("");
	};

	return (
		<form className="" onSubmit={onSubmit}>
			<div>
				<input
					type="text"
					placeholder="BGG Username"
					className="form-control-i"
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
			</div>
			<input type="submit" value="Go" className="submit" />
		</form>
	);
}

export default InputUser;
