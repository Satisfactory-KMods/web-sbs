import {
	useCallback,
	useEffect,
	useMemo,
	useState
} from "react";

export function usePageHandler<T extends Array<T>>( array : T[], onPageUpdated : ( options : { skip : number, limit : number } ) => void, show = 10 ) {
	const [ page, updatePage ] = useState( 0 );

	const maxPage = useMemo( () => Math.ceil( array.length / show ), [ array.length, show ] );
	const showArray = useMemo( () => [ ...array ].splice( page * show, show ), [ array, page, show ] );

	const setPage = useCallback( ( page : number ) => {
		updatePage( () => page );
		onPageUpdated( { skip: page * show, limit: show } );
	}, [ onPageUpdated, show ] );

	useEffect( () => {
		if ( maxPage > page ) {
			setPage( maxPage );
			onPageUpdated( { skip: page * show, limit: show } );
		}
	}, [ page, maxPage, setPage, onPageUpdated, show ] );

	return { showArray, setPage, currentPage: page, maxPage };
}