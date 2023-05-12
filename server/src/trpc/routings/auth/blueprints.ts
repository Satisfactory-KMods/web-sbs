import {
	blueprintProcedure,
	handleTRCPErr,
	router
} from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import _ from "lodash";
import { z } from "zod";

export const auth_blueprints = router( {
	rate: blueprintProcedure.input( z.object( {
		rating: z.number().min( 1 ).max( 5 ),
	} ) ).mutation( async( { ctx, input } ) => {
		const { blueprint, userClass } = ctx;
		const { rating } = input;

		try {
			const bpDocument = await blueprint.getDocument();
			if( bpDocument ) {
				const ratingIndex = bpDocument.rating.findIndex( e => _.isEqual( e.userid,userClass.Get._id ) );
				if( ratingIndex >= 0 ) {
					bpDocument.rating[ ratingIndex ].rating = rating;
				} else {
					bpDocument.rating.push( { userid: userClass.Get._id, rating } );
				}
				if( await bpDocument.updateRating() ) {
					return "Rating saved!";
				}
			}
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "password or login is to short.", code: "BAD_REQUEST" } );
	} )
} );
