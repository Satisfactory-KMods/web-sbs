/** @type {import("mongoose").Model} */
import type { MongoBase } from "@server/Types/mongo";
import { ERoles } from "@shared/Enum/ERoles";
import * as crypto from "crypto";
import * as mongoose from "mongoose";
import { z } from "zod";


const ZodUserAccountSchema = z.object( {
	role: z.nativeEnum( ERoles ),
	username: z.string(),
	email: z.string(),
	apiKey: z.string().optional(),
	hash: z.string(),
	salt: z.string()
} );

export interface UserAccountMethods {
	setPassword: ( password: string ) => void;
	validPassword: ( password: string ) => boolean;
	createKey: () => Promise<string>;
}

const UserAccountSchema = new mongoose.Schema( {
	username: { type: String, required: true },
	email: { type: String, required: true },
	role: { type: Number, required: true },
	hash: { type: String, required: true },
	salt: { type: String, required: true },
	apiKey: { type: String, required: false }
}, {
	timestamps: true,
	methods: {
		setPassword: function( password ) {
			this.salt = crypto.randomBytes( 16 ).toString( "hex" );
			this.hash = crypto.pbkdf2Sync( password, this.salt, 1000, 256, `sha512` ).toString( `hex` );
		},
		validPassword: function( password ) {
			const hash = crypto.pbkdf2Sync( password, this.salt!, 1000, 256, `sha512` ).toString( `hex` );
			return this.hash === hash;
		},
		createKey: async function(  ) {
			if( !this.apiKey ) {
				const key = this._id.toHexString() + crypto.randomBytes( 6 ).toString( "hex" );
				this.apiKey = key;
				this.markModified( "apiKey" );
				await this.save();
				return key;
			}
			return this.apiKey;
		}
	}
} );
export type UserAccount = z.infer<typeof ZodUserAccountSchema> & MongoBase;
export type ClientUserAccount = Omit<UserAccount, "hash" | "salt" | "__v">;

const Model = mongoose.model<UserAccount, mongoose.Model<UserAccount, unknown, UserAccountMethods>>( "SBS_UserAccount", UserAccountSchema );

export default Model;
export { UserAccountSchema };

