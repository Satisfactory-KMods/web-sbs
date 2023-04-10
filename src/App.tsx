import { useState } from "react";
import { BrowserRouter, Router, Routes } from "react-router-dom";
import Layout from "./Layout";

function App() {

	return (
		<BrowserRouter>
			<Routes>
				<Layout>

				</Layout>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
