import { IMO_UserAccount } from "../Types/MongoDB";
import { ERoles }          from "../Enum/ERoles";

export const DefaultUser : IMO_UserAccount = {
	__v: 0,
	_id: "123123",
	username: "Default User",
	email: "ychag@example.com",
	role: ERoles.member
};