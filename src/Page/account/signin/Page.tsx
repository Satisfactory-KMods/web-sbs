import {
	fireSwalFromApi,
	tRPC_Public,
	tRPC_handleError
} from "@applib/tRPC";
import { useAuth } from "@hooks/useAuth";
import { usePageTitle } from "@kyri123/k-reactutils";
import {
	Button,
	Checkbox,
	Label,
	TextInput
} from "flowbite-react";
import type {
	FormEvent,
	FunctionComponent
} from "react";
import { useState } from "react";
import {
	Link,
	useNavigate
} from "react-router-dom";


const Component: FunctionComponent = () => {
	const navigate = useNavigate();
	const { setToken } = useAuth();
	const [ isSending, setIsSending ] = useState( false );
	usePageTitle( `SBS - Sign In` );

	const [ login, setLogin ] = useState( "" );
	const [ password, setPassword ] = useState( "" );
	const [ stayLoggedIn, setStayLoggedIn ] = useState( true );

	const handleSubmit = async( e: FormEvent<HTMLFormElement> ) => {
		e.preventDefault();
		setIsSending( true );

		const response = await tRPC_Public.login.mutate( {
			stayLoggedIn, login, password
		} ).catch( tRPC_handleError );

		if( response ) {
			setToken( response.token );
			await fireSwalFromApi( response.message, true );
			navigate( "/" );
		}

		setIsSending( false );
	};

	return (
		<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-[85vh] lg:py-0 ">
			<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
				<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
					<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
						Sign in to your account
					</h1>
					<hr className="border-gray-600" />
					<form className="space-y-3 md:space-y-3" onSubmit={ handleSubmit }>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="login" value="Your email or username" />
							</div>
							<TextInput id="login" type="text" placeholder="kmods@example.com" required={ true }
							           onChange={ e => setLogin( e.target.value ) } />
						</div>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="password" value="Password" />
							</div>
							<TextInput id="password" type="password" placeholder="Password123" required={ true }
							           onChange={ e => setPassword( e.target.value ) } />
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Checkbox id="stay" value={ Number( stayLoggedIn ) }
								          onChange={ e => setStayLoggedIn( e.target.checked ) } />
								<Label htmlFor="stay">
									Stay logged in
								</Label>
							</div>
							<Link to="#"
							      className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500 hidden">Forgot
								password?</Link>
						</div>
						<hr className="border-gray-600" />
						<div className="flex items-center justify-between">
							<Button disabled={ isSending } type="submit">
								Sign in
							</Button>
							<p className="text-sm font-light text-gray-500 dark:text-gray-400">
								Don’t have an account yet?
								<Link to="/account/signup"
								      className="font-medium ms-1 text-primary-600 hover:underline dark:text-primary-500">
									Sign up
								</Link>
							</p>
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

