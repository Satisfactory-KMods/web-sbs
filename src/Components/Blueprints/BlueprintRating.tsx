import { useAuth } from "@app/hooks/useAuth";
import type { BlueprintData } from "@server/MongoDB/DB_Blueprints";
import { Rating } from "flowbite-react";
import { useMemo, useState, type FunctionComponent } from "react";

interface BlueprintRatingProps {
	blueprint: BlueprintData;
}

const BlueprintRating: FunctionComponent<BlueprintRatingProps> = ( { blueprint } ) => {
	const [ hover, setHover ] = useState( 0 );
	const { loggedIn } = useAuth();

	const rating = useMemo( () => {
		return Math.round( ( Math.random() * 5 + 1 ) * 100 ) / 100;
	}, [] );

	const setHoverRating = ( rating: number ) => {
		if ( !loggedIn ) {
			return;
		}
		setHover( () =>rating );
	};

	const setRating = async( rating: number ) => {
		if ( !loggedIn ) {
			return;
		}
	};

	console.log( hover, rating );

	return (
		<Rating>
			<Rating.Star onMouseEnter={ () => setHoverRating( 1 ) } onMouseLeave={ () => setHoverRating( 0 ) } filled={ ( rating >= 1 && hover === 0 ) || hover >= 1 } />
			<Rating.Star onMouseEnter={ () => setHoverRating( 2 ) } onMouseLeave={ () => setHoverRating( 0 ) } filled={ ( rating >= 2 && hover === 0 ) || hover >= 2 } />
			<Rating.Star onMouseEnter={ () => setHoverRating( 3 ) } onMouseLeave={ () => setHoverRating( 0 ) } filled={ ( rating >= 3 && hover === 0 ) || hover >= 3 } />
			<Rating.Star onMouseEnter={ () => setHoverRating( 4 ) } onMouseLeave={ () => setHoverRating( 0 ) } filled={ ( rating >= 4 && hover === 0 ) || hover >= 4 } />
			<Rating.Star onMouseEnter={ () => setHoverRating( 5 ) } onMouseLeave={ () => setHoverRating( 0 ) } filled={ ( rating >= 5 && hover === 0 ) || hover >= 5 } />
			<p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
				{ rating } out of 5
			</p>
			<span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400" />
			<span className="text-sm font-medium text-gray-900 dark:text-white">
				{ blueprint.likes } reviews
			</span>
		</Rating>
	);
};

export default BlueprintRating;