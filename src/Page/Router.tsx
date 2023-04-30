import {
	createBrowserRouter,
	createRoutesFromElements,
	Navigate,
	Route
}            from "react-router-dom";
import React from "react";

const rootRouter = createBrowserRouter( createRoutesFromElements(
	<Route path="*" lazy={ () => import("@app/Layout") }>
		<Route path="error/:statusCode" lazy={ () => import("@page/error/[statusCode]") }/>

		<Route path="terms/service" lazy={ () => import("@page/terms/service/Page") }/>
		<Route path="terms/private" lazy={ () => import("@page/terms/private/Page") }/>

		<Route path="account/signin" lazy={ () => import("@page/account/signin/Page") }/>
		<Route path="account/signup" lazy={ () => import("@page/account/signup/Page") }/>
		<Route path="account/settings" lazy={ () => import("@page/account/settings/Page") }/>

		<Route path="admin/tags" lazy={ () => import("@page/admin/tags/Page") }/>
		<Route path="admin/users" lazy={ () => import("@page/admin/users/Page") }/>
		<Route path="admin/blueprints/blacklisted" lazy={ () => import("@page/admin/blueprints/blacklisted/Page") }/>

		<Route path="blueprint/my" lazy={ () => import("@page/Page") }/>
		<Route path="blueprint/create" lazy={ () => import("@page/Page") }/>
		<Route path="blueprint/edit/:blueprintId" lazy={ () => import("@page/Page") }/>
		<Route path="blueprint/:blueprintId" lazy={ () => import("@page/Page") }/>

		<Route index loader={ async( { request, params } ) => {
			const { loader } = await import( "@page/Loader" );
			return loader( { request, params } );
		} } lazy={ () => import("@page/Page") }/>

		<Route path="*" element={ <Navigate to={ "error/404" }/> }/>
	</Route>
) );

export {
	rootRouter
};