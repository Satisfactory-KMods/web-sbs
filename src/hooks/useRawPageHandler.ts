import {
	useCallback,
	useEffect,
	useMemo,
	useState
} from "react";


export function useRawPageHandler<T extends T[]>( length: number, onPageUpdated: ( options: { skip: number, limit: number } ) => Promise<void>, show = 10 ) {
	const [ page, updatePage ] = useState( 0 );

	const maxPage = useMemo( () => Math.ceil( length / show ), [ length, show ] );
	const filterOption = useMemo( () => ( { skip: page * show, limit: show } ), [ page, show ] );

	const setPage = useCallback( async( page: number ) => {
		updatePage( () => page );
		await onPageUpdated( { skip: page - 1 * show, limit: show } );
	}, [ onPageUpdated, show ] );

	useEffect( () => {
		if( page > maxPage ) {
			setPage( maxPage ).then( () => {
			} );
		}
	}, [ page, maxPage, setPage, onPageUpdated, show ] );

	return { filterOption, setPage, currentPage: page, maxPage };
}
