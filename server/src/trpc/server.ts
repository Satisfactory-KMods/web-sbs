import * as trpcExpress         from "@trpc/server/adapters/express";
import { public_validate }      from "@server/trpc/routings/public/validate";
import { public_login }         from "@server/trpc/routings/public/login";
import { public_createAccount } from "@server/trpc/routings/public/createAccount";
import {
	createContext,
	router
}                               from "@server/trpc/trpc";
import { MW_Auth }              from "@server/Lib/Express.Lib";
import { BC }                   from "@server/Lib/System.Lib";


const publicRouter = router( {
	validate: public_validate,
	login: public_login,
	register: public_createAccount
} );
const authRouter = router( {} );


SystemLib.Log( "start", "register TRCP on", BC( "Red" ), "/api/v2/*" );
Api.use( "/api/v2/public", trpcExpress.createExpressMiddleware( {
	router: publicRouter,
	createContext
} ) );
Api.use( "/api/v2/auth", MW_Auth, trpcExpress.createExpressMiddleware( {
	router: authRouter,
	createContext
} ) );

export type PublicRouter = typeof publicRouter;
export type AuthRouter = typeof authRouter;