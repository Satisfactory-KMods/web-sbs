import type { FunctionComponent } from "react";
import TopNav                from "@comp/Main/TopNav";
import { Container }         from "react-bootstrap";
import { Outlet }            from "react-router-dom";

const Component : FunctionComponent = () => {
	return (
		<>
			<div className={ "d-flex flex-column h-100 w-100" }>
				<TopNav/>
				<div className={ "flex-1 overflow-y-auto" }
				     style={ {
					     backgroundImage: "url(\"/images/background/6.jpg\")",
					     backgroundOrigin: "content-box",
					     backgroundRepeat: "no-repeat",
					     backgroundSize: "cover"
				     } }>
					<Container className={ "h-100 p-3" }>
						<Outlet/>
					</Container>
				</div>
			</div>
		</>
	);
};

export {
	Component
};
