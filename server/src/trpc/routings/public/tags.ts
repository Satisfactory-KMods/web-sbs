import { TRPCError }   from "@trpc/server";
import {
	handleTRCPErr,
	publicProcedure,
	router
}                      from "@server/trpc/trpc";
import type { MO_Tag } from "@shared/Types/MongoDB";
import DB_Tags         from "@server/MongoDB/DB_Tags";


export const public_tags = router( {
	getTags: publicProcedure.query( async() => {
		try {
			const tags = await DB_Tags.find<MO_Tag>();
			if ( tags ) {
				return { tags };
			}
		}
		catch ( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} )
} );
