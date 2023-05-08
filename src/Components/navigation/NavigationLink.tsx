import type { FunctionComponent } from "react";
import type { LinkProps }         from "react-router-dom";
import {
	Link,
	useLocation
}                                 from "react-router-dom";
import type { ERoles }            from "@shared/Enum/ERoles";
import { useAuth }                from "@hooks/useAuth";

type NavigationLinkProps = LinkProps & {
	role? : ERoles
}

const NavigationLink : FunctionComponent<NavigationLinkProps> = ( { children, className, role, ...props } ) => {
	const { pathname } = useLocation();
	const { user } = useAuth();

	if ( role !== undefined && !user.HasPermssion( role ) ) {
		return null;
	}

	if ( pathname.startsWith( props.to.toString() ) ) {
		return (
			<Link
				className={ "bg-[#383c54] text-white rounded-md px-3 py-2 text-sm font-medium " + ( className || "" ) } { ...props }>
				{ children }
			</Link>
		);
	}

	return (
		<Link
			className={ "text-gray-300 hover:bg-[#454b6b] hover:text-white rounded-md px-3 py-2 text-sm font-medium " + ( className || "" ) } { ...props }>
			{ children }
		</Link>
	);
};

export default NavigationLink;