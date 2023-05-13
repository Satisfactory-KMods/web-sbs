import { useAuth } from "@hooks/useAuth";
import type { ERoles } from "@shared/Enum/ERoles";
import type { FunctionComponent } from "react";
import type { LinkProps } from "react-router-dom";
import {
	Link,
	useLocation
} from "react-router-dom";

type NavigationLinkButtonProps = LinkProps & {
	role?: ERoles,
	label: string
};

const NavigationLinkButton: FunctionComponent<NavigationLinkButtonProps> = ( { children, className, label, role, ...props } ) => {
	const { pathname } = useLocation();
	const { user } = useAuth();

	if( role !== undefined && !user.HasPermission( role ) ) {
		return null;
	}

	let classNames = "text-neutral-100 px-3 py-2 font-medium bg-gray-600" + ( className || "" );
	if( !pathname.startsWith( props.to.toString() ) ) {
		classNames = "text-neutral-300 px-3 py-2 font-medium hover:bg-gray-600 hover:text-neutral-100" + ( className || "" );
	}

	return (
		<Link className={ classNames } { ...props }>
			<span className="block font-semibold">{ label }</span>
			<span className="block text-xs">{ children }</span>
		</Link>
	);
};

export default NavigationLinkButton;