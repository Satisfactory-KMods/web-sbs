'use server';

import { getMetaHandler } from "@/server/metaHandler";
import type { MetaData } from "@/utils/searching/metaDataHandler";
import { MetaDataHandler } from "@/utils/searching/metaDataHandler";


export const doWikiSearch = async( { searchString }: { searchString: string } ): Promise<MetaData[]> => {
	'use server';
	const result: MetaData[] = [];

	const metaData = getMetaHandler( "allData" );
	for( const [ key, value ] of metaData ) {
		if( value.name === "" || value.image === "" ) {
			continue;
		}
		const isOk = searchString === "" || value.name.toLowerCase().includes( searchString.toLowerCase() );
		if( isOk ) {
			result.push( value );
		}
		if( result.length >= 50 ) {
			break;
		}
	}


	return result;
};
