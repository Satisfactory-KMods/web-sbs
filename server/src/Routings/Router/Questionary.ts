import {
	ApiUrl,
	MW_Auth,
	MW_Permission
} from "@server/Lib/Express.Lib";
import DB_BlueprintPacks from "@server/MongoDB/DB_BlueprintPacks";
import DB_Blueprints from "@server/MongoDB/DB_Blueprints";
import DB_Mods from "@server/MongoDB/DB_Mods";
import DB_Tags from "@server/MongoDB/DB_Tags";
import DB_UserAccount from "@server/MongoDB/DB_UserAccount";
import { DefaultResponseSuccess } from "@shared/Default/Auth.Default";
import { EApiQuestionary } from "@shared/Enum/EApiPath";
import { ERoles } from "@shared/Enum/ERoles";
import type { TRequest_BP_Questionary } from "@shared/Types/API_Request";
import type { TResponse_BP_Questionary } from "@shared/Types/API_Response";
import type {
	Request,
	Response
} from "express";

export default function() {
	Router.post( ApiUrl( EApiQuestionary.blueprintpack ), async( req: Request, res: Response ) => {
		const Response: TResponse_BP_Questionary = {
			...DefaultResponseSuccess,
			Data: []
		};

		const Request: TRequest_BP_Questionary = req.body;

		try {
			Response.Data = await DB_BlueprintPacks.find( {
				blacklisted: { $ne: true },
				...Request.Filter
			}, null, Request.Options );
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
		}

		res.json( {
			...Response
		} );
	} );

	Router.post( ApiUrl( EApiQuestionary.blueprints ), async( req: Request, res: Response ) => {
		const Response: TResponse_BP_Questionary = {
			...DefaultResponseSuccess,
			Data: []
		};

		const Request: TRequest_BP_Questionary = req.body;

		try {
			Response.Data = await DB_Blueprints.find( {
				blacklisted: { $ne: true },
				...Request.Filter
			}, null, Request.Options );
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
		}

		res.json( {
			...Response
		} );
	} );

	Api.post( ApiUrl( EApiQuestionary.num ), async( req: Request, res: Response ) => {
		const Response: TResponse_BP_Questionary = {
			...DefaultResponseSuccess,
			Data: 0
		};

		const Request: TRequest_BP_Questionary = req.body;

		try {
			Response.Data = Number( await DB_Blueprints.countDocuments( Request.Filter, Request.Options ) );
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
		}

		res.json( {
			...Response
		} );
	} );


	Api.post( ApiUrl( EApiQuestionary.tags ), async( req: Request, res: Response ) => {
		const Response: TResponse_BP_Questionary = {
			...DefaultResponseSuccess,
			Data: 0
		};

		const Request: TRequest_BP_Questionary = req.body;

		try {
			Response.Data = await DB_Tags.find( {
				...Request.Filter
			}, null, Request.Options );
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
		}

		res.json( {
			...Response
		} );
	} );


	Api.post( ApiUrl( EApiQuestionary.mods ), async( req: Request, res: Response ) => {
		const Response: TResponse_BP_Questionary = {
			...DefaultResponseSuccess,
			Data: 0
		};

		const Request: TRequest_BP_Questionary = req.body;

		try {
			Response.Data = await DB_Mods.find( {
				...Request.Filter
			}, null, Request.Options );
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
		}

		res.json( {
			...Response
		} );
	} );


	Api.post( ApiUrl( EApiQuestionary.users ), MW_Auth, ( req, res, next ) => MW_Permission( req, res, next, ERoles.admin ), async( req: Request, res: Response ) => {
		const Response: TResponse_BP_Questionary = {
			...DefaultResponseSuccess,
			Data: 0
		};

		const Request: TRequest_BP_Questionary = req.body;

		try {
			Response.Data = await DB_UserAccount.find( {
				...Request.Filter
			}, null, Request.Options );
		} catch( e ) {
			if( e instanceof Error ) {
				SystemLib.LogError( "api", e.message );
			}
		}

		res.json( {
			...Response
		} );
	} );
}