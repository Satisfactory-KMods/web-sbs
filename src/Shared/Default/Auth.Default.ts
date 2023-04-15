import { IMO_UserAccount }  from "../Types/MongoDB";
import { ERoles }           from "../Enum/ERoles";
import { IAPIResponseBase } from "../Types/API_Response";

export const DefaultUser : IMO_UserAccount = {
	__v: 0,
	_id: "123123",
	username: "Default User",
	email: "ychag@example.com",
	role: ERoles.member
};

export const DefaultResponseFailed : IAPIResponseBase = {
	Success: false,
	Auth: false,
	Reached: true,
	MessageCode: "Failed"
};

export const DefaultResponseSuccess : IAPIResponseBase = {
	Success: false,
	Auth: false,
	Reached: true,
	MessageCode: "Failed"
};