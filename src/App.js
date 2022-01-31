import Home from "./containers/Home";
import Navbar from "./containers/Navbar";
import styles from "./App.module.css";

function App() {
	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<strong>Find My Bank</strong>
			</header>
			<div className={styles.layout}>
				{/* <Navbar /> */}
				<Home />
			</div>
		</div>
	);
}

export default App;
