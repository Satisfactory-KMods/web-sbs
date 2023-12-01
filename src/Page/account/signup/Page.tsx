import { fireSwalFromApi, tRPCHandleError, tRPCPublic } from '@applib/tRPC';
import { useAuth } from '@hooks/useAuth';
import { usePageTitle } from '@kyri123/k-reactutils';
import { Button, Label, TextInput } from 'flowbite-react';
import type { FormEvent, FunctionComponent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Component: FunctionComponent = () => {
	const navigate = useNavigate();
	const { setToken } = useAuth();
	const [isSending, setIsSending] = useState(false);
	usePageTitle(`SBS - Sign Up`);

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [password2, setPassword2] = useState('');

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (password !== password2) {
			fireSwalFromApi(`Passwords do not match`, 'warning');
			return;
		}

		setIsSending(true);
		const response = await tRPCPublic.register
			.mutate({
				email,
				username,
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
					<h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>Create your account</h1>
					<hr className='border-gray-600' />
					<form className='space-y-3 md:space-y-3' onSubmit={handleSubmit}>
						<div>
							<div className='mb-2 block'>
								<Label htmlFor='login' value='Your username' />
							</div>
							<TextInput
								id='login'
								type='text'
								placeholder='Super Mario'
								required={true}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
						<div>
							<div className='mb-2 block'>
								<Label htmlFor='email' value='Your email' />
							</div>
							<TextInput
								id='email'
								type='email'
								placeholder='kmods@example.com'
								required={true}
								onChange={(e) => setEmail(e.target.value)}
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
						<div>
							<div className='mb-2 block'>
								<Label htmlFor='password2' value='Repeat Password' />
							</div>
							<TextInput
								id='password2'
								type='password'
								placeholder='Password123'
								required={true}
								onChange={(e) => setPassword2(e.target.value)}
							/>
						</div>
						<hr className='border-gray-600' />
						<div className='flex items-center justify-between'>
							<Button disabled={isSending} type='submit'>
								Sign in
							</Button>
							<p className='text-sm font-light text-gray-500 dark:text-gray-400'>
								You have already signed up?
								<Link to='/account/signin' className='text-primary-600 dark:text-primary-500 ms-1 font-medium hover:underline'>
									Sign In now!
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
