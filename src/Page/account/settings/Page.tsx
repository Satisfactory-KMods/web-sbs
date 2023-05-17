import {
	fireSwalFromApi,
	tRPCAuth,
	tRPCHandleError
} from "@applib/tRPC";
import { useAuth } from "@hooks/useAuth";
import { usePageTitle } from "@kyri123/k-reactutils";
import {
	Button,
	Label,
	TextInput
} from "flowbite-react";
import type {
	FormEvent,
	FunctionComponent
} from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Component: FunctionComponent = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [ isSending, setIsSending ] = useState( false );
	usePageTitle( `SBS - Sign Up` );

	const [ username, setUsername ] = useState( () => user.Get.username );
	const [ email, setEmail ] = useState( () => user.Get.email );
	const [ password, setPassword ] = useState( "" );
	const [ password2, setPassword2 ] = useState( "" );

	const handleSubmit = async( e: FormEvent<HTMLFormElement> ) => {
		e.preventDefault();

		if( password !== password2 ) {
			fireSwalFromApi( `Passwords do not match`, "warning" );
			return;
		}

		const sendData: any = {
			username,
			email,
			password
		};
		if( sendData.username.clearWs().length <= 0 ) {
			sendData.username = undefined;
		}
		if( sendData.email.clearWs().length <= 0 ) {
			sendData.email = undefined;
		}
		if( sendData.password.clearWs().length <= 0 ) {
			sendData.password = undefined;
		}

		setIsSending( true );
		const response = await tRPCAuth.updateAccount.mutate( sendData ).catch( tRPCHandleError );

		if( response ) {
			await logout( false );
			await fireSwalFromApi( response, true );
			navigate( 0 );
		}
		setIsSending( false );
	};

	return (
		<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-[85vh] lg:py-0 ">
			<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
				<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
					<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
						Edit your account
					</h1>
					<hr className="border-gray-600" />
					<form className="space-y-3 md:space-y-3" onSubmit={ handleSubmit }>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="login" value="Your username" />
							</div>
							<TextInput id="login" type="text" placeholder="Super Mario"
							           value={ username }
							           onChange={ e => setUsername( e.target.value ) } />
						</div>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="email" value="Your email" />
							</div>
							<TextInput id="email" type="email" placeholder="kmods@example.com"
							           value={ email }
							           onChange={ e => setEmail( e.target.value ) } />
						</div>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="password" value="Password" />
							</div>
							<TextInput id="password" type="password" placeholder="Password123"
							           value={ password }
							           onChange={ e => setPassword( e.target.value ) } />
						</div>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="password2" value="Repeat Password" />
							</div>
							<TextInput id="password2" type="password" placeholder="Password123"
							           value={ password2 }
							           onChange={ e => setPassword2( e.target.value ) } />
						</div>
						<hr className="border-gray-600" />
						<div className="flex items-center justify-between">
							<Button disabled={ isSending } type="submit">
								Save Changes
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export {
	Component
};

