import type { MO_UserAccount } from "@shared/Types/MongoDB";
import type { JwtPayload }     from "jsonwebtoken";
import jwt                     from "jwt-decode";
import type { ERoles }         from "@shared/Enum/ERoles";
import { DefaultUser }         from "@shared/Default/Auth.Default";

export class User {
	public JsonWebToken;
	private user : MO_UserAccount & Partial<JwtPayload>;

	constructor( JsonWebToken : string ) {
		this.JsonWebToken = JsonWebToken;
		try {
			this.user = jwt( JsonWebToken );
		}
		catch ( e ) {
			this.user = {
				...DefaultUser
			};
		}
	}

	public setuser( Data : MO_UserAccount ) {
		this.user = {
			...this.user,
			...Data
		};
	}

	public GetTimeLeft() {
		if ( this.user?.exp ) {
			return Math.max( this.user.exp - Date.now() / 1000, 0 );
		}
		return 0;
	}

	public get IsValid() {
		return this.GetTimeLeft() > 0;
	}

	public get Get() {
		return this.user;
	}

	public get GetUserImage() {
		return this.IsValid ? "/images/default/unknown.png" : "/images/default/unknown.png";
	}

	public HasPermssion( Permssion : ERoles ) {
		return this.user.role >= Permssion && this.IsValid;
	}
}