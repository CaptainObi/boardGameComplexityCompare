import axios, { AxiosResponse } from "axios";
import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import Header from "./Header";
import { Page } from "../App";
import "./css/DataPage.css";
import { Elo } from "../interfaces/Elo";

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
	onPageChange: () => void;
};

/**
 * Creates the datapage to display all the data
 * @param props {DataPageProps} props that contain which page it is for the header and what to do when the page is changed
 * @returns
 */
function DataPage({ page, onPageChange }: DataPageProps) {
	// uses useState for rowss, just with a default loading row
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

	// columns with labels to make it easier to understand
	const columns = [
		{ label: "Name", name: "Name" },
		{ label: "Rating", name: "rating" },
		{ label: "Year Published", name: "yearpublished" },
		{ label: "BGG Weight", name: "weight" },
		{ label: "Rules Complexity", name: "ComplexElo" },
		{ label: "Strategical Depth", name: "DepthElo" },
	];

	// turns off datafiltering and selecting rows.
	const options: any = {
		filterType: "checkbox",
		filter: "false",
		selectableRows: "none",
		onRowsDelete: () => false,
	};

	useEffect(() => {
		const getRows = async () => {
			// gets all the games
			const res: AxiosResponse = await axios.get("/api/elo/");
			const data: Elo[] = await res.data;

			// filters out any that haven't been compared yet
			const filter = data.filter(
				(e) => e.ComplexElo !== 1000 && e.DepthElo !== 1000
			);

			// maps them to rows
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
		};
		getRows();
	}, []);
	return (
		<div className="main">
			<div className="header">
				<Header page={page} onPageChange={onPageChange} />
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
