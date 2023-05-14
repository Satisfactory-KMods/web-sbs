import type {
	Request
} from "express";

export type ExpressRequest<ReqBody, ReqQuery = any> = Request<core.ParamsDictionary, any, ReqBody, ReqQuery>;