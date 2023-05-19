import {
	createBrowserRouter,
	Navigate
} from "react-router-dom";


const rootRouter = createBrowserRouter( [
	{
		path: "/",
		lazy: async() => await import( "@page/Layout" ),
		loader: async( { request, params } ) => {
			const { defaultLoader } = await import( "@page/Loader" );
			return defaultLoader( { request, params } );
		},
		children: [
			// start auth --------------------------------
			{
				path: "/account/signin",
				lazy: async() => await import( "@page/account/signin/Page" ),
				loader: async( { request, params } ) => {
					const { loader } = await import( "@page/account/OnlyLoggedInLoader" );
					return loader( { request, params } );
				}
			},
			{
				path: "/account/signup",
				lazy: async() => await import( "@page/account/signup/Page" ),
				loader: async( { request, params } ) => {
					const { loader } = await import( "@page/account/OnlyLoggedInLoader" );
					return loader( { request, params } );
				}
			},
			// end auth ----------------------------------


			// start App --------------------------------
			{
				path: "/account/settings",
				lazy: async() => await import( "@page/account/settings/Page" ),
				loader: async( { request, params } ) => {
					const { loader } = await import( "@page/account/settings/Loader" );
					return loader( { request, params } );
				}
			},
			{
				path: "/admin/tags",
				lazy: async() => await import( "@page/admin/tags/Page" ),
				loader: async( { request, params } ) => {
					const { loader } = await import( "@page/admin/tags/Loader" );
					return loader( { request, params } );
				}
			},
			{
				path: "/admin/users",
				lazy: async() => await import( "@page/admin/users/Page" ),
				loader: async( { request, params } ) => {
					const { loader } = await import( "@page/admin/users/Loader" );
					return loader( { request, params } );
				}
			},
			{
				path: "/terms/private",
				lazy: async() => await import( "@page/terms/private/Page" )
			},
			{
				path: "/blueprint/create",
				lazy: async() => await import( "@page/blueprint/create/Page" ),
				loader: async( { request, params } ) => {
					const { loader } = await import( "@page/blueprint/create/Loader" );
					return loader( { request, params } );
				}
			},
			{
				path: "/blueprint/edit/:blueprintId",
				lazy: async() => await import( "@page/blueprint/edit/[blueprintId]" ),
				loader: async( { request, params } ) => {
					const { blueprintIdLoader } = await import( "@page/blueprint/edit/[blueprintId]Loader" );
					return blueprintIdLoader( { request, params } );
				}
			},
			{
				path: "/blueprint/my",
				lazy: async() => await import( "@page/blueprint/my/Page" ),
				loader: async( { request, params } ) => {
					const { loader } = await import( "@page/blueprint/my/Loader" );
					return loader( { request, params } );
				}
			},
			{
				path: "/blueprint/list",
				lazy: async() => await import( "@page/blueprint/list/Page" ),
				loader: async( { request, params } ) => {
					const { loader } = await import( "@page/blueprint/list/Loader" );
					return loader( { request, params } );
				}
			},
			{
				path: "/blueprint/:blueprintId",
				lazy: async() => await import( "@page/blueprint/[blueprintId]" ),
				loader: async( { request, params } ) => {
					const { loader } = await import( "@page/blueprint/[blueprintId]Loader" );
					return loader( { request, params } );
				}
			},
			{
				path: "/blueprintpacks/edit/:blueprintId",
				lazy: async() => await import( "@page/blueprintpacks/edit/[blueprintPackId]" ),
				loader: async( { request, params } ) => {
					const { loader } = await import( "@page/blueprintpacks/edit/[blueprintPackId]Loader" );
					return loader( { request, params } );
				}
			},
			{
				path: "/blueprintpacks/my",
				lazy: async() => await import( "@page/blueprintpacks/my/Page" ),
				loader: async( { request, params } ) => {
					const { loader } = await import( "@page/blueprintpacks/my/Loader" );
					return loader( { request, params } );
				}
			},
			{
				path: "/blueprintpacks/create/",
				lazy: async() => await import( "@page/blueprintpacks/create/Page" ),
				loader: async( { request, params } ) => {
					const { loader } = await import( "@page/blueprintpacks/create/Loader" );
					return loader( { request, params } );
				}
			},
			{
				path: "/blueprintpacks/edit/:blueprintPackId",
				lazy: async() => await import( "@page/blueprintpacks/edit/[blueprintPackId]" ),
				loader: async( { request, params } ) => {
					const { loader } = await import( "@page/blueprintpacks/edit/[blueprintPackId]Loader" );
					return loader( { request, params } );
				}
			},
			{
				path: "/blueprintpacks/",
				lazy: async() => await import( "@page/blueprintpacks/Page" ),
				loader: async( { request, params } ) => {
					const { loader } = await import( "@page/blueprintpacks/Loader" );
					return loader( { request, params } );
				}
			},
			// end App ----------------------------------,
			{
				path: "/",
				element: <Navigate to="/blueprint/list" />
			},
			{
				path: "/error/:statusCode",
				lazy: async() => await import( "@page/error/[statusCode]" )
			},
			{
				path: "*",
				element: <Navigate to="/error/404" />
			}
		]
	},
	{
		path: "*",
		element: <Navigate to="/error/404" />
	}
] );

export {
	rootRouter
};

