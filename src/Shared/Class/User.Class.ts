import type { MO_UserAccount } from "@shared/Types/MongoDB";
import type { JwtPayload }     from "jsonwebtoken";
import jwt                from "jwt-decode";
import type { ERoles }         from "@shared/Enum/ERoles";
import { DefaultUser }    from "@shared/Default/Auth.Default";

export class User {
	private JsonWebToken;
	private UserData : MO_UserAccount & Partial<JwtPayload>;

	constructor( JsonWebToken : string ) {
		this.JsonWebToken = JsonWebToken;
		try {
			this.UserData = jwt( JsonWebToken );
		}
		catch ( e ) {
			this.UserData = {
				...DefaultUser
			};
		}
	}

	public setUserData( Data : MO_UserAccount ) {
		this.UserData = {
			...this.UserData,
			...Data
		};
	}

	public GetTimeLeft() {
		if ( this.UserData?.exp ) {
			return Math.max( this.UserData.exp - Date.now() / 1000, 0 );
		}
		return 0;
	}

	public get IsValid() {
		return this.GetTimeLeft() > 0;
	}

	public get Get() {
		return this.UserData;
	}

	public GetUserImage() {
		return this.IsValid ? "/images/default/unknown.png" : "/images/default/unknown.png";
	}

	public HasPermssion( Permssion : ERoles ) {
		return this.UserData.role >= Permssion && this.IsValid;
	}
}