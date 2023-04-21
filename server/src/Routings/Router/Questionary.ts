import {
	ApiUrl,
	MW_Auth,
	MW_Permission
}                                   from "../../Lib/Express.Lib";
import { EApiQuestionary }          from "../../../../src/Shared/Enum/EApiPath";
import {
	Request,
	Response
}                                   from "express";
import { DefaultResponseSuccess }   from "../../../../src/Shared/Default/Auth.Default";
import { TRequest_BP_Questionary }  from "../../../../src/Shared/Types/API_Request";
import { TResponse_BP_Questionary } from "../../../../src/Shared/Types/API_Response";
import DB_Blueprints                from "../../MongoDB/DB_Blueprints";
import DB_Tags                      from "../../MongoDB/DB_Tags";
import DB_UserAccount               from "../../MongoDB/DB_UserAccount";
import { ERoles }                   from "../../../../src/Shared/Enum/ERoles";
import DB_Mods                      from "../../MongoDB/DB_Mods";

export default function() {
	Router.post( ApiUrl( EApiQuestionary.blueprints ), async( req : Request, res : Response ) => {
		const Response : TResponse_BP_Questionary = {
			...DefaultResponseSuccess,
			Data: []
		};

		const Request : TRequest_BP_Questionary = req.body;

		try {
			Response.Data = await DB_Blueprints.find( {
				blacklisted: { $ne: true },
				...Request.Filter
			}, null, Request.Options );
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

	Api.post( ApiUrl( EApiQuestionary.num ), async( req : Request, res : Response ) => {
		const Response : TResponse_BP_Questionary = {
			...DefaultResponseSuccess,
			Data: 0
		};

		const Request : TRequest_BP_Questionary = req.body;

		try {
			Response.Data = Number( await DB_Blueprints.countDocuments( Request.Filter, Request.Options ) );
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


	Api.post( ApiUrl( EApiQuestionary.tags ), async( req : Request, res : Response ) => {
		const Response : TResponse_BP_Questionary = {
			...DefaultResponseSuccess,
			Data: 0
		};

		const Request : TRequest_BP_Questionary = req.body;

		try {
			Response.Data = await DB_Tags.find( {
				...Request.Filter
			}, null, Request.Options );
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


	Api.post( ApiUrl( EApiQuestionary.mods ), async( req : Request, res : Response ) => {
		const Response : TResponse_BP_Questionary = {
			...DefaultResponseSuccess,
			Data: 0
		};

		const Request : TRequest_BP_Questionary = req.body;

		try {
			Response.Data = await DB_Mods.find( {
				...Request.Filter
			}, null, Request.Options );
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


	Api.post( ApiUrl( EApiQuestionary.users ), MW_Auth, ( req, res, next ) => MW_Permission( req, res, next, ERoles.admin ), async( req : Request, res : Response ) => {
		const Response : TResponse_BP_Questionary = {
			...DefaultResponseSuccess,
			Data: 0
		};

		const Request : TRequest_BP_Questionary = req.body;

		try {
			Response.Data = await DB_UserAccount.find( {
				...Request.Filter
			}, null, Request.Options );
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