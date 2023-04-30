import type { MO_UserAccount }   from "@shared/Types/MongoDB";
import { ERoles }           from "@shared/Enum/ERoles";
import type { IAPIResponseBase } from "@shared/Types/API_Response";

export const DefaultUser : MO_UserAccount = {
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
	MessageCode: "Api.error.Failed"
};

export const DefaultResponseSuccess : IAPIResponseBase = {
	Success: true,
	Auth: false,
	Reached: true
};