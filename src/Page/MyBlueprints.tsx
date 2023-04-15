import { FunctionComponent } from "react";
import { useAuthCheck }      from "../hooks/useAuthCheck";

const MyBlueprints : FunctionComponent = () => {
	const { AuthCheckProps, AuthCheck } = useAuthCheck( { Auth: true, RedirectTo: "/signin" } );
	return (
		<AuthCheck { ...AuthCheckProps }></AuthCheck>
	);
};

export default MyBlueprints;
