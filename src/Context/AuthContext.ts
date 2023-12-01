import { User } from '@shared/Class/User.Class';
import { createContext } from 'react';

export default createContext<{
	loggedIn: boolean;
	user: User;
}>({
	loggedIn: false,
	user: new User('')
});
