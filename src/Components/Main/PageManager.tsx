import type {
	FunctionComponent} from "react";
import {
	useEffect
}                           from "react";
import type {
	ButtonProps
} from "react-bootstrap";
import {
	Button,
	ButtonGroup
}                           from "react-bootstrap";
import {
	FaAngleDoubleLeft,
	FaAngleDoubleRight,
	FaAngleLeft,
	FaAngleRight
}                           from "react-icons/all";
import type { ButtonGroupProps } from "react-bootstrap/ButtonGroup";

interface IPageManagerProps {
	MaxPage : number,
	OnPageChange : ( Page : number ) => void,
	Page : number,
	ButtonProps? : ButtonProps
	ButtonGroupProps? : ButtonGroupProps
	Hide? : boolean
}

const PageManager : FunctionComponent<IPageManagerProps> = ( {
	ButtonGroupProps,
	ButtonProps,
	MaxPage,
	Page,
	OnPageChange,
	Hide
} ) => {
	useEffect( () => {
		if ( Page > MaxPage || Page < 0 ) {
			OnPageChange( Math.clamp( 0, Page, MaxPage - 1 ) );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ MaxPage, Page ] );

	if ( Hide ) {
		return null;
	}

	return (
		<ButtonGroup { ...ButtonGroupProps }>
			<Button { ...ButtonProps } onClick={ () => OnPageChange( 0 ) }
			        disabled={ Page === 0 }><FaAngleDoubleLeft/></Button>
			<Button { ...ButtonProps } onClick={ () => OnPageChange( Page - 1 ) }
			        disabled={ Page - 1 <= 0 }><FaAngleLeft/></Button>
			<Button { ...ButtonProps } disabled={ true }>{ Page + 1 }</Button>
			<Button { ...ButtonProps } onClick={ () => OnPageChange( Page + 1 ) }
			        disabled={ Page + 1 >= MaxPage }><FaAngleRight/></Button>
			<Button { ...ButtonProps } onClick={ () => OnPageChange( MaxPage - 1 ) }
			        disabled={ Page === MaxPage - 1 }><FaAngleDoubleRight/></Button>
		</ButtonGroup>
	);
};

export default PageManager;
