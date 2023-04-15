import { ApiUrl }                 from "../../Lib/Express.Lib";
import { EApiBlueprint }          from "../../../../src/Shared/Enum/EApiPath";
import {
	Request,
	Response
}                                 from "express";
import { DefaultResponseSuccess } from "../../../../src/Shared/Default/Auth.Default";
import {
	TRequest_BP_Get,
	TRequest_BP_Num
}                                 from "../../../../src/Shared/Types/API_Request";
import {
	TResponse_BP_Get,
	TResponse_BP_Num
}                                 from "../../../../src/Shared/Types/API_Response";
import DB_Blueprints              from "../../MongoDB/DB_Blueprints";

export default function() {
	Api.post( ApiUrl( EApiBlueprint.get ), async( req : Request, res : Response ) => {
		const Response : TResponse_BP_Get = {
			...DefaultResponseSuccess,
			Data: []
		};

		const Request : TRequest_BP_Get = req.body;

		try {
			Response.Data = await DB_Blueprints.find( {
				...Request.Filter,
				blacklisted: { $ne: true }
			}, null, Request.Options );
		}
		catch ( e ) {
		}

		res.json( {
			...Response
		} );
	} );

	Api.post( ApiUrl( EApiBlueprint.num ), async( req : Request, res : Response ) => {
		const Response : TResponse_BP_Num = {
			...DefaultResponseSuccess,
			Data: 0
		};

		const Request : TRequest_BP_Num = req.body;

		try {
			Response.Data = Number( await DB_Blueprints.countDocuments( Request.Filter, Request.Options ) );
		}
		catch ( e ) {
		}

		res.json( {
			...Response
		} );
	} );

}