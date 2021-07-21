import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Route, BrowserRouter } from "react-router-dom";
import App from "./App";
import DataPage from "./DataPage";

const routes = (
	<BrowserRouter>
		<div>
			<Route exact path="/" component={App} />
			<Route path="/dataP" component={DataPage} />
		</div>
	</BrowserRouter>
);
ReactDOM.render(routes, document.getElementById("root"));
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
