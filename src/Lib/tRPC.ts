import { AUTHTOKEN } from "@applib/constance";
import type {
	AuthRouter,
	PublicRouter
} from "@server/trpc/server";
import { transformer } from "@shared/transformer";
import {
	TRPCClientError,
	createTRPCProxyClient,
	httpBatchLink
} from "@trpc/client";
import type { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";
import Swal from "sweetalert2";


export async function onConfirm<PreConfirmResult = any>( msg: string, moreOptions?: SweetAlertOptions<PreConfirmResult> ): Promise<boolean> {
	const accept = await fireSwalFromApi( msg, "question", {
		showConfirmButton: true,
		showCancelButton: true,
		confirmButtonText: "Ja",
		cancelButtonText: "Nein",
		timer: 5000,
		...moreOptions
	} );
	return !!accept?.isConfirmed;
}

export function successSwal( msg: string, toast?: boolean ) {
	if( toast ) {
		fireToastFromApi( msg, "success" );
		return msg;
	}
	fireSwalFromApi( msg, "success" );
	return msg;
}

export function successSwalAwait( msg: string, toast?: boolean ) {
	if( toast ) {
		return fireToastFromApi( msg, "success" );
	}
	return fireSwalFromApi( msg, "success" );
}

export function fireSwalFromApi<PreConfirmResult = any>( message: string[] | string | undefined, success?: boolean | SweetAlertIcon, moreOptions?: SweetAlertOptions<PreConfirmResult> ) {
	if( message && message.length >= 0 ) {
		return Swal.fire<PreConfirmResult>( {
			html: Array.isArray( message ) ? message.join( "<br />" ) : message,
			icon: typeof success === "string" ? success : ( success ? "success" : "error" ),
			showConfirmButton: false,
			timerProgressBar: true,
			timer: 3000,
			...moreOptions
		} );
	}
	return null;
}

export function fireToastFromApi<PreConfirmResult = any>( message: string[] | string | undefined, success?: boolean | SweetAlertIcon, moreOptions?: SweetAlertOptions<PreConfirmResult> ) {
	if( message && message.length >= 0 ) {
		return Swal.fire( {
			position: "bottom-end",
			toast: true,
			html: Array.isArray( message ) ? message.join( "<br />" ) : message,
			icon: typeof success === "string" ? success : ( success ? "success" : "error" ),
			showConfirmButton: false,
			timerProgressBar: true,
			timer: 3000,
			...moreOptions
		} );
	}
	return null;
}


export const tRPCToken = () => window.localStorage.getItem( AUTHTOKEN ) || "";

export const tRPCPublic = createTRPCProxyClient<PublicRouter>( {
	transformer,
	links: [
		httpBatchLink( {
			url: "/api/v2/public"
		} )
	]
} );

export const tRPCAuth = createTRPCProxyClient<AuthRouter>( {
	transformer,
	links: [
		httpBatchLink( {
			url: "/api/v2/auth",
			headers: () => ( {
				Authorization: `Bearer ${ tRPCToken() }`
			} )
		} )
	]
} );

export const tRPCHandleError = ( e: any, asToast?: boolean ) => {
	if( e instanceof TRPCClientError ) {
		let message: string | string[] = e.message;
		try {
			const asArray: any[] = JSON.parse( e.message );
			message = asArray.map( msg => msg.message );
		} catch( err ) {
		}

		if( !asToast ) {
			fireSwalFromApi( message );
		} else {
			fireToastFromApi( message );
		}
	} else {
		fireToastFromApi( "Something goes wrong!" );
	}
};
