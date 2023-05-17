import { ApiUrl, MWRest, MWRestUser } from "@/server/src/Lib/Express.Lib";
import type { BlueprintData, BlueprintPack } from "@/server/src/MongoDB/MongoBlueprints";
import MongoBlueprints, { MongoBlueprintPacks } from "@/server/src/MongoDB/MongoBlueprints";
import MongoTags from "@/server/src/MongoDB/MongoTags";
import MongoUserAccount from "@/server/src/MongoDB/MongoUserAccount";
import type { ExpressRequest } from "@/server/src/Types/express";
import { buildFilter, filterSchema } from "@/server/src/trpc/routings/public/blueprint";
import type { Response } from "express";
import _ from "lodash";
import { z } from "zod";


export default function() {
	Router.post( ApiUrl( "mod/getblueprints" ), MWRest, async( req: ExpressRequest<{
		skip: number,
		limit: number,
		filterOptions: z.infer<typeof filterSchema>
	}>, res: Response ) => {
		try {
			z.number().optional().parse( req.body.skip );
			z.number().parse( req.body.limit );
			filterSchema.optional().parse( req.body.filterOptions );

			const { skip, limit, filterOptions } = req.body;

			const { filter, options } = buildFilter( filterOptions );
			const totalBlueprints = await MongoBlueprints.count( filter );
			const blueprints: BlueprintData[] = [];
			for await ( const blueprint of MongoBlueprints.find( filter, { description: 0 }, { skip, limit, options } ) ) {
				const copy: BlueprintData = _.cloneDeep( blueprint.toJSON() );
				const owner = await MongoUserAccount.findById( blueprint.owner );
				if( owner ) {
					copy.owner = owner.username || "Unknown User";
				}
				if( copy.tags.length > 0 ) {
					const tags = await MongoTags.find( { _id: { $in: copy.tags } } );
					// @ts-ignore
					copy.tags = tags.map( e => {
						return  { DisplayName: e.DisplayName, _id: e._id.toString() };
					} );
				}
				blueprints.push( copy );
			}

			console.log( blueprints );
			return res.json( { blueprints, totalBlueprints } );
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( e.message );
			}
		}

		return res.sendStatus( 500 );
	} );


	Router.post( ApiUrl( "mod/gettags" ), MWRest, async( req: ExpressRequest, res: Response ) => {
		try {
			const tags = await MongoTags.find();
			return res.json( { tags: tags.map( e => {
				return  { _id: e._id.toString(), DisplayName: e.DisplayName };
			} ) } );
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( e.message );
			}
		}

		return res.sendStatus( 500 );
	} );


	Router.post( ApiUrl( "mod/getblueprintpacks" ), MWRest, async( req: ExpressRequest<{
		skip: number,
		limit: number,
		filterOptions: z.infer<typeof filterSchema>
	}>, res: Response ) => {
		try {
			z.number().optional().parse( req.body.skip );
			z.number().parse( req.body.limit );
			filterSchema.optional().parse( req.body.filterOptions );

			const { skip, limit, filterOptions } = req.body;

			const { filter, options } = buildFilter( filterOptions );
			const totalBlueprints = await MongoBlueprintPacks.count( filter );
			const blueprints: BlueprintPack[] = [];
			for await ( const blueprintPack of MongoBlueprintPacks.find( filter, { description: 0 }, { skip, limit, options } ) ) {
				const copy: BlueprintPack = _.cloneDeep( blueprintPack.toJSON() );
				const Blueprints = await MongoBlueprints.find( { _id: blueprintPack.blueprints } );
				const owner = await MongoUserAccount.findById( blueprintPack.owner );
				if( owner ) {
					copy.owner = owner.username || "Unknown User";
				}
				if( copy.tags.length > 0 ) {
					const tags = await MongoTags.find( { _id: { $in: copy.tags } } );
					// @ts-ignore
					copy.tags = tags.map( e => {
						return  { DisplayName: e.DisplayName, _id: e._id.toString() };
					} );
				}
				if( Blueprints.length > 0 ) {
					// @ts-ignore
					copy.blueprints = Blueprints.map( e => {
						return  { _id: e._id.toString(), name: e.name, iconData: e.iconData! };
					} );
				}
				blueprints.push( copy );
			}

			console.log( blueprints );
			return res.json( { blueprints, totalBlueprints } );
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( e.message );
			}
		}

		return res.sendStatus( 500 );
	} );

	Router.post( ApiUrl( "mod/authcheck" ), MWRest, MWRestUser, async( req: ExpressRequest, res: Response ) => {
		return res.status( 200 ).json( { success: true } );
	} );
}

