import * as trpc             from "@trpc/server";
import { TRPCError }         from "@trpc/server";
import type * as trpcExpress from "@trpc/server/adapters/express";
import type { User }         from "@shared/Class/User.Class";
import { transformer }       from "@shared/transformer";

export function handleTRCPErr( e : unknown ) {
	if ( e instanceof TRPCError ) {
		throw new TRPCError( { message: e.message, code: e.code } );
	}
	else if ( e instanceof Error ) {
		SystemLib.LogError( "tRCP", e.message );
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	}
}

export interface Context {
	token? : string,
	userClass? : User,
}

export const createContext = async( {
	req
} : trpcExpress.CreateExpressContextOptions ) => {
	const ctx : Context = {
		token: req.body.JsonWebToken,
		userClass: req.body.UserClass
	};

	return ctx;
};

const t = trpc.initTRPC.context<Context>().create( {
	transformer,
	isDev: SystemLib.IsDevMode
} );


export const router = t.router;
export const publicProcedure = t.procedure;