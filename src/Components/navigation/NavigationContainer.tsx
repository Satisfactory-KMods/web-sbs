import { useAuth } from '@hooks/useAuth';
import type { ERoles } from '@shared/Enum/ERoles';
import type { FunctionComponent, HTMLAttributes } from 'react';
import { useRef } from 'react';
import type { ReactElement } from 'react-markdown/lib/react-markdown';
import { useLocation } from 'react-router-dom';

type NavigationContainerProps = HTMLAttributes<HTMLDivElement> & {
	role?: ERoles;
	path: string;
	label: string | ReactElement;
	location?: 'center' | 'left' | 'right';
};

const NavigationContainer: FunctionComponent<NavigationContainerProps> = ({ children, className, role, path, label, location, ...props }) => {
	const { pathname } = useLocation();
	const { user } = useAuth();
	const ref = useRef<HTMLDivElement>(null);
	if (role !== undefined && !user.HasPermission(role)) {
		return null;
	}

	let classNames = 'flex bg-gray-700 text-white rounded-md px-3 py-2 text-sm font-medium ';
	if (!pathname.startsWith(path.toString())) {
		classNames = 'flex text-gray-300 hover:bg-gray-600 hover:text-white rounded-md px-3 py-2 text-sm font-medium ';
	}

	const onHover = () => ref.current?.classList.toggle('hidden', false);
	const onUnHover = () => ref.current?.classList.toggle('hidden', true);

	let loc = 'left-1/4 transform -translate-x-1/4';
	if (!location) {
		location = 'center';
	}
	switch (location) {
		case 'center':
			loc = 'left-1/2 transform -translate-x-1/2';
			break;
		case 'right':
			loc = 'right-1/4 transform translate-x-1/4';
			break;
	}

	return (
		<div className={'relative' + (className || '')} onPointerOver={onHover} onPointerLeave={onUnHover}>
			<div className={classNames} {...props}>
				{label}
			</div>

			<div onPointerOver={onHover} onPointerLeave={onUnHover} ref={ref} className={`absolute hidden ${loc} z-10`}>
				<div className={`absolute top-0 ${loc} z-10 mt-1 h-[15px] w-[15px] rotate-45 bg-gray-500`} />
				<div className='${ loc } relative left-0 z-10 mt-3 block block w-[300px] bg-gray-500 shadow'>
					<div className='z-20 grid grid-cols-1 divide-y divide-gray-400'>{children}</div>
				</div>
			</div>
		</div>
	);
};

export default NavigationContainer;
