import type { User } from "@shared/Class/User.Class";
import { ERoles } from "@shared/Enum/ERoles";
import { transformer } from "@shared/transformer";
import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import type * as trpcExpress from "@trpc/server/adapters/express";
import _ from "lodash";
import { z } from "zod";
import { BlueprintClass } from "../Lib/Blueprint.Class";

export function handleTRCPErr( e : unknown ) {
	if ( e instanceof TRPCError ) {
		throw new TRPCError( { message: e.message, code: e.code } );
	} else if ( e instanceof Error ) {
		SystemLib.LogError( "tRCP", e.message );
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	}
}

export interface Context {
	token : string,
	userClass : User,
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

export const middleware = t.middleware;

// create the blueprint class and add it to the context
const blueprintMiddleware = middleware( async( opts ) => {
	const { input } = opts;
	const { blueprintId } = input as { blueprintId: string };
	const blueprint = await BlueprintClass.createClass( blueprintId );
	if ( !blueprint ) {
		throw new TRPCError( { code: 'UNAUTHORIZED' } );
	}

	return opts.next( {
		ctx: {
			blueprint
		},
	} );
} );

// only check if we have admin or we are the owner
const isOwnerMiddleware = middleware( async( opts ) => {
	const { ctx } = opts;
	const { blueprint, userClass } = ctx as { blueprint: BlueprintClass<true> } & typeof ctx;
	const isOwner = false;
	if ( !ctx.userClass.HasPermssion( ERoles.admin ) && !_.eq( blueprint.get.owner ,userClass.Get._id ) ) {
		throw new TRPCError( { code: 'UNAUTHORIZED' } );
	}
	return opts.next();
} );

// check if we have a role for example for admin actions or something else
const roleMiddleware = ( role: ERoles ) => middleware( async( opts ) => {
	const { ctx } = opts;
	if ( !ctx.userClass.HasPermssion( role ) ) {
		throw new TRPCError( { code: 'UNAUTHORIZED' } );
	}
	return opts.next();
} );

export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure;
export const blueprintProcedure = t.procedure.input( z.object( {
	blueprintId: z.string()
} ) ).use( blueprintMiddleware );
export const blueprintOwnerProcedure = t.procedure.input( z.object( {
	blueprintId: z.string()
} ) ).use( blueprintMiddleware ).use( isOwnerMiddleware );
export const adminProcedure = t.procedure.use( roleMiddleware( ERoles.admin ) );
export const modProcedure = t.procedure.use( roleMiddleware( ERoles.moderator ) );
export const adminBlueprintProcedure = t.procedure.use( roleMiddleware( ERoles.admin ) ).input( z.object( {
	blueprintId: z.string()
} ) ).use( blueprintMiddleware );
export const modBlueprintProcedure = t.procedure.use( roleMiddleware( ERoles.moderator ) ).input( z.object( {
	blueprintId: z.string()
} ) ).use( blueprintMiddleware );