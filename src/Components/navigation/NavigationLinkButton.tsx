import { useAuth } from '@hooks/useAuth';
import type { ERoles } from '@shared/Enum/ERoles';
import type { FunctionComponent } from 'react';
import type { LinkProps } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';

type NavigationLinkButtonProps = LinkProps & {
	role?: ERoles;
	label: string;
};

const NavigationLinkButton: FunctionComponent<NavigationLinkButtonProps> = ({ children, className, label, role, ...props }) => {
	const { pathname } = useLocation();
	const { user } = useAuth();

	if (role !== undefined && !user.HasPermission(role)) {
		return null;
	}

	let classNames = 'flex bg-gray-700 text-white rounded-md px-3 py-2 text-sm font-medium ' + (className || '');
	if (!pathname.startsWith(props.to.toString())) {
		classNames = 'flex text-gray-300 hover:bg-gray-600 hover:text-white rounded-md px-3 py-2 text-sm font-medium ' + (className || '');
	}

	return (
		<Link className={classNames} {...props}>
			{label}
		</Link>
	);
};

export default NavigationLinkButton;
