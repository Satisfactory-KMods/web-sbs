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
import { useLang }         from "./hooks/useLang";
import AuthContext         from "./Context/AuthContext";
import { useAuth }         from "./hooks/useAuth";

const Home = React.lazy( () => import("./Page/Home") );
const ErrorPage = React.lazy( () => import("./Page/ErrorPage") );
const SignIn = React.lazy( () => import("./Page/SignIn") );
const SignUp = React.lazy( () => import("./Page/SignUp") );
const CreateBlueprint = React.lazy( () => import("./Page/CreateBlueprint") );
const EditBlueprint = React.lazy( () => import("./Page/EditBlueprint") );
const ShowBlueprint = React.lazy( () => import("./Page/ShowBlueprint") );
const MyBlueprints = React.lazy( () => import("./Page/MyBlueprints") );

function App() {
	const Lang = useLang();
	const Auth = useAuth();

	return (
		<BrowserRouter>
			<LangContext.Provider value={ Lang }>
				<AuthContext.Provider value={ Auth }>
					<Layout>
						<Suspense fallback={ <LoadingPage/> }>
							<Routes>
								<Route path="/error/401" element={ <ErrorPage ErrorCode={ 401 }/> }/>
								<Route path="/error/403" element={ <ErrorPage ErrorCode={ 403 }/> }/>
								<Route path="/error/404" element={ <ErrorPage ErrorCode={ 404 }/> }/>

								<Route path="/signin" element={ <SignIn/> }/>
								<Route path="/signup" element={ <SignUp/> }/>

								<Route path="/blueprint/my" element={ <MyBlueprints/> }/>
								<Route path="/blueprint/create" element={ <CreateBlueprint/> }/>
								<Route path="/blueprint/edit/:id" element={ <EditBlueprint/> }/>
								<Route path="/blueprint/:id" element={ <ShowBlueprint/> }/>

								<Route path="/" element={ <Home/> }/>

								<Route path="*" element={ <Navigate to="/error/404"/> }/>
							</Routes>
						</Suspense>
					</Layout>
				</AuthContext.Provider>
			</LangContext.Provider>
		</BrowserRouter>
	);
}

export default App;
