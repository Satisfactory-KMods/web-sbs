import { ApiUrl }   from "../../Lib/Express.Lib";
import { EApiAuth } from "../../../../src/Shared/Enum/EApiPath";
import {
	Request,
	Response
}                   from "express";

export default function() {
	Api.get( ApiUrl( EApiAuth.validate ), ( req : Request, res : Response ) => {


		res.status( 200 ).json( {} );
	} );
}