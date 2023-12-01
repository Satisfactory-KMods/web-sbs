import { useCopy } from '@kyri123/k-reactutils';
import type { ButtonProps } from 'flowbite-react';
import { Button } from 'flowbite-react';
import { forwardRef } from 'react';
import { BiCopy } from 'react-icons/bi';
import { CgSpinner } from 'react-icons/cg';
import { FaCheck } from 'react-icons/fa';
import type { IconType } from 'react-icons/lib';

interface LoadingButtonsProps extends ButtonProps {
	isLoading?: boolean;
	Icon: IconType;
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonsProps>(({ children, isLoading, Icon, hidden, disabled, ...props }, ref) => {
	if (hidden) {
		return null;
	}
	return (
		<Button ref={ref} disabled={!!isLoading || !!disabled} {...props}>
			{(!!isLoading && <CgSpinner className='mr-2 h-5 w-5 animate-spin' />) || <Icon className='mr-2 h-5 w-5' />}
			{children}
		</Button>
	);
});

interface CopyButtonsProps extends ButtonProps {
	copyString?: string;
	getCopyString?: () => string;
}

const CopyButton = forwardRef<HTMLButtonElement, CopyButtonsProps>(({ children, getCopyString, hidden, disabled, copyString, ...props }, ref) => {
	const [doCopy, isCopied] = useCopy('', 2000);
	if (hidden) {
		return null;
	}

	const getString = () => {
		if (getCopyString) {
			return getCopyString();
		}
		if (!copyString) {
			alert('DEV: No copyString set!');
		}
		return copyString || 'noCopySet!';
	};

	return (
		<Button
			ref={ref}
			onClick={() => doCopy(getString())}
			disabled={isCopied() || !!disabled}
			color={isCopied() ? 'green' : undefined}
			size='xs'
			{...props}>
			{!isCopied() ? <BiCopy /> : <FaCheck />}
		</Button>
	);
});

LoadingButton.displayName = 'LoadingButton';
CopyButton.displayName = 'CopyButton';

export { CopyButton, LoadingButton };
