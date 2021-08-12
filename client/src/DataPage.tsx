import axios, { AxiosResponse } from "axios";
import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import { Page } from "./App";
import "./DataPage.css";

interface Elo {
	gameID: number;
	ComplexElo: number;
	DepthElo: number;
}

export interface GameElement {
	id: string;
	thumbnail: string;
	image: string;
	name: string;
	description: string[];
	yearpublished: number;
	rank: number;
	weight: number;
	rating: number;
}

export interface GameRes {
	message: GameElement;
}

interface Rows {
	Image: string;
	Name: string;
	ComplexElo: number | undefined;
	DepthElo: number | undefined;
}

type DataPageProps = {
	page: Page;
	onButtonClick: () => void;
};

function DataPage({ page, onButtonClick }: DataPageProps) {
	const [rows, setRows] = useState<Rows[]>([
		{ Image: "LOADING", Name: "LOADING", ComplexElo: 2132, DepthElo: 32432 },
	]);
	const columns = ["ComplexElo", "DepthElo", "Image", "Name"];

	const options: any = {
		filterType: "checkbox",
		filter: "false",
		selectableRows: "none",
		onRowsDelete: () => false,
	};

	useEffect(() => {
		const getRows = async () => {
			const res: AxiosResponse = await axios.get("/api/elo/");
			const data: Elo[] = await res.data;

			const axiosRequests = [];
			const ids: number[] = data.map((e: Elo) => e.gameID);
			for (let id of ids) {
				axiosRequests.push(axios.get(`/api/game/${id}`));
			}

			let responseArray: AxiosResponse[];
			responseArray = await Promise.all(axiosRequests);

			const newRows: Rows[] = [] as Rows[];

			for (let response of responseArray) {
				console.log(
					response.data.message.name,
					response.data.message.thumbnail
				);

				const element: GameElement = response.data.message;

				const newRow: Rows = {
					ComplexElo: data.find((elo: Elo) => elo.gameID === Number(element.id))
						?.ComplexElo,
					DepthElo: data.find((elo: Elo) => elo.gameID === Number(element.id))
						?.DepthElo,

					Image: element.thumbnail,
					Name: element.name,
				};

				console.log(newRow);
				newRows.push(newRow);
			}

			setRows(newRows);
			/*
			//create a promise for each API call
			

			
			const newData: object[] = data.map(async (e: Elo) => {
				const res: Response = await fetch(
					`/api/game/${e.gameID}`
				);
				const data: GameRes = await res.json();
				const name: string = data.message.name;

				const newComplexElo: number = e.ComplexElo;
				const newDepthElo: number = e.DepthElo;

				setRows(
					rows.map((row) =>
						row.userID === id ? { ...rows, gameID: name } : row
					)
				);
			});*/

			//console.log(newData);

			//setRows(newData);
		};
		getRows();
	}, []);
	return (
		<div className="main">
			<div className="header">
				<Header page={page} onButtonClick={onButtonClick} />
			</div>
			<div className="table">
				<MUIDataTable
					title={"Ranking of all games ranked"}
					data={rows}
					columns={columns}
					options={options}
				/>
			</div>
		</div>
	);
}

export default DataPage;
