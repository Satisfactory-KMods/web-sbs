import {
	BrowserRouter,
	Navigate,
	Route,
	Routes
}                          from "react-router-dom";
import Layout              from "./Layout";
import React, { Suspense } from "react";
import LoadingPage         from "./Page/LoadingPage";

const Home = React.lazy( () => import("./Page/Home") );
const Err404 = React.lazy( () => import("./Page/Err404") );
const Err401 = React.lazy( () => import("./Page/Err401") );
const Err403 = React.lazy( () => import("./Page/Err403") );

function App() {

	return (
		<BrowserRouter>
			<Layout>
				<Suspense fallback={ <LoadingPage/> }>
					<Routes>
						<Route path="/401" element={ <Err401/> }/>
						<Route path="/404" element={ <Err404/> }/>
						<Route path="/403" element={ <Err403/> }/>

						<Route path="/" element={ <Home/> }/>

						<Route path="*" element={ <Navigate to="/404"/> }/>
					</Routes>
				</Suspense>
			</Layout>
		</BrowserRouter>
	);
}

export default App;
