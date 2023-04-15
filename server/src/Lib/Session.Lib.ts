import { IMO_UserAccount } from "../../../src/Shared/Types/MongoDB";
import DB_SessionToken     from "../MongoDB/DB_SessionToken";
import * as jwt            from "jsonwebtoken";

export async function CreateSession( User : Partial<IMO_UserAccount> ) : Promise<string | undefined> {
	delete User.__v;
	delete User.salt;
	delete User.hash;
	try {
		const Token = jwt.sign( User, process.env.JWTToken || "", {
			expiresIn: "7d"
		} );
		const Decoded = jwt.verify( Token, process.env.JWTToken || "" ) as jwt.JwtPayload;
		if ( Decoded ) {
			const session = await DB_SessionToken.create( {
				token: Token,
				userid: User._id,
				expire: Decoded.exp || 0
			} );
			return session.token;
		}
	}
	catch ( e ) {
		console.log( e, process.env.JWTToken );
	}
	return undefined;
}