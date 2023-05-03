import {
	Navigate,
	RouterProvider
}                     from "react-router-dom";
import React          from "react";
import LangContext    from "@context/LangContext";
import { useLang }    from "@hooks/useLang";
import { rootRouter } from "@page/Router";

function App() {
	const Lang = useLang();

	return (
		<LangContext.Provider value={ Lang }>
			<RouterProvider router={ rootRouter } fallbackElement={ <Navigate to={ "/error/404" }/> }/>
		</LangContext.Provider>
	);
}

export default App;
