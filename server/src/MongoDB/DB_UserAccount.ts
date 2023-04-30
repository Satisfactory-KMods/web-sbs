import type { Model }          from "mongoose";
import * as mongoose           from "mongoose";
import type { MO_UserAccount } from "@shared/Types/MongoDB";
import * as crypto             from "crypto";

export interface IUserAccountMethods {
	setPassword : ( password : string ) => void;
	validPassword : ( password : string ) => boolean;
}

const UserAccountSchema = new mongoose.Schema<MO_UserAccount>( {
	username: { type: String, required: true },
	email: { type: String, required: true },
	role: { type: Number, required: true },
	hash: { type: String, required: true },
	salt: { type: String, required: true }
}, { timestamps: true } );

UserAccountSchema.methods.setPassword = function( password : string ) {
	this.salt = crypto.randomBytes( 16 ).toString( "hex" );
	this.hash = crypto.pbkdf2Sync( password, this.salt, 1000, 256, `sha512` ).toString( `hex` );
};

UserAccountSchema.methods.validPassword = function( password : string ) {
	const hash = crypto.pbkdf2Sync( password, this.salt, 1000, 256, `sha512` ).toString( `hex` );
	return this.hash === hash;
};

export default mongoose.model<MO_UserAccount, Model<MO_UserAccount, any, IUserAccountMethods>>( "SBS_UserAccount", UserAccountSchema );
export { UserAccountSchema };