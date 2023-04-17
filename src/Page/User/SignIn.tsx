import {
	FormEvent,
	FunctionComponent,
	useContext,
	useState
}                                from "react";
import LangContext               from "../../Context/LangContext";
import FloatInput                from "../../Components/Boostrap/FloatInput";
import { Link }                  from "react-router-dom";
import { usePageTitle }          from "@kyri123/k-reactutils";
import LoadingButton             from "../../Components/Boostrap/LoadingButton";
import { API_QueryLib }          from "../../Lib/Api/API_Query.Lib";
import { EApiAuth }              from "../../Shared/Enum/EApiPath";
import { TResponse_Auth_SignIn } from "../../Shared/Types/API_Response";
import AuthContext               from "../../Context/AuthContext";
import { useAuthCheck }          from "../../hooks/useAuthCheck";


const SignIn : FunctionComponent = () => {
	const { AuthCheckProps, AuthCheck } = useAuthCheck( { Auth: false, RedirectTo: "/" } );
	const { UpdateToken } = useContext( AuthContext );
	const { Lang } = useContext( LangContext );
	const [ IsSending, setIsSending ] = useState( false );
	usePageTitle( `SBS - ${ Lang.Auth.Signin }` );

	const [ Password, setPassword ] = useState( "" );
	const [ Login, setLogin ] = useState( "" );

	const handleSubmit = async( e : FormEvent<HTMLFormElement> ) => {
		e.preventDefault();
		setIsSending( true );
		const Data = new FormData();
		Data.append( "Login", Login );
		Data.append( "Password", Password );
		const Result = await API_QueryLib.PostToAPI<TResponse_Auth_SignIn>( EApiAuth.signin, Data );

		if ( Result.Success && Result.Auth && Result.Data ) {
			UpdateToken( Result.Data.Token );
		}

		setIsSending( false );
	};

	return (
		<AuthCheck { ...AuthCheckProps }>
			<div className={ "d-flex h-100 justify-content-center" }>
				<form onSubmit={ handleSubmit }
				      className={ "align-self-center w-100 max-w-lg bg-gray-800 p-4 border rounded-4" }>
					<h3>{ Lang.Auth.Signin }</h3>
					<hr/>
					<FloatInput type="text" onChange={ E => setLogin( E.target.value ) } value={ Login }
					            className={ "mb-3" }>{ Lang.Auth.Username } / { Lang.Auth.Email }</FloatInput>
					<FloatInput type="password" onChange={ E => setPassword( E.target.value ) }
					            value={ Password }>{ Lang.Auth.Password }</FloatInput>
					<hr/>
					<div className={ "d-flex" }>
						<LoadingButton IsLoading={ IsSending } className={ "w-100 flex-1 me-1" } variant="success"
						               type={ "submit" }>{ Lang.Auth.Signin }</LoadingButton>
						<Link className={ "w-100 flex-1 ms-1 btn btn-primary" }
						      to={ "/account/signup" }>{ Lang.Auth.Signup }</Link>
					</div>
				</form>
			</div>
		</AuthCheck>
	);
};

export default SignIn;
