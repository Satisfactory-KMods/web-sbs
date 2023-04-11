import {
	FunctionComponent,
	PropsWithChildren
}                    from "react";
import TopNav        from "./Components/Main/TopNav";
import { Container } from "react-bootstrap";

const Layout : FunctionComponent<PropsWithChildren> = ( { children } ) => {

	return (
		<>
			<div className={ "d-flex flex-column h-100 w-100" }>
				<TopNav/>
				<div className={ "flex-1 overflow-y-auto" }>
					<Container className={ "h-100 p-3" }>
						{ children }
					</Container>
				</div>
			</div>
		</>
	);
};

export default Layout;
