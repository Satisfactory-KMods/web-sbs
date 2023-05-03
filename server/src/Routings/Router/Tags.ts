import {
	ApiUrl,
	MW_Auth,
	MW_Permission
}                                     from "@server/Lib/Express.Lib";
import { EApiTags }                   from "@shared/Enum/EApiPath";
import type {
	Request,
	Response
}                                     from "express";
import {
	DefaultResponseFailed,
	DefaultResponseSuccess
}                                     from "@shared/Default/Auth.Default";
import type { TRequest_Tags_Modify }  from "@shared/Types/API_Request";
import type { TResponse_Tags_Modify } from "@shared/Types/API_Response";
import { ERoles }                     from "@shared/Enum/ERoles";
import DB_Tags                        from "@server/MongoDB/DB_Tags";
import DB_Blueprints                  from "@server/MongoDB/DB_Blueprints";

export default function() {
	Router.post( ApiUrl( EApiTags.modifytag ), MW_Auth, ( req, res, next ) => MW_Permission( req, res, next, ERoles.admin ), async( req : Request, res : Response ) => {
		let Response : TResponse_Tags_Modify = {
			...DefaultResponseFailed
		};

		const Request : TRequest_Tags_Modify = req.body;

		try {
			if ( Request.Remove && Request.Id ) {
				const Document = ( await DB_Tags.findById( Request.Id ) )!;
				const ID = Document._id.toString();
				if ( await Document.deleteOne() ) {
					await DB_Blueprints.updateMany( {}, { $pull: { tags: ID } } );
					Response = {
						...DefaultResponseSuccess,
						MessageCode: "Tags.Delete.Success"
					};
				}
			}
			else if ( Request.Id && Request.Data ) {
				const Document = ( await DB_Tags.findById( Request.Id ) )!;

				delete Request.Data._id;

				if ( await Document.updateOne( Request.Data ) ) {
					Response = {
						...DefaultResponseSuccess,
						MessageCode: "Tags.Modify.Success"
					};
				}
			}
			else if ( !Request.Id && Request.Data ) {
				const Document = await DB_Tags.create( Request.Data );
				if ( Document ) {
					Response = {
						...DefaultResponseSuccess,
						MessageCode: "Tags.Create.Success"
					};
				}
			}
		}
		catch ( e ) {
			if ( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
		}

		res.json( {
			...Response
		} );
	} );
}