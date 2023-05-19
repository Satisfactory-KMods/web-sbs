import { successSwal, tRPCAuth, tRPCHandleError } from "@app/Lib/tRPC";
import type { useBlueprintPack } from "@app/hooks/useBlueprintPack";
import type { RatingProps } from "flowbite-react";
import { Rating } from "flowbite-react";
import type { FunctionComponent } from "react";
import { useState } from "react";


interface BlueprintPackRatingProps extends RatingProps {
	blueprintHook: ReturnType<typeof useBlueprintPack>
}

const BlueprintPackRating: FunctionComponent<BlueprintPackRatingProps> = ( { blueprintHook, children, ...props } ) => {
	const [ hover, setHover ] = useState( 0 );
	const { update, allowedToLike, blueprintPack } = blueprintHook;

	const setHoverRating = ( rating: number ) => {
		if( !allowedToLike ) {
			return;
		}
		setHover( () => rating );
	};

	const setRating = async( rating: number ) => {
		if( !allowedToLike ) {
			return;
		}
		await tRPCAuth.blueprints.rate.mutate( {
			blueprintId: blueprintPack._id,
			rating
		} ).then( msg => {
			update();
			successSwal( msg );
		} ).catch( tRPCHandleError );
	};

	const rating = blueprintPack.totalRating || 1;

	return (
		<Rating { ...props }>
			<Rating.Star onClick={ () => setRating( 1 ) } onMouseEnter={ () => setHoverRating( 1 ) } onMouseLeave={ () => setHoverRating( 0 ) } filled={ ( rating >= 1 && hover === 0 ) || hover >= 1 } />
			<Rating.Star onClick={ () => setRating( 2 ) } onMouseEnter={ () => setHoverRating( 2 ) } onMouseLeave={ () => setHoverRating( 0 ) } filled={ ( rating >= 2 && hover === 0 ) || hover >= 2 } />
			<Rating.Star onClick={ () => setRating( 3 ) } onMouseEnter={ () => setHoverRating( 3 ) } onMouseLeave={ () => setHoverRating( 0 ) } filled={ ( rating >= 3 && hover === 0 ) || hover >= 3 } />
			<Rating.Star onClick={ () => setRating( 4 ) } onMouseEnter={ () => setHoverRating( 4 ) } onMouseLeave={ () => setHoverRating( 0 ) } filled={ ( rating >= 4 && hover === 0 ) || hover >= 4 } />
			<Rating.Star onClick={ () => setRating( 5 ) } onMouseEnter={ () => setHoverRating( 5 ) } onMouseLeave={ () => setHoverRating( 0 ) } filled={ ( rating >= 5 && hover === 0 ) || hover >= 5 } />
			<p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
				{ blueprintPack.totalRating } out of 5
			</p>
			<span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400" />
			<span className="text-sm font-medium text-gray-900 dark:text-white">
				{ blueprintPack.rating?.length || 0 } { children || "votes" }
			</span>
		</Rating>
	);
};

export default BlueprintPackRating;
