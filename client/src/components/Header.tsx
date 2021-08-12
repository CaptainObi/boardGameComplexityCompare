import React from "react";
import logo from "../BoardGameCompareLogo-01.svg";
import "./Header.css";
import { Page } from "../App";

type HeaderProps = {
	page: Page;
	onButtonClick: () => void;
};

function Header({ page, onButtonClick }: HeaderProps) {
	return (
		<header className="topbar">
			<ul>
				<li>
					<img src={logo} alt="logo" className="logo" />
				</li>
				<li>
					<h1>BoardGameCompare</h1>
				</li>
				<li>
					<button onClick={onButtonClick} className="btn">
						{page === Page.Data ? "Main Page" : "Data Page"}
					</button>
				</li>
			</ul>
		</header>
	);
}

export default Header;
