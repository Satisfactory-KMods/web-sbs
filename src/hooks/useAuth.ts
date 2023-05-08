import { useContext }      from "react";
import { useLocalStorage } from "@kyri123/k-reactutils";
import { AUTHTOKEN }       from "@applib/constance";
import AuthContext         from "@context/AuthContext";
import { useNavigate }     from "react-router-dom";
import {
	fireSwalFromApi,
	tRPC_Auth,
	tRPC_handleError
}                          from "@applib/tRPC";

export function useAuth() {
	const navigate = useNavigate();
	const { Storage, SetStorage, ResetStorage } = useLocalStorage( AUTHTOKEN, "" );
	const { loggedIn, user } = useContext( AuthContext );

	const logout = () => {
		tRPC_Auth.logout.mutate().then( msg => {
			ResetStorage();
			fireSwalFromApi( msg, true );
		} ).catch( tRPC_handleError );
		navigate( 0 );
	};

	const setToken = ( token : string ) => {
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