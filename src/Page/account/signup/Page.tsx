import type {
	FormEvent,
	FunctionComponent
}                                     from "react";
import {
	useContext,
	useState
}                                     from "react";
import LangContext                    from "@context/LangContext";
import FloatInput                     from "@comp/Boostrap/FloatInput";
import { Link }                       from "react-router-dom";
import { usePageTitle }               from "@kyri123/k-reactutils";
import { API_QueryLib }               from "@applib/Api/API_Query.Lib";
import type { TResponse_Auth_SignUp } from "@shared/Types/API_Response";
import { EApiAuth }                   from "@shared/Enum/EApiPath";
import LoadingButton                  from "@comp/Boostrap/LoadingButton";
import { useAuth }                    from "@hooks/useAuth";


const Component : FunctionComponent = () => {
	const { setToken } = useAuth();
	const { Lang } = useContext( LangContext );
	usePageTitle( `SBS - ${ Lang.Auth.Signup }` );

	const [ IsSending, setIsSending ] = useState( false );

	const [ Login, setLogin ] = useState( "" );
	const [ EMail, setEMail ] = useState( "" );
	const [ Password, setPassword ] = useState( "" );
	const [ RepeatPassword, setRepeatPassword ] = useState( "" );

	const handleSubmit = async( e : FormEvent<HTMLFormElement> ) => {
		e.preventDefault();
		setIsSending( true );
		const Data = new FormData();
		Data.append( "Login", Login );
		Data.append( "EMail", EMail );
		Data.append( "Password", Password );
		Data.append( "RepeatPassword", RepeatPassword );
		const Result = await API_QueryLib.PostToAPI<TResponse_Auth_SignUp>( EApiAuth.signup, Data );

		if ( Result.Success && Result.Auth && Result.Data ) {
			setToken( Result.Data.Token );
		}

		setIsSending( false );
	};

	return (
		<div className={ "d-flex h-100 justify-content-center" }>
			<form onSubmit={ handleSubmit }
			      className={ "align-self-center w-100 max-w-lg bg-gray-800 p-4 border rounded-4" }>
				<h3 className={ "m-0" }>{ Lang.Auth.Signup }</h3>
				<hr/>
				<FloatInput type="text" onChange={ E => setLogin( E.target.value ) } value={ Login }
				            className={ "mb-3" }>{ Lang.Auth.Username }</FloatInput>
				<FloatInput type="email" onChange={ E => setEMail( E.target.value ) } value={ EMail }
				            className={ "mb-3" }>{ Lang.Auth.Email }</FloatInput>
				<FloatInput type="password" onChange={ E => setPassword( E.target.value ) } value={ Password }
				            className={ "mb-3" }>{ Lang.Auth.Password }</FloatInput>
				<FloatInput type="password" onChange={ E => setRepeatPassword( E.target.value ) }
				            value={ RepeatPassword }>{ Lang.Auth.PasswordAgain }</FloatInput>
				<hr/>
				<div className={ "d-flex" }>
					<LoadingButton IsLoading={ IsSending } className={ "w-100 flex-1 me-1" } variant="success"
					               type={ "submit" }>{ Lang.Auth.Signup }</LoadingButton>
					<Link className={ "w-100 flex-1 ms-1 btn btn-primary" }
					      to={ "/account/signin" }>{ Lang.Auth.Signin }</Link>
				</div>
			</form>
		</div>
	);
};

export {
	Component
};
