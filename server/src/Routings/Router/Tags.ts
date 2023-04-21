import {
	ApiUrl,
	MW_Auth,
	MW_Permission
}                                from "../../Lib/Express.Lib";
import { EApiTags }              from "../../../../src/Shared/Enum/EApiPath";
import {
	Request,
	Response
}                                from "express";
import {
	DefaultResponseFailed,
	DefaultResponseSuccess
}                                from "../../../../src/Shared/Default/Auth.Default";
import { TRequest_Tags_Modify }  from "../../../../src/Shared/Types/API_Request";
import { TResponse_Tags_Modify } from "../../../../src/Shared/Types/API_Response";
import { ERoles }                from "../../../../src/Shared/Enum/ERoles";
import DB_Tags                   from "../../MongoDB/DB_Tags";
import DB_Blueprints             from "../../MongoDB/DB_Blueprints";

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
				delete Request.Data.__v;

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
				SystemLib.LogError( e );
			}
		}

		res.json( {
			...Response
		} );
	} );
}