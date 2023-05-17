import MongoSessionToken from "@server/MongoDB/MongoSessionToken";
import type {
	ClientUserAccount,
	UserAccount
} from "@server/MongoDB/MongoUserAccount";
import type { JwtPayload } from "jsonwebtoken";
import * as jwt from "jsonwebtoken";


export type UserSession = ClientUserAccount & Partial<JwtPayload>;

export async function CreateSession( User: Partial<UserAccount>, stayLoggedIn = false ): Promise<string | undefined> {
	delete User.salt;
	delete User.hash;
	try {
		const Token = jwt.sign( User, process.env.JWTToken || "", {
			expiresIn: stayLoggedIn ? "28d" : "1d"
		} );
		const Decoded = jwt.verify( Token, process.env.JWTToken || "" ) as jwt.JwtPayload;
		if( Decoded ) {
			await MongoSessionToken.deleteMany( { expire: { $lte: new Date() } } );
			const session = await MongoSessionToken.create( {
				token: Token,
				userid: User._id,
				expire: new Date( ( Decoded.exp || 0 ) * 1000 )
			} );
			return session.token;
		}
	} catch( e ) {
		if( e instanceof Error ) {
			SystemLib.LogError( "api", e.message );
		}
	}
	return undefined;
}
