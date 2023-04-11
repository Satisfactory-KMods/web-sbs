import {
	BrowserRouter,
	Navigate,
	Route,
	Routes
}                          from "react-router-dom";
import Layout              from "./Layout";
import React, { Suspense } from "react";
import LoadingPage         from "./Page/LoadingPage";
import LangContext         from "./Context/LangContext";
import { useLang }         from "./Lib/hooks/useLang";

const Home = React.lazy( () => import("./Page/Home") );
const ErrorPage = React.lazy( () => import("./Page/ErrorPage") );

function App() {
	const Lang = useLang();

	return (
		<BrowserRouter>
			<LangContext.Provider value={ Lang }>
				<Layout>
					<Suspense fallback={ <LoadingPage/> }>
						<Routes>
							<Route path="/error/401" element={ <ErrorPage ErrorCode={ 401 }/> }/>
							<Route path="/error/403" element={ <ErrorPage ErrorCode={ 403 }/> }/>
							<Route path="/error/404" element={ <ErrorPage ErrorCode={ 404 }/> }/>

							<Route path="/" element={ <Home/> }/>

							<Route path="*" element={ <Navigate to="/error/404"/> }/>
						</Routes>
					</Suspense>
				</Layout>
			</LangContext.Provider>
		</BrowserRouter>
	);
}

export default App;
