import { TRPCError }    from "@trpc/server";
import {
	handleTRCPErr,
	publicProcedure,
	router
}                       from "@server/trpc/trpc";
import type { Mod } from "@server/MongoDB/DB_Mods";
import DB_Mods from "@server/MongoDB/DB_Mods";


export const public_mods = router( {
	getMods: publicProcedure.query( async() => {
		try {
			const mods = await DB_Mods.find<Mod>();
			if ( mods ) {
				return { mods };
			}
		}
		catch ( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} )
} );
