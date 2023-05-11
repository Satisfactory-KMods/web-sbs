import type React from "react";
import { useId }  from "react";

interface IFloatInputProps extends FormControlProps {
	lableClassName? : string | undefined;
}

const FloatInput : React.FunctionComponent<IFloatInputProps> = ( { lableClassName, children, ...Props } ) => {
	const ID = useId();

	return (
		<FloatingLabel controlId={ ID }
			label={ children }
			className={ lableClassName }>
			<FormControl { ...Props } />
		</FloatingLabel>
	);
};

export default FloatInput;
