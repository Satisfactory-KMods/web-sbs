import {
	IAPIResponseBase,
	TResponse_BP_Questionary
}                                  from "../../Shared/Types/API_Response";
import { TApiPath }                from "../../Shared/Enum/EApiPath";
import withReactContent            from "sweetalert2-react-content";
import Swal                        from "sweetalert2";
import { GetApiMessage }           from "../lang/lang";
import { TRequest_BP_Questionary } from "../../Shared/Types/API_Request";

export class API_QueryLib {

	static async FireSwal( Code : string | undefined ) {
		const Message = GetApiMessage( Code );
		if ( Message ) {
			const MySwal = withReactContent( Swal );
			MySwal.fire( Message );
		}
	}

	static async Qustionary<T = any>(
		Path : TApiPath,
		Data : TRequest_BP_Questionary<T>,
		ContentType? : "application/json" | "application/x-www-form-urlencoded" | "multipart/form-data"
	) : Promise<TResponse_BP_Questionary<T[]>> {
		return API_QueryLib.PostToAPI<TResponse_BP_Questionary<T[]>, TRequest_BP_Questionary<T>>( Path, Data, ContentType );
	}

	static async PostToAPI<T extends IAPIResponseBase = IAPIResponseBase<any>, D = any>(
		Path : TApiPath,
		Data : D,
		ContentType? : "application/json" | "application/x-www-form-urlencoded" | "multipart/form-data"
	) : Promise<T> {
		const Token = window.localStorage.getItem( "session" );
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
			MessageCode: "ApiNotReachable"
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

		await this.FireSwal( Response.MessageCode );

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

		const Token = window.localStorage.getItem( "session" );
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
			MessageCode: "ApiNotReachable"
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

		await this.FireSwal( Response.MessageCode );

		return Response as T;
	}
}
