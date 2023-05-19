import type { InputHTMLAttributes } from "react";
import React, { useId } from "react";


type SBSInput = {
	label: React.ReactElement | string,
	mainClassName?: string,
	hint?: React.ReactElement | string,
	hintClassName?: string
};

type SBSInputProps = InputHTMLAttributes<HTMLInputElement> & SBSInput;

type SBSSelectProps = InputHTMLAttributes<HTMLDivElement> & SBSInput;

const SBSInput = React.forwardRef<HTMLInputElement, SBSInputProps>( ( {
	mainClassName,
	className,
	label,
	children,
	hint,
	hintClassName,
	...props
}, ref ) => {
	const id = useId();
	return (
		<div className={ mainClassName }>
			<div className="rounded-2 w-full flex h-[42px]">
				<label htmlFor={ id }
			       className={ `px-3 py-2 border-gray-600 border border-r-0 rounded-l-lg ${ hint ? "rounded-bl-none" : "" } bg-gray-600 text-neutral-100` }>{ label }</label>
				<div className="flex-1 flex">
					<div className="relative w-full h-[42px]">
						<div className="absolute right-0 top-1/3 mr-4">
							{ children }
						</div>
						<input { ...props } id={ id } ref={ ref }
					       className={ `pe-10 block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-r-lg ${ hint ? "rounded-br-none" : "" }  ${ props.type === "file" ? "" : "p-2.5" } text-sm dark:hover:border-gray-500 ${ className || "" }` } />
					</div>
				</div>
			</div>
			{ hint && <div className={ `text-xs bg-dark text-gray-200 p-2 px-3 bg-gray-600 rounded-b-lg border-gray-600 flex w-full ${ hintClassName || '' }` }>{ hint }</div> }
		</div>
	);
} );

const SBSSelect = React.forwardRef<any, SBSSelectProps>( ( {
	mainClassName,
	className,
	label,
	hint,
	hintClassName,
	children,
	...props
}, ref ) => {
	const id = useId();
	return (
		<div className={ mainClassName }>
			<div className="bg-dark rounded-2 w-full flex h-[42px]">
				<label htmlFor={ id }
			       className="px-3 py-2 border-gray-600 border border-r-0 rounded-l-lg bg-gray-600 text-neutral-100">{ label }</label>
				<div { ...props } className={ `h-[42px] flex-1 ${ className }` }>
					{ children }
				</div>
			</div>
			{ hint && <div className={ `text-xs bg-dark text-gray-200 p-1 px-2 ${ hintClassName || '' }` }>{ hint }</div> }
		</div>
	);
} );


SBSInput.displayName = "SBSInput";
SBSSelect.displayName = "SBSSelect";

export {
	SBSSelect, SBSInput
};

