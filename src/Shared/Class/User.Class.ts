import type { UserSession } from '@server/Lib/Session.Lib';
import type { UserAccount } from '@server/MongoDB/MongoUserAccount';
import { DefaultUser } from '@shared/Default/Auth.Default';
import type { ERoles } from '@shared/Enum/ERoles';
import { jwtDecode as jwt } from 'jwt-decode';

export class User {
	public JsonWebToken;
	private user: UserSession;

	constructor(JsonWebToken: string) {
		this.JsonWebToken = JsonWebToken;
		try {
			this.user = jwt(JsonWebToken);
		} catch (e) {
			this.user = {
				...DefaultUser
			};
		}
	}

	public setuser(Data: UserAccount) {
		this.user = {
			...this.user,
			...Data
		};
	}

	public GetTimeLeft() {
		if (this.user?.exp) {
			return Math.max(this.user.exp - Date.now() / 1000, 0);
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
		return this.IsValid ? '/images/default/unknown.png' : '/images/default/unknown.png';
	}

	public HasPermission(Permssion: ERoles) {
		return this.user.role >= Permssion && this.IsValid;
	}
}
