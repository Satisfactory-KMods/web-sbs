import { TApiPath }              from "../../../src/Shared/Enum/EApiPath";
import {
	NextFunction,
	Request,
	Response
}                                from "express";
import { ERoles }                from "../../../src/Shared/Enum/ERoles";
import * as jwt                  from "jsonwebtoken";
import { DefaultResponseFailed } from "../../../src/Shared/Default/Auth.Default";
import { ResponseBase }          from "../../../src/Shared/Types/API_Response";
import { User }                  from "../../../src/Shared/Class/User.Class";
import DB_SessionToken           from "../MongoDB/DB_SessionToken";

export function ApiUrl( Url : TApiPath ) {
	const EndUrl = `/api/v1/${ Url }`;
	SystemLib.Log( "[URL] Routing registered:", SystemLib.ToBashColor( "Red" ), EndUrl );
	return EndUrl;
}

export async function MW_Auth( req : Request, res : Response, next : NextFunction ) {
	const Response : ResponseBase = {
		...DefaultResponseFailed,
		MessageCode: "Unauthorized"
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
			const UserData = new User( Token );
			const Session = await DB_SessionToken.findOne( { token: Token, userid: UserData.Get._id } );
			if ( Session ) {
				req.body.UserClass = UserData;
				next();
				return;
			}
		}
		catch ( e ) {
		}
	}
	res.json( Response );
}

export async function MW_Permission( req : Request, res : Response, next : NextFunction, Permission : ERoles ) {
	next();
}