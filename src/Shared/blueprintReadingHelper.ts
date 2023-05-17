import type { SaveComponent, SaveEntity } from "@etothepii/satisfactory-file-parser";
import _ from "lodash";

/**
 * @description returns a list for all mods that have a object reference in this blueprint
 */
export const findModsFromBlueprint = ( objects: ( SaveEntity | SaveComponent )[] | undefined ) => {
	if( !objects ) {
		return [];
	}
	const modRefSet = new Set<string>();
		 for( const ueObj of objects ) {
		if( !ueObj.typePath.startsWith( "/Script/" ) ) {
			modRefSet.add( ueObj.typePath.split( "/" )[ 1 ] );
		} else {
			modRefSet.add( ueObj.typePath.split( "/" )[ 2 ].split( "." )[ 0 ] );
		}
	}
	return [ ...modRefSet ].filter( e => {
		return !_.isEqual( "FactoryGame", e ) && !_.isEqual( "Game", e );
	} );
};
