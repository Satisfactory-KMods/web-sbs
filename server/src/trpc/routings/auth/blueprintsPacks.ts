import type { BlueprintPackExtended } from "@/server/src/MongoDB/MongoBlueprints";
import { MongoBlueprintPacks } from "@/server/src/MongoDB/MongoBlueprints";
import {
	authProcedure,
	blueprintPackOwnerProcedure,
	blueprintPackProcedure,
	handleTRCPErr,
	router
} from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import _ from "lodash";
import { z } from "zod";
import { buildFilter, filterSchema } from "../public/blueprint";


const ZodBlueprintCreateSchema = z.object( {
	data: z.object( {
		name: z.string().min( 3 ),
		description: z.string().min( 3 ),
		tags: z.array( z.string() ),
		blueprints: z.array( z.string() )
	} )
} );

export const authBlueprintPacks = router( {
	rate: blueprintPackProcedure.input( z.object( {
		rating: z.number().min( 1 ).max( 5 )
	} ) ).mutation( async( { ctx, input } ) => {
		const { blueprintPack, userClass } = ctx;
		const { rating } = input;

		try {
			const bpDocument = await blueprintPack.getDocument();
			if( bpDocument ) {
				const ratingIndex = bpDocument.rating.findIndex( e => _.isEqual( e.userid, userClass.Get._id ) );
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
	} ),

	remove: blueprintPackOwnerProcedure.mutation( async( { ctx } ) => {
		const { blueprintPack } = ctx;
		try {
			if( await blueprintPack.remove() ) {
				return "Blueprint deleted!";
			}
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} ),

	modify: blueprintPackOwnerProcedure.input( ZodBlueprintCreateSchema ).mutation( async( { ctx, input } ) => {
		const { blueprintPack } = ctx;
		const { data } = input;
		const { name, description, tags, blueprints } = data;
		try {
			const docu = await blueprintPack.getDocument();
			if( docu ) {
				docu.name = name;
				docu.description = description;
				docu.tags = tags;
				docu.blueprints = blueprints;

				docu.markModified( "name" );
				docu.markModified( "description" );
				docu.markModified( "tags" );
				docu.markModified( "blueprints" );

				docu.updateModRefs( false );
				if( await docu.save() ) {
					return "Blueprint modified!";
				}
			} else {
				throw new TRPCError( { message: "BlueprintPack is invalid!", code: "BAD_REQUEST" } );
			}
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} ),

	my: authProcedure.input( z.object( {
		skip: z.number().optional(),
		limit: z.number().optional(),
		filterOptions: filterSchema.optional()
	} ) ).query( async( { ctx, input } ) => {
		const { limit, filterOptions, skip } = input;
		const { userClass } = ctx;
		try {
			const { filter, options } = buildFilter( filterOptions );
			const totalBlueprints = await MongoBlueprintPacks.count( { ...filter, owner: userClass.Get._id } );
			const blueprintPacks: BlueprintPackExtended[] = await MongoBlueprintPacks.find<BlueprintPackExtended>(
				{ ...filter, owner: userClass.Get._id },
				null,
				{
					...options,
					limit,
					skip
				}
			).populate( [ 'blueprints', 'owner', 'tags' ] );

			const setOfImages = new Set( blueprintPacks.map( e => e.blueprints.reduce<string[]>( ( arr, cur ) => arr.concat( cur.images ), [] ) ) );
			const image = Array.from( setOfImages ).reduce<string[]>( ( arr, cur ) => arr.concat( cur ), [] )[ Math.floor( Math.random() * setOfImages.size ) ];
			return { blueprintPacks, totalBlueprints, image };
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} ),

	add: authProcedure.input( ZodBlueprintCreateSchema ).input( z.object( {
		skip: z.number().optional(),
		limit: z.number().optional(),
		filterOptions: filterSchema.optional()
	} ) ).query( async( { ctx, input } ) => {
		const { data } = input;
		const { name, description, tags, blueprints } = data;
		const { userClass } = ctx;
		try {
			const docu = new MongoBlueprintPacks();
			docu.name = name;
			docu.description = description;
			docu.tags = tags;
			docu.blueprints = blueprints;
			docu.owner = userClass.Get._id;
			docu.rating = [];
			docu.totalRating = 0;
			docu.totalRatingCount = 0;
			docu.mods = [];

			docu.markModified( "name" );
			docu.markModified( "description" );
			docu.markModified( "tags" );
			docu.markModified( "blueprints" );

			if( await docu.save() ) {
				docu.updateModRefs( true );
				return { message: "Blueprint Created!", id: docu._id.toString() };
			}
		} catch( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} )
} );

export type BlueprintCreateInput = z.infer<typeof ZodBlueprintCreateSchema>;
