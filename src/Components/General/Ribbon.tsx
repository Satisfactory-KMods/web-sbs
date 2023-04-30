import type {
	FunctionComponent,
	PropsWithChildren
} from "react";
import type React from "react";

interface IRibbonProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, PropsWithChildren {
	innerClassName? : string;
}

const Ribbon : FunctionComponent<IRibbonProps> = ( { children, innerClassName, ...Props } ) => (
	<div className="ribbon-wrapper" { ...Props }>
		<div className={ `ribbon ${ innerClassName || "" }` }>
			{ children }
		</div>
	</div>
);

export default Ribbon;
