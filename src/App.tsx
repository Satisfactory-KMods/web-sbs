import {
	Navigate,
	RouterProvider
}                     from "react-router-dom";
import React          from "react";
import { rootRouter } from "@page/Router";

function App() {

	return (
		<RouterProvider router={ rootRouter } fallbackElement={ <Navigate to={ "/error/404" }/> }/>
	);
}

export default App;
