import type {
	FunctionComponent,
	PropsWithChildren,
	ReactElement
} from "react";
import { useRef } from "react";

interface NavigationDropdownProps extends PropsWithChildren {
	image?: string;
	text?: string | ReactElement;
}

const NavigationDropdown: FunctionComponent<NavigationDropdownProps> = ( { image, text, children } ) => {

	const dropDownRef = useRef<HTMLDivElement>( null );

	const handleClickAnywhere = () => {
		if( dropDownRef.current ) {
			dropDownRef.current.classList.toggle( "hidden", true );
		}
	};

	const onToggle = () => {
		document.body.removeEventListener( "mouseup", handleClickAnywhere );
		if( dropDownRef.current ) {
			if( !dropDownRef.current.classList.toggle( "hidden", false ) ) {
				document.body.addEventListener( "mouseup", handleClickAnywhere, {
					passive: true,
					once: true
				} );
			}
		}
	};

	return (
		<div>
			<button onClick={ onToggle }
			        className="inline-flex items-center text-sm font-medium text-center text-neutral-200 hover:text-white focus:outline-none"
			        type="button">
				{ image && <img className="h-8 w-8 rounded-full"
				                src={ image }
				                alt="Logoimage" /> }
				{ text && <span className="ml-3 hidden md:block">{ text }</span> }
			</button>
			<div className="hidden max-w-sm bg-white divide-y divide-gray-100 shadow absolute right-0 mt-2 w-56 origin-top-right"
				ref={ dropDownRef }>
				{ children }
			</div>
		</div>
	);
};

export default NavigationDropdown;
