import React, { forwardRef } from "react";
import type { ButtonProps }  from "flowbite-react";
import { Button }            from "flowbite-react";
import type { IconType }     from "react-icons/lib";
import { CgSpinner }         from "react-icons/all";

interface LoadingButtonsProps extends ButtonProps {
	isLoading? : boolean;
	Icon : IconType;
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonsProps>( ( {
	children,
	isLoading,
	Icon,
	hidden,
	disabled,
	...props
} ) => {
	if ( hidden ) {
		return null;
	}
	return (
		<Button disabled={ !!isLoading || !!disabled } { ...props }>
			{ !!isLoading && <CgSpinner className="mr-2 h-5 w-5 animate-spin" /> || <Icon className="mr-2 h-5 w-5" /> }
			{ children }
		</Button>
	);
} );

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
