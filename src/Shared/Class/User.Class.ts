import { IMO_UserAccount } from "../Types/MongoDB";
import { JwtPayload }      from "jsonwebtoken";
import jwt                 from "jwt-decode";

export class User {
	private JsonWebToken;
	private UserData : IMO_UserAccount & Partial<JwtPayload>;

	constructor( JsonWebToken : string ) {
		this.JsonWebToken = JsonWebToken;
		this.UserData = jwt( JsonWebToken );
	}

	public setUserData( Data : IMO_UserAccount ) {
		this.UserData = {
			...this.UserData,
			...Data
		};
	}

	public GetTimeLeft() {
		if ( this.UserData.exp ) {
			return Math.max( this.UserData.exp - Date.now(), 0 );
		}
		return 0;
	}

	public get IsValid() {
		return this.GetTimeLeft() > 0;
	}

	public get Get() {
		return this.UserData;
	}
}