import type { IAPIResponseBase } from "@shared/Types/API_Response";
import type { TApiPath }         from "@shared/Enum/EApiPath";
import { AUTHTOKEN }             from "@applib/constance";

export class API_QueryLib {
	static async PostToAPI<T extends IAPIResponseBase = IAPIResponseBase<any>, D = any>(
		Path : TApiPath,
		Data : D,
		ContentType? : "application/json" | "application/x-www-form-urlencoded" | "multipart/form-data"
	) : Promise<T> {
		const Token = window.localStorage.getItem( AUTHTOKEN );
		const requestOptions : RequestInit = {
			method: "POST",
			headers: {
				Authorization: "Bearer " + Token || "",
				"User-Agent": "Frontend"
			},
			body: Data instanceof FormData ? Data : JSON.stringify( Data )
		};

		if ( !( Data instanceof FormData ) ) {
			// @ts-ignore
			requestOptions.headers[ "Content-Type" ] = ContentType || "application/json";
		}

		let Response : IAPIResponseBase<T> = {
			Success: false,
			Auth: false,
			Reached: false,
			Data: undefined,
			MessageCode: "Api.error.NotReachable"
		} as T;

		try {
			const Resp : Response | void = await fetch(
				`/api/v1/${ Path }`,
				requestOptions
			).catch( console.error );
			if ( Resp ) {
				if ( Resp.ok && Resp.status === 200 ) {
					Response = ( await Resp.json() ) as IAPIResponseBase<T>;
					Response.Reached = true;
				}
			}
		}
		catch ( e ) {
			console.error( e );
		}

		return Response as T;
	}

	static async GetFromAPI<T extends IAPIResponseBase = IAPIResponseBase<any>, D = any>(
		Path : TApiPath,
		Data : D
	) : Promise<T> {
		const RequestData : string[] = [];

		if ( Data ) {
			if ( typeof Data === "object" && !Array.isArray( Data ) ) {
				for ( const [ Key, Value ] of Object.entries( Data ) ) {
					RequestData.push( `${ Key }=${ Value }` );
				}
			}
		}

		const Token = window.localStorage.getItem( AUTHTOKEN );
		const requestOptions : RequestInit = {
			method: "GET",
			headers: {
				Authorization: "Bearer " + Token || "",
				"User-Agent": "Frontend",
				"Content-Type": "application/json"
			}
		};

		let Response : IAPIResponseBase<T> = {
			Success: false,
			Auth: false,
			Reached: false,
			Data: undefined,
			MessageCode: "Api.error.NotReachable"
		} as T;

		try {
			const Resp : Response | void = await fetch(
				`/api/v1/${ Path }`,
				requestOptions
			).catch( console.error );
			if ( Resp ) {
				if ( Resp.ok && Resp.status === 200 ) {
					Response = ( await Resp.json() ) as IAPIResponseBase<T>;
					Response.Reached = true;
				}
			}
		}
		catch ( e ) {

		}

		return Response as T;
	}
}
