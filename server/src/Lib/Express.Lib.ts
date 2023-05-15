import { BlueprintClass } from "@/server/src/Lib/Blueprint.Class";
import type { BlueprintData } from "@/server/src/MongoDB/DB_Blueprints";
import type { ExpressRequest } from "@/server/src/Types/express";
import type { EApiBlueprintUtils } from "@/src/Shared/Enum/EApiPath";
import { errorResponse } from "@kyri123/lib";
import DB_SessionToken from "@server/MongoDB/DB_SessionToken";
import { User } from "@shared/Class/User.Class";
import type { ERoles } from "@shared/Enum/ERoles";
import type {
	NextFunction,
	Request,
	Response
} from "express";
import * as jwt from "jsonwebtoken";
import _ from "lodash";
import multer from "multer";
import path from "path";

export function ApiUrl( Url: EApiBlueprintUtils | string ) {
	const EndUrl = `/api/v1/${ Url }`;
	SystemLib.Log( "URL", "Routing registered:", SystemLib.ToBashColor( "Red" ), EndUrl );
	return EndUrl;
}

export async function MW_Auth( req: Request, res: Response, next: NextFunction ) {
	const AuthHeader = req.headers[ "authorization" ];
	let Token: string | undefined = undefined;
	try {
		Token = AuthHeader && AuthHeader.split( " " )[ 1 ].replaceAll( "\"", "" );
	} catch( e ) {
	}

	if( Token ) {
		try {
			const Result = jwt.verify( Token, process.env.JWTToken as string );
			if( typeof Result === "object" ) {
				const UserData = new User( Token );
				const Session = await DB_SessionToken.findOne( { token: Token, userid: UserData.Get._id } );
				if( Session ) {
					req.body.UserClass = UserData;
					next();
					return;
				}
			}
		} catch( e ) {
		}
	}
	return res.status( 401 ).json( errorResponse( "Unauthorized", res ) );
}

export async function MW_Permission( req: Request, res: Response, next: NextFunction, Permission: ERoles ) {
	if( req.body.UserClass && req.body.UserClass.HasPermission( Permission ) ) {
		next();
		return;
	}
	return res.status( 401 ).json( errorResponse( "Unauthorized", res ) );
}

export async function MW_Blueprint( req: ExpressRequest<{
	blueprint: Omit<BlueprintData, "_id" | "__v">,
	blueprintName: string,
	blueprintId: string | BlueprintClass<true>,
	UserClass?: User
}>, res: Response, next: NextFunction ) {
	if( req.body.blueprintName && req.body.blueprint && req.body.blueprintId && typeof req.body.blueprintId === "string" ) {
		const server = await BlueprintClass.createClass( req.body.blueprintId );
		if( server && req.body.UserClass ) {
			if( server.isOwner( req.body.UserClass?.Get._id ) ) {
				req.body.blueprintId = server;
				return next();
			}
		}
	}
	return res.status( 401 ).json( errorResponse( "Unauthorized", res ) );
}

export async function MW_Rest( req: Request, res: Response, next: NextFunction ) {
	const apiKey = req.header( 'x-api-key' );
	if( _.isEqual( apiKey, process.env.APIKey ) && process.env.APIKey ) {
		return next();
	} else if( !process.env.APIKey ) {
		SystemLib.LogFatal( "MOD", "No API Key provided" );
	}
	return res.status( 401 ).json( errorResponse( "Unauthorized", res ) );
}

export const upload = multer( {
	dest: path.join( __MountDir, "tmp" ),
} );