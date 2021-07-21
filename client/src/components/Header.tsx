import React from "react";
import logo from "../BoardGameCompareLogo-01.svg";
import "./Header.css";

function Header() {
	return (
		<header className="topbar">
			<ul>
				<li>
					<img src={logo} alt="logo" className="logo" />
				</li>
				<li>
					<h1>BoardGameCompare</h1>
				</li>
			</ul>
		</header>
	);
}

export default Header;
