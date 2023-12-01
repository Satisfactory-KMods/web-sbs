import { fireSwalFromApi, tRPCHandleError, tRPCPublic } from '@applib/tRPC';
import { useAuth } from '@hooks/useAuth';
import { usePageTitle } from '@kyri123/k-reactutils';
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import type { FormEvent, FunctionComponent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Component: FunctionComponent = () => {
	const navigate = useNavigate();
	const { setToken } = useAuth();
	const [isSending, setIsSending] = useState(false);
	usePageTitle(`SBS - Sign In`);

	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const [stayLoggedIn, setStayLoggedIn] = useState(true);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSending(true);

		const response = await tRPCPublic.login
			.mutate({
				stayLoggedIn,
				login,
				password
			})
			.catch(tRPCHandleError);

		if (response) {
			setToken(response.token);
			await fireSwalFromApi(response.message, true);
			navigate('/');
		}

		setIsSending(false);
	};

	return (
		<div className='mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-[85vh] lg:py-0 '>
			<div className='w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0'>
				<div className='space-y-4 p-6 sm:p-8 md:space-y-6'>
					<h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
						Sign in to your account
					</h1>
					<hr className='border-gray-600' />
					<form className='space-y-3 md:space-y-3' onSubmit={handleSubmit}>
						<div>
							<div className='mb-2 block'>
								<Label htmlFor='login' value='Your email or username' />
							</div>
							<TextInput
								id='login'
								type='text'
								placeholder='kmods@example.com'
								required={true}
								onChange={(e) => setLogin(e.target.value)}
							/>
						</div>
						<div>
							<div className='mb-2 block'>
								<Label htmlFor='password' value='Password' />
							</div>
							<TextInput
								id='password'
								type='password'
								placeholder='Password123'
								required={true}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<Checkbox id='stay' value={Number(stayLoggedIn)} onChange={(e) => setStayLoggedIn(e.target.checked)} />
								<Label htmlFor='stay'>Stay logged in</Label>
							</div>
							<Link to='#' className='text-primary-600 dark:text-primary-500 hidden text-sm font-medium hover:underline'>
								Forgot password?
							</Link>
						</div>
						<hr className='border-gray-600' />
						<div className='flex items-center justify-between'>
							<Button disabled={isSending} type='submit'>
								Sign in
							</Button>
							<p className='text-sm font-light text-gray-500 dark:text-gray-400'>
								Don’t have an account yet?
								<Link to='/account/signup' className='text-primary-600 dark:text-primary-500 ms-1 font-medium hover:underline'>
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

export { Component };
