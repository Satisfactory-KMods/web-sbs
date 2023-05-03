import { useContext }      from "react";
import { useLocalStorage } from "@kyri123/k-reactutils";
import { API_QueryLib }    from "@applib/Api/API_Query.Lib";
import { EApiAuth }        from "@shared/Enum/EApiPath";
import { AUTHTOKEN }       from "@applib/constance";
import AuthContext         from "@context/AuthContext";
import { useNavigate }     from "react-router-dom";

export function useAuth() {
	const navigate = useNavigate();
	const { Storage, SetStorage, ResetStorage } = useLocalStorage( AUTHTOKEN, "" );
	const { loggedIn, user } = useContext( AuthContext );

	const logout = () => {
		ResetStorage();
		Promise.all( [
			API_QueryLib.FireSwal( "Auth.success.logout" ),
			API_QueryLib.PostToAPI( EApiAuth.logout, { Storage } )
		] ).then();
		navigate( 0 );
	};

	const setToken = ( token : string ) => {
		SetStorage( token );
		Promise.all( [
			API_QueryLib.FireSwal( "Auth.success.logout" )
		] ).then();
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