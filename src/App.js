import Home from "./containers/Home";
import Navbar from "./containers/Navbar";
import styles from "./App.module.css";

function App() {
	return (
		<div className={styles.container}>
			<Navbar />
			<Home />
		</div>
	);
}

export default App;
