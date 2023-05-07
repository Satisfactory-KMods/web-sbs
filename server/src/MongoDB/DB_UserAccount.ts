import * as mongoose      from "mongoose";
import * as crypto        from "crypto";
import { ERoles }         from "@shared/Enum/ERoles";
import type { MongoBase } from "@server/Types/mongo";
import { z }              from "zod";

const ZodUserAccountSchema = z.object( {
	role: z.nativeEnum( ERoles ),
	username: z.string(),
	email: z.string(),
	hash: z.string(),
	salt: z.string()
} );

export interface UserAccountMethods {
	setPassword : ( password : string ) => void;
	validPassword : ( password : string ) => boolean;
}

const UserAccountSchema = new mongoose.Schema( {
	username: { type: String, required: true },
	email: { type: String, required: true },
	role: { type: Number, required: true },
	hash: { type: String, required: true },
	salt: { type: String, required: true }
}, {
	timestamps: true, methods: {
		setPassword: function( password ) {
			this.salt = crypto.randomBytes( 16 ).toString( "hex" );
			this.hash = crypto.pbkdf2Sync( password, this.salt, 1000, 256, `sha512` ).toString( `hex` );
		},
		validPassword: function( password ) {
			const hash = crypto.pbkdf2Sync( password, this.salt!, 1000, 256, `sha512` ).toString( `hex` );
			return this.hash === hash;
		}
	}
} );

export type UserAccount = z.infer<typeof ZodUserAccountSchema> & MongoBase
export type ClientUserAccount = Omit<UserAccount, "hash" | "salt" | "__v">;

export default mongoose.model<UserAccount, mongoose.Model<UserAccount, any, UserAccountMethods>>( "SBS_UserAccount", UserAccountSchema );
export { UserAccountSchema };