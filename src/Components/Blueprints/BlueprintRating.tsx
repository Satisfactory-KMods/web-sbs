import { successSwal, tRPC_Auth, tRPC_handleError } from "@app/Lib/tRPC";
import type { useBlueprint } from "@app/hooks/useBlueprint";
import type { RatingProps } from "flowbite-react";
import { Rating } from "flowbite-react";
import { useMemo, useState, type FunctionComponent } from "react";

interface BlueprintRatingProps extends RatingProps {
	blueprintHook: ReturnType<typeof useBlueprint>
}

const BlueprintRating: FunctionComponent<BlueprintRatingProps> = ( { blueprintHook, children, ...props } ) => {
	const [ hover, setHover ] = useState( 0 );
	const { Update, allowedToLike, Blueprint } = blueprintHook;

	const rating = useMemo( () => {
		const totalRating = Blueprint.rating.length * 5;
		const currentTotalRating = Blueprint.rating.reduce( ( total, rating ) => total + rating.rating, 0 );
		const currRating = Math.round( currentTotalRating / totalRating * 5 * 100 ) / 100;
		return !isNaN( currRating ) ? currRating : 0;
	}, [ Blueprint.rating ] );

	const setHoverRating = ( rating: number ) => {
		if ( !allowedToLike ) {
			return;
		}
		setHover( () =>rating );
	};

	const setRating = async( rating: number ) => {
		if ( !allowedToLike ) {
			return;
		}
		await tRPC_Auth.blueprints.rate.mutate( {
			blueprintId: Blueprint._id,
			rating
		} ).then( msg => {
			Update();
			successSwal( msg );
		} ).catch( tRPC_handleError );
	};

	return (
		<Rating { ...props }>
			<Rating.Star onClick={ () => setRating( 1 ) } onMouseEnter={ () => setHoverRating( 1 ) } onMouseLeave={ () => setHoverRating( 0 ) } filled={ ( rating >= 1 && hover === 0 ) || hover >= 1 } />
			<Rating.Star onClick={ () => setRating( 2 ) } onMouseEnter={ () => setHoverRating( 2 ) } onMouseLeave={ () => setHoverRating( 0 ) } filled={ ( rating >= 2 && hover === 0 ) || hover >= 2 } />
			<Rating.Star onClick={ () => setRating( 3 ) } onMouseEnter={ () => setHoverRating( 3 ) } onMouseLeave={ () => setHoverRating( 0 ) } filled={ ( rating >= 3 && hover === 0 ) || hover >= 3 } />
			<Rating.Star onClick={ () => setRating( 4 ) } onMouseEnter={ () => setHoverRating( 4 ) } onMouseLeave={ () => setHoverRating( 0 ) } filled={ ( rating >= 4 && hover === 0 ) || hover >= 4 } />
			<Rating.Star onClick={ () => setRating( 5 ) } onMouseEnter={ () => setHoverRating( 5 ) } onMouseLeave={ () => setHoverRating( 0 ) } filled={ ( rating >= 5 && hover === 0 ) || hover >= 5 } />
			<p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
				{ rating } out of 5
			</p>
			<span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400" />
			<span className="text-sm font-medium text-gray-900 dark:text-white">
				{ Blueprint.rating.length } { children || "votes" }
			</span>
		</Rating>
	);
};

export default BlueprintRating;