import { MW_Auth } from "@server/Lib/Express.Lib";
import { BC } from "@server/Lib/System.Lib";
import { auth_logout } from "@server/trpc/routings/auth/logout";
import { auth_updateAccount } from "@server/trpc/routings/auth/updateAccount";
import { public_blueprint } from "@server/trpc/routings/public/blueprint";
import { public_createAccount } from "@server/trpc/routings/public/createAccount";
import { public_login } from "@server/trpc/routings/public/login";
import { public_mods } from "@server/trpc/routings/public/mods";
import { public_tags } from "@server/trpc/routings/public/tags";
import { public_validate } from "@server/trpc/routings/public/validate";
import {
	createContext,
	router
} from "@server/trpc/trpc";
import * as trpcExpress from "@trpc/server/adapters/express";
import { auth_blueprints } from "./routings/auth/blueprints";
import { admin_tags } from "./routings/auth/tags";


const publicRouter = router( {
	validate: public_validate,
	login: public_login,
	register: public_createAccount,
	blueprint: public_blueprint,
	tags: public_tags,
	mods: public_mods
} );
const authRouter = router( {
	blueprints: auth_blueprints,
	updateAccount: auth_updateAccount,
	logout: auth_logout,
	adminTags: admin_tags
} );


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