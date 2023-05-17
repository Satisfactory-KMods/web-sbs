import type { Mod } from "@server/MongoDB/MongoMods";
import MongoMods from "@server/MongoDB/MongoMods";
import {
	handleTRCPErr,
	publicProcedure,
	router
} from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";

export const publicMods = router( {
	getMods: publicProcedure.query( async() => {
		try {
			const mods = await MongoMods.find<Mod>();
			if( mods ) {
				return mods;
			}
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} )
} );
