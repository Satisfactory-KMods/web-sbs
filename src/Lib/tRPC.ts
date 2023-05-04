import {
	createTRPCProxyClient,
	httpBatchLink,
	TRPCClientError
}                                 from "@trpc/client";
import type {
	AuthRouter,
	PublicRouter
}                                 from "@server/trpc/server";
import type { SweetAlertOptions } from "sweetalert2";
import Swal                       from "sweetalert2";
import { AUTHTOKEN }              from "@applib/constance";
import { transformer }            from "@shared/transformer";


export function fireSwalFromApi<PreConfirmResult = any>( message : string[] | string | undefined, success? : boolean, moreOptions? : SweetAlertOptions<PreConfirmResult> ) {
	if ( message && message.length >= 0 ) {
		return Swal.fire<PreConfirmResult>( {
			html: Array.isArray( message ) ? message.join( "<br />" ) : message,
			icon: success ? "success" : "error",
			showConfirmButton: false,
			timerProgressBar: true,
			timer: 3000,
			...moreOptions
		} );
	}
	return null;
}

export function fireToastFromApi<PreConfirmResult = any>( message : string[] | string | undefined, success? : boolean, moreOptions? : SweetAlertOptions<PreConfirmResult> ) {
	if ( message && message.length >= 0 ) {
		return Swal.fire( {
			position: "bottom-end",
			toast: true,
			html: Array.isArray( message ) ? message.join( "<br />" ) : message,
			icon: success ? "success" : "error",
			showConfirmButton: false,
			timerProgressBar: true,
			timer: 3000,
			...moreOptions
		} );
	}
	return null;
}


export const tRPC_token = () => window.localStorage.getItem( AUTHTOKEN ) || "";

export const tRPC_Public = createTRPCProxyClient<PublicRouter>( {
	transformer,
	links: [
		httpBatchLink( {
			url: "/api/v2/public"
		} )
	]
} );

export const tRPC_Auth = createTRPCProxyClient<AuthRouter>( {
	transformer,
	links: [
		httpBatchLink( {
			url: "/api/v2/auth",
			headers: () => {
				return {
					Authorization: `Bearer ${ tRPC_token() }`
				};
			}
		} )
	]
} );

export const tRPC_handleError = ( e : any, asToast? : boolean ) => {
	if ( e instanceof TRPCClientError ) {
		let message : string | string[] = e.message;
		try {
			const asArray : any[] = JSON.parse( e.message );
			message = asArray.map( msg => msg.message );
		}
		catch ( err ) {
		}

		if ( !asToast ) {
			fireSwalFromApi( message );
		}
		else {
			fireToastFromApi( message );
		}
	}
	else {
		fireToastFromApi( "Something goes wrong!" );
	}
};