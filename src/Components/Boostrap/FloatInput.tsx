import type React from "react";
import { useId }     from "react";
import {
	FloatingLabel,
	FormControl
}                           from "react-bootstrap";
import type { FormControlProps } from "react-bootstrap/FormControl";

interface IFloatInputProps extends FormControlProps {
	lableClassName? : string | undefined;
}

const FloatInput : React.FunctionComponent<IFloatInputProps> = ( { lableClassName, children, ...Props } ) => {
	const ID = useId();

	return (
		<FloatingLabel
			controlId={ ID }
			label={ children }
			className={ lableClassName }
		>
			<FormControl { ...Props } />
		</FloatingLabel>
	);
};

export default FloatInput;
