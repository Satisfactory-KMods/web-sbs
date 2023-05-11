import type { InputHTMLAttributes } from "react";
import React, { useId }             from "react";

type SBSTextInputProps = InputHTMLAttributes<HTMLInputElement> & {
	label : React.ReactElement | string,
	mainClassName? : string,
};

type SBSSelectProps = InputHTMLAttributes<HTMLDivElement> & {
	label : React.ReactElement | string,
	mainClassName? : string
};

const SBSTextInput = React.forwardRef<HTMLInputElement, SBSTextInputProps>( ( {
	mainClassName,
	className,
	label,
	children,
	...props
}, ref ) => {
	const id = useId();
	return (
		<div className={ `bg-dark rounded-2 w-full flex h-[42px] ${ mainClassName || "" }` }>
			<label htmlFor={ id }
			       className={ "px-3 py-2 border-gray-600 border border-r-0 rounded-l-lg bg-gray-600" }>{ label }</label>
			<div className="flex-1 flex">
				<div className="relative w-full h-[42px]">
					<div className="absolute right-0 top-1/3 mr-4">
						{ children }
					</div>
					<input { ...props } id={ id } ref={ ref }
					       className={ `pe-10 block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-r-lg p-2.5 text-sm dark:hover:border-gray-500 ${ className || "" }` }/>
				</div>
			</div>
		</div>
	);
} );

const SBSSelect = React.forwardRef<any, SBSSelectProps>( ( {
	mainClassName,
	className,
	label,
	children,
	...props
}, ref ) => {
	const id = useId();
	return (
		<div className={ `bg-dark rounded-2 w-full flex h-[42px] ${ mainClassName || "" }` }>
			<label htmlFor={ id }
			       className={ "px-3 py-2 border-gray-600 border border-r-0 rounded-l-lg bg-gray-600" }>{ label }</label>
			<div { ...props } className={ `h-[42px] flex-1 ${ className }` }>
				{ children }
			</div>
		</div>
	);
} );


SBSTextInput.displayName = "SBSTextInput";
SBSSelect.displayName = "SBSSelect";

export {
	SBSTextInput,
	SBSSelect
};
