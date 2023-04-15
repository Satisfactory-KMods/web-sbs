import {
	ApiUrl,
	MW_Auth
}                                 from "../../Lib/Express.Lib";
import { EApiTags }               from "../../../../src/Shared/Enum/EApiPath";
import {
	Request,
	Response
}                                 from "express";
import { DefaultResponseSuccess } from "../../../../src/Shared/Default/Auth.Default";
import { TRequest_Tags_Mods }     from "../../../../src/Shared/Types/API_Request";
import { TResponse_Tags_Mods }    from "../../../../src/Shared/Types/API_Response";
import DB_Mods                    from "../../MongoDB/DB_Mods";
import { FilterQuery }            from "mongoose";
import {
	IMO_Mod,
	IMO_Tag
}                                 from "../../../../src/Shared/Types/MongoDB";
import DB_Tags                    from "../../MongoDB/DB_Tags";

export default function() {
	Api.post( ApiUrl( EApiTags.mods ), MW_Auth, async( req : Request, res : Response ) => {
		const Response : TResponse_Tags_Mods = {
			...DefaultResponseSuccess,
			Data: []
		};

		const Request : TRequest_Tags_Mods = req.body;

		try {
			const SearchOptions : FilterQuery<IMO_Mod> = {};
			if ( Request.filter ) {
				SearchOptions.$or = [
					{ name: { $contains: Request.filter } },
					{ mod_reference: { $contains: Request.filter } }
				];
			}
			Response.Data = await DB_Mods.find( SearchOptions, Request.limit ? { limit: Request.limit } : {} );
		}
		catch ( e ) {
		}

		res.json( {
			...Response
		} );
	} );

	Api.post( ApiUrl( EApiTags.tags ), MW_Auth, async( req : Request, res : Response ) => {
		const Response : TResponse_Tags_Mods = {
			...DefaultResponseSuccess,
			Data: []
		};

		const Request : TRequest_Tags_Mods = req.body;

		try {
			const SearchOptions : FilterQuery<IMO_Tag> = {};
			if ( Request.filter ) {
				SearchOptions.$or = [
					{ DisplayName: { $contains: Request.filter } }
				];
			}
			Response.Data = await DB_Tags.find( SearchOptions, Request.limit ? { limit: Request.limit } : {} );
		}
		catch ( e ) {
		}

		res.json( {
			...Response
		} );
	} );
}