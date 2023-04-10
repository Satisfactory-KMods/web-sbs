import {
	FunctionComponent,
	PropsWithChildren
}             from "react";
import TopNav from "./Components/Main/TopNav";

const Layout : FunctionComponent<PropsWithChildren> = ( { children } ) => {

	return (
		<>
			<TopNav/>
			{ children }
		</>
	);
};

export default Layout;
