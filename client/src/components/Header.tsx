import React from "react";
import logo from "../BoardGameCompareLogo-01.svg";
import "./Header.css";
import { Page } from "../App";

type HeaderProps = {
	page: Page;
	onPageChange: () => void;
};

/**
 * Generates a header
 * @param props {HeaderProps} this is a object that contains the name of the page that it is on and what to do when the button is clicked
 * @returns
 */

function Header({ page, onPageChange }: HeaderProps) {
	// this is the header for both pages of the app
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
					<button onClick={onPageChange} className="btn">
						{page === Page.Data ? "Main Page" : "Data Page"}
					</button>
				</li>
			</ul>
		</header>
	);
}

export default Header;
