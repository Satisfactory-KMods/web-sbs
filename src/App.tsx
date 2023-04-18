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

const SignIn = React.lazy( () => import("./Page/User/SignIn") );
const SignUp = React.lazy( () => import("./Page/User/SignUp") );
const UserSettings = React.lazy( () => import("./Page/User/UserSettings") );

const CreateBlueprint = React.lazy( () => import("./Page/Blueprints/CreateBlueprint") );
const EditBlueprint = React.lazy( () => import("./Page/Blueprints/EditBlueprint") );
const ShowBlueprint = React.lazy( () => import("./Page/Blueprints/ShowBlueprint") );
const MyBlueprints = React.lazy( () => import("./Page/Blueprints/MyBlueprints") );

const AdminTags = React.lazy( () => import("./Page/Admin/AdminTags") );
const AdminBlacklisted = React.lazy( () => import("./Page/Admin/AdminBlacklisted") );
const AdminUsers = React.lazy( () => import("./Page/Admin/AdminUsers") );

const TermsPrivate = React.lazy( () => import("./Page/TermsPrivate") );
const TermsService = React.lazy( () => import("./Page/TermsService") );

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

								<Route path="/terms/service" element={ <TermsService/> }/>
								<Route path="/terms/private" element={ <TermsPrivate/> }/>

								<Route path="/account/signin" element={ <SignIn/> }/>
								<Route path="/account/signup" element={ <SignUp/> }/>
								<Route path="/account/settings" element={ <UserSettings/> }/>

								<Route path="/admin/tags" element={ <AdminTags/> }/>
								<Route path="/admin/users" element={ <AdminUsers/> }/>
								<Route path="/admin/blueprints/blacklisted" element={ <AdminBlacklisted/> }/>

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
