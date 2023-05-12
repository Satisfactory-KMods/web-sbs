import { useAuth } from "@hooks/useAuth";
import type { ERoles } from "@shared/Enum/ERoles";
import type { FunctionComponent } from "react";
import type { LinkProps } from "react-router-dom";
import { Link } from "react-router-dom";

interface NavigationDropdownProps extends LinkProps {
	to: string;
	permission?: ERoles;
}

const NavigationDropdown: FunctionComponent<NavigationDropdownProps> = ( {
	to,
	permission,
	children,
	className,
	...props
} ) => {
	const { user } = useAuth();

	if( permission !== undefined && !user.HasPermssion( permission ) ) {
		return null;
	}

	return (
		<div className="divide-y divide-gray-100">
			<Link to={ to }
			      className="flex p-2 hover:bg-gray-100" { ...props }>
				<div className="w-full">
					<div className={ `text-sm flex ${ className || "text-gray-500" }` }>
						{ children }
					</div>
				</div>
			</Link>
		</div>
	);
};

export default NavigationDropdown;
