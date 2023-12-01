import Foother from '@comp/Main/Foother';
import TopNav from '@comp/Main/TopNav';
import AuthContext from '@context/AuthContext';
import DataContext from '@context/DataContext';
import type { LayoutLoaderData } from '@page/Loader';
import { User } from '@shared/Class/User.Class';
import type { FunctionComponent } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';

const Component: FunctionComponent = () => {
	const { loggedIn, user, tags, mods } = useLoaderData() as LayoutLoaderData;

	return (
		<AuthContext.Provider
			value={{
				loggedIn,
				user: new User(user.JsonWebToken)
			}}>
			<DataContext.Provider value={{ tags, mods }}>
				<div className='flex h-screen flex-col justify-between'>
					<TopNav />
					<div className='container mb-auto px-2 py-3 md:mx-auto md:px-0'>
						<Outlet />
					</div>
					<Foother />
				</div>
			</DataContext.Provider>
		</AuthContext.Provider>
	);
};

export { Component };
