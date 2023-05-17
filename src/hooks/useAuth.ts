import { AUTHTOKEN } from "@applib/constance";
import {
	fireSwalFromApi,
	tRPCAuth,
	tRPCHandleError
} from "@applib/tRPC";
import AuthContext from "@context/AuthContext";
import { useLocalStorage } from "@kyri123/k-reactutils";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";


export function useAuth() {
	const navigate = useNavigate();
	const { Storage, SetStorage, ResetStorage } = useLocalStorage( AUTHTOKEN, "" );
	const { loggedIn, user } = useContext( AuthContext );

	const logout = async( preventSwal?: boolean ) => tRPCAuth.logout.mutate().then( async msg => {
		ResetStorage();
		if( !preventSwal ) {
			await fireSwalFromApi( msg, true );
			navigate( 0 );
		}
	} ).catch( tRPCHandleError );

	const setToken = ( token: string ) => {
		SetStorage( token );
		navigate( 0 );
	};

	return {
		token: Storage,
		setToken,
		loggedIn,
		logout,
		user
	};
}
