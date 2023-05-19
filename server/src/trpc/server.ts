import { authBlueprintPacks } from "@/server/src/trpc/routings/auth/blueprintsPacks";
import { adminUsers } from "@/server/src/trpc/routings/auth/users";
import { publicBlueprintPacks } from "@/server/src/trpc/routings/public/blueprintPack";
import { MWAuth } from "@server/Lib/Express.Lib";
import { BC } from "@server/Lib/System.Lib";
import { authLogout } from "@server/trpc/routings/auth/logout";
import { authUpdateAccount } from "@server/trpc/routings/auth/updateAccount";
import { publicBlueprint } from "@server/trpc/routings/public/blueprint";
import { publicCreateAccount } from "@server/trpc/routings/public/createAccount";
import { publicLogin } from "@server/trpc/routings/public/login";
import { publicMods } from "@server/trpc/routings/public/mods";
import { publicTags } from "@server/trpc/routings/public/tags";
import { publicValidate } from "@server/trpc/routings/public/validate";
import {
	createContext,
	router
} from "@server/trpc/trpc";
import * as trpcExpress from "@trpc/server/adapters/express";
import { authBlueprints } from "./routings/auth/blueprints";
import { adminTags } from "./routings/auth/tags";


const publicRouter = router( {
	publicBlueprintPacks,
	validate: publicValidate,
	login: publicLogin,
	register: publicCreateAccount,
	blueprint: publicBlueprint,
	tags: publicTags,
	mods: publicMods
} );
const authRouter = router( {
	authBlueprintPacks,
	blueprints: authBlueprints,
	updateAccount: authUpdateAccount,
	logout: authLogout,
	adminTags,
	adminUsers
} );


SystemLib.Log( "start", "register TRCP on", BC( "Red" ), "/api/v2/*" );
Api.use( "/api/v2/public", trpcExpress.createExpressMiddleware( {
	router: publicRouter,
	createContext
} ) );
Api.use( "/api/v2/auth", MWAuth, trpcExpress.createExpressMiddleware( {
	router: authRouter,
	createContext
} ) );

export type PublicRouter = typeof publicRouter;
export type AuthRouter = typeof authRouter;
