import { ApiUrl }   from "../../Lib/Express.Lib";
import { EApiAuth } from "../../../../src/Shared/Enum/EApiPath";
import {
	NextFunction,
	Request,
	Response
}                   from "express";

export default function() {
	Api.get( ApiUrl( EApiAuth.validate ), ( req : Request, res : Response, next : NextFunction ) => {


		res.status( 200 ).json( {} );
	} );
}