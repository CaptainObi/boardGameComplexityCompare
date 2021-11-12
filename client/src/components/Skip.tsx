import { Choice } from "../App";

type SkipProps = {
	onSkip: (winners: Choice, skip: boolean) => void;
};

function Skip({ onSkip }: SkipProps) {
	return (
		<button
			onClick={() => onSkip({ winnerDepth: 0, winnerMechanically: 0 }, true)}
			className="skip"
		>
			Skip
		</button>
	);
}

export default Skip;
