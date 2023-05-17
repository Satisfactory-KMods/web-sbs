import { ApiUrl, MW_Rest, MW_Rest_USER } from "@/server/src/Lib/Express.Lib";
import type { BlueprintPack } from "@/server/src/MongoDB/DB_BlueprintPacks";
import DB_BlueprintPacks from "@/server/src/MongoDB/DB_BlueprintPacks";
import type { BlueprintData } from "@/server/src/MongoDB/DB_Blueprints";
import DB_Blueprints from "@/server/src/MongoDB/DB_Blueprints";
import DB_Tags from "@/server/src/MongoDB/DB_Tags";
import DB_UserAccount from "@/server/src/MongoDB/DB_UserAccount";
import type { ExpressRequest } from "@/server/src/Types/express";
import { buildFilter, filterSchema } from "@/server/src/trpc/routings/public/blueprint";
import type { Response } from "express";
import _ from "lodash";
import { z } from "zod";

export default function() {
	Router.post( ApiUrl( "mod/getblueprints" ), MW_Rest, async( req: ExpressRequest<{
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
			const totalBlueprints = await DB_Blueprints.count( filter );
			const blueprints: BlueprintData[] = [];
			for await ( const blueprint of DB_Blueprints.find( filter, { description: 0 }, { skip, limit, options } ) ) {
				const copy: BlueprintData = _.cloneDeep( blueprint.toJSON() );
				const owner = await DB_UserAccount.findById( blueprint.owner );
				if( owner ) {
					copy.owner = owner.username || "Unknown User";
				}
				if( copy.tags.length > 0 ) {
					const tags = await DB_Tags.find( { _id: { $in: copy.tags } } );
					// @ts-ignore
					copy.tags = tags.map( e => ( { DisplayName: e.DisplayName, _id: e._id.toString() } ) );
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


	Router.post( ApiUrl( "mod/gettags" ), MW_Rest, async( req: ExpressRequest, res: Response ) => {
		try {
			const tags = await DB_Tags.find();
			return res.json( { tags: tags.map( e => ( { _id: e._id.toString(), DisplayName: e.DisplayName } ) ) } );
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( e.message );
			}
		}

		return res.sendStatus( 500 );
	} );


	Router.post( ApiUrl( "mod/getblueprintpacks" ), MW_Rest, async( req: ExpressRequest<{
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
			const totalBlueprints = await DB_BlueprintPacks.count( filter );
			const blueprints: BlueprintPack[] = [];
			for await ( const blueprintPack of DB_BlueprintPacks.find( filter, { description: 0 }, { skip, limit, options } ) ) {
				const copy: BlueprintPack = _.cloneDeep( blueprintPack.toJSON() );
				const Blueprints = await DB_Blueprints.find( { _id: blueprintPack.blueprints } );
				const owner = await DB_UserAccount.findById( blueprintPack.owner );
				if( owner ) {
					copy.owner = owner.username || "Unknown User";
				}
				if( copy.tags.length > 0 ) {
					const tags = await DB_Tags.find( { _id: { $in: copy.tags } } );
					// @ts-ignore
					copy.tags = tags.map( e => ( { DisplayName: e.DisplayName, _id: e._id.toString() } ) );
				}
				if( Blueprints.length > 0 ) {
					// @ts-ignore
					copy.blueprints = Blueprints.map( e => ( { _id: e._id.toString(), name: e.name, iconData: e.iconData! } ) );
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

	Router.post( ApiUrl( "mod/authcheck" ), MW_Rest, MW_Rest_USER, async( req: ExpressRequest, res: Response ) => {
		return res.status( 200 ).json( { success: true } );
	} );
}

