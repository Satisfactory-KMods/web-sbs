import type { FunctionComponent } from "react";
import TopNav                     from "@comp/Main/TopNav";
import { Container }              from "react-bootstrap";
import {
	Outlet,
	useLoaderData
}                                 from "react-router-dom";
import AuthContext                from "./Context/AuthContext";
import { User }                   from "@shared/Class/User.Class";
import type { LayoutLoaderData }  from "@app/Loader";
import DataContext                from "@context/DataContext";

const Component : FunctionComponent = () => {
	const { loggedIn, user, tags, mods } = useLoaderData() as LayoutLoaderData;

	return (
		<AuthContext.Provider value={ {
			loggedIn,
			user: new User( user.JsonWebToken )
		} }>
			<DataContext.Provider value={ { tags, mods } }>
				<div className={ "d-flex flex-column h-100 w-100" }>
					<TopNav/>
					<div className={ "flex-1 overflow-y-auto" }
					     style={ {
						     backgroundImage: "url(\"/images/background/6.jpg\")",
						     backgroundOrigin: "content-box",
						     backgroundRepeat: "no-repeat",
						     backgroundSize: "cover"
					     } }>
						<Container className={ "h-100 p-3" }>
							<Outlet/>
						</Container>
					</div>
				</div>
			</DataContext.Provider>
		</AuthContext.Provider>
	);
};

export {
	Component
};
