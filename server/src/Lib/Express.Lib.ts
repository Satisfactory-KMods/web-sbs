import { TApiPath } from "../../../src/Shared/Enum/EApiPath";
import {
	NextFunction,
	Request,
	Response
}                   from "express";
import { ERoles }   from "../../../src/Shared/Enum/ERoles";

type ExpressRequest = { req : Request, res : Response, next : NextFunction };

export function ApiUrl( Url : TApiPath ) {
	const EndUrl = `/api/v1/${ Url }`;
	SystemLib.Log( "[URL] Routing registered:", EndUrl );
	return EndUrl;
}

export async function MW_Auth( { req, res, next } : ExpressRequest ) {
	next();
}

export async function MW_Permission( { req, res, next } : ExpressRequest, Permission : ERoles ) {
	next();
}