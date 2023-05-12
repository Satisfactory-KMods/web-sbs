import type React from "react";
import { useId } from "react";

interface IFloatTextareaProps extends FormControlProps {
	lableClassName?: string | undefined;
}

const FloatTextarea: React.FunctionComponent<IFloatTextareaProps> = ( {
	lableClassName,
	children,
	className,
	...Props
} ) => {
	const ID = useId();

	return (
		<FloatingLabel controlId={ ID }
			label={ children }
			className={ lableClassName }>
			<textarea className={ "form-control " + ( className || "" ) } { ...Props } />
		</FloatingLabel>
	);
};

export default FloatTextarea;
