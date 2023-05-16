import type {
	Request
} from "express";

export type ExpressRequest<ReqBody = any, ReqQuery = any> = Request<core.ParamsDictionary, any, ReqBody, ReqQuery>;