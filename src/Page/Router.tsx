import {
	createBrowserRouter,
	createRoutesFromElements,
	Navigate,
	Route
}            from "react-router-dom";
import React from "react";

const rootRouter = createBrowserRouter( createRoutesFromElements(
	<>
		<Route path="/" loader={ async( { request, params } ) => {
			const { defaultLoader } = await import( "@app/Loader" );
			return defaultLoader( { request, params } );
		} } lazy={ async() => await import("@app/Layout") }>
			<Route path="error/:statusCode" lazy={ async() => await import("@page/error/[statusCode]") }/>

			<Route path="terms/service" lazy={ async() => await import("@page/terms/service/Page") }/>
			<Route path="terms/private" lazy={ async() => await import("@page/terms/private/Page") }/>

			<Route path="account/signin" lazy={ async() => await import("@page/account/signin/Page") }/>
			<Route path="account/signup" lazy={ async() => await import("@page/account/signup/Page") }/>
			<Route path="account/settings" lazy={ async() => await import("@page/account/settings/Page") }/>

			<Route path="admin/tags" lazy={ async() => await import("@page/admin/tags/Page") }/>
			<Route path="admin/users" lazy={ async() => await import("@page/admin/users/Page") }/>
			<Route path="admin/blueprints/blacklisted"
			       lazy={ async() => await import("@page/admin/blueprints/blacklisted/Page") }/>

			<Route path="blueprint/my" lazy={ async() => await import("@page/Page") }/>
			<Route path="blueprint/create" lazy={ async() => await import("@page/Page") }/>
			<Route path="blueprint/edit/:blueprintId" lazy={ async() => await import("@page/Page") }/>
			<Route path="blueprint/:blueprintId" lazy={ async() => await import("@page/Page") }/>

			<Route index loader={ async( { request, params } ) => {
				const { loader } = await import( "@page/Loader" );
				return loader( { request, params } );
			} } lazy={ async() => await import("@page/Page") }/>
		</Route>

		<Route path="*" element={ <Navigate to={ "error/404" }/> }/>
	</>
) );

export {
	rootRouter
};