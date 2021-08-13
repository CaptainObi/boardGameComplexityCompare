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
	thumbnail: string | null;
	image: string | null;
	name: string | null;
	yearpublished: number;
	rank: number;
	weight: number;
	rating: number;
}

interface Rows {
	Name: string;

	rating: number;
	yearpublished: number;
	weight: number;
	ComplexElo: number | undefined;
	DepthElo: number | undefined;
}

type DataPageProps = {
	page: Page;
	onButtonClick: () => void;
};

function DataPage({ page, onButtonClick }: DataPageProps) {
	const [rows, setRows] = useState<Rows[]>([
		{
			Name: "LOADING",
			weight: 0,
			rating: 0,
			yearpublished: 0,
			ComplexElo: 0,
			DepthElo: 0,
		},
	]);
	const columns = [
		{ label: "Name", name: "Name" },
		{ label: "Rating", name: "rating" },
		{ label: "Year Published", name: "yearpublished" },
		{ label: "BGG Weight", name: "weight" },
		{ label: "Complexity", name: "ComplexElo" },
		{ label: "Depth", name: "DepthElo" },
	];

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

			const filter = data.filter(
				(e) => e.ComplexElo !== 1000 && e.DepthElo !== 1000
			);

			setRows(
				filter.map((e: Elo) => {
					const row: Rows = {
						Name: String(e.name),
						rating: e.rating,
						yearpublished: e.yearpublished,
						weight: e.weight,
						ComplexElo: e.ComplexElo,
						DepthElo: e.DepthElo,
					};
					return row;
				})
			);

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
