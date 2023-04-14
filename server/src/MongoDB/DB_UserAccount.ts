import * as mongoose       from "mongoose";
import { Model }           from "mongoose";
import { IMO_UserAccount } from "../../../src/Shared/Types/MongoDB";
import * as crypto         from "crypto";

export interface IUserAccountMethods {
	setPassword : ( password : string ) => void;
	validPassword : ( password : string ) => boolean;
}

const UserAccountSchema = new mongoose.Schema<IMO_UserAccount>( {
	username: { type: String, required: true },
	email: { type: String, required: true },
	role: { type: Number, required: true },
	hash: { type: String, required: true },
	salt: { type: String, required: true }
}, { timestamps: true } );

UserAccountSchema.methods.setPassword = function( password ) {
	this.salt = crypto.randomBytes( 16 ).toString( "hex" );
	this.hash = crypto.pbkdf2Sync( password, this.salt, 1000, 256, `sha512` ).toString( `hex` );
};

UserAccountSchema.methods.validPassword = function( password ) {
	const hash = crypto.pbkdf2Sync( password, this.salt, 1000, 256, `sha512` ).toString( `hex` );
	return this.hash === hash;
};

export default mongoose.model<IMO_UserAccount, Model<IMO_UserAccount, any, IUserAccountMethods>>( "SBS_UserAccount", UserAccountSchema );
export { UserAccountSchema };