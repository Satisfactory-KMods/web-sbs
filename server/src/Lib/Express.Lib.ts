import type { TApiPath }         from "@shared/Enum/EApiPath";
import type {
	NextFunction,
	Request,
	Response
}                                from "express";
import type { ERoles }           from "@shared/Enum/ERoles";
import * as jwt                  from "jsonwebtoken";
import { DefaultResponseFailed } from "@shared/Default/Auth.Default";
import type { ResponseBase }     from "@shared/Types/API_Response";
import { User }                  from "@shared/Class/User.Class";
import DB_SessionToken           from "@server/MongoDB/DB_SessionToken";

export function ApiUrl( Url : TApiPath | string ) {
	const EndUrl = `/api/v1/${ Url }`;
	SystemLib.Log( "URL", "Routing registered:", SystemLib.ToBashColor( "Red" ), EndUrl );
	return EndUrl;
}

export async function MW_Auth( req : Request, res : Response, next : NextFunction ) {
	const Response : ResponseBase = {
		...DefaultResponseFailed,
		MessageCode: "Api.error.Unauthorized"
	};

	const AuthHeader = req.headers[ "authorization" ];
	let Token : string | undefined = undefined;
	try {
		Token = AuthHeader && AuthHeader.split( " " )[ 1 ].replaceAll( "\"", "" );
	}
	catch ( e ) {
	}

	if ( Token ) {
		try {
			const Result = jwt.verify( Token, process.env.JWTToken as string );
			if ( typeof Result === "object" ) {
				const UserData = new User( Token );
				const Session = await DB_SessionToken.findOne( { token: Token, userid: UserData.Get._id } );
				if ( Session ) {
					req.body.UserClass = UserData;
					next();
					return;
				}
			}
		}
		catch ( e ) {
		}
	}
	res.json( Response );
}

export async function MW_Permission( req : Request, res : Response, next : NextFunction, Permission : ERoles ) {
	const Response : ResponseBase = {
		...DefaultResponseFailed,
		MessageCode: "Api.error.Unauthorized"
	};
	if ( req.body.UserClass && req.body.UserClass.HasPermssion( Permission ) ) {
		next();
		return;
	}
	res.json( Response );
}