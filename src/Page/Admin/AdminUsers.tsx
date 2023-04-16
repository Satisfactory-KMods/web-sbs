import { FunctionComponent } from "react";
import { useAuthCheck }      from "../../hooks/useAuthCheck";
import { ERoles }            from "../../Shared/Enum/ERoles";

const AdminUsers : FunctionComponent = () => {
	const { AuthCheckProps, AuthCheck } = useAuthCheck( { Auth: true, RedirectTo: "/", Role: ERoles.admin } );

	return (
		<AuthCheck { ...AuthCheckProps }>

		</AuthCheck>
	);
};

export default AdminUsers;
