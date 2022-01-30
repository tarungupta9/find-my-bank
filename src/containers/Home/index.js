import React, { useRef, useEffect, useState, Fragment } from "react";
import { GET_BANKS, cities, categories } from "../../constants";
import styles from "./Home.module.css";

const row = 10;

function Home() {
	const bankAllData = useRef();
	const filteredBankData = useRef();
	const [city, setCity] = useState("MUMBAI");
	const [category, setCategory] = useState("select_category");
	const [query, setQuery] = useState(null);
	const [banks, setBanks] = useState(null);
	const [page, setPage] = useState(1);

	/** These states can be expressed with the help of useReducer too */

	useEffect(
		function fetchCityBanks() {
			setBanks(null);
			setPage(1);

			const url = new URL(GET_BANKS);
			const params = { city };
			url.search = new URLSearchParams(params).toString();

			fetch(url)
				.then((res) => res.json())
				.then((data) => {
					bankAllData.current = data;
					filteredBankData.current = bankAllData.current;
					setBanks(filteredBankData.current.slice(0, row));
				});
		},
		[city]
	);

	useEffect(() => {
		if (filteredBankData.current?.length > 0) {
			setBanks(
				filteredBankData.current.slice((page - 1) * row, page * row)
			);
		}
	}, [page]);

	useEffect(() => {
		if (filteredBankData.current?.length < 0) {
			return;
		}

		if (query && category !== "select_category") {
			filteredBankData.current = filteredBankData.current.filter(
				(data) => {
					const searchable = data[category]?.toLowerCase();

					return searchable.includes(query.toLowerCase());
				}
			);
		} else {
			filteredBankData.current = bankAllData.current;
		}

		setPage(1);
		setBanks(filteredBankData.current?.slice(0, row));
	}, [query, category]);

	return (
		<main className={styles.container}>
			<div className={styles.header}>
				<h3>All banks</h3>
				<div className={styles.controls}>
					<select
						name="city"
						value={city}
						onChange={(e) => {
							setCity(e.target.value);
						}}
					>
						{getOptions(cities)}
					</select>
					<select
						name="category"
						value={category}
						onChange={(e) => {
							setCategory(e.target.value);
						}}
					>
						{getOptions(categories)}
					</select>
					<input
						type="text"
						placeholder="Search"
						onChange={(e) => setQuery(e.target.value)}
						disabled={category === "select_category"}
					/>
				</div>
			</div>
			{banks?.length > 0 ? (
				<Fragment>
					<table className={styles.detailsTable}>
						<thead>
							<tr>
								<th>Bank</th>
								<th>IFSC</th>
								<th>Branch</th>
								<th>Bank ID</th>
								<th>Address</th>
							</tr>
						</thead>
						<tbody>{getBanks(banks)}</tbody>
					</table>
					<div className={styles.pagination}>
						<span>Rows per page: {row}</span>
						<button onClick={handlePrev}>Prev</button>
						{page}
						<button onClick={handleNext}>Next</button>
					</div>
				</Fragment>
			) : (
				<span>Loading...</span>
			)}
		</main>
	);

	function handlePrev() {
		if (page === 1) {
			return;
		}

		setPage((page) => page - 1);
	}

	function handleNext() {
		const hasMoreRecords = Math.floor(
			((page + 1) * row - filteredBankData.current.length) / row
		);

		if (hasMoreRecords > 0) {
			return;
		}

		setPage((page) => page + 1);
	}
}

function getOptions(options) {
	if (!Array.isArray(options) || options?.length < 1) {
		return [];
	}

	return options.map(({ name, value, disabled }) => (
		<option key={value} value={value} disabled={disabled}>
			{name}
		</option>
	));
}

function getBanks(banks) {
	if (!Array.isArray(banks) || banks?.length < 1) {
		return [];
	}

	return banks.map(({ bank_id, bank_name, ifsc, branch, address }) => {
		return (
			<tr key={ifsc}>
				<td>{bank_name}</td>
				<td>{ifsc}</td>
				<td>{branch}</td>
				<td>{bank_id}</td>
				<td>{address}</td>
			</tr>
		);
	});
}

export default Home;
