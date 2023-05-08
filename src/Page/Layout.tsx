import type { FunctionComponent } from "react";
import TopNav                     from "@comp/Main/TopNav";
import {
	Outlet,
	useLoaderData
}                                 from "react-router-dom";
import AuthContext                from "@context/AuthContext";
import { User }                   from "@shared/Class/User.Class";
import type { LayoutLoaderData }  from "@page/Loader";
import DataContext                from "@context/DataContext";
import Foother                    from "@comp/Main/Foother";

const Component : FunctionComponent = () => {
	const { loggedIn, user, tags, mods } = useLoaderData() as LayoutLoaderData;

	return (
		<AuthContext.Provider value={ {
			loggedIn,
			user: new User( user.JsonWebToken )
		} }>
			<DataContext.Provider value={ { tags, mods } }>
				<div className="flex flex-col h-screen justify-between">
					<TopNav/>
					<div className="container py-3 px-2 md:px-0 md:mx-auto mb-auto">
						<Outlet/>
					</div>
					<Foother/>
				</div>
			</DataContext.Provider>
		</AuthContext.Provider>
	);
};

export {
	Component
};
