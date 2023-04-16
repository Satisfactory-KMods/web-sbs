import { FunctionComponent } from "react";
import { useAuthCheck }      from "../../hooks/useAuthCheck";

const UserSettings : FunctionComponent = () => {
	const { AuthCheckProps, AuthCheck } = useAuthCheck( { Auth: true, RedirectTo: "/" } );

	return (
		<AuthCheck { ...AuthCheckProps }>

		</AuthCheck>
	);
};

export default UserSettings;
