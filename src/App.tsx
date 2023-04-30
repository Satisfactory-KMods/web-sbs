import {
	Navigate,
	RouterProvider
}                     from "react-router-dom";
import React          from "react";
import LangContext    from "@context/LangContext";
import { useLang }    from "@hooks/useLang";
import AuthContext    from "@context/AuthContext";
import { useAuth }    from "@hooks/useAuth";
import { rootRouter } from "@page/Router";

function App() {
	const Lang = useLang();
	const Auth = useAuth();

	return (
		<LangContext.Provider value={ Lang }>
			<AuthContext.Provider value={ Auth }>
				<RouterProvider router={ rootRouter } fallbackElement={ <Navigate to={ "/error/404" }/> }/>
			</AuthContext.Provider>
		</LangContext.Provider>
	);
}

export default App;
