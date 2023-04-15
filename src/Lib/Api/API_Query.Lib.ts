import { IAPIResponseBase } from "../../Shared/Types/API_Response";
import { TApiPath }         from "../../Shared/Enum/EApiPath";
import withReactContent     from "sweetalert2-react-content";
import Swal                 from "sweetalert2";
import { GetApiMessage }    from "../lang/lang";

export class API_QueryLib {

	static async FireSwal( Code : string | undefined ) {
		const Message = GetApiMessage( Code );
		if ( Message ) {
			const MySwal = withReactContent( Swal );
			MySwal.fire( Message );
		}
	}

	static async PostToAPI<T extends IAPIResponseBase = IAPIResponseBase<any>, D = any>(
		Path : TApiPath,
		Data : D
	) : Promise<T> {
		const Token = window.localStorage.getItem( "session" );
		const requestOptions : RequestInit = {
			method: "POST",
			headers: {
				Authorization: "Bearer " + Token || "",
				"User-Agent": "Frontend",
				"Content-Type": "application/json"
			},
			body: JSON.stringify( Data )
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
