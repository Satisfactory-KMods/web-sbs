import { AUTHTOKEN } from "@applib/constance";
import type { EApiBlueprintUtils } from "@shared/Enum/EApiPath";
import superjson from 'superjson';

export class API_QueryLib {
	static async PostToAPI<T, D = any>(
		Path: EApiBlueprintUtils,
		Data: D,
		ContentType?: "application/json" | "application/x-www-form-urlencoded" | "multipart/form-data"
	): Promise<T | undefined> {
		const Token = window.localStorage.getItem( AUTHTOKEN );
		const requestOptions: RequestInit = {
			method: "POST",
			headers: {
				Authorization: "Bearer " + Token || "",
				"User-Agent": "Frontend"
			},
			body: Data instanceof FormData ? Data : JSON.stringify( Data )
		};

		if( !( Data instanceof FormData ) ) {
			// @ts-ignore
			requestOptions.headers[ "Content-Type" ] = ContentType || "application/json";
		}

		try {
			const Resp: Response | void = await fetch(
				`/api/v1/${ Path }`,
				requestOptions
			).catch( console.error );
			if( Resp ) {
				if( Resp.ok && Resp.status === 200 ) {
					Response = ( await Resp.json() ) as SuccessDataResponseFormat;
					return superjson.parse( Response.result.data ) as T;
				}
			}
		} catch( e ) {
			console.error( e );
		}

		return undefined;
	}

	static async GetFromAPI<T, D = any>(
		Path: EApiBlueprintUtils,
		Data: D
	): Promise<T> {
		const RequestData: string[] = [];

		if( Data ) {
			if( typeof Data === "object" && !Array.isArray( Data ) ) {
				for( const [ Key, Value ] of Object.entries( Data ) ) {
					RequestData.push( `${ Key }=${ Value }` );
				}
			}
		}

		const Token = window.localStorage.getItem( AUTHTOKEN );
		const requestOptions: RequestInit = {
			method: "GET",
			headers: {
				Authorization: "Bearer " + Token || "",
				"User-Agent": "Frontend",
				"Content-Type": "application/json"
			}
		};

		try {
			const Resp: Response | void = await fetch(
				`/api/v1/${ Path }`,
				requestOptions
			).catch( console.error );
			if( Resp ) {
				if( Resp.ok && Resp.status === 200 ) {
					Response = ( await Resp.json() ) as SuccessDataResponseFormat;
					return superjson.parse( Response.result.data ) as T;
				}
			}
		} catch( e ) {

		}

		return undefined;
	}
}
