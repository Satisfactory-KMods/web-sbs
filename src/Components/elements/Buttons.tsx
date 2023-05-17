import type { ButtonProps } from "flowbite-react";
import { Button } from "flowbite-react";
import { forwardRef } from "react";
import { CgSpinner } from "react-icons/all";
import type { IconType } from "react-icons/lib";


interface LoadingButtonsProps extends ButtonProps {
	isLoading?: boolean;
	Icon: IconType;
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonsProps>( ( {
	children,
	isLoading,
	Icon,
	hidden,
	disabled,
	...props
}, ref ) => {
	if( hidden ) {
		return null;
	}
	return (
		<Button ref={ ref } disabled={ !!isLoading || !!disabled } { ...props }>
			{ !!isLoading && <CgSpinner className="mr-2 h-5 w-5 animate-spin" /> || <Icon className="mr-2 h-5 w-5" /> }
			{ children }
		</Button>
	);
} );

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };

