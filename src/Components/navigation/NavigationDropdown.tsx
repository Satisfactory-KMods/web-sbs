import type { FunctionComponent, PropsWithChildren, ReactElement } from 'react';
import { useRef } from 'react';

interface NavigationDropdownProps extends PropsWithChildren {
	image?: string;
	text?: string | ReactElement;
}

const NavigationDropdown: FunctionComponent<NavigationDropdownProps> = ({ image, text, children }) => {
	const dropDownRef = useRef<HTMLDivElement>(null);

	const handleClickAnywhere = () => {
		if (dropDownRef.current) {
			dropDownRef.current.classList.toggle('hidden', true);
		}
	};

	const onToggle = () => {
		document.body.removeEventListener('mouseup', handleClickAnywhere);
		if (dropDownRef.current) {
			if (!dropDownRef.current.classList.toggle('hidden', false)) {
				document.body.addEventListener('mouseup', handleClickAnywhere, {
					passive: true,
					once: true
				});
			}
		}
	};

	return (
		<div>
			<button
				onClick={onToggle}
				className='inline-flex items-center text-center text-sm font-medium text-neutral-200 hover:text-white focus:outline-none'
				type='button'>
				{image && <img className='h-8 w-8 rounded-full' src={image} alt='Logoimage' />}
				{text && <span className='ml-3'>{text}</span>}
			</button>
			<div
				className='absolute right-0 z-50 mt-2 hidden w-56 max-w-sm origin-top-right divide-y divide-gray-100 bg-white shadow'
				ref={dropDownRef}>
				{children}
			</div>
		</div>
	);
};

export default NavigationDropdown;
