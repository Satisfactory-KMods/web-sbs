import type {
	FunctionComponent,
	PropsWithChildren} from "react";
import type React from "react";
import {
	useId
} from "react";

interface IFileUploadInputProps extends PropsWithChildren {
	BoxClassName? : string;
}

const FileUploadInput : FunctionComponent<IFileUploadInputProps & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>> = ( {
	BoxClassName,
	children,
	className,
	id,
	...Props
} ) => {
	const ID = useId();

	return (
		<div className={ "input-group " + ( BoxClassName || "" ) } id={ id }>
			<label htmlFor={ ID } className="input-group-text text-bg-dark">{ children }</label>
			<input className={ "form-control " + ( className || "" ) } type="file" id={ ID } { ...Props } />
		</div>
	);
};

export default FileUploadInput;
