import type {
	FormEvent,
	FunctionComponent
}                                     from "react";
import { useState }                   from "react";
import { usePageTitle }               from "@kyri123/k-reactutils";
import FloatInput                     from "@comp/Boostrap/FloatInput";
import LoadingButton                  from "@comp/Boostrap/LoadingButton";
import { API_QueryLib }               from "@applib/Api/API_Query.Lib";
import type { TResponse_Auth_SignUp } from "@shared/Types/API_Response";
import type { TRequest_Auth_Modify }  from "@shared/Types/API_Request";
import { EApiAuth }                   from "@shared/Enum/EApiPath";
import { useAuth }                    from "@hooks/useAuth";

const Component : FunctionComponent = () => {
	const { user, logout } = useAuth();
	usePageTitle( `SBS - ${ Lang.Auth.AccSettings }` );

	const [ IsSending, setIsSending ] = useState( false );

	const [ Login, setLogin ] = useState( "" );
	const [ EMail, setEMail ] = useState( "" );
	const [ Password, setPassword ] = useState( "" );
	const [ RepeatPassword, setRepeatPassword ] = useState( "" );

	const handleSubmit = async( e : FormEvent<HTMLFormElement> ) => {
		e.preventDefault();

		console.log( "handleSubmit" );
		if ( ( Password !== "" || RepeatPassword !== "" ) && Password !== RepeatPassword && Password.length < 8 ) {
			await API_QueryLib.FireSwal( "Signup.error.password.invalid" );
			return;
		}
		else if ( Login !== "" && Login.length < 6 ) {
			await API_QueryLib.FireSwal( "Signup.error.username.invalid" );
			return;
		}
		else if ( EMail !== "" && !EMail.match( /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ ) ) {
			await API_QueryLib.FireSwal( "Signup.error.email.invalid" );
			return;
		}
		else if ( EMail === "" && Login === "" && Password === "" && RepeatPassword === "" ) {
			await API_QueryLib.FireSwal( "Signup.error.missingfield" );
			return;
		}
		setIsSending( true );

		const Data : TRequest_Auth_Modify = { UserID: user.Get._id, Data: {}, Remove: false };
		Password !== "" && ( Data.Data!.hash = Password );
		Login !== "" && ( Data.Data!.username = Password );
		EMail !== "" && ( Data.Data!.email = Password );

		await API_QueryLib.PostToAPI<TResponse_Auth_SignUp>( EApiAuth.modify, Data );
		logout();
		setIsSending( false );
	};

	return (
		<div className={ "d-flex h-100 justify-content-center" }>
			<form onSubmit={ handleSubmit }
			      className={ "align-self-center w-100 max-w-lg bg-gray-800 p-4 border rounded-4" }>
				<h3 className={ "m-0" }>{ Lang.Auth.AccSettings }</h3>
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
					               type={ "submit" }>{ Lang.Auth.Edit }</LoadingButton>
				</div>
			</form>
		</div>
	);
};

export {
	Component
};
